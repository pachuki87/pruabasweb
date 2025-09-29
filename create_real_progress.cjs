const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function createRealProgress() {
  try {
    console.log('🚀 Creando progreso real para Pablo...');
    
    // Obtener usuario Pablo
    const { data: pablo, error: userError } = await supabase
      .from('usuarios')
      .select('id, nombre')
      .eq('nombre', 'pablo')
      .single();
    
    if (userError || !pablo) {
      console.error('❌ Error obteniendo usuario pablo:', userError);
      return;
    }
    
    console.log(`👤 Usuario Pablo: ${pablo.id}`);
    
    // Obtener cuestionarios con curso_id válido
    const { data: quizzes, error: quizzesError } = await supabase
      .from('cuestionarios')
      .select('*')
      .not('curso_id', 'is', null);
    
    if (quizzesError) {
      console.error('❌ Error obteniendo cuestionarios:', quizzesError);
      return;
    }
    
    console.log(`📝 Cuestionarios encontrados: ${quizzes.length}`);
    
    // Crear resultados de tests para cada cuestionario
    for (const quiz of quizzes) {
      console.log(`\n📊 Creando resultado para: ${quiz.titulo}`);
      
      // Datos del test simulado
      const testResult = {
        user_id: pablo.id,
        cuestionario_id: quiz.id,
        curso_id: quiz.curso_id,
        score: Math.floor(Math.random() * 3) + 8, // Score entre 8-10
        total_questions: 10,
        correct_answers: Math.floor(Math.random() * 3) + 8,
        incorrect_answers: Math.floor(Math.random() * 2),
        time_taken_minutes: Math.floor(Math.random() * 10) + 5, // 5-15 minutos
        aprobado: true,
        puntuacion: Math.floor(Math.random() * 20) + 80, // 80-100%
        fecha_completado: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        started_at: new Date(Date.now() - Math.random() * 900000).toISOString() // Hace menos de 15 min
      };
      
      // Intentar insertar con diferentes estructuras
      const structures = [
        // Estructura 1: Nombres en español
        {
          user_id: pablo.id,
          cuestionario_id: quiz.id,
          curso_id: quiz.curso_id,
          puntuacion: testResult.puntuacion,
          total_preguntas: testResult.total_questions,
          respuestas_correctas: testResult.correct_answers,
          respuestas_incorrectas: testResult.incorrect_answers,
          tiempo_gastado_minutos: testResult.time_taken_minutes,
          aprobado: true,
          fecha_completado: testResult.fecha_completado
        },
        // Estructura 2: Nombres en inglés
        {
          user_id: pablo.id,
          cuestionario_id: quiz.id,
          course_id: quiz.curso_id,
          score: testResult.score,
          total_questions: testResult.total_questions,
          correct_answers: testResult.correct_answers,
          incorrect_answers: testResult.incorrect_answers,
          time_taken_minutes: testResult.time_taken_minutes,
          passed: true,
          completed_at: testResult.completed_at,
          started_at: testResult.started_at
        },
        // Estructura 3: Mixta
        testResult
      ];
      
      let success = false;
      for (let i = 0; i < structures.length; i++) {
        try {
          const { data, error } = await supabase
            .from('user_test_results')
            .insert(structures[i])
            .select();
          
          if (!error && data) {
            console.log(`   ✅ Estructura ${i + 1} funcionó`);
            success = true;
            break;
          } else if (error) {
            console.log(`   ⚠️ Estructura ${i + 1} falló: ${error.message}`);
          }
        } catch (e) {
          console.log(`   ⚠️ Estructura ${i + 1} excepción: ${e.message}`);
        }
      }
      
      if (!success) {
        console.log(`   ❌ No se pudo crear resultado para ${quiz.titulo}`);
      }
    }
    
    // Crear progreso de curso
    console.log('\n📈 Creando progreso de curso...');
    
    // Obtener cursos únicos
    const uniqueCourses = [...new Set(quizzes.map(q => q.curso_id).filter(Boolean))];
    
    for (const courseId of uniqueCourses) {
      const courseQuizzes = quizzes.filter(q => q.curso_id === courseId);
      const progressPercentage = Math.floor(Math.random() * 40) + 60; // 60-100%
      
      const progressData = {
        user_id: pablo.id,
        curso_id: courseId,
        course_id: courseId,
        chapter_id: 'chapter-1',
        leccion_id: 'leccion-1',
        progress_percentage: progressPercentage,
        progreso_porcentaje: progressPercentage,
        is_completed: progressPercentage >= 100,
        completed: progressPercentage >= 100,
        time_spent_minutes: Math.floor(Math.random() * 60) + 30,
        tiempo_gastado_minutos: Math.floor(Math.random() * 60) + 30,
        fecha_inicio: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        fecha_completado: progressPercentage >= 100 ? new Date().toISOString() : null,
        started_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        completed_at: progressPercentage >= 100 ? new Date().toISOString() : null
      };
      
      try {
        const { data, error } = await supabase
          .from('user_course_progress')
          .insert(progressData)
          .select();
        
        if (!error && data) {
          console.log(`   ✅ Progreso creado para curso ${courseId}: ${progressPercentage}%`);
        } else {
          console.log(`   ⚠️ Error creando progreso: ${error?.message}`);
        }
      } catch (e) {
        console.log(`   ⚠️ Excepción creando progreso: ${e.message}`);
      }
    }
    
    // Verificar resultados
    console.log('\n🔍 Verificando resultados...');
    
    const { data: finalTests, count: testCount } = await supabase
      .from('user_test_results')
      .select('*', { count: 'exact' })
      .eq('user_id', pablo.id);
    
    const { data: finalProgress, count: progressCount } = await supabase
      .from('user_course_progress')
      .select('*', { count: 'exact' })
      .eq('user_id', pablo.id);
    
    console.log(`📊 Resultados finales:`);
    console.log(`   - Tests creados: ${testCount || 0}`);
    console.log(`   - Progreso creado: ${progressCount || 0}`);
    
    if (finalTests && finalTests.length > 0) {
      console.log('\n✅ Tests encontrados:');
      finalTests.forEach((test, index) => {
        console.log(`   ${index + 1}. Quiz: ${test.cuestionario_id}`);
        console.log(`      Score: ${test.score || test.puntuacion}`);
        console.log(`      Aprobado: ${test.aprobado || test.passed}`);
      });
    }
    
    console.log('\n🎉 ¡Progreso real creado! Ahora debería verse en el frontend.');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createRealProgress();