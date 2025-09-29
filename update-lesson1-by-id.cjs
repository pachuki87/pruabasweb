require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function updateLesson1ById() {
  try {
    console.log('🔧 Actualizando lección 1 por ID específico...');
    
    const lessonId = 'd44cb089-75f9-4d7f-8603-2de303c01a74';
    
    // Actualizar la lección 1 por ID
    const { data, error } = await supabase
      .from('lecciones')
      .update({ 
        archivo_url: '/lessons/leccion-1-qu-significa-ser-adicto-.html'
      })
      .eq('id', lessonId)
      .select();
    
    if (error) {
      console.error('❌ Error al actualizar lección 1:', error);
      return;
    }
    
    console.log('✅ Lección 1 actualizada exitosamente:');
    if (data && data.length > 0) {
      console.log(`   ID: ${data[0].id}`);
      console.log(`   Título: ${data[0].titulo}`);
      console.log(`   Archivo URL: ${data[0].archivo_url}`);
    } else {
      console.log('   ⚠️  Actualización completada pero sin datos devueltos');
    }
    
    // Verificar la actualización
    const { data: verification, error: verifyError } = await supabase
      .from('lecciones')
      .select('id, titulo, archivo_url')
      .eq('id', lessonId)
      .single();
    
    if (!verifyError && verification) {
      console.log('\n🔍 Verificación:');
      console.log(`   ID: ${verification.id}`);
      console.log(`   Título: ${verification.titulo}`);
      console.log(`   Archivo URL: ${verification.archivo_url}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateLesson1ById();