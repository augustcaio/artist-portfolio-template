"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase-auth";
import { STORAGE_BUCKET } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { mockCategorias } from "@/lib/mock-data";

export default function NewPostPage() {
  const supabase = createClientBrowser();
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [categoria, setCategoria] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // carregar sugestões de tags existentes
    (async () => {
      const { data } = await supabase.from("works").select("tags");
      const set = new Set<string>();
      (data || []).forEach((row: any) => {
        (row?.tags || []).forEach((t: string) => {
          if (typeof t === "string" && t.trim()) set.add(t.trim());
        });
      });
      setTagSuggestions(Array.from(set).sort());
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    let imageUrl: string | null = null;
    try {
      let uploadedUrls: string[] = [];
      if (files.length > 0) {
        for (const file of files.slice(0, 10)) {
          const path = `works/${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}-${file.name}`;
          const { error: upErr } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(path, file, { cacheControl: "3600", upsert: false });
          if (upErr) throw upErr;
          const { data } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(path);
          uploadedUrls.push(data.publicUrl);
        }
        imageUrl = uploadedUrls[0] ?? null;
      }

      // Garantir que a categoria seja sempre a primeira tag
      const finalTags = categoria
        ? [categoria, ...tags.filter((tag) => tag !== categoria)]
        : tags;

      const { error } = await supabase.from("works").insert({
        titulo,
        descricao,
        imagem_url: imageUrl,
        galeria: uploadedUrls.slice(1),
        categoria,
        tags: finalTags,
      });
      if (error) throw error;
      router.push("/admin/posts");
    } catch (err) {
      console.error(err);
      const message = (err as any)?.message?.includes("Bucket not found")
        ? `Bucket de Storage não encontrado: ${STORAGE_BUCKET}. Crie-o no Supabase (público) ou ajuste o nome em lib/storage.ts.`
        : "Falha ao salvar a postagem";
      setErrorMsg(message);
    } finally {
      setLoading(false);
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

  return (
    <section
      style={{ backgroundColor: "#fffce3" }}
      className="min-h-screen py-16 sm:py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        <h1 className="text-xl sm:text-2xl font-semibold text-[#232323] mb-6 sm:mb-8">
          Nova Postagem
        </h1>
        <form
          onSubmit={handleSubmit}
          className="rounded-xl p-4 sm:p-6 lg:p-8 border-2 border-[#232323] bg-transparent"
        >
          {errorMsg && (
            <div className="text-sm text-red-800 bg-red-50 border border-red-200 px-3 py-2 rounded-md mb-6">
              {errorMsg}
            </div>
          )}

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
                Imagens (até 10)
              </Label>
              <div className="border-2 border-dashed border-[#232323]/50 rounded-lg p-4 hover:border-[#232323] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setFiles(Array.from(e.target.files || []).slice(0, 10))
                  }
                  className="w-full text-sm text-[#232323] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-[#232323] file:text-[#232323] file:bg-transparent hover:file:bg-[#232323] hover:file:text-[#fffce3] file:transition-colors cursor-pointer"
                />
                <p className="text-xs sm:text-sm text-[#232323]/70 mt-2">
                  Escolha até 10 imagens. A primeira será a capa do trabalho.
                </p>
              </div>
              {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="text-xs sm:text-sm text-[#232323] border border-[#232323]/30 rounded-lg p-3 bg-[#232323]/5"
                    >
                      <span className="font-medium">
                        {i === 0 ? "🖼️ Capa:" : `📷 Img ${i + 1}:`}
                      </span>
                      <p className="truncate mt-1">{f.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botão de Submit - Full Width */}
          <div className="pt-6 mt-6 border-t border-[#232323]/20">
            <Button
              type="submit"
              disabled={loading}
              className="w-full lg:w-auto lg:px-8 border-2 border-[#232323] text-[#232323] hover:bg-[#232323] hover:text-[#fffce3] px-6 py-3 font-medium transition-colors"
            >
              {loading ? "Salvando..." : "Salvar Postagem"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
