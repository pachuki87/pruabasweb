const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkQuizForLesson1() {
  console.log('🔍 Verificando cuestionarios para la Lección 1...');
  
  // Buscar cuestionarios para la lección 1 del curso MÁSTER EN ADICCIONES
  const courseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
  
  try {
    // Primero obtener las lecciones del curso
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseId)
      .order('orden');
    
    if (lessonsError) {
      console.error('❌ Error obteniendo lecciones:', lessonsError);
      return;
    }
    
    console.log('📚 Lecciones encontradas:', lessons.length);
    
    // Buscar la lección 1 (orden = 1)
    const lesson1 = lessons.find(l => l.orden === 1);
    if (!lesson1) {
      console.log('❌ No se encontró la lección 1');
      return;
    }
    
    console.log('📖 Lección 1 encontrada:', lesson1.titulo);
    console.log('🆔 ID de la lección 1:', lesson1.id);
    
    // Buscar cuestionarios para esta lección
    const { data: quizzes, error: quizzesError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('leccion_id', lesson1.id);
    
    if (quizzesError) {
      console.error('❌ Error obteniendo cuestionarios:', quizzesError);
      return;
    }
    
    console.log('📝 Cuestionarios encontrados para la Lección 1:', quizzes.length);
    
    if (quizzes.length === 0) {
      console.log('⚠️  La Lección 1 NO tiene cuestionarios asociados');
    } else {
      quizzes.forEach((quiz, index) => {
        console.log(`📋 Cuestionario ${index + 1}:`);
        console.log(`   - Título: ${quiz.titulo}`);
        console.log(`   - ID: ${quiz.id}`);
        console.log(`   - Creado: ${quiz.creado_en}`);
      });
    }
    
    // También verificar si hay cuestionarios por curso_id (método alternativo)
    console.log('\n🔍 Verificando cuestionarios por curso_id...');
    const { data: courseQuizzes, error: courseQuizzesError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('curso_id', courseId);
    
    if (courseQuizzesError) {
      console.error('❌ Error obteniendo cuestionarios por curso:', courseQuizzesError);
    } else {
      console.log('📝 Cuestionarios encontrados por curso_id:', courseQuizzes.length);
      courseQuizzes.forEach((quiz, index) => {
        console.log(`📋 Cuestionario del curso ${index + 1}:`);
        console.log(`   - Título: ${quiz.titulo}`);
        console.log(`   - ID: ${quiz.id}`);
        console.log(`   - Lección ID: ${quiz.leccion_id}`);
        console.log(`   - Creado: ${quiz.creado_en}`);
      });
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

checkQuizForLesson1();