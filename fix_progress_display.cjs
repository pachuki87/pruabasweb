require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fixProgressDisplay() {
  console.log('🔍 Verificando datos de progreso...');
  
  try {
    // 0. Obtener el UUID del usuario Pablo
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, nombre, email')
      .eq('nombre', 'pablo');
    
    if (usuariosError) {
      console.error('Error al buscar usuario Pablo:', usuariosError);
      return;
    }
    
    if (!usuarios || usuarios.length === 0) {
      console.log('❌ Usuario Pablo no encontrado');
      return;
    }
    
    const pabloId = usuarios[0].id;
    console.log(`✅ Usuario Pablo encontrado: ${usuarios[0].nombre} (${usuarios[0].email})`);
    console.log(`📋 UUID: ${pabloId}`);
    
    // 1. Verificar inscripciones
    const { data: inscripciones, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('*')
      .eq('user_id', pabloId);
    
    if (inscripcionesError) {
      console.error('Error al consultar inscripciones:', inscripcionesError);
      return;
    }
    
    console.log(`📚 Inscripciones encontradas: ${inscripciones.length}`);
    inscripciones.forEach(ins => {
      console.log(`  - Curso: ${ins.curso_id}, Fecha: ${ins.fecha_inscripcion}`);
    });
    
    // 2. Verificar progreso de lecciones
    const { data: progreso, error: progresoError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', pabloId);
    
    if (progresoError) {
      console.error('Error al consultar progreso:', progresoError);
      return;
    }
    
    console.log(`📖 Registros de progreso: ${progreso.length}`);
    progreso.forEach(p => {
      console.log(`  - Lección: ${p.leccion_id}, Completada: ${p.completado}, Progreso: ${p.progreso_porcentaje}%`);
    });
    
    // 3. Verificar resultados de tests
    const { data: tests, error: testsError } = await supabase
      .from('user_test_results')
      .select('*')
      .eq('user_id', pabloId);
    
    if (testsError) {
      console.error('Error al consultar tests:', testsError);
      return;
    }
    
    console.log(`🧪 Resultados de tests: ${tests.length}`);
    tests.forEach(t => {
      console.log(`  - Test: ${t.test_id}, Puntuación: ${t.score}, Aprobado: ${t.passed}`);
    });
    
    // 4. Calcular progreso por curso
    if (inscripciones.length > 0) {
      for (const inscripcion of inscripciones) {
        console.log(`\n📊 Calculando progreso para curso: ${inscripcion.curso_id}`);
        
        // Obtener lecciones del curso
        const { data: lecciones, error: leccionesError } = await supabase
          .from('lecciones')
          .select('id')
          .eq('curso_id', inscripcion.curso_id);
        
        if (leccionesError) {
          console.error('Error al obtener lecciones:', leccionesError);
          continue;
        }
        
        const totalLecciones = lecciones.length;
        const leccionesCompletadas = progreso.filter(p => 
          lecciones.some(l => l.id === p.lesson_id) && p.completed
        ).length;
        
        const porcentajeProgreso = totalLecciones > 0 ? 
          Math.round((leccionesCompletadas / totalLecciones) * 100) : 0;
        
        console.log(`  Total lecciones: ${totalLecciones}`);
        console.log(`  Lecciones completadas: ${leccionesCompletadas}`);
        console.log(`  Porcentaje calculado: ${porcentajeProgreso}%`);
        
        // 5. Intentar insertar/actualizar en user_course_summary
        const summaryData = {
          user_id: pabloId,
          curso_id: inscripcion.curso_id,
          porcentaje_progreso: porcentajeProgreso,
          lecciones_completadas: leccionesCompletadas,
          total_lecciones: totalLecciones,
          tiempo_total_estudio: 0,
          ultima_actividad: new Date().toISOString(),
          fecha_inscripcion: inscripcion.fecha_inscripcion
        };
        
        console.log('\n🔄 Intentando actualizar user_course_summary...');
        
        // Primero intentar upsert
        const { data: upsertData, error: upsertError } = await supabase
          .from('user_course_summary')
          .upsert(summaryData, { 
            onConflict: 'user_id,course_id',
            ignoreDuplicates: false 
          })
          .select();
        
        if (upsertError) {
          console.error('❌ Error en upsert:', upsertError);
          
          // Intentar insert directo
          const { data: insertData, error: insertError } = await supabase
            .from('user_course_summary')
            .insert(summaryData)
            .select();
          
          if (insertError) {
            console.error('❌ Error en insert:', insertError);
          } else {
            console.log('✅ Insert exitoso:', insertData);
          }
        } else {
          console.log('✅ Upsert exitoso:', upsertData);
        }
      }
    }
    
    // 6. Verificar el resultado final
    console.log('\n🔍 Verificando resultado final...');
    const { data: finalCheck, error: finalError } = await supabase
      .from('user_course_summary')
      .select('*')
      .eq('user_id', pabloId);
    
    if (finalError) {
      console.error('Error en verificación final:', finalError);
    } else {
      console.log(`✅ Registros finales en user_course_summary: ${finalCheck.length}`);
      finalCheck.forEach(record => {
        console.log(`  - Curso: ${record.course_id}, Progreso: ${record.porcentaje_progreso}%`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

fixProgressDisplay();