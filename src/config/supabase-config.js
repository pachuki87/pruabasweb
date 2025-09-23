// Configuración de Supabase con múltiples fallbacks
// Este archivo sirve como respaldo cuando las variables de entorno fallan

const SUPABASE_CONFIG = {
  // Configuración primaria (desde variables de entorno)
  primary: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    serviceKey: import.meta.env.VITE_SUPABASE_SERVICE_KEY
  },
  
  // Configuración de respaldo (hardcoded como último recurso)
  fallback: {
    url: 'https://lyojcqiiixkqqtpoejdo.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc',
    serviceKey: ''
  }
};

// Función para obtener la configuración disponible
export const getSupabaseConfig = () => {
  console.log('🔍 Verificando configuración de Supabase...');
  
  // Intentar usar configuración primaria
  const primary = SUPABASE_CONFIG.primary;
  if (primary.url && primary.anonKey) {
    console.log('✅ Usando configuración primaria (variables de entorno)');
    return primary;
  }
  
  // Usar configuración de respaldo
  console.log('⚠️ Usando configuración de respaldo (hardcoded)');
  console.log('📡 URL:', SUPABASE_CONFIG.fallback.url);
  console.log('🔑 Key:', SUPABASE_CONFIG.fallback.anonKey ? 'Configurada' : 'Faltante');
  
  return SUPABASE_CONFIG.fallback;
};

// Función para validar la configuración
export const validateSupabaseConfig = (config) => {
  if (!config.url) {
    throw new Error('supabaseUrl is required. No se encontró URL de Supabase en ninguna configuración.');
  }
  
  if (!config.anonKey) {
    throw new Error('supabaseAnonKey is required. No se encontró clave anónima de Supabase.');
  }
  
  return true;
};

export default SUPABASE_CONFIG;
