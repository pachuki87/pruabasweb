import { createClient } from '@supabase/supabase-js';

// Debug: Log available environment variables
console.log('Environment variables debug:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'MISSING',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
  VITE_SUPABASE_SERVICE_KEY: import.meta.env.VITE_SUPABASE_SERVICE_KEY ? 'SET' : 'MISSING',
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD
});

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// Detailed validation with specific error messages
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is missing or undefined');
  console.error('Available env vars:', Object.keys(import.meta.env));
  throw new Error('supabaseUrl is required. VITE_SUPABASE_URL environment variable is missing. Please check your .env file and Netlify environment variables.');
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is missing or undefined');
  console.error('Available env vars:', Object.keys(import.meta.env));
  throw new Error('supabaseAnonKey is required. VITE_SUPABASE_ANON_KEY environment variable is missing. Please check your .env file and Netlify environment variables.');
}

console.log('✅ Supabase configuration loaded successfully');

// Create Supabase client with error handling
let supabase: any;
let supabaseAdmin: any;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Supabase client created successfully');
} catch (error) {
  console.error('❌ Failed to create Supabase client:', error);
  // Create a mock client to prevent app crashes
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
    }),
    auth: {
      signIn: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') })
    }
  };
}

export { supabase };

// Cliente especial para operaciones que requieren bypasear RLS (como cuestionarios)
try {
  supabaseAdmin = supabaseServiceKey 
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
    : supabase; // Fallback al cliente normal si no hay service key
  console.log('✅ Supabase admin client configured');
} catch (error) {
  console.error('❌ Failed to create Supabase admin client:', error);
  supabaseAdmin = supabase; // Fallback to regular client
}

export { supabaseAdmin };

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
