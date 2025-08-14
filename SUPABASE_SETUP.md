# Configuração do Supabase - URLs de Redirecionamento

## Problema Resolvido ✅

O redirecionamento do link mágico do Supabase estava configurado para `localhost` em desenvolvimento, mas agora está configurado para usar o domínio de produção `https://anagabrielasantos.vercel.app/admin`.

## Alterações Realizadas

### 1. Arquivo de Configuração (`lib/config.ts`)

Criado um arquivo centralizado para gerenciar as URLs de redirecionamento:

```typescript
export const SUPABASE_REDIRECT_URL =
  process.env.NODE_ENV === "production"
    ? "https://anagabrielasantos.vercel.app/admin"
    : "http://localhost:3000/admin";
```

### 2. Página de Login (`app/(auth)/login/page.tsx`)

Atualizado para usar a configuração centralizada:

```typescript
emailRedirectTo: SUPABASE_REDIRECT_URL;
```

### 3. Componente Navbar (`components/Navbar.tsx`)

Atualizado para usar a configuração centralizada no modal de login.

## Configuração Necessária no Painel do Supabase

Para que o redirecionamento funcione corretamente, você precisa configurar as URLs permitidas no painel do Supabase:

### Passos:

1. **Acesse o painel do Supabase**

   - Vá para [supabase.com](https://supabase.com)
   - Faça login e selecione seu projeto

2. **Navegue para Authentication Settings**

   - No menu lateral, clique em "Authentication"
   - Clique em "Settings"

3. **Configure Site URL**

   - Em "Site URL", adicione: `https://anagabrielasantos.vercel.app`

4. **Configure Redirect URLs**

   - Em "Redirect URLs", adicione:
     ```
     https://anagabrielasantos.vercel.app/admin
     http://localhost:3000/admin
     ```

5. **Salve as configurações**
   - Clique em "Save" para aplicar as mudanças

## URLs Configuradas

- **Produção**: `https://anagabrielasantos.vercel.app/admin`
- **Desenvolvimento**: `http://localhost:3000/admin`

## Como Funciona

- Em **desenvolvimento** (`npm run dev`): usa `localhost:3000/admin`
- Em **produção** (Vercel): usa `https://anagabrielasantos.vercel.app/admin`

O sistema detecta automaticamente o ambiente e usa a URL apropriada.

## Teste

1. Faça deploy para a Vercel
2. Teste o link mágico em produção
3. Verifique se o redirecionamento funciona corretamente

## Notas Importantes

- As URLs devem ser exatamente iguais às configuradas no painel do Supabase
- Certifique-se de que o domínio `anagabrielasantos.vercel.app` está ativo
- O redirecionamento só funcionará após configurar as URLs no painel do Supabase
