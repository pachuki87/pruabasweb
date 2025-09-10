const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function debugTestResults() {
  try {
    console.log('🔍 Debuggeando resultados de tests...');
    
    // Obtener usuario Pablo
    const { data: users, error: userError } = await supabase
      .from('usuarios')
      .select('id, nombre')
      .eq('nombre', 'pablo')
      .single();
    
    if (userError || !users) {
      console.error('❌ Error obteniendo usuario pablo:', userError);
      return;
    }
    
    console.log(`👤 Usuario Pablo: ${users.id}`);
    
    // Ver todos los datos en user_test_results
    console.log('\n📋 Todos los registros en user_test_results:');
    const { data: allTests, error: testsError } = await supabase
      .from('user_test_results')
      .select('*');
    
    if (testsError) {
      console.error('❌ Error obteniendo tests:', testsError);
      return;
    }
    
    if (allTests && allTests.length > 0) {
      allTests.forEach((test, index) => {
        console.log(`   ${index + 1}. User: ${test.user_id}`);
        console.log(`      Quiz ID: ${test.cuestionario_id || test.quiz_id}`);
        console.log(`      Course ID: ${test.curso_id || test.course_id}`);
        console.log(`      Score: ${test.score || test.puntuacion}`);
        console.log(`      Aprobado: ${test.aprobado || test.passed}`);
        console.log(`      Fecha: ${test.fecha_completado || test.completed_at}`);
        console.log('      ---');
      });
    } else {
      console.log('   ⚠️ No hay registros en user_test_results');
    }
    
    // Ver todos los cuestionarios
    console.log('\n📝 Todos los cuestionarios:');
    const { data: allQuizzes, error: quizzesError } = await supabase
      .from('cuestionarios')
      .select('*');
    
    if (quizzesError) {
      console.error('❌ Error obteniendo cuestionarios:', quizzesError);
      return;
    }
    
    if (allQuizzes && allQuizzes.length > 0) {
      allQuizzes.forEach((quiz, index) => {
        console.log(`   ${index + 1}. ID: ${quiz.id}`);
        console.log(`      Título: ${quiz.titulo}`);
        console.log(`      Curso ID: ${quiz.curso_id}`);
        console.log('      ---');
      });
    } else {
      console.log('   ⚠️ No hay cuestionarios');
    }
    
    // Verificar si hay coincidencias
    console.log('\n🔍 Buscando coincidencias...');
    if (allTests && allQuizzes) {
      const testQuizIds = allTests.map(t => t.cuestionario_id || t.quiz_id).filter(Boolean);
      const quizIds = allQuizzes.map(q => q.id);
      
      console.log('Quiz IDs en tests:', testQuizIds);
      console.log('Quiz IDs disponibles:', quizIds);
      
      const matches = testQuizIds.filter(id => quizIds.includes(id));
      console.log('Coincidencias encontradas:', matches);
    }
    
    // Verificar datos de progreso de curso
    console.log('\n📊 Datos en user_course_progress:');
    const { data: progressData, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', users.id);
    
    if (progressError) {
      console.error('❌ Error obteniendo progreso:', progressError);
    } else if (progressData && progressData.length > 0) {
      progressData.forEach((progress, index) => {
        console.log(`   ${index + 1}. Curso: ${progress.curso_id || progress.course_id}`);
        console.log(`      Capítulo: ${progress.chapter_id || progress.leccion_id}`);
        console.log(`      Completado: ${progress.is_completed || progress.completed}`);
        console.log(`      Progreso: ${progress.progress_percentage || progress.progreso_porcentaje}%`);
        console.log('      ---');
      });
    } else {
      console.log('   ⚠️ No hay datos de progreso');
    }
    
    console.log('\n🎉 Debug completado');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

debugTestResults();