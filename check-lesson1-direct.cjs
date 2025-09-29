require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkLesson1Direct() {
  try {
    console.log('🔍 Verificando lección 1 directamente...');
    
    // Obtener todas las lecciones con orden 1
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('orden', 1);
    
    if (error) {
      console.error('❌ Error al obtener lecciones:', error);
      return;
    }
    
    console.log(`📊 Encontradas ${lessons.length} lecciones con orden 1:`);
    
    for (const lesson of lessons) {
      console.log('\n' + '─'.repeat(60));
      console.log(`📚 ID: ${lesson.id}`);
      console.log(`📚 Título: ${lesson.titulo}`);
      console.log(`📚 Curso ID: ${lesson.curso_id}`);
      console.log(`📚 Orden: ${lesson.orden}`);
      console.log(`📁 Archivo URL: ${lesson.archivo_url || 'No definido'}`);
      console.log(`📝 Contenido HTML: ${lesson.contenido_html ? 'Presente' : 'No presente'}`);
    }
    
    // También verificar el curso específico
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (!cursoError && curso) {
      console.log('\n' + '='.repeat(60));
      console.log(`🎓 Curso encontrado: ${curso.titulo} (ID: ${curso.id})`);
      
      const { data: courseLesson, error: courseLessonError } = await supabase
        .from('lecciones')
        .select('*')
        .eq('curso_id', curso.id)
        .eq('orden', 1)
        .single();
      
      if (!courseLessonError && courseLesson) {
        console.log('\n📚 Lección 1 del curso específico:');
        console.log(`   ID: ${courseLesson.id}`);
        console.log(`   Título: ${courseLesson.titulo}`);
        console.log(`   Archivo URL: ${courseLesson.archivo_url || 'No definido'}`);
      } else {
        console.log('❌ No se encontró lección 1 para este curso');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkLesson1Direct();