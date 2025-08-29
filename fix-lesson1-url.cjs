require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fixLesson1Url() {
  try {
    console.log('🔧 Actualizando URL del archivo para la lección 1...');
    
    // Obtener el curso
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (cursoError) {
      console.error('❌ Error al obtener curso:', cursoError);
      return;
    }
    
    // Actualizar la lección 1
    const { data, error } = await supabase
      .from('lecciones')
      .update({ 
        archivo_url: '/lessons/leccion-1-qu-significa-ser-adicto-.html'
      })
      .eq('curso_id', curso.id)
      .eq('orden', 1)
      .select();
    
    if (error) {
      console.error('❌ Error al actualizar lección 1:', error);
      return;
    }
    
    console.log('✅ Lección 1 actualizada exitosamente:');
    if (data && data.length > 0) {
      console.log(`   Título: ${data[0].titulo}`);
      console.log(`   Archivo URL: ${data[0].archivo_url}`);
    } else {
      console.log('   Actualización completada (sin datos devueltos)');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixLesson1Url();