import { Work, Categoria } from "./supabase";

// Dados de exemplo para teste
export const mockWorks: Work[] = [
  {
    id: "1",
    titulo: "Identidade Visual - Café Aroma",
    descricao:
      "Desenvolvimento completo da identidade visual para uma cafeteria artesanal, incluindo logo, paleta de cores, tipografia e aplicações em diversos materiais.",
    imagem_url: "/Ana_profile.jpg",
    categoria: "Identidade Visual",
    tags: ["Logo Design", "Branding", "Café", "Artesanal"],
    galeria: ["/Ana_profile.jpg", "/Ana_profile.jpg", "/Ana_profile.jpg"],
    data_criacao: "2024-01-15T10:00:00Z",
    data_atualizacao: "2024-01-15T10:00:00Z",
    ativo: true,
    ordem_exibicao: 1,
  },
  {
    id: "2",
    titulo: "Teste com tags",
    descricao: "Teste de postagem com Tag para Filtragem",
    imagem_url: "/Ana_profile.jpg",
    categoria: "Design Gráfico",
    tags: ["Photoshop"],
    galeria: ["/Ana_profile.jpg", "/Ana_profile.jpg"],
    data_criacao: "2024-01-10T14:30:00Z",
    data_atualizacao: "2024-01-10T14:30:00Z",
    ativo: true,
    ordem_exibicao: 2,
  },
  {
    id: "3",
    titulo: "Ilustração Digital - Natureza",
    descricao:
      "Série de ilustrações digitais explorando a relação entre natureza e tecnologia, usando técnicas de pintura digital e composição surreal.",
    imagem_url: "/Ana_profile.jpg",
    categoria: "Ilustração",
    tags: ["Digital Art", "Natureza", "Surreal", "Pintura Digital"],
    data_criacao: "2024-01-05T09:15:00Z",
    data_atualizacao: "2024-01-05T09:15:00Z",
    ativo: true,
    ordem_exibicao: 3,
  },
  {
    id: "4",
    titulo: "Website - Portfolio Pessoal",
    descricao:
      "Design e desenvolvimento de website responsivo para artista visual, focando em apresentação elegante do portfólio e experiência do usuário otimizada.",
    imagem_url: "/Ana_profile.jpg",
    categoria: "Design Gráfico",
    tags: ["Website", "Portfolio", "Responsivo", "UX/UI"],
    data_criacao: "2023-12-20T16:45:00Z",
    data_atualizacao: "2023-12-20T16:45:00Z",
    ativo: true,
    ordem_exibicao: 4,
  },
  {
    id: "5",
    titulo: "Packaging - Linha de Cosméticos",
    descricao:
      "Desenvolvimento de embalagens para linha premium de cosméticos naturais, com foco em sustentabilidade e elegância minimalista.",
    imagem_url: "/Ana_profile.jpg",
    categoria: "Design Gráfico",
    tags: ["Packaging", "Cosméticos", "Sustentável", "Premium"],
    data_criacao: "2023-12-15T11:20:00Z",
    data_atualizacao: "2023-12-15T11:20:00Z",
    ativo: true,
    ordem_exibicao: 5,
  },
  {
    id: "6",
    titulo: "Arte Digital - Retrato Conceitual",
    descricao:
      "Retrato digital conceitual explorando temas de identidade e expressão pessoal através de elementos abstratos e cores vibrantes.",
    imagem_url: "/Ana_profile.jpg",
    categoria: "Arte Visual",
    tags: ["Retrato", "Conceitual", "Digital", "Abstrato"],
    data_criacao: "2023-12-10T13:00:00Z",
    data_atualizacao: "2023-12-10T13:00:00Z",
    ativo: true,
    ordem_exibicao: 6,
  },
];

export const mockCategorias: Categoria[] = [
  {
    id: "1",
    nome: "Design Gráfico",
    descricao: "Projetos de design gráfico e identidade visual",
    cor: "#232323",
    ativo: true,
    ordem_exibicao: 1,
  },
  {
    id: "2",
    nome: "Ilustração",
    descricao: "Ilustrações e arte digital",
    cor: "#232323",
    ativo: true,
    ordem_exibicao: 2,
  },
  {
    id: "3",
    nome: "Identidade Visual",
    descricao: "Branding e identidade de marca",
    cor: "#232323",
    ativo: true,
    ordem_exibicao: 3,
  },

  {
    id: "5",
    nome: "Arte Visual",
    descricao: "Obras de arte e projetos criativos",
    cor: "#232323",
    ativo: true,
    ordem_exibicao: 5,
  },
];
