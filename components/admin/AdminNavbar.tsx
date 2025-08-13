"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClientBrowser } from "@/lib/supabase-auth";
import { useRouter } from "next/navigation";

export function AdminNavbar() {
  const router = useRouter();
  const supabase = createClientBrowser();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user?.email ?? null);
    });
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const linkBase =
    "group relative px-6 py-2 text-[#232323] font-medium rounded-lg overflow-hidden transition-colors hover:text-[#fffce3]";

  // Mantemos o mesmo comportamento visual da Navbar pública: sem estado ativo persistente

  return (
    <nav
      className="sticky top-0 z-40 border-b-2 border-[#232323]"
      style={{ backgroundColor: "#fffce3" }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-lg font-semibold text-[#232323]">
            Área Administrativa
          </Link>
          <span className="hidden sm:block text-[#232323]/40">|</span>
          <div className="hidden md:flex items-center gap-2">
            <Link href="/admin" className={linkBase}>
              <div
                className={`absolute inset-0 bg-[#232323] opacity-0 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out`}
              />
              <span className="relative z-10 transition-colors duration-300">
                Dashboard
              </span>
            </Link>
            <Link href="/admin/posts" className={linkBase}>
              <div
                className={`absolute inset-0 bg-[#232323] opacity-0 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out`}
              />
              <span className="relative z-10 transition-colors duration-300">
                Postagens
              </span>
            </Link>
            <Link href="/admin/posts/new" className={linkBase}>
              <div
                className={`absolute inset-0 bg-[#232323] opacity-0 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out`}
              />
              <span className="relative z-10 transition-colors duration-300">
                Nova
              </span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {email && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#232323] flex items-center justify-center text-xs font-semibold">
                {email[0]?.toUpperCase()}
              </div>
              <span className="text-[#232323] text-sm max-w-[160px] truncate">
                {email}
              </span>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="group relative inline-flex items-center justify-center px-6 py-2 font-semibold text-[#232323] bg-transparent border-2 border-[#232323] rounded-lg overflow-hidden transition-colors hover:text-[#fffce3]"
            title="Sair"
          >
            <div className="absolute inset-0 bg-[#232323] overflow-hidden opacity-0 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out z-10" />
            <span className="relative z-20 transition-colors duration-300">
              Sair
            </span>
          </button>
        </div>
      </div>

      {/* Navegação compacta em telas pequenas */}
      <div className="md:hidden container mx-auto px-4 pb-3 flex gap-2">
        <Link href="/admin" className={`${linkBase} flex-1 text-center`}>
          <div
            className={`absolute inset-0 bg-[#232323] opacity-0 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out`}
          />
          <span className="relative z-10 transition-colors duration-300">
            Dashboard
          </span>
        </Link>
        <Link href="/admin/posts" className={`${linkBase} flex-1 text-center`}>
          <div
            className={`absolute inset-0 bg-[#232323] opacity-0 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out`}
          />
          <span className="relative z-10 transition-colors duration-300">
            Postagens
          </span>
        </Link>
        <Link
          href="/admin/posts/new"
          className={`${linkBase} flex-1 text-center`}
        >
          <div
            className={`absolute inset-0 bg-[#232323] opacity-0 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out`}
          />
          <span className="relative z-10 transition-colors duration-300">
            Nova
          </span>
        </Link>
      </div>
    </nav>
  );
}

export default AdminNavbar;
