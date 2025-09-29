require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Usar service role key para permisos de administrador
const supabase = createClient(
  'https://lyojcqiiixkqqtpoejdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM'
);

async function updateLesson1ServiceRole() {
  try {
    console.log('🔧 Actualizando lección 1 con service role...');
    
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
    } else {
      console.error('❌ Error en verificación:', verifyError);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateLesson1ServiceRole();