const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncPabloProgress() {
  try {
    const pabloUserId = '83508eb3-e26e-4312-90f7-9a06901d4126';
    
    console.log('🔄 Sincronizando progreso de Pablo...');
    
    // 1. Obtener los resultados de tests de Pablo
    const { data: testResults, error: testError } = await supabase
      .from('user_test_results')
      .select('*')
      .eq('user_id', pabloUserId);
    
    if (testError) {
      console.error('❌ Error obteniendo resultados de tests:', testError);
      return;
    }
    
    console.log(`📊 Tests completados por Pablo: ${testResults?.length || 0}`);
    
    if (!testResults || testResults.length === 0) {
      console.log('❌ Pablo no tiene resultados de tests registrados');
      return;
    }
    
    // 2. Obtener inscripciones de Pablo
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
    
    // 3. Para cada curso inscrito, crear/actualizar progreso
    for (const enrollment of enrollments) {
      const courseId = enrollment.curso_id;
      const courseTitle = enrollment.cursos?.titulo || 'Sin título';
      
      console.log(`\n🎯 Procesando curso: ${courseTitle}`);
      
      // Verificar si ya existe progreso para este curso
      const { data: existingProgress, error: progressError } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', pabloUserId)
        .eq('curso_id', courseId)
        .maybeSingle();
      
      if (progressError) {
        console.error(`❌ Error verificando progreso existente:`, progressError);
        continue;
      }
      
      // Contar tests completados para este curso
      const courseTests = testResults.filter(test => test.curso_id === courseId);
      const passedTests = courseTests.filter(test => test.aprobado === true);
      
      console.log(`   📝 Tests en este curso: ${courseTests.length}`);
      console.log(`   ✅ Tests aprobados: ${passedTests.length}`);
      
      // Calcular progreso basado en tests (asumiendo que cada test representa progreso)
      const progressPercentage = courseTests.length > 0 ? Math.min(100, (passedTests.length / courseTests.length) * 100) : 0;
      
      const progressData = {
        user_id: pabloUserId,
        curso_id: courseId,
        estado: progressPercentage >= 100 ? 'completado' : (progressPercentage > 0 ? 'en_progreso' : 'no_iniciado'),
        progreso_porcentaje: Math.round(progressPercentage),
        fecha_inicio: courseTests.length > 0 ? courseTests[0].creado_en : new Date().toISOString(),
        fecha_completado: progressPercentage >= 100 ? new Date().toISOString() : null,
        ultima_actividad: courseTests.length > 0 ? courseTests[courseTests.length - 1].completed_at : new Date().toISOString(),
        tiempo_estudiado: courseTests.reduce((total, test) => total + (test.tiempo_completado || 0), 0) // ya está en segundos
      };
      
      if (existingProgress) {
        // Actualizar progreso existente
        const { error: updateError } = await supabase
          .from('user_course_progress')
          .update(progressData)
          .eq('id', existingProgress.id);
        
        if (updateError) {
          console.error(`❌ Error actualizando progreso:`, updateError);
        } else {
          console.log(`   ✅ Progreso actualizado: ${progressData.progreso_porcentaje}%`);
        }
      } else {
        // Crear nuevo registro de progreso
        const { error: insertError } = await supabase
          .from('user_course_progress')
          .insert(progressData);
        
        if (insertError) {
          console.error(`❌ Error creando progreso:`, insertError);
        } else {
          console.log(`   ✅ Progreso creado: ${progressData.progreso_porcentaje}%`);
        }
      }
    }
    
    // 4. Verificar si existe la función de trigger para actualizar user_course_summary
    console.log('\n🔄 Verificando actualización automática de user_course_summary...');
    
    // Esperar un momento para que los triggers se ejecuten
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 5. Verificar el resultado final
    const { data: finalSummary, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('*')
      .eq('user_id', pabloUserId);
    
    if (summaryError) {
      console.error('❌ Error verificando user_course_summary:', summaryError);
    } else {
      console.log(`\n📊 Registros en user_course_summary: ${finalSummary?.length || 0}`);
      
      if (finalSummary && finalSummary.length > 0) {
        finalSummary.forEach((record, index) => {
          console.log(`\n${index + 1}. Resumen del curso:`);
          console.log(`   - Curso ID: ${record.curso_id || record.course_id}`);
          console.log(`   - Progreso: ${record.porcentaje_progreso || record.progress_percentage}%`);
          console.log(`   - Lecciones completadas: ${record.lecciones_completadas || record.completed_lessons}`);
          console.log(`   - Tiempo total: ${record.tiempo_total_gastado || record.total_time_spent} min`);
        });
      } else {
        console.log('⚠️ No se crearon registros en user_course_summary automáticamente');
        console.log('💡 Puede que falte el trigger o la función update_user_course_summary');
      }
    }
    
    console.log('\n✅ Sincronización completada');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

syncPabloProgress();