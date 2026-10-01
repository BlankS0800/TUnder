import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'https://tu-proyecto.supabase.co' && 
    supabaseAnonKey !== 'tu-anon-key-aqui' &&
    supabaseUrl.startsWith('https://')
  );
};

// Si no está configurado, creamos un cliente dummy para evitar excepciones al inicializar
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : createClient('https://dummyprojecturl123.supabase.co', 'dummykey123', {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
