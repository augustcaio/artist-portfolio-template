"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer
      id="contact"
      className="py-4 sm:py-6"
      style={{ backgroundColor: "#fffce3" }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center text-center sm:text-left text-xs sm:text-sm text-[#232323] space-y-2 sm:space-y-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-2 sm:order-1"
          >
            <span className="block sm:inline">
              © 2025 Ana Gabriela Santos. Todos os direitos reservados.
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center space-x-1 order-1 sm:order-2"
          >
            <span>Desenvolvido pela</span>
            <motion.a
              href="https://opusmds.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-[#1a1a1a] transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Opus MDS
            </motion.a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
