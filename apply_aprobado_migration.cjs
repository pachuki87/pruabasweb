require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkAprobadoColumn() {
  try {
    console.log('🔍 Verificando si la columna aprobado existe...');
    
    // Intentar hacer una consulta simple que incluya la columna aprobado
    const { data, error } = await supabase
      .from('intentos_cuestionario')
      .select('id, aprobado')
      .limit(1);
      
    if (error) {
      if (error.code === 'PGRST204' && error.message.includes('aprobado')) {
        console.log('❌ La columna "aprobado" NO existe en la tabla intentos_cuestionario');
        console.log('\n📋 SOLUCIÓN - Ejecuta este SQL en el panel de Supabase:');
        console.log('\n=== COPIA Y PEGA ESTE SQL EN EL SQL EDITOR ===');
        console.log('ALTER TABLE public.intentos_cuestionario ADD COLUMN IF NOT EXISTS aprobado BOOLEAN DEFAULT FALSE;');
        console.log('\nCOMMENT ON COLUMN public.intentos_cuestionario.aprobado IS \'Indica si el intento fue aprobatorio (generalmente >= 70%)\';');
        console.log('\nUPDATE public.intentos_cuestionario SET aprobado = CASE WHEN porcentaje >= 70 THEN TRUE ELSE FALSE END WHERE aprobado IS NULL;');
        console.log('=== FIN DEL SQL ===\n');
        console.log('\n🔗 Pasos para aplicar:');
        console.log('1. Ve a https://supabase.com/dashboard');
        console.log('2. Selecciona tu proyecto');
        console.log('3. Ve a SQL Editor');
        console.log('4. Crea una nueva query');
        console.log('5. Pega el SQL de arriba');
        console.log('6. Ejecuta la query');
        console.log('7. Recarga tu aplicación web');
      } else {
        console.error('❌ Error inesperado:', error);
      }
    } else {
      console.log('✅ La columna "aprobado" YA EXISTE');
      console.log('📊 Datos de ejemplo:', data);
      console.log('\n🎉 El problema debería estar resuelto.');
      console.log('💡 Si sigues viendo el error, intenta:');
      console.log('1. Recargar completamente la página (Ctrl+F5)');
      console.log('2. Limpiar caché del navegador');
      console.log('3. Esperar unos minutos para que se actualice el caché de Supabase');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la verificación
checkAprobadoColumn();
