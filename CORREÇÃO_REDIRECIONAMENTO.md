# 🔧 Correção do Redirecionamento para Localhost

## ❌ Problema Identificado

O link do email está redirecionando para:

```
http://localhost:3000/?code=33348111-dbb3-456a-8acd-37cea3161415
```

Em vez de:

```
https://anagabrielasantos.vercel.app/auth/callback?code=...
```

## ✅ Solução

### 1. **Configuração no Painel do Supabase** (CRÍTICO)

**Acesse**: [supabase.com](https://supabase.com) → Seu Projeto → Authentication → Settings

#### Site URL:

```
https://anagabrielasantos.vercel.app
```

#### Redirect URLs (ADICIONE TODAS):

```
https://anagabrielasantos.vercel.app/auth/callback
https://anagabrielasantos.vercel.app/admin
http://localhost:3000/auth/callback
http://localhost:3000/admin
```

### 2. **Verificar Variáveis de Ambiente na Vercel**

**Acesse**: Dashboard Vercel → Settings → Environment Variables

**Verifique se existem**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. **Limpar Cache e Re-deploy**

1. **Na Vercel**: Force um novo deploy
2. **No Supabase**: Verifique se as configurações foram salvas
3. **Teste novamente** o link mágico

## 🔍 Verificação

Após as correções, o link do email deve ser:

```
https://anagabrielasantos.vercel.app/auth/callback?code=...
```

E deve redirecionar para:

```
https://anagabrielasantos.vercel.app/admin
```

## 📋 Checklist

- [ ] Site URL configurado no Supabase
- [ ] Redirect URLs adicionadas no Supabase
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Novo deploy realizado
- [ ] Link do email testado

## 🚨 Importante

O problema está **100% na configuração do Supabase**, não no código. O código está correto, mas o Supabase precisa ser configurado para usar o domínio de produção.
