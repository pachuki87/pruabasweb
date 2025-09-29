const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fixLessonQuizFlags() {
  try {
    console.log('🔧 Actualizando campo tiene_cuestionario para lecciones con cuestionarios...');
    
    // Primero, verificar qué lecciones tienen cuestionarios
    const { data: quizzes, error: quizError } = await supabase
      .from('cuestionarios')
      .select('leccion_id, titulo')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05');
    
    if (quizError) {
      console.error('❌ Error obteniendo cuestionarios:', quizError);
      return;
    }
    
    console.log('\n📋 Cuestionarios encontrados:');
    quizzes?.forEach(quiz => {
      console.log(`- ${quiz.titulo} (Lección ID: ${quiz.leccion_id})`);
    });
    
    // Obtener IDs únicos de lecciones que tienen cuestionarios
    const lessonIdsWithQuizzes = [...new Set(quizzes?.map(q => q.leccion_id) || [])];
    
    console.log(`\n🎯 Lecciones que necesitan actualización: ${lessonIdsWithQuizzes.length}`);
    
    // Actualizar cada lección para marcar tiene_cuestionario = true
    for (const lessonId of lessonIdsWithQuizzes) {
      const { error: updateError } = await supabase
        .from('lecciones')
        .update({ tiene_cuestionario: true })
        .eq('id', lessonId);
      
      if (updateError) {
        console.error(`❌ Error actualizando lección ${lessonId}:`, updateError);
      } else {
        console.log(`✅ Lección ${lessonId} actualizada`);
      }
    }
    
    // Verificar el resultado
    console.log('\n🔍 Verificando resultado...');
    const { data: updatedLessons } = await supabase
      .from('lecciones')
      .select('id, titulo, tiene_cuestionario')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden');
    
    console.log('\n📋 Estado final de las lecciones:');
    updatedLessons?.forEach((lesson, index) => {
      const status = lesson.tiene_cuestionario ? '✅' : '❌';
      console.log(`${index + 1}. ${lesson.titulo} ${status}`);
    });
    
    const lessonsWithQuiz = updatedLessons?.filter(l => l.tiene_cuestionario) || [];
    console.log(`\n📊 Resumen final:`);
    console.log(`- Total lecciones: ${updatedLessons?.length || 0}`);
    console.log(`- Con cuestionario: ${lessonsWithQuiz.length}`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

fixLessonQuizFlags();