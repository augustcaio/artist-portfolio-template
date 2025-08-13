"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Falha ao enviar");
      }
      setSuccess("Mensagem enviada com sucesso! Retornaremos em breve.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setError(err?.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="contact"
      className="py-20"
      style={{ backgroundColor: "#fffce3" }}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <AnimatedSection delay={0.2} direction="up">
          <h2 className="text-4xl font-semibold text-[#232323] text-center mb-2">
            Fale comigo
          </h2>
          <p className="text-gray-600 text-center mb-10">
            Envie uma mensagem e vamos conversar sobre seu projeto.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.4} direction="up">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl p-6 border-2 border-[#232323] bg-transparent"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#232323] mb-1">
                  Nome
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  spellCheck={false}
                  className="w-full rounded-lg border-2 border-[#232323] bg-transparent text-[#232323] placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#232323]"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-sm text-[#232323] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  spellCheck={false}
                  className="w-full rounded-lg border-2 border-[#232323] bg-transparent text-[#232323] placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#232323]"
                  placeholder="voce@email.com"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-[#232323] mb-1">
                Mensagem
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                spellCheck={false}
                className="w-full rounded-lg border-2 border-[#232323] bg-transparent text-[#232323] placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#232323]"
                placeholder="Conte um pouco sobre o que você precisa..."
              />
            </div>

            {success && (
              <p className="mt-4 text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
                {success}
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
              className="group relative mt-6 inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-[#232323] bg-transparent border-2 border-[#232323] rounded-lg overflow-hidden hover:text-[#fffce3] disabled:opacity-60"
              whileHover={{ boxShadow: "0 8px 20px rgba(35,35,35,0.15)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-[#232323] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">
                {loading ? "Enviando..." : "Enviar"}
              </span>
            </motion.button>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
}
