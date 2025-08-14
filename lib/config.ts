// Configurações de redirecionamento do Supabase
export const SUPABASE_REDIRECT_URL = process.env.NODE_ENV === 'production' 
  ? 'https://anagabrielasantos.vercel.app/admin'
  : 'http://localhost:3000/admin';

// URL base da aplicação
export const APP_URL = process.env.NODE_ENV === 'production'
  ? 'https://anagabrielasantos.vercel.app'
  : 'http://localhost:3000';
