const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function checkLesson4() {
  try {
    console.log('🔍 Verificando lección 4...');
    
    // Buscar el curso
    const { data: course } = await supabase
      .from('cursos')
      .select('id')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (!course) {
      console.log('❌ Curso no encontrado');
      return;
    }
    
    // Buscar lección 4 por orden
    const { data: lesson4ByOrder } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', course.id)
      .eq('orden', 4)
      .single();
    
    if (lesson4ByOrder) {
      console.log('✅ Lección 4 encontrada por orden:');
      console.log(`   ID: ${lesson4ByOrder.id}`);
      console.log(`   Título: ${lesson4ByOrder.titulo}`);
      console.log(`   Orden: ${lesson4ByOrder.orden}`);
      console.log(`   Tiene cuestionario: ${lesson4ByOrder.tiene_cuestionario}`);
    } else {
      console.log('⚠️  No se encontró lección con orden 4');
      
      // Buscar todas las lecciones para ver qué hay
      const { data: allLessons } = await supabase
        .from('lecciones')
        .select('id, titulo, orden')
        .eq('curso_id', course.id)
        .order('orden');
      
      console.log('\n📚 Todas las lecciones del curso:');
      allLessons?.forEach(lesson => {
        console.log(`   ${lesson.orden}: ${lesson.titulo} (ID: ${lesson.id})`);
      });
    }
    
    // Verificar si ya hay cuestionarios para la lección 4
    if (lesson4ByOrder) {
      const { data: quizzes } = await supabase
        .from('cuestionarios')
        .select('*')
        .eq('leccion_id', lesson4ByOrder.id);
      
      if (quizzes && quizzes.length > 0) {
        console.log('\n📊 Cuestionarios existentes para la lección 4:');
        quizzes.forEach(quiz => {
          console.log(`   - ${quiz.titulo} (ID: ${quiz.id})`);
        });
      } else {
        console.log('\n⚠️  No hay cuestionarios para la lección 4');
        console.log('📝 Necesitamos crear el cuestionario para la lección 4');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkLesson4();