"use client";

import { useState } from "react";
import { createClientBrowser } from "@/lib/supabase-auth";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const supabase = createClientBrowser();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (!data.session) throw new Error("Falha ao iniciar sessão");
      setMessage("Login realizado com sucesso.");

      // Redirecionar imediatamente após login bem-sucedido
      console.log("Login successful, redirecting to /admin");
      window.location.href = "/admin";
    } catch (err: any) {
      setError(err?.message || "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#fffce3" }}
    >
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-[#232323]">Entrar</h1>
          <p className="text-gray-600">Acesse com email e senha</p>
        </div>
        <form
          onSubmit={handleSignIn}
          className="rounded-xl p-6 border-2 border-[#232323] bg-transparent space-y-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-[#232323]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-[#232323] bg-transparent px-3 py-2 text-[#232323] focus:outline-none"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[#232323]"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-[#232323] bg-transparent px-3 py-2 text-[#232323] focus:outline-none"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <p className="mb-4 text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
              {message}
            </p>
          )}
          {error && (
            <p className="mb-4 text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="group relative w-full inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-[#232323] bg-transparent border-2 border-[#232323] rounded-lg overflow-hidden hover:text-[#fffce3] disabled:opacity-60"
            whileHover={{ boxShadow: "0 8px 20px rgba(35,35,35,0.15)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-[#232323] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10">
              {loading ? "Entrando..." : "Entrar"}
            </span>
          </motion.button>
        </form>
      </div>
    </section>
  );
}
