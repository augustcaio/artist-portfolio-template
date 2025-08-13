"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { WorkCard } from "./WorkCard";
import { WorkModal } from "./WorkModal";
import { AnimatedSection } from "./AnimatedSection";
import { Work, getWorks } from "@/lib/supabase";
import { mockCategorias } from "@/lib/mock-data";
import { mockWorks } from "@/lib/mock-data";

export function Gallery() {
  const [works, setWorks] = useState<Work[]>([]);
  const [allWorks, setAllWorks] = useState<Work[]>([]);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Carregar dados
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Tenta carregar do Supabase, se falhar usa dados de exemplo
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const worksData = await getWorks();
        setWorks(worksData);
        setAllWorks(worksData);
      } else {
        // Simula delay de carregamento
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setWorks(mockWorks);
        setAllWorks(mockWorks);
      }
    } catch (error) {
      console.error("Erro ao carregar dados, usando dados de exemplo:", error);
      setWorks(mockWorks);
      setAllWorks(mockWorks);
    } finally {
      setLoading(false);
    }
  };

  // Categorias disponíveis derivadas dos trabalhos
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    for (const w of allWorks) {
      if (w.categoria) {
        set.add(w.categoria);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [allWorks]);

  // Filtrar por categoria
  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 150));
      if (category === "all") {
        setWorks(allWorks);
      } else {
        const filtered = allWorks.filter((w) => w.categoria === category);
        setWorks(filtered);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWorkClick = (work: Work) => {
    setSelectedWork(work);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWork(null);
  };

  return (
    <section
      id="gallery"
      className="py-20"
      style={{ backgroundColor: "#fffce3" }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Título da Seção */}
          <AnimatedSection delay={0.2} direction="up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-semibold text-[#232323] mb-4">
                Meu Portfólio
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore uma seleção dos meus trabalhos mais recentes em design
                gráfico, identidade visual e ilustração.
              </p>
            </div>
          </AnimatedSection>

          {/* Filtros por Categorias (dinâmicos) */}
          <AnimatedSection delay={0.4} direction="up">
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => handleCategoryFilter("all")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === "all"
                    ? "bg-[#232323] text-white"
                    : "bg-white text-[#232323] hover:bg-gray-100"
                }`}
              >
                Todos
              </button>

              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[#232323] text-white"
                      : "bg-white text-[#232323] hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Grid de Trabalhos */}
          <AnimatedSection delay={0.6} direction="up">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Skeleton Loading */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[4/3] bg-gray-200" />
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-3" />
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded w-16" />
                        <div className="h-6 bg-gray-200 rounded w-12" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : works.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {works.map((work, index) => (
                  <WorkCard
                    key={work.id}
                    work={work}
                    onClick={handleWorkClick}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {selectedCategory === "all"
                    ? "Nenhum trabalho encontrado."
                    : `Nenhum trabalho encontrado na categoria "${selectedCategory}".`}
                </p>
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <WorkModal
        work={selectedWork}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
