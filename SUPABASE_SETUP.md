# Configuração do Supabase - URLs de Redirecionamento

## Problema Resolvido ✅

O redirecionamento do link mágico do Supabase estava configurado para `localhost` em desenvolvimento, mas agora está configurado para usar o domínio de produção `https://anagabrielasantos.vercel.app/admin`.

## Alterações Realizadas

### 1. Arquivo de Configuração (`lib/config.ts`)

Criado um arquivo centralizado para gerenciar as URLs de redirecionamento:

```typescript
export const SUPABASE_REDIRECT_URL =
  process.env.NODE_ENV === "production"
    ? "https://anagabrielasantos.vercel.app/auth/callback"
    : "http://localhost:3000/auth/callback";
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
     https://anagabrielasantos.vercel.app/auth/callback
     http://localhost:3000/auth/callback
     ```

5. **Configure Email Templates (Opcional)**

   - Em "Email Templates" > "Magic Link"
   - Verifique se o template está configurado corretamente
   - O link deve apontar para: `https://anagabrielasantos.vercel.app/auth/callback`

6. **Salve as configurações**
   - Clique em "Save" para aplicar as mudanças

### Verificação Importante:

- Certifique-se de que as variáveis de ambiente estão configuradas na Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## URLs Configuradas

- **Produção**: `https://anagabrielasantos.vercel.app/auth/callback`
- **Desenvolvimento**: `http://localhost:3000/auth/callback`

## Como Funciona

1. **Usuário clica no botão** "Enviar link" na página de login
2. **Email é enviado** para `caioaugusto930@gmail.com` com link para `/auth/callback`
3. **Usuário clica no link** do email
4. **Callback processa** o código e redireciona para `/admin?auth_code=...`
5. **Página admin** processa o código e autentica o usuário
6. **Usuário tem acesso** completo à dashboard

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
