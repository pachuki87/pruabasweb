// Script para verificar variables de entorno de Supabase
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Verificando variables de entorno...');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'Definida' : 'No definida');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Definida' : 'No definida');

// Intentar obtener las variables desde diferentes fuentes
const possibleUrls = [
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_URL,
  'https://your-project.supabase.co' // placeholder
];

const possibleKeys = [
  process.env.VITE_SUPABASE_ANON_KEY,
  process.env.SUPABASE_ANON_KEY,
  'your-anon-key' // placeholder
];

console.log('\n📋 Variables encontradas:');
console.log('URLs posibles:', possibleUrls.filter(Boolean));
console.log('Keys posibles:', possibleKeys.filter(Boolean).map(key => key.substring(0, 10) + '...'));

// Si tenemos variables válidas, probar conexión
const url = possibleUrls.find(Boolean);
const key = possibleKeys.find(Boolean);

if (url && key && url !== 'https://your-project.supabase.co' && key !== 'your-anon-key') {
  console.log('\n🔗 Probando conexión a Supabase...');
  
  try {
    const supabase = createClient(url, key);
    
    // Probar una consulta simple
    supabase.from('cursos')
      .select('id, titulo')
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.log('❌ Error en la consulta:', error.message);
        } else {
          console.log('✅ Conexión exitosa! Datos encontrados:', data?.length || 0);
        }
      })
      .catch(err => {
        console.log('❌ Error de conexión:', err.message);
      });
  } catch (err) {
    console.log('❌ Error creando cliente:', err.message);
  }
} else {
  console.log('\n⚠️ No se encontraron variables de entorno válidas para Supabase');
  console.log('Necesitas configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
}