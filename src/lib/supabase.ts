import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente especial para operaciones que requieren bypasear RLS (como cuestionarios)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase; // Fallback al cliente normal si no hay service key

export const auth = supabase.auth;

// Función para obtener usuarios de la tabla 'usuarios'
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*');

  if (error) {
    console.error('Error al obtener usuarios:', error);
    return null;
  }
  return data;
};

// Función para obtener un usuario por ID
export const getUserById = async (userId: string) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error al obtener usuario por ID:', error);
    return null;
  }
  return data;
};
