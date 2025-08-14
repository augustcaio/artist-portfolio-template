// Configurações de redirecionamento do Supabase
export const SUPABASE_REDIRECT_URL = process.env.NODE_ENV === 'production' 
  ? 'https://anagabrielasantos.vercel.app/auth/callback'
  : 'http://localhost:3000/auth/callback';

// URL base da aplicação
export const APP_URL = process.env.NODE_ENV === 'production'
  ? 'https://anagabrielasantos.vercel.app'
  : 'http://localhost:3000';
