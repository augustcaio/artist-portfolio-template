import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para os dados
export interface Work {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string;
  // Opcional: galeria adicional de imagens (URLs públicas)
  galeria?: string[] | null;
  categoria: string;
  tags: string[];
  data_criacao: string;
  data_atualizacao: string;
  ativo: boolean;
  ordem_exibicao: number;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  ativo: boolean;
  ordem_exibicao: number;
}

// Funções para buscar dados
export async function getWorks(): Promise<Work[]> {
  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("ativo", true)
    .order("ordem_exibicao", { ascending: true })
    .order("data_criacao", { ascending: false });

  if (error) {
    console.error("Erro ao buscar works:", error);
    return [];
  }

  return data || [];
}

export async function getWorksByCategory(categoria: string): Promise<Work[]> {
  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("ativo", true)
    .eq("categoria", categoria)
    .order("ordem_exibicao", { ascending: true })
    .order("data_criacao", { ascending: false });

  if (error) {
    console.error("Erro ao buscar works por categoria:", error);
    return [];
  }

  return data || [];
}

export async function getCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("ativo", true)
    .order("ordem_exibicao", { ascending: true });

  if (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }

  return data || [];
}
