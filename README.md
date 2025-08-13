# Portfólio do Artista

Um site de portfólio profissional para designers e artistas, construído com Next.js, TailwindCSS e Supabase.

## 🚀 Tecnologias

- **Frontend:** Next.js 15 + TypeScript
- **Styling:** TailwindCSS + Shadcn/ui
- **Backend:** Supabase (Database + Storage)
- **Autenticação:** Magic Link via email
- **Deploy:** Vercel

## 📁 Estrutura do Projeto

```
artist-portfolio/
├── app/                    # App Router (Next.js 13+)
│   ├── admin/             # Área administrativa
│   ├── gallery/           # Galeria de trabalhos
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── layout/           # Componentes de layout
│   └── ui/               # Componentes Shadcn/ui
├── lib/                  # Utilitários e configurações
│   ├── auth/             # Configurações de autenticação
│   ├── supabase/         # Configurações do Supabase
│   └── utils.ts          # Utilitários gerais
├── types/                # Tipos TypeScript
└── public/               # Arquivos estáticos
```

## 🛠️ Funcionalidades

### ✅ Implementado

- [x] Setup do Next.js com TypeScript
- [x] Configuração do TailwindCSS
- [x] Shadcn/ui configurado
- [x] Layout responsivo (Header, Footer)
- [x] Estrutura de pastas organizada
- [x] Tipos TypeScript definidos

### 🚧 Em Desenvolvimento

- [ ] Configuração do Supabase
- [ ] Sistema de autenticação (Magic Link)
- [ ] Área administrativa protegida
- [ ] CRUD de trabalhos
- [ ] Galeria de trabalhos
- [ ] Upload de imagens
- [ ] Sistema de categorias

## 🚀 Como Executar

1. **Clone o repositório:**

   ```bash
   git clone [url-do-repositorio]
   cd artist-portfolio
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   ```bash
   cp env.example .env.local
   # Edite o arquivo .env.local com suas configurações
   ```

4. **Execute o projeto:**

   ```bash
   npm run dev
   ```

5. **Acesse:** http://localhost:3000

## 📝 Próximos Passos

1. **Configurar Supabase:**

   - Criar projeto no Supabase
   - Configurar banco de dados
   - Configurar autenticação

2. **Implementar autenticação:**

   - Magic Link via email
   - Proteção de rotas admin

3. **Desenvolver CRUD:**

   - Criar, editar, deletar trabalhos
   - Upload de imagens
   - Sistema de categorias

4. **Criar galeria:**
   - Grid responsivo de trabalhos
   - Filtros por categoria
   - Modal de visualização

## 🎨 Design System

O projeto utiliza o Shadcn/ui com as seguintes características:

- **Tema:** Claro/escuro
- **Cores:** Sistema de cores HSL
- **Tipografia:** Geist Sans
- **Componentes:** Button, Card, etc.

## 📄 Licença

Este projeto está sob a licença MIT.
