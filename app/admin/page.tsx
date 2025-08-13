"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const supabase = createClientBrowser();
  const router = useRouter();
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(false);

  const [totalWorks, setTotalWorks] = useState<number>(0);
  const [publishedWorks, setPublishedWorks] = useState<number>(0);
  const [draftWorks, setDraftWorks] = useState<number>(0);
  const [categoriesCount, setCategoriesCount] = useState<number>(0);
  const [recentWorks, setRecentWorks] = useState<
    Array<{
      id: string;
      titulo: string;
      categoria: string | null;
      imagem_url: string | null;
    }>
  >([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setIsLogged(Boolean(data.session));
      if (mounted) setChecking(false);
      if (mounted) setUserEmail(data.session?.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!mounted) return;
      setIsLogged(Boolean(session));
      setChecking(false);
      setUserEmail(session?.user?.email ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLogged) return;
    loadDashboard();
  }, [isLogged]);

  async function loadDashboard() {
    setLoadingDashboard(true);
    try {
      // Total de trabalhos
      const { count: total } = await supabase
        .from("works")
        .select("id", { count: "exact", head: true });
      setTotalWorks(total || 0);

      // Publicados e rascunhos
      const [{ count: publicados }, { count: rascunhos }] = await Promise.all([
        supabase
          .from("works")
          .select("id", { count: "exact", head: true })
          .eq("ativo", true),
        supabase
          .from("works")
          .select("id", { count: "exact", head: true })
          .neq("ativo", true),
      ]);
      setPublishedWorks(publicados || 0);
      setDraftWorks(rascunhos || 0);

      // Categorias distintas (em memória para simplicidade)
      const { data: categoriasRows } = await supabase
        .from("works")
        .select("categoria")
        .not("categoria", "is", null);
      const uniqueCategories = new Set<string>();
      (categoriasRows || []).forEach((r: any) => {
        if (typeof r.categoria === "string" && r.categoria.trim().length > 0) {
          uniqueCategories.add(r.categoria.trim());
        }
      });
      setCategoriesCount(uniqueCategories.size);

      // Recentes
      const { data: recentes } = await supabase
        .from("works")
        .select("id,titulo,categoria,imagem_url")
        .order("data_criacao", { ascending: false })
        .limit(5);
      setRecentWorks(recentes || []);
    } finally {
      setLoadingDashboard(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <section
      style={{ backgroundColor: "#fffce3" }}
      className="min-h-screen py-16 sm:py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {checking ? (
          <p className="text-[#232323]">Carregando...</p>
        ) : !isLogged ? (
          <p className="text-[#232323]">Faça login para ver o conteúdo.</p>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Cabeçalho do artista */}
            <div className="rounded-xl p-4 sm:p-6 border-2 border-[#232323] bg-transparent">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#232323] bg-[#fffce3] flex items-center justify-center text-[#232323] font-semibold text-sm sm:text-base">
                    {userEmail?.[0]?.toUpperCase() || "A"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[#232323] text-base sm:text-lg font-medium">
                      Bem-vindo de volta
                    </p>
                    <p className="text-[#232323]/70 text-sm truncate">
                      {userEmail || "Artista"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <Link
                    href="/admin/posts/new"
                    className="border-2 border-[#232323] text-[#232323] px-4 py-2 rounded-lg hover:bg-[#232323] hover:text-[#fffce3] transition-colors text-center text-sm sm:text-base font-medium"
                  >
                    Novo trabalho
                  </Link>
                  <Link
                    href="/admin/posts"
                    className="border-2 border-[#232323] text-[#232323] px-4 py-2 rounded-lg hover:bg-[#232323] hover:text-[#fffce3] transition-colors text-center text-sm sm:text-base font-medium"
                  >
                    Gerenciar trabalhos
                  </Link>
                </div>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "Trabalhos", value: totalWorks },
                { label: "Publicados", value: publishedWorks },
                { label: "Rascunhos", value: draftWorks },
                { label: "Categorias", value: categoriesCount },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl p-3 sm:p-5 border-2 border-[#232323] bg-transparent text-center sm:text-left"
                >
                  <p className="text-xs sm:text-sm text-[#232323]/70 mb-1 sm:mb-0">
                    {m.label}
                  </p>
                  <p className="text-xl sm:text-3xl font-semibold text-[#232323]">
                    {loadingDashboard ? "--" : m.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Recentes */}
            <div className="rounded-xl p-4 sm:p-6 border-2 border-[#232323] bg-transparent">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-[#232323]">
                  Recentes
                </h2>
                <Link
                  href="/admin/posts"
                  className="text-sm underline text-[#232323] self-start sm:self-auto"
                >
                  Ver todos
                </Link>
              </div>
              {loadingDashboard ? (
                <p className="text-[#232323] text-sm sm:text-base">
                  Carregando...
                </p>
              ) : recentWorks.length === 0 ? (
                <p className="text-[#232323] text-sm sm:text-base">
                  Nenhum trabalho ainda.
                </p>
              ) : (
                <ul className="space-y-3 sm:divide-y sm:divide-[#232323]/20 sm:space-y-0">
                  {recentWorks.map((w) => (
                    <li
                      key={w.id}
                      className="flex flex-col gap-3 p-3 sm:p-0 sm:py-3 border border-[#232323]/20 rounded-lg sm:border-0 sm:rounded-none sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {w.imagem_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={w.imagem_url}
                            alt={w.titulo}
                            className="w-12 h-9 sm:w-14 sm:h-10 object-cover rounded border border-[#232323]/30 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-9 sm:w-14 sm:h-10 rounded bg-[#232323]/10 flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-[#232323] font-medium truncate text-sm sm:text-base">
                            {w.titulo}
                          </p>
                          <p className="text-[#232323]/70 text-xs sm:text-sm truncate">
                            {w.categoria || "Sem categoria"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end sm:ml-auto">
                        <Link
                          href={`/admin/posts/${w.id}`}
                          className="text-xs sm:text-sm border-2 border-[#232323] text-[#232323] px-3 py-1.5 sm:py-1 rounded-lg hover:bg-[#232323] hover:text-[#fffce3] transition-colors font-medium"
                        >
                          Editar
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
