"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClientBrowser } from "@/lib/supabase-auth";
import { STORAGE_BUCKET } from "@/lib/storage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Work = {
  id: string;
  titulo: string;
  descricao: string | null;
  imagem_url: string | null;
  categoria: string | null;
  tags: string[] | null;
  ativo: boolean;
  ordem_exibicao: number;
};

export default function PostsListPage() {
  const supabase = createClientBrowser();
  const [items, setItems] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("works")
      .select("*")
      .order("data_criacao", { ascending: false });
    setItems(data || []);
    setLoading(false);
  }

  // Função auxiliar para extrair o path da URL do Supabase Storage
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

  async function handleDelete(id: string) {
    if (!confirm("Deseja excluir esta postagem?")) return;

    try {
      // Primeiro buscar os dados do post para obter as URLs das imagens
      const { data: postData, error: fetchError } = await supabase
        .from("works")
        .select("imagem_url, galeria")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Erro ao buscar dados do post:", fetchError);
        throw fetchError;
      }

      console.log("=== DADOS DO POST ===");
      console.log("Post completo:", postData);
      console.log("Tipo da galeria:", typeof postData?.galeria);
      console.log("Galeria é array:", Array.isArray(postData?.galeria));

      if (postData) {
        const allImageUrls: string[] = [];

        // Coletar TODAS as URLs (principal + galeria)
        if (postData.imagem_url) {
          allImageUrls.push(postData.imagem_url);
          console.log("✓ Imagem principal adicionada:", postData.imagem_url);
        }

        // Tratar diferentes formatos de galeria
        if (postData.galeria) {
          if (Array.isArray(postData.galeria)) {
            postData.galeria.forEach((url: string, i: number) => {
              if (url && url.trim()) {
                allImageUrls.push(url);
                console.log(`✓ Galeria ${i + 1} adicionada:`, url);
              }
            });
          } else if (typeof postData.galeria === "string") {
            // Caso a galeria seja uma string JSON
            try {
              const parsed = JSON.parse(postData.galeria);
              if (Array.isArray(parsed)) {
                parsed.forEach((url: string, i: number) => {
                  if (url && url.trim()) {
                    allImageUrls.push(url);
                    console.log(`✓ Galeria JSON ${i + 1} adicionada:`, url);
                  }
                });
              }
            } catch (jsonError) {
              console.error("Erro ao parsear galeria JSON:", jsonError);
            }
          }
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
                        await new Promise((resolve) =>
                          setTimeout(resolve, 2000)
                        );
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
      load();
    } catch (error) {
      console.error("=== ERRO GERAL ===", error);
      alert(
        "Erro ao deletar a postagem. Verifique o console para mais detalhes."
      );
    }
  }

  return (
    <section
      style={{ backgroundColor: "#fffce3" }}
      className="min-h-screen py-16"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#232323]">Postagens</h1>
          <Link href="/admin/posts/new">
            <Button className="border-2 border-[#232323] text-[#232323] hover:bg-[#232323] hover:text-[#fffce3]">
              Nova postagem
            </Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-[#232323]">Carregando...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((w) => (
                <TableRow key={w.id}>
                  <TableCell>
                    {w.imagem_url ? (
                      <Image
                        src={w.imagem_url}
                        alt={w.titulo}
                        width={64}
                        height={48}
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-gray-200 rounded" />
                    )}
                  </TableCell>
                  <TableCell className="text-[#232323]">{w.titulo}</TableCell>
                  <TableCell className="text-[#232323]">
                    {w.categoria || "-"}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Link href={`/admin/posts/${w.id}`}>
                      <Button
                        variant="outline"
                        className="border-2 border-[#232323] text-[#232323] hover:bg-[#232323] hover:text-[#fffce3] font-medium"
                      >
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(w.id)}
                      className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 font-medium"
                    >
                      Deletar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}
