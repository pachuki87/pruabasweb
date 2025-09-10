const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function forceFrontendRefresh() {
  try {
    const pabloUserId = '83508eb3-e26e-4312-90f7-9a06901d4836';
    
    console.log('🔄 Forzando actualización del progreso en el frontend...');
    
    // 1. Verificar datos actuales en user_course_summary
    console.log('\n📊 Verificando user_course_summary...');
    const { data: summaryData, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('*')
      .eq('user_id', pabloUserId);
    
    if (summaryError) {
      console.error('❌ Error obteniendo summary:', summaryError);
    } else {
      console.log(`📈 Registros en user_course_summary: ${summaryData?.length || 0}`);
      
      if (summaryData && summaryData.length > 0) {
        summaryData.forEach((summary, index) => {
          console.log(`\n${index + 1}. Resumen del curso:`);
          console.log(`   - Curso ID: ${summary.curso_id}`);
          console.log(`   - Progreso: ${summary.progreso_porcentaje}%`);
          console.log(`   - Tests completados: ${summary.tests_completados}`);
          console.log(`   - Tests totales: ${summary.tests_totales}`);
          console.log(`   - Última actividad: ${new Date(summary.ultima_actividad).toLocaleString()}`);
        });
      } else {
        console.log('⚠️ No hay datos en user_course_summary');
        console.log('💡 Esto explica por qué el frontend muestra 0%');
        
        // Forzar actualización de user_course_summary
        await updateCourseSummary(pabloUserId);
      }
    }
    
    // 2. Verificar datos en user_course_progress
    console.log('\n📊 Verificando user_course_progress...');
    const { data: progressData, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', pabloUserId);
    
    if (progressError) {
      console.error('❌ Error obteniendo progress:', progressError);
    } else {
      console.log(`📈 Registros en user_course_progress: ${progressData?.length || 0}`);
      
      if (progressData && progressData.length > 0) {
        // Agrupar por curso_id y mostrar el progreso más reciente
        const courseProgress = {};
        progressData.forEach(progress => {
          const courseId = progress.curso_id;
          if (!courseProgress[courseId] || new Date(progress.ultima_actividad) > new Date(courseProgress[courseId].ultima_actividad)) {
            courseProgress[courseId] = progress;
          }
        });
        
        Object.values(courseProgress).forEach((progress, index) => {
          console.log(`\n${index + 1}. Progreso más reciente:`);
          console.log(`   - Curso ID: ${progress.curso_id}`);
          console.log(`   - Progreso: ${progress.progreso_porcentaje}%`);
          console.log(`   - Estado: ${progress.estado}`);
          console.log(`   - Última actividad: ${new Date(progress.ultima_actividad).toLocaleString()}`);
        });
      }
    }
    
    // 3. Verificar datos en user_test_results
    console.log('\n📊 Verificando user_test_results...');
    const { data: testResults, error: testError } = await supabase
      .from('user_test_results')
      .select('*')
      .eq('user_id', pabloUserId)
      .order('completed_at', { ascending: false });
    
    if (testError) {
      console.error('❌ Error obteniendo test results:', testError);
    } else {
      console.log(`📈 Tests completados: ${testResults?.length || 0}`);
      
      if (testResults && testResults.length > 0) {
        testResults.slice(0, 3).forEach((test, index) => {
          console.log(`\n${index + 1}. Test reciente:`);
          console.log(`   - Curso ID: ${test.curso_id}`);
          console.log(`   - Puntuación: ${test.puntuacion}/${test.puntuacion_maxima} (${test.porcentaje}%)`);
          console.log(`   - Aprobado: ${test.aprobado ? 'Sí' : 'No'}`);
          console.log(`   - Completado: ${new Date(test.completed_at).toLocaleString()}`);
        });
      }
    }
    
    // 4. Simular consulta del frontend
    console.log('\n🔍 Simulando consulta del frontend...');
    await simulateFrontendQuery(pabloUserId);
    
    console.log('\n✅ Verificación completada');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

async function updateCourseSummary(userId) {
  console.log('\n🔄 Actualizando user_course_summary...');
  
  try {
    // Obtener inscripciones del usuario
    const { data: enrollments, error: enrollError } = await supabase
      .from('inscripciones')
      .select(`
        curso_id,
        cursos:curso_id (
          id,
          titulo
        )
      `)
      .eq('user_id', userId);
    
    if (enrollError) {
      console.error('❌ Error obteniendo inscripciones:', enrollError);
      return;
    }
    
    for (const enrollment of enrollments) {
      const courseId = enrollment.curso_id;
      const courseTitle = enrollment.cursos?.titulo || 'Sin título';
      
      console.log(`\n📚 Procesando curso: ${courseTitle}`);
      
      // Obtener tests del curso
      const { data: courseTests, error: testsError } = await supabase
        .from('user_test_results')
        .select('*')
        .eq('user_id', userId)
        .eq('curso_id', courseId);
      
      if (testsError) {
        console.error(`❌ Error obteniendo tests:`, testsError);
        continue;
      }
      
      // Obtener total de cuestionarios del curso
      const { data: totalQuizzes, error: quizzesError } = await supabase
        .from('cuestionarios')
        .select('id')
        .eq('curso_id', courseId);
      
      if (quizzesError) {
        console.error(`❌ Error obteniendo cuestionarios:`, quizzesError);
        continue;
      }
      
      const testsCompletados = courseTests?.length || 0;
      const testsTotales = totalQuizzes?.length || 0;
      const progresoCalculado = testsTotales > 0 ? Math.round((testsCompletados / testsTotales) * 100) : 0;
      
      console.log(`   - Tests completados: ${testsCompletados}/${testsTotales}`);
      console.log(`   - Progreso calculado: ${progresoCalculado}%`);
      
      if (testsCompletados > 0) {
        const summaryData = {
          user_id: userId,
          curso_id: courseId,
          progreso_porcentaje: progresoCalculado,
          tests_completados: testsCompletados,
          tests_totales: testsTotales,
          tiempo_total_estudiado: courseTests.reduce((total, test) => total + (test.tiempo_completado || 0), 0),
          ultima_actividad: courseTests[courseTests.length - 1]?.completed_at || new Date().toISOString(),
          fecha_ultimo_acceso: new Date().toISOString()
        };
        
        // Insertar o actualizar user_course_summary
        const { error: upsertError } = await supabase
          .from('user_course_summary')
          .upsert(summaryData, {
            onConflict: 'user_id,curso_id'
          });
        
        if (upsertError) {
          console.error(`   ❌ Error actualizando summary:`, upsertError);
        } else {
          console.log(`   ✅ Summary actualizado: ${progresoCalculado}%`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error actualizando course summary:', error);
  }
}

async function simulateFrontendQuery(userId) {
  try {
    // Simular la consulta que hace getUserProgressStats
    console.log('\n🔍 Consultando como lo hace el frontend...');
    
    const { data: stats, error: statsError } = await supabase
      .from('user_course_summary')
      .select(`
        *,
        cursos:curso_id (
          id,
          titulo,
          descripcion
        )
      `)
      .eq('user_id', userId);
    
    if (statsError) {
      console.error('❌ Error en consulta frontend:', statsError);
    } else {
      console.log(`📊 Datos que vería el frontend: ${stats?.length || 0} cursos`);
      
      if (stats && stats.length > 0) {
        stats.forEach((stat, index) => {
          console.log(`\n${index + 1}. Curso frontend:`);
          console.log(`   - Título: ${stat.cursos?.titulo || 'Sin título'}`);
          console.log(`   - Progreso: ${stat.progreso_porcentaje}%`);
          console.log(`   - Tests: ${stat.tests_completados}/${stat.tests_totales}`);
        });
      } else {
        console.log('⚠️ El frontend no vería ningún dato de progreso');
        console.log('💡 Esto explica por qué muestra 0%');
      }
    }
    
  } catch (error) {
    console.error('❌ Error simulando consulta frontend:', error);
  }
}

forceFrontendRefresh();