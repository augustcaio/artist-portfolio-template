"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createClientBrowser } from "@/lib/supabase-auth";
import { SUPABASE_REDIRECT_URL } from "@/lib/config";

export function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMsg, setLoginMsg] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const supabase = createClientBrowser();

  // Animações elegantes para o menu mobile
  const listVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.12,
        delayChildren: 0.12,
      },
    },
  } as const;
  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    },
  } as const;

  // Detectar scroll para mudança de estilo
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll para seções
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: "home", label: "Início", section: "home" },
    { id: "gallery", label: "Portfólio", section: "gallery" },
    { id: "contact", label: "Contato", section: "contact" },
  ];

  async function handleLoginClick() {
    // Verificar se o usuário já está logado
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      // Se estiver logado, redirecionar para a dashboard
      router.push("/admin");
    } else {
      // Se não estiver logado, abrir o modal
      setIsLoginOpen(true);
    }
  }

  async function handleSendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginMsg(null);
    setLoginError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: "caioaugusto930@gmail.com",
        options: {
          emailRedirectTo: SUPABASE_REDIRECT_URL,
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
      setLoginMsg(
        "Link de acesso enviado com sucesso para caioaugusto930@gmail.com."
      );
    } catch (err: any) {
      setLoginError(err?.message || "Erro ao enviar link de acesso");
    } finally {
      setLoginLoading(false);
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#fffce3]/95" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Nome - Centralizado no mobile */}
          <motion.button
            onClick={() => scrollToSection("home")}
            className="group relative text-xl font-extrabold italic text-[#232323] hover:text-[#1a1a1a] transition-colors md:static absolute left-1/2 transform -translate-x-1/2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Ana Gabriela Santos
          </motion.button>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.section)}
                className="group relative px-6 py-2 text-[#232323] font-medium rounded-lg overflow-hidden transition-colors hover:text-[#fffce3]"
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {/* Animação de hover igual ao botão Contrate-me */}
                <div className="absolute inset-0 bg-[#232323] opacity-0 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />

                <span className="relative z-10 transition-colors duration-300">
                  {item.label}
                </span>
              </motion.button>
            ))}

            {/* Botão Entrar (verifica login ou abre modal) */}
            <motion.button
              type="button"
              onClick={handleLoginClick}
              className="group relative px-6 py-2 text-[#232323] font-medium rounded-lg overflow-hidden transition-colors hover:text-[#fffce3]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-[#232323] opacity-0 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
              <span className="relative z-10 transition-colors duration-300">
                Entrar
              </span>
            </motion.button>

            {/* Botão CTA */}
            <motion.a
              href="https://wa.me/+559282925640"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative ml-4 inline-flex items-center justify-center px-6 py-2 font-semibold text-[#232323] bg-transparent border-2 border-[#232323] rounded-lg overflow-hidden transition-colors hover:text-[#fffce3]"
              whileHover={{
                boxShadow: "0 8px 20px rgba(35, 35, 35, 0.15)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Animação de hover (ajustada ao tamanho da navbar) */}
              <div className="absolute inset-0 bg-[#232323] overflow-hidden opacity-0 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out z-10" />

              <span className="relative z-20 transition-colors duration-300">
                Contate-me
              </span>
            </motion.a>
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#232323] hover:bg-[#232323]/10"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[300px] bg-[#fffce3] border-l border-[#232323]/20"
              >
                <SheetHeader>
                  {/* Título acessível para o Dialog interno do Sheet */}
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                </SheetHeader>
                <motion.div
                  className="flex flex-col mt-4 px-4 pb-6 space-y-2"
                  variants={listVariants}
                  initial="hidden"
                  animate={isMobileMenuOpen ? "show" : "hidden"}
                >
                  {/* Items do menu */}
                  {navItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => scrollToSection(item.section)}
                      className="group relative w-full text-left px-4 py-3 text-[#232323] font-medium rounded-lg overflow-hidden transition-colors hover:text-[#fffce3]"
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Animação de hover */}
                      <div className="absolute inset-0 bg-[#232323] opacity-0 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />

                      <span className="relative z-10 transition-colors duration-300">
                        {item.label}
                      </span>
                    </motion.button>
                  ))}

                  {/* Botão CTA Mobile */}
                  <motion.a
                    href="https://wa.me/+559282925640"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-full text-center mt-4 px-6 py-3 text-[#232323] font-semibold border-2 border-[#232323] rounded-lg overflow-hidden transition-colors hover:text-[#fffce3]"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Animação de hover */}
                    <div className="absolute inset-0 bg-[#232323] opacity-0 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />

                    <span className="relative z-10 transition-colors duration-300">
                      Contrate-me
                    </span>
                  </motion.a>

                  {/* Botão Entrar Mobile (verifica login ou abre modal) */}
                  <motion.button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLoginClick();
                    }}
                    className="group relative w-full text-left mt-2 px-4 py-3 text-[#232323] font-medium rounded-lg overflow-hidden transition-colors hover:text-[#fffce3]"
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-[#232323] opacity-0 transform -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
                    <span className="relative z-10 transition-colors duration-300">
                      Entrar
                    </span>
                  </motion.button>
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Modal de Login por Magic Link */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="max-w-md rounded-xl border-2 border-[#232323] bg-[#fffce3] text-[#232323] shadow-lg p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-semibold text-[#232323]">
              Entrar com email
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSendMagicLink} className="space-y-6">
            <div className="text-sm leading-relaxed text-[#232323]">
              <p>
                Enviaremos um link de acesso para{" "}
                <strong>caioaugusto930@gmail.com</strong>. Clique no botão
                abaixo e verifique sua caixa de entrada.
              </p>
            </div>

            {loginMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-800 bg-green-50 border border-green-200 px-3 py-2 rounded-md"
              >
                {loginMsg}
              </motion.div>
            )}

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-800 bg-red-50 border border-red-200 px-3 py-2 rounded-md"
              >
                {loginError}
              </motion.div>
            )}

            <div className="flex items-center gap-4 justify-end pt-4">
              <Button
                type="button"
                onClick={() => {
                  setIsLoginOpen(false);
                  setLoginMsg(null);
                  setLoginError(null);
                }}
                variant="outline"
                className="border-2 border-[#232323] text-[#232323] hover:bg-gray-100"
                disabled={loginLoading}
              >
                Fechar
              </Button>
              <Button
                type="submit"
                disabled={loginLoading}
                className="border-2 border-[#232323] text-[#232323] hover:bg-[#232323] hover:text-[#fffce3] transition-colors"
              >
                {loginLoading ? "Enviando..." : "Enviar link"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.nav>
  );
}
