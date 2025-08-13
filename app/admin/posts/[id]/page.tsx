"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientBrowser } from "@/lib/supabase-auth";
import { STORAGE_BUCKET } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { mockCategorias } from "@/lib/mock-data";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClientBrowser();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagemUrl, setImagemUrl] = useState<string | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [galeria, setGaleria] = useState<string[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function toObjectPath(publicUrl: string): string | null {
    try {
      const u = new URL(publicUrl);
      const prefix = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
      const idx = u.pathname.indexOf(prefix);
      if (idx >= 0) {
        return u.pathname.substring(idx + prefix.length);
      }
      return null;
    } catch {
      return null;
    }
  }

  async function handleRemoveImage(index: number) {
    const src = galeria[index];
    const next = galeria.filter((_, i) => i !== index);
    setGaleria(next);
    if (imagemUrl === src) setImagemUrl(next[0] ?? null);
    const path = toObjectPath(src);
    if (path) {
      await supabase.storage.from(STORAGE_BUCKET).remove([path]);
    }
  }

  function handleDragStart(i: number) {
    setDragIndex(i);
  }
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }
  function handleDrop(i: number) {
    if (dragIndex === null || dragIndex === i) return;
    const next = [...galeria];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(i, 0, moved);
    setGaleria(next);
    setDragIndex(null);
  }
  function handleSetCover(src: string) {
    setImagemUrl(src);
    setGaleria((prev) => {
      const rest = prev.filter((s) => s !== src);
      return [src, ...rest];
    });
  }

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    const { data } = await supabase
      .from("works")
      .select("*")
      .eq("id", id)
      .single();
    if (data) {
      setTitulo(data.titulo || "");
      setDescricao(data.descricao || "");
      setCategoria(data.categoria || "");
      setImagemUrl(data.imagem_url || null);
      setGaleria(Array.isArray(data.galeria) ? data.galeria : []);
      setTags(Array.isArray(data.tags) ? data.tags : []);
    }
    setLoading(false);
    // carregar sugestões
    const { data: all } = await supabase.from("works").select("tags");
    const set = new Set<string>();
    (all || []).forEach((row: any) => {
      (row?.tags || []).forEach((t: string) => {
        if (typeof t === "string" && t.trim()) set.add(t.trim());
      });
    });
    setTagSuggestions(Array.from(set).sort());
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    let newUrl = imagemUrl;
    try {
      // Upload novas imagens (se houver) e anexa à galeria
      let addedUrls: string[] = [];
      if (newFiles.length > 0) {
        for (const f of newFiles.slice(0, 10)) {
          const path = `works/${id}-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}-${f.name}`;
          const { error: upErr } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(path, f, { cacheControl: "3600", upsert: true });
          if (upErr) throw upErr;
          const { data } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(path);
          addedUrls.push(data.publicUrl);
        }
      }
      const nextGaleria = [...galeria, ...addedUrls].slice(0, 10);
      if (!newUrl && nextGaleria[0]) newUrl = nextGaleria[0];

      // Garantir que a categoria seja sempre a primeira tag
      const finalTags = categoria
        ? [categoria, ...tags.filter((tag) => tag !== categoria)]
        : tags;

      const { error } = await supabase
        .from("works")
        .update({
          titulo,
          descricao,
          categoria,
          imagem_url: newUrl,
          galeria: nextGaleria,
          tags: finalTags,
        })
        .eq("id", id);
      if (error) throw error;
      router.push("/admin/posts");
    } catch (err: any) {
      // Loga com detalhes úteis
      console.error("Erro ao salvar post:", {
        raw: err,
        message: err?.message,
        code: err?.code,
        details: err?.details,
        hint: err?.hint,
      });
      const isBucket = err?.message?.includes("Bucket not found");
      const isColumn =
        err?.message?.includes("column") || err?.details?.includes?.("column");
      const text = isBucket
        ? `Bucket de Storage não encontrado: ${STORAGE_BUCKET}. Crie-o no Supabase (público) ou ajuste o nome em lib/storage.ts.`
        : isColumn
        ? `Erro de coluna no banco (verifique se 'galeria' e 'tags' existem como text[]).`
        : err?.message || "Falha ao salvar";
      alert(text);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Excluir esta postagem?")) return;

    try {
      console.log("=== DADOS CARREGADOS NA PÁGINA ===");
      console.log("Imagem URL:", imagemUrl);
      console.log("Galeria:", galeria);
      console.log("Tipo da galeria:", typeof galeria);
      console.log("Galeria é array:", Array.isArray(galeria));

      const allImageUrls: string[] = [];

      // Coletar TODAS as URLs (principal + galeria)
      if (imagemUrl) {
        allImageUrls.push(imagemUrl);
        console.log("✓ Imagem principal adicionada:", imagemUrl);
      }

      // Adicionar todas as imagens da galeria
      if (galeria && galeria.length > 0) {
        galeria.forEach((url: string, i: number) => {
          if (url && url.trim()) {
            allImageUrls.push(url);
            console.log(`✓ Galeria ${i + 1} adicionada:`, url);
          }
        });
      } else {
        console.log("Nenhuma galeria encontrada ou galeria vazia");
      }

      console.log("=== TODAS AS URLs COLETADAS ===");
      console.log("Total de URLs:", allImageUrls.length);
      console.log("URLs:", allImageUrls);

      // Converter URLs para paths e remover duplicatas
      const uniquePaths = new Set<string>();

      allImageUrls.forEach((url, index) => {
        const path = toObjectPath(url);
        console.log(`URL ${index + 1}: ${url} → Path: ${path}`);
        if (path) {
          uniquePaths.add(path);
        }
      });

      const pathsArray = Array.from(uniquePaths);
      console.log("=== PATHS ÚNICOS PARA DELETAR ===");
      console.log("Total de paths:", pathsArray.length);
      console.log("Paths:", pathsArray);

      // Deletar as imagens do storage UMA POR UMA (mais confiável)
      if (pathsArray.length > 0) {
        console.log("=== INICIANDO DELEÇÃO UMA POR UMA ===");

        let actuallyDeletedCount = 0;
        let errorCount = 0;

        for (let i = 0; i < pathsArray.length; i++) {
          const path = pathsArray[i];
          console.log(
            `Tentando deletar ${i + 1}/${pathsArray.length}: ${path}`
          );

          try {
            // Primeiro, verificar se o arquivo existe
            const { data: existsData, error: existsError } =
              await supabase.storage
                .from(STORAGE_BUCKET)
                .list(path.split("/").slice(0, -1).join("/"), {
                  search: path.split("/").pop(),
                });

            if (existsError) {
              console.log(
                `⚠️ Erro ao verificar existência de ${path}:`,
                existsError
              );
            }

            const fileExists = existsData && existsData.length > 0;
            console.log(`📁 Arquivo ${path} existe: ${fileExists}`);

            if (!fileExists) {
              console.log(`⭐ Arquivo ${path} já não existe, pulando...`);
              continue;
            }

            // Tentar deletar o arquivo com múltiplas tentativas
            let deleted = false;
            let attempts = 0;
            const maxAttempts = 3;

            while (!deleted && attempts < maxAttempts) {
              attempts++;
              console.log(
                `🔄 Tentativa ${attempts}/${maxAttempts} para deletar: ${path}`
              );

              const { data: deleteResult, error: deleteError } =
                await supabase.storage.from(STORAGE_BUCKET).remove([path]);

              if (deleteError) {
                console.error(
                  `❌ Erro na tentativa ${attempts} para ${path}:`,
                  deleteError
                );
                if (attempts === maxAttempts) {
                  errorCount++;
                  break;
                }
              } else {
                console.log(
                  `🗑️ Tentativa ${attempts} - Comando enviado para: ${path}`,
                  deleteResult
                );

                // Aguardar e verificar se foi realmente deletado
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Aguardar mais tempo

                const { data: verifyData, error: verifyError } =
                  await supabase.storage
                    .from(STORAGE_BUCKET)
                    .list(path.split("/").slice(0, -1).join("/"), {
                      search: path.split("/").pop(),
                    });

                if (verifyError) {
                  console.log(
                    `⚠️ Erro ao verificar deleção de ${path}:`,
                    verifyError
                  );
                  if (attempts === maxAttempts) {
                    errorCount++;
                    break;
                  }
                } else {
                  const stillExists = verifyData && verifyData.length > 0;
                  if (stillExists) {
                    console.error(
                      `💀 Tentativa ${attempts} FALHOU: ${path} ainda existe!`
                    );
                    if (attempts === maxAttempts) {
                      console.error(
                        `🚨 FALHA TOTAL: ${path} não pôde ser deletado após ${maxAttempts} tentativas`
                      );
                      errorCount++;
                    } else {
                      console.log(`🔄 Tentando novamente em 2 segundos...`);
                      await new Promise((resolve) => setTimeout(resolve, 2000));
                    }
                  } else {
                    console.log(
                      `✅ SUCESSO na tentativa ${attempts}: ${path} foi realmente deletado!`
                    );
                    actuallyDeletedCount++;
                    deleted = true;
                  }
                }
              }
            }

            // Delay entre tentativas
            await new Promise((resolve) => setTimeout(resolve, 300));
          } catch (err) {
            console.error(`💥 Exceção ao deletar ${path}:`, err);
            errorCount++;
          }
        }

        console.log(`=== RESULTADO FINAL DA DELEÇÃO ===`);
        console.log(`✅ Realmente deletados: ${actuallyDeletedCount}`);
        console.log(`❌ Erros/Falhas: ${errorCount}`);
        console.log(`📊 Total tentativas: ${pathsArray.length}`);
      }

      // Deletar o post do banco de dados
      console.log("=== DELETANDO POST DO BANCO ===");
      const { error: deletePostError } = await supabase
        .from("works")
        .delete()
        .eq("id", id);

      if (deletePostError) {
        console.error("Erro ao deletar post:", deletePostError);
        throw deletePostError;
      }

      console.log("✓ Post deletado com sucesso do banco");
      router.push("/admin/posts");
    } catch (error) {
      console.error("=== ERRO GERAL ===", error);
      alert(
        "Erro ao deletar a postagem. Verifique o console para mais detalhes."
      );
    }
  }

  function handleAddTagFromInput() {
    const value = tagInput.trim();
    if (!value) return;
    if (!tags.includes(value)) setTags([...tags, value]);
    setTagInput("");
  }

  function handleRemoveTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  if (loading) return <p className="p-6 text-[#232323]">Carregando...</p>;

  return (
    <section
      style={{ backgroundColor: "#fffce3" }}
      className="min-h-screen py-16 sm:py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        <h1 className="text-xl sm:text-2xl font-semibold text-[#232323] mb-6 sm:mb-8">
          Editar Postagem
        </h1>
        <form
          onSubmit={handleSave}
          className="rounded-xl p-4 sm:p-6 lg:p-8 border-2 border-[#232323] bg-transparent"
        >
          <div className="space-y-6 sm:space-y-8">
            {/* Informações Básicas */}
            <div className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <Label className="text-[#232323] font-medium text-sm sm:text-base">
                  Título
                </Label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  className="border-2 border-[#232323] bg-transparent text-[#232323] focus:border-[#232323] focus:ring-1 focus:ring-[#232323]"
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label className="text-[#232323] font-medium text-sm sm:text-base">
                  Descrição
                </Label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full rounded-lg border-2 border-[#232323] bg-transparent text-[#232323] px-3 py-2 min-h-[100px] sm:min-h-[120px] lg:min-h-[150px] resize-y focus:border-[#232323] focus:ring-1 focus:ring-[#232323] focus:outline-none"
                  rows={5}
                  placeholder="Descreva seu trabalho..."
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label className="text-[#232323] font-medium text-sm sm:text-base">
                  Categoria
                </Label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full rounded-lg border-2 border-[#232323] bg-transparent text-[#232323] px-3 py-2 focus:border-[#232323] focus:ring-1 focus:ring-[#232323] focus:outline-none"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {mockCategorias.map((cat) => (
                    <option key={cat.id} value={cat.nome}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
                <p className="text-xs sm:text-sm text-[#232323]/70 mt-2">
                  A categoria será automaticamente adicionada como a primeira
                  tag
                </p>
              </div>
            </div>

            {/* Tags e Imagens */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[#232323] font-medium text-sm sm:text-base">
                  Tags
                </Label>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 rounded-full border-2 border-[#232323] px-3 py-1 text-xs sm:text-sm text-[#232323]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-[#232323]/70 hover:text-[#232323] text-sm"
                          aria-label={`Remover tag ${tag}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        handleAddTagFromInput();
                      }
                    }}
                    placeholder="Digite e pressione Enter para adicionar"
                    className="border-2 border-[#232323] bg-transparent text-[#232323] focus:border-[#232323] focus:ring-1 focus:ring-[#232323] flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTagFromInput}
                    className="border-2 border-[#232323] text-[#232323] hover:bg-[#232323] hover:text-[#fffce3] px-4 py-2 text-sm font-medium"
                  >
                    Adicionar
                  </Button>
                </div>
                {tagSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-[#232323]/70">
                      Sugestões:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tagSuggestions.slice(0, 10).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            if (!tags.includes(s)) setTags([...tags, s]);
                          }}
                          className="group relative px-3 py-1 rounded-lg overflow-hidden border-2 border-[#232323] text-[#232323] text-xs sm:text-sm hover:text-[#fffce3] transition-colors"
                          title="Adicionar tag"
                        >
                          <span className="absolute inset-0 bg-[#232323] opacity-0 -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
                          <span className="relative z-10">{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-[#232323] font-medium text-sm sm:text-base">
                  Imagem Principal
                </Label>
                {imagemUrl && (
                  <div className="border-2 border-[#232323]/20 rounded-lg p-2 inline-block">
                    <img
                      src={imagemUrl}
                      alt="preview"
                      className="w-32 h-24 sm:w-40 sm:h-28 object-cover rounded"
                    />
                    <p className="text-xs text-[#232323]/70 mt-1 text-center">
                      Imagem atual
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-[#232323] font-medium text-sm sm:text-base">
                    Galeria
                  </Label>
                  {galeria.length > 0 ? (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {galeria.map((src, i) => (
                        <div
                          key={i}
                          className={`relative group ${
                            dragIndex === i ? "ring-2 ring-[#232323]" : ""
                          }`}
                          draggable
                          onDragStart={() => handleDragStart(i)}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(i)}
                          title="Arraste para reordenar"
                        >
                          <img
                            src={src}
                            alt={`img-${i}`}
                            className="w-full h-20 object-cover rounded border border-[#232323]/30"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 text-xs rounded bg-[#232323] text-[#fffce3] px-2 py-0.5 opacity-90 hover:opacity-100"
                            onClick={() => handleRemoveImage(i)}
                            title="Remover"
                          >
                            Remover
                          </button>
                          <button
                            type="button"
                            className="absolute bottom-1 right-1 text-xs rounded bg-[#fffce3] border border-[#232323] text-[#232323] px-2 py-0.5 hover:bg-[#232323] hover:text-[#fffce3]"
                            onClick={() => handleSetCover(src)}
                            title="Definir como capa"
                          >
                            Capa
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#232323]/70">
                      Sem imagens adicionais
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setNewFiles(Array.from(e.target.files || []).slice(0, 10))
                  }
                  className="w-full text-sm text-[#232323] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-[#232323] file:text-[#232323] file:bg-transparent hover:file:bg-[#232323] hover:file:text-[#fffce3] file:transition-colors cursor-pointer"
                />
                <p className="text-xs sm:text-sm text-[#232323]/70 mt-2">
                  Escolha novas imagens para substituir ou adicionar à galeria.
                </p>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="pt-6 mt-6 border-t border-[#232323]/20">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  className="flex-1 sm:flex-none border-2 border-[#232323] text-[#232323] hover:bg-[#232323] hover:text-[#fffce3] px-6 py-3 font-medium transition-colors"
                >
                  Salvar Alterações
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 font-medium px-6 py-3 transition-colors"
                >
                  Deletar Postagem
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
