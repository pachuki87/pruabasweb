require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function createQuizProgress() {
  console.log('🎯 Creando progreso de cuestionarios usando nombres de columnas correctos...');
  
  try {
    // 1. Obtener el usuario Pablo
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, nombre, email')
      .eq('nombre', 'pablo');
    
    if (usuariosError || !usuarios || usuarios.length === 0) {
      console.error('❌ Usuario Pablo no encontrado:', usuariosError);
      return;
    }
    
    const pabloId = usuarios[0].id;
    console.log(`✅ Usuario Pablo: ${usuarios[0].nombre} (${pabloId})`);
    
    // 2. Obtener sus inscripciones
    const { data: inscripciones, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('*')
      .eq('user_id', pabloId);
    
    if (inscripcionesError) {
      console.error('❌ Error obteniendo inscripciones:', inscripcionesError);
      return;
    }
    
    console.log(`📚 Inscripciones: ${inscripciones.length}`);
    
    // 3. Para cada curso inscrito, crear progreso simulado
    for (const inscripcion of inscripciones) {
      console.log(`\n🎓 Procesando curso: ${inscripcion.curso_id}`);
      
      // Obtener lecciones del curso
      const { data: lecciones, error: leccionesError } = await supabase
        .from('lecciones')
        .select('id, titulo, tiene_cuestionario')
        .eq('curso_id', inscripcion.curso_id);
      
      if (leccionesError) {
        console.error('❌ Error obteniendo lecciones:', leccionesError);
        continue;
      }
      
      console.log(`📖 Lecciones encontradas: ${lecciones.length}`);
      
      // 4. Crear progreso para algunas lecciones (simular que completó cuestionarios)
      const leccionesConCuestionario = lecciones.filter(l => l.tiene_cuestionario);
      console.log(`🧪 Lecciones con cuestionario: ${leccionesConCuestionario.length}`);
      
      // Simular que completó el 50% de los cuestionarios
      const leccionesACompletar = Math.ceil(leccionesConCuestionario.length * 0.5);
      console.log(`✅ Simulando ${leccionesACompletar} cuestionarios completados`);
      
      for (let i = 0; i < leccionesACompletar; i++) {
        const leccion = leccionesConCuestionario[i];
        
        // Crear progreso en user_course_progress usando nombres correctos según las migraciones
        const progressData = {
          user_id: pabloId,
          curso_id: inscripcion.curso_id, // Según migración: curso_id (español)
          chapter_id: leccion.id, // Según migración: chapter_id (inglés)
          progress_percentage: 100,
          is_completed: true,
          completed_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
          time_spent_minutes: 15 + Math.floor(Math.random() * 30), // 15-45 minutos
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log(`📝 Creando progreso para lección: ${leccion.titulo}`);
        
        const { data: progressResult, error: progressError } = await supabase
          .from('user_course_progress')
          .upsert(progressData, { onConflict: 'user_id,curso_id,chapter_id' })
          .select();
        
        if (progressError) {
          console.error(`❌ Error creando progreso para ${leccion.titulo}:`, progressError);
        } else {
          console.log(`✅ Progreso creado para ${leccion.titulo}`);
        }
        
        // Crear resultado de test simulado
        const { data: cuestionarios, error: cuestionariosError } = await supabase
          .from('cuestionarios')
          .select('id')
          .eq('leccion_id', leccion.id)
          .limit(1);
        
        if (!cuestionariosError && cuestionarios && cuestionarios.length > 0) {
          // Según las migraciones, user_test_results usa nombres mixtos
          const testResult = {
            user_id: pabloId, // Puede ser user_id o usuario_id según migración
            quiz_id: cuestionarios[0].id, // Puede ser quiz_id o cuestionario_id según migración
            course_id: inscripcion.curso_id, // Puede ser course_id o curso_id según migración
            score: 85 + Math.floor(Math.random() * 15), // Puntuación entre 85-100
            total_questions: 10,
            correct_answers: 8 + Math.floor(Math.random() * 2), // 8-9 respuestas correctas
            passed: true,
            completed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          const { data: testResultData, error: testResultError } = await supabase
            .from('user_test_results')
            .upsert(testResult, { onConflict: 'user_id,quiz_id' })
            .select();
          
          if (testResultError) {
            console.error(`❌ Error creando resultado de test:`, testResultError);
            
            // Intentar con nombres en español
            console.log('🔄 Intentando con nombres en español...');
            const testResultSpanish = {
              usuario_id: pabloId,
              cuestionario_id: cuestionarios[0].id,
              curso_id: inscripcion.curso_id,
              puntuacion: testResult.score,
              puntuacion_maxima: 100,
              porcentaje: testResult.score,
              tiempo_completado: 300 + Math.floor(Math.random() * 300),
              aprobado: true,
              fecha_completado: new Date().toISOString(),
              creado_en: new Date().toISOString(),
              actualizado_en: new Date().toISOString()
            };
            
            const { data: spanishResult, error: spanishError } = await supabase
              .from('user_test_results')
              .upsert(testResultSpanish, { onConflict: 'usuario_id,cuestionario_id' })
              .select();
            
            if (spanishError) {
              console.error(`❌ Error con nombres en español:`, spanishError);
            } else {
              console.log(`✅ Resultado de test creado con nombres en español`);
            }
          } else {
            console.log(`✅ Resultado de test creado con puntuación: ${testResult.score}`);
          }
        }
      }
      
      // 5. Verificar si se creó progreso
      const { data: createdProgress, error: checkError } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', pabloId)
        .eq('curso_id', inscripcion.curso_id);
      
      if (checkError) {
        console.error('❌ Error verificando progreso creado:', checkError);
      } else {
        console.log(`✅ Progreso verificado: ${createdProgress?.length || 0} registros`);
      }
    }
    
    // 6. Verificar el resultado final
    console.log('\n🔍 Verificación final...');
    
    const { data: finalProgress, error: finalProgressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', pabloId);
    
    const { data: finalTests, error: finalTestsError } = await supabase
      .from('user_test_results')
      .select('*')
      .eq('user_id', pabloId);
    
    // Intentar también con usuario_id para user_test_results
    if (finalTestsError) {
      console.log('🔄 Intentando user_test_results con usuario_id...');
      const { data: finalTestsSpanish, error: finalTestsSpanishError } = await supabase
        .from('user_test_results')
        .select('*')
        .eq('usuario_id', pabloId);
      
      if (!finalTestsSpanishError) {
        console.log(`📊 Resultados de tests (español): ${finalTestsSpanish?.length || 0}`);
      }
    }
    
    const { data: finalSummary, error: finalSummaryError } = await supabase
      .from('user_course_summary')
      .select('*')
      .eq('user_id', pabloId);
    
    console.log(`📊 Registros finales:`);
    console.log(`   - Progreso de lecciones: ${finalProgress?.length || 0}`);
    console.log(`   - Resultados de tests: ${finalTests?.length || 0}`);
    console.log(`   - Resúmenes de cursos: ${finalSummary?.length || 0}`);
    
    if (finalProgress && finalProgress.length > 0) {
      console.log('\n✅ Progreso de lecciones creado:');
      finalProgress.forEach(progress => {
        console.log(`   - Curso: ${progress.curso_id}`);
        console.log(`   - Capítulo: ${progress.chapter_id}`);
        console.log(`   - Completado: ${progress.is_completed}`);
        console.log(`   - Progreso: ${progress.progress_percentage}%`);
        console.log(`   - Tiempo: ${progress.time_spent_minutes} minutos`);
      });
    }
    
    if (finalTests && finalTests.length > 0) {
      console.log('\n✅ Resultados de tests:');
      finalTests.forEach(test => {
        console.log(`   - Quiz: ${test.quiz_id || test.cuestionario_id}`);
        console.log(`   - Puntuación: ${test.score || test.puntuacion}`);
        console.log(`   - Aprobado: ${test.passed || test.aprobado}`);
      });
    }
    
    if (finalSummary && finalSummary.length > 0) {
      console.log('\n✅ Resúmenes de cursos:');
      finalSummary.forEach(summary => {
        console.log(`   - Curso: ${summary.course_id}`);
        console.log(`   - Progreso: ${summary.overall_progress}%`);
        console.log(`   - Capítulos completados: ${summary.chapters_completed}`);
        console.log(`   - Tests tomados: ${summary.total_tests_taken}`);
      });
    }
    
    console.log('\n🎉 ¡Proceso completado! El progreso debería aparecer ahora en el frontend.');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createQuizProgress();