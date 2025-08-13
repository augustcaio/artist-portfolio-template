"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Work } from "@/lib/supabase";

interface WorkCardProps {
  work: Work;
  onClick: (work: Work) => void;
  index: number;
}

export function WorkCard({ work, onClick, index }: WorkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
      onClick={() => onClick(work)}
      whileHover={{ y: -5 }}
    >
      {/* Imagem */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={work.imagem_url || "/placeholder-work.jpg"}
          alt={work.titulo}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay no hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-semibold text-lg">Ver Detalhes</span>
        </div>

        {/* Categoria */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#232323] text-white px-3 py-1 rounded-full text-sm font-medium">
            {work.categoria}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-[#232323] mb-2 line-clamp-2">
          {work.titulo}
        </h3>

        {work.descricao && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {work.descricao}
          </p>
        )}

        {/* Tags */}
        {work.tags && work.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {work.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {work.tags.length > 3 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{work.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
