require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function createQuizzesForLesson2() {
  try {
    console.log('🎯 Creando cuestionarios para Lección 2: TERAPIA COGNITIVA DROGODEPENDENCIAS');
    
    // Primero verificar que la lección existe
    const { data: lesson, error: lessonError } = await supabase
      .from('lecciones')
      .select('id, titulo')
      .eq('id', 'e4546103-526d-42ff-a98b-0db4828caa44')
      .single();
    
    if (lessonError) {
      console.log('❌ Error al verificar lección:', lessonError.message);
      return;
    }
    
    console.log('✅ Lección encontrada:', lesson.titulo);
    
    // Crear los dos cuestionarios
    const { data: quizzes, error: quizError } = await supabase
      .from('cuestionarios')
      .insert([
        {
          titulo: 'Cuestionario 1: Fundamentos de Terapia Cognitiva',
          curso_id: 'b5ef8c64-fe26-4f20-8221-80a1bf475b05',
          leccion_id: 'e4546103-526d-42ff-a98b-0db4828caa44'
        },
        {
          titulo: 'Cuestionario 2: Técnicas de Intervención Cognitiva',
          curso_id: 'b5ef8c64-fe26-4f20-8221-80a1bf475b05',
          leccion_id: 'e4546103-526d-42ff-a98b-0db4828caa44'
        }
      ])
      .select('id, titulo');
    
    if (quizError) {
      console.log('❌ Error al crear cuestionarios:', quizError.message);
      return;
    }
    
    console.log('✅ Cuestionarios creados exitosamente:');
    quizzes.forEach((quiz, index) => {
      console.log(`   ${index + 1}. ${quiz.titulo} (ID: ${quiz.id})`);
    });
    
    return quizzes;
    
  } catch (error) {
    console.log('💥 Error general:', error.message);
  }
}

// Ejecutar la función
createQuizzesForLesson2().then(() => {
  console.log('\n🎉 Proceso completado');
  process.exit(0);
});