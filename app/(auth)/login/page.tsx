"use client";

import { useState } from "react";
import { createClientBrowser } from "@/lib/supabase-auth";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const supabase = createClientBrowser();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
      setMessage(
        "Enviamos um link mágico para seu email. Verifique sua caixa de entrada."
      );
    } catch (err: any) {
      setError(err?.message || "Erro ao enviar link");
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
          <p className="text-gray-600">Acesse com link mágico por email</p>
        </div>
        <form
          onSubmit={handleSignIn}
          className="rounded-xl p-6 border-2 border-[#232323] bg-transparent"
        >
          <label className="block text-sm text-[#232323] mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border-2 border-[#232323] bg-transparent text-[#232323] placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#232323]"
            placeholder="voce@email.com"
          />

          {message && (
            <p className="mt-4 text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-4 text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="group relative mt-6 w-full inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-[#232323] bg-transparent border-2 border-[#232323] rounded-lg overflow-hidden hover:text-[#fffce3] disabled:opacity-60"
            whileHover={{ boxShadow: "0 8px 20px rgba(35,35,35,0.15)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-[#232323] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10">
              {loading ? "Enviando..." : "Enviar link"}
            </span>
          </motion.button>
        </form>
      </div>
    </section>
  );
}
