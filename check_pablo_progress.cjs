require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

(async () => {
  try {
    console.log('=== VERIFICACIÓN DE PROGRESO DE PABLO ===\n');
    
    // 1. Buscar el usuario Pablo por email
    console.log('1. Buscando usuario Pablo...');
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', 'pablocardonafeliu@gmail.com')
      .single();

    if (userError) {
      console.log('Error al buscar usuario:', userError);
      return;
    }

    if (!usuario) {
      console.log('Usuario Pablo no encontrado');
      return;
    }

    console.log(`Usuario encontrado: ${usuario.nombre} (${usuario.email})`);
    console.log(`ID de usuario: ${usuario.id}\n`);

    // 2. Consultar progreso en user_course_summary
    console.log('2. Consultando progreso en user_course_summary...');
    const { data: progreso, error: progressError } = await supabase
      .from('user_course_summary')
      .select('*')
      .eq('user_id', usuario.id);

    if (progressError) {
      console.log('Error al consultar progreso:', progressError);
      return;
    }

    console.log(`Registros encontrados en user_course_summary: ${progreso.length}\n`);

    if (progreso.length === 0) {
      console.log('❌ NO HAY REGISTROS DE PROGRESO PARA PABLO');
      console.log('Esto explica por qué el frontend muestra 0%\n');
      
      // Verificar si hay datos en user_course_progress
      console.log('3. Verificando datos en user_course_progress...');
      const { data: progressDetail, error: detailError } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', usuario.id);

      if (detailError) {
        console.log('Error al consultar user_course_progress:', detailError);
      } else {
        console.log(`Registros en user_course_progress: ${progressDetail.length}`);
        if (progressDetail.length > 0) {
          console.log('\n📊 Datos detallados de progreso:');
          progressDetail.forEach(p => {
            console.log(`- Lección ${p.lesson_id}: ${p.porcentaje_completado}% completado`);
          });
        }
      }

      // Verificar resultados de tests
      console.log('\n4. Verificando resultados de tests...');
      const { data: testResults, error: testError } = await supabase
        .from('user_test_results')
        .select('*')
        .eq('user_id', usuario.id);

      if (testError) {
        console.log('Error al consultar user_test_results:', testError);
      } else {
        console.log(`Tests completados: ${testResults.length}`);
        if (testResults.length > 0) {
          const aprobados = testResults.filter(t => t.aprobado).length;
          console.log(`Tests aprobados: ${aprobados}/${testResults.length}`);
        }
      }
    } else {
      console.log('✅ PROGRESO ENCONTRADO:');
      progreso.forEach(p => {
        console.log(`Curso ID: ${p.curso_id}`);
        console.log(`Porcentaje de progreso: ${p.porcentaje_progreso}%`);
        console.log(`Lecciones completadas: ${p.lecciones_completadas}`);
        console.log(`Total de lecciones: ${p.total_lecciones}`);
        console.log(`Tiempo total estudiado: ${p.tiempo_total_estudiado} minutos`);
        console.log(`Última actualización: ${p.updated_at}`);
        console.log('---');
      });
    }

    console.log('\n=== VERIFICACIÓN COMPLETADA ===');

  } catch (error) {
    console.error('Error general:', error);
  }
})();