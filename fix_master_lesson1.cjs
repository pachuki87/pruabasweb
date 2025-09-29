require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixMasterLesson1() {
  try {
    console.log('🔧 Corrigiendo lección 1 del Máster en Adicciones...');
    
    // Actualizar la lección 1 del máster para eliminar el archivo_url incorrecto
    const { data, error } = await supabase
      .from('lecciones')
      .update({
        archivo_url: null,
        actualizado_en: new Date().toISOString()
      })
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .eq('orden', 1)
      .select();
    
    if (error) {
      console.error('❌ Error al actualizar lección:', error);
      return;
    }
    
    console.log('✅ Lección 1 del máster corregida exitosamente');
    console.log('📝 Datos actualizados:', data[0]);
    
    console.log('\n🎯 Ahora la lección usará el contenido estático correcto desde:');
    console.log('   /course-content/Módulo 1/01_¿Qué significa ser adicto_/contenido.html');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixMasterLesson1();