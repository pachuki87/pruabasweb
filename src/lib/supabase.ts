import { createClient } from '@supabase/supabase-js';

<<<<<<< HEAD
// Función mejorada para validar y obtener variables de entorno
const getEnvVar = (key: string, required: boolean = true): string => {
  const value = import.meta.env[key];
  
  if (required && !value) {
    console.error(`❌ Variable de entorno requerida ${key} no encontrada`);
    console.error(`Variables disponibles: ${Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')).join(', ')}`);
    throw new Error(`Variable de entorno ${key} es requerida pero no está definida. Verifica tu archivo .env`);
  }
  
  return value || '';
};

// Función para crear cliente con manejo robusto de errores
const createSupabaseClient = (url: string, key: string, options?: any) => {
  try {
    if (!url || !key) {
      throw new Error('URL y clave son requeridas para crear el cliente Supabase');
    }
    
    const client = createClient(url, key, options);
    console.log('✅ Cliente Supabase creado exitosamente');
    return client;
  } catch (error) {
    console.error('❌ Error al crear cliente Supabase:', error);
    
    // Crear cliente mock para evitar que la aplicación se bloquee
    console.warn('⚠️ Creando cliente mock debido a error de configuración');
    return {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: new Error('Supabase no configurado correctamente') }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado correctamente') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado correctamente') }),
        delete: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado correctamente') }),
        eq: () => ({ select: () => Promise.resolve({ data: [], error: new Error('Supabase no configurado correctamente') }) }),
        single: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado correctamente') })
      }),
      auth: {
        signIn: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado correctamente') }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase no configurado correctamente') })
      }
    };
  }
};

// Diagnóstico detallado al cargar el módulo
console.log('🔍 DIAGNÓSTICO DE CONFIGURACIÓN SUPABASE:');
console.log('Variables de entorno VITE_ disponibles:');
Object.keys(import.meta.env)
  .filter(key => key.startsWith('VITE_') || key.startsWith('SUPABASE_'))
  .forEach(key => {
    const value = import.meta.env[key];
    console.log(`  ${key}: ${value ? '✅ CONFIGURADA' : '❌ FALTANTE'}`);
    if (key.includes('KEY') && value) {
      console.log(`    Valor: ${value.substring(0, 20)}...`);
    } else if (key.includes('URL') && value) {
      console.log(`    Valor: ${value}`);
    }
  });

// Variables para almacenar los clientes
let supabase: any;
let supabaseAdmin: any;
let auth: any;

try {
  // Obtener variables de entorno con validación
  const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
  const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');
  const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY', false); // No requerida, ya que es para el backend

  console.log('✅ Variables de entorno validadas correctamente');
  console.log(`📡 URL de Supabase: ${supabaseUrl}`);
  console.log(`🔑 Clave anónima: ${supabaseAnonKey ? 'Configurada' : 'Faltante'}`);
  console.log(`🔐 Clave de servicio (SUPABASE_SERVICE_ROLE_KEY): ${supabaseServiceKey ? 'Configurada' : 'Faltante'}`);

  // Crear cliente principal
  supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  
  // Crear cliente admin (para operaciones que requieren bypasear RLS)
  supabaseAdmin = supabaseServiceKey 
    ? createSupabaseClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
    : supabase; // Fallback al cliente normal si no hay service key

  auth = supabase.auth;

  console.log('✅ Configuración de Supabase completada exitosamente');

} catch (error) {
  console.error('❌ ERROR CRÍTICO EN CONFIGURACIÓN DE SUPABASE:');
  console.error((error as Error).message);
  console.error('La aplicación continuará funcionando con funcionalidad limitada.');
  
  // Exportar clientes mock para que la aplicación no se bloquee
  const mockClient = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: new Error('Supabase no configurado') }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado') }),
      update: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado') }),
      delete: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado') }),
      eq: () => ({ select: () => Promise.resolve({ data: [], error: new Error('Supabase no configurado') }) }),
      single: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado') })
    }),
    auth: {
      signIn: () => Promise.resolve({ data: null, error: new Error('Supabase no configurado') }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase no configurado') })
    }
  };

  supabase = mockClient;
  supabaseAdmin = mockClient;
  auth = mockClient.auth;
}

// Funciones de utilidad para operaciones comunes
=======
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const auth = supabase.auth;

// Función para obtener usuarios de la tabla 'usuarios'
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
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

<<<<<<< HEAD
=======
// Función para obtener un usuario por ID
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
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
<<<<<<< HEAD

// Función para probar la conexión
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('cuestionarios').select('count').single();
    if (error) {
      console.error('❌ Error de conexión a Supabase:', error.message);
      return false;
    }
    console.log('✅ Conexión a Supabase exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error al probar conexión:', (error as Error).message);
    return false;
  }
};

// Exportar los clientes
export { supabase, supabaseAdmin, auth };
=======
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
