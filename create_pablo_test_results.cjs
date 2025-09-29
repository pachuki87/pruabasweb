const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase con service role para evitar RLS
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createPabloTestResults() {
  try {
    const pabloUserId = '83508eb3-e26e-4312-90f7-9a06901d4126';
    
    console.log('🔄 Creando resultados de tests para Pablo...');
    
    // 1. Obtener inscripciones de Pablo
    const { data: enrollments, error: enrollError } = await supabase
      .from('inscripciones')
      .select(`
        *,
        cursos:curso_id (
          id,
          titulo
        )
      `)
      .eq('user_id', pabloUserId);
    
    if (enrollError) {
      console.error('❌ Error obteniendo inscripciones:', enrollError);
      return;
    }
    
    console.log(`📚 Cursos inscritos: ${enrollments?.length || 0}`);
    
    if (!enrollments || enrollments.length === 0) {
      console.log('❌ Pablo no tiene inscripciones');
      return;
    }
    
    // 2. Para cada curso, obtener cuestionarios y crear resultados
    for (const enrollment of enrollments) {
      const courseId = enrollment.curso_id;
      const courseTitle = enrollment.cursos?.titulo || 'Sin título';
      
      console.log(`\n🎯 Procesando curso: ${courseTitle}`);
      
      // Obtener cuestionarios del curso
      const { data: quizzes, error: quizzesError } = await supabase
        .from('cuestionarios')
        .select('*')
        .eq('curso_id', courseId)
        .limit(3); // Solo los primeros 3 cuestionarios
      
      if (quizzesError) {
        console.error(`❌ Error obteniendo cuestionarios:`, quizzesError);
        continue;
      }
      
      console.log(`   📝 Cuestionarios encontrados: ${quizzes?.length || 0}`);
      
      if (!quizzes || quizzes.length === 0) {
        console.log('   ⚠️ No hay cuestionarios en este curso');
        continue;
      }
      
      // 3. Crear resultados de tests para cada cuestionario
      for (let i = 0; i < quizzes.length; i++) {
        const quiz = quizzes[i];
        const isLastQuiz = i === quizzes.length - 1;
        
        // Simular diferentes niveles de progreso
        const baseScore = 70 + (i * 10); // 70%, 80%, 90%
        const score = Math.min(100, baseScore + Math.floor(Math.random() * 10));
        const totalQuestions = 10; // Asumir 10 preguntas por cuestionario
        const correctAnswers = Math.floor((score / 100) * totalQuestions);
        const passed = score >= 70;
        
        const testResult = {
          user_id: pabloUserId,
          cuestionario_id: quiz.id,
          curso_id: courseId,
          puntuacion: correctAnswers,
          puntuacion_maxima: totalQuestions,
          tiempo_completado: 300 + Math.floor(Math.random() * 600), // 5-15 minutos
          respuestas_detalle: {
            answers: Array.from({ length: totalQuestions }, (_, idx) => ({
              questionId: `q_${idx + 1}`,
              answer: idx < correctAnswers ? 'correct' : 'incorrect',
              timeSpent: 30 + Math.floor(Math.random() * 60)
            })),
            totalTime: 300 + Math.floor(Math.random() * 600)
          },
          fecha_completado: new Date(Date.now() - (quizzes.length - i) * 24 * 60 * 60 * 1000).toISOString(), // Fechas escalonadas
          completed_at: new Date(Date.now() - (quizzes.length - i) * 24 * 60 * 60 * 1000).toISOString(),
          creado_en: new Date(Date.now() - (quizzes.length - i) * 24 * 60 * 60 * 1000).toISOString()
        };
        
        console.log(`   📊 Creando resultado para: ${quiz.titulo || 'Cuestionario sin título'}`);
        console.log(`      - Puntuación: ${correctAnswers}/${totalQuestions} (${score}%)`);
        console.log(`      - Aprobado: ${passed ? 'Sí' : 'No'}`);
        
        const { error: insertError } = await supabase
          .from('user_test_results')
          .insert(testResult);
        
        if (insertError) {
          console.error(`   ❌ Error creando resultado:`, insertError);
        } else {
          console.log(`   ✅ Resultado creado exitosamente`);
        }
        
        // Pausa entre inserciones
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log('\n🔄 Esperando a que se actualicen las tablas de progreso...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 4. Verificar que se crearon los registros
    const { data: testResults, error: testError } = await supabase
      .from('user_test_results')
      .select('*')
      .eq('user_id', pabloUserId);
    
    if (testError) {
      console.error('❌ Error verificando resultados:', testError);
    } else {
      console.log(`\n📊 Total de resultados creados: ${testResults?.length || 0}`);
      
      if (testResults && testResults.length > 0) {
        testResults.forEach((result, index) => {
          console.log(`\n${index + 1}. Test completado:`);
          console.log(`   - Puntuación: ${result.puntuacion}/${result.puntuacion_maxima}`);
          console.log(`   - Porcentaje: ${result.porcentaje}%`);
          console.log(`   - Aprobado: ${result.aprobado ? 'Sí' : 'No'}`);
          console.log(`   - Fecha: ${new Date(result.fecha_completado).toLocaleDateString()}`);
        });
      }
    }
    
    // 5. Verificar si se actualizó user_course_progress
    const { data: progressData, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', pabloUserId);
    
    if (progressError) {
      console.error('❌ Error verificando progreso:', progressError);
    } else {
      console.log(`\n📈 Registros de progreso: ${progressData?.length || 0}`);
      
      if (progressData && progressData.length > 0) {
        progressData.forEach((progress, index) => {
          console.log(`\n${index + 1}. Progreso del curso:`);
          console.log(`   - Curso ID: ${progress.curso_id}`);
          console.log(`   - Progreso: ${progress.progreso_porcentaje}%`);
          console.log(`   - Estado: ${progress.estado}`);
          console.log(`   - Tiempo estudiado: ${Math.floor((progress.tiempo_estudiado || 0) / 60)} min`);
        });
      } else {
        console.log('⚠️ No se crearon registros de progreso automáticamente');
        console.log('💡 Ejecutando script de sincronización...');
        
        // Ejecutar sincronización manual
        await syncProgressManually(pabloUserId, enrollments);
      }
    }
    
    console.log('\n✅ Proceso completado');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

async function syncProgressManually(userId, enrollments) {
  console.log('\n🔄 Sincronizando progreso manualmente...');
  
  for (const enrollment of enrollments) {
    const courseId = enrollment.curso_id;
    const courseTitle = enrollment.cursos?.titulo || 'Sin título';
    
    // Obtener resultados de tests para este curso
    const { data: courseTests, error: testsError } = await supabase
      .from('user_test_results')
      .select('*')
      .eq('user_id', userId)
      .eq('curso_id', courseId);
    
    if (testsError) {
      console.error(`❌ Error obteniendo tests del curso ${courseTitle}:`, testsError);
      continue;
    }
    
    if (!courseTests || courseTests.length === 0) {
      console.log(`⚠️ No hay tests para el curso ${courseTitle}`);
      continue;
    }
    
    const passedTests = courseTests.filter(test => test.aprobado === true);
    const progressPercentage = Math.min(100, Math.round((passedTests.length / courseTests.length) * 100));
    
    const progressData = {
      user_id: userId,
      curso_id: courseId,
      estado: progressPercentage >= 100 ? 'completado' : (progressPercentage > 0 ? 'en_progreso' : 'no_iniciado'),
      progreso_porcentaje: progressPercentage,
      fecha_inicio: courseTests[0].creado_en,
      fecha_completado: progressPercentage >= 100 ? new Date().toISOString() : null,
      ultima_actividad: courseTests[courseTests.length - 1].completed_at,
      tiempo_estudiado: courseTests.reduce((total, test) => total + (test.tiempo_completado || 0), 0)
    };
    
    console.log(`   📊 Creando progreso para ${courseTitle}: ${progressPercentage}%`);
    
    const { error: insertError } = await supabase
      .from('user_course_progress')
      .insert(progressData);
    
    if (insertError) {
      console.error(`   ❌ Error creando progreso:`, insertError);
    } else {
      console.log(`   ✅ Progreso creado: ${progressPercentage}%`);
    }
  }
}

createPabloTestResults();