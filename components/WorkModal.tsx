"use client";

import { useState, useEffect } from "react";
import { Work } from "@/lib/supabase";

interface WorkModalProps {
  work: Work | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WorkModal({ work, isOpen, onClose }: WorkModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Reset quando abrir um novo trabalho
  useEffect(() => {
    if (isOpen && work) {
      setCurrentImageIndex(0);
      setShowLightbox(false);
    }
  }, [isOpen, work]);

  // Fechar modal com ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (showLightbox) {
          setShowLightbox(false);
        } else {
          onClose();
        }
      }

      // Navegação no lightbox com setas
      if (showLightbox && images.length > 1) {
        if (e.key === "ArrowLeft") {
          goToPrevious();
        }
        if (e.key === "ArrowRight") {
          goToNext();
        }
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, showLightbox, currentImageIndex]);

  if (!isOpen || !work) return null;

  // Preparar lista de imagens - combinar capa + galeria
  const images = (() => {
    const capaImage = work.imagem_url || "/Ana_profile.jpg";
    const galeriaImages =
      work.galeria && work.galeria.length > 0 ? work.galeria : [];

    // Se não há galeria, usar apenas a capa
    if (galeriaImages.length === 0) {
      return [capaImage];
    }

    // Se a capa já está na galeria, usar apenas a galeria
    if (galeriaImages.includes(capaImage)) {
      return galeriaImages;
    }

    // Combinar capa + galeria (capa primeiro)
    return [capaImage, ...galeriaImages];
  })();

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  return (
    <>
      {/* Modal Principal */}
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 sm:p-4">
        {/* Backdrop - fecha ao clicar */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Container do Modal */}
        <div className="relative bg-[#fffce3] border-2 border-[#232323] rounded-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-[#232323] text-[#fffce3] rounded-full flex items-center justify-center hover:bg-[#1a1a1a] transition-colors"
          >
            ×
          </button>

          {/* Conteúdo do Modal */}
          <div className="flex flex-col md:flex-row max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Coluna Esquerda - Imagens */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col">
              {/* Imagem Principal */}
              <div className="mb-4">
                <img
                  src={images[0]}
                  alt={work.titulo}
                  className="w-full aspect-[4/3] object-cover rounded-lg cursor-pointer border-2 border-[#232323]"
                  onClick={() => openLightbox(0)}
                  onError={(e) => {
                    console.log("Erro ao carregar imagem:", images[0]);
                    e.currentTarget.src = "/Ana_profile.jpg";
                  }}
                />
              </div>

              {/* Miniaturas */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${work.titulo} - ${index + 1}`}
                      className={`w-full aspect-square object-cover rounded border-2 cursor-pointer hover:opacity-80 transition-opacity ${
                        index === 0
                          ? "border-[#232323] ring-2 ring-[#232323]/30"
                          : "border-[#232323]"
                      }`}
                      onClick={() => openLightbox(index)}
                      onError={(e) => {
                        console.log("Erro ao carregar miniatura:", img);
                        e.currentTarget.src = "/Ana_profile.jpg";
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Coluna Direita - Detalhes */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col">
              {/* Conteúdo Superior */}
              <div className="flex-1">
                {/* Título e Categoria */}
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#232323] mb-2">
                    {work.titulo}
                  </h2>
                  {work.categoria && (
                    <span className="inline-block px-3 py-1 bg-[#232323] text-[#fffce3] text-sm rounded-full">
                      {work.categoria}
                    </span>
                  )}
                </div>

                {/* Descrição */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#232323] mb-2">
                    Sobre o projeto
                  </h3>
                  <p className="text-[#232323] leading-relaxed">
                    {work.descricao || "Sem descrição disponível."}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Criado em{" "}
                    {new Date(work.data_criacao).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                {/* Tags */}
                {work.tags && work.tags.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-[#232323] mb-2">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 border-2 border-[#232323] text-[#232323] text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Call to Action - Fixado na parte inferior */}
              <div className="border-2 border-[#232323] rounded-lg p-3 sm:p-4 mt-auto">
                <h4 className="font-semibold text-[#232323] mb-2 text-sm sm:text-base">
                  Gostou deste trabalho?
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">
                  Entre em contato para discutir seu próximo projeto!
                </p>
                <a
                  href="https://wa.me/+559282925640"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-[#232323] text-[#fffce3] rounded-lg hover:bg-[#1a1a1a] transition-colors text-sm"
                >
                  Conversar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95">
          {/* Fechar clicando no fundo */}
          <div
            className="absolute inset-0"
            onClick={() => setShowLightbox(false)}
          />

          {/* Imagem */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={images[currentImageIndex]}
              alt={work.titulo}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                console.log(
                  "Erro ao carregar imagem no lightbox:",
                  images[currentImageIndex]
                );
                e.currentTarget.src = "/Ana_profile.jpg";
              }}
            />
          </div>

          {/* Controles */}
          <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
            {/* Botão Anterior */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="pointer-events-auto w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 rounded-full flex items-center justify-center text-white text-xl transition-colors"
              >
                ←
              </button>
            )}

            <div className="pointer-events-auto"></div>

            {/* Botão Próximo */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="pointer-events-auto w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 rounded-full flex items-center justify-center text-white text-xl transition-colors"
              >
                →
              </button>
            )}
          </div>

          {/* Indicador e botão fechar */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 pointer-events-none">
            {/* Contador de imagens */}
            {images.length > 1 && (
              <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Botão fechar lightbox */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 rounded-full flex items-center justify-center text-white text-xl transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
