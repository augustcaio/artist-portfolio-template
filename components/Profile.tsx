"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";

export function Profile() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-16"
      style={{ backgroundColor: "#fffce3" }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Avatar */}
          <AnimatedSection delay={0.2} direction="up">
            <div className="mb-8">
              <motion.div
                className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-200 shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/Ana_profile.jpg"
                  alt="Ana Gabriela Santos"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  priority
                />
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Nome e Título */}
          <AnimatedSection delay={0.4} direction="up">
            <h1 className="text-5xl font-semibold italic text-[#232323] mb-4">
              Ana Gabriela Santos
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.6} direction="up">
            <h2 className="text-2xl text-[#232323] mb-8">
              Designer & Artista Visual
            </h2>
          </AnimatedSection>

          {/* Descrição */}
          <AnimatedSection delay={0.8} direction="up">
            <p className="text-lg text-[#232323] max-w-2xl mx-auto mb-8 leading-relaxed">
              Transformando ideias em experiências visuais únicas. Especializada
              em design gráfico, identidade visual e ilustração. Criando
              conexões através da arte e do design.
            </p>
          </AnimatedSection>

          {/* Botão Contrate-me */}
          <AnimatedSection delay={0.9} direction="up">
            <div className="mb-12">
              <motion.a
                href="https://wa.me/+559282925640"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-[#232323] bg-transparent border-2 border-[#232323] rounded-lg overflow-hidden"
                whileHover={{
                  boxShadow: "0 8px 20px rgba(35, 35, 35, 0.15)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {/* Animação da esquerda para direita */}
                <div className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-[#232323] overflow-hidden transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-10" />

                <span className="relative z-20 transition-colors duration-300 group-hover:text-[#fffce3]">
                  Contate-me
                </span>
              </motion.a>
            </div>
          </AnimatedSection>

          {/* Redes Sociais */}
          <AnimatedSection delay={1.1} direction="up">
            <div className="mt-12 flex justify-center space-x-6">
              <motion.a
                href="https://www.instagram.com/santizzza/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                whileHover={{ scale: 1.2, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="w-6 h-6"
                  fill="url(#instagram-gradient)"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <linearGradient
                      id="instagram-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#f09433" />
                      <stop offset="25%" stopColor="#e6683c" />
                      <stop offset="50%" stopColor="#dc2743" />
                      <stop offset="75%" stopColor="#cc2366" />
                      <stop offset="100%" stopColor="#bc1888" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/ana-gabriela-857073214/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                whileHover={{ scale: 1.2, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="#0077b5" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </motion.a>
              <motion.a
                href="mailto:santosssag@gmail.com"
                className="transition-colors"
                whileHover={{ scale: 1.2, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <span className="sr-only">Gmail</span>
                <svg className="w-6 h-6" fill="#EA4335" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.819L12 13.09l9.545-9.269h.819A1.636 1.636 0 0 1 24 5.457z" />
                </svg>
              </motion.a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
