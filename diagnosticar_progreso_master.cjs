require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

(async () => {
  try {
    console.log('=== DIAGNÓSTICO COMPLETO DE PROGRESO MÁSTER ADICCIONES ===\n');

    // 1. Obtener usuario Pablo
    console.log('1. Buscando usuario Pablo...');
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', 'pablocardonafeliu@gmail.com')
      .single();

    if (userError || !usuario) {
      console.log('Error al buscar usuario:', userError);
      return;
    }
    console.log(`Usuario encontrado: ${usuario.nombre} (${usuario.email})`);
    console.log(`ID: ${usuario.id}\n`);

    // 2. Buscar el curso MÁSTER EN ADICCIONES
    console.log('2. Buscando curso MÁSTER EN ADICCIONES...');
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('*')
      .ilike('titulo', '%MÁSTER EN ADICCIONES%')
      .single();

    if (cursoError || !curso) {
      console.log('Error al buscar curso:', cursoError);
      return;
    }
    console.log(`Curso encontrado: ${curso.titulo}`);
    console.log(`ID: ${curso.id}\n`);

    // 3. Verificar inscripción del usuario en el curso
    console.log('3. Verificando inscripción...');
    const { data: inscripcion, error: inscripcionError } = await supabase
      .from('inscripciones')
      .select('*')
      .eq('user_id', usuario.id)
      .eq('curso_id', curso.id)
      .single();

    if (inscripcionError) {
      console.log('Error al verificar inscripción:', inscripcionError);
    } else {
      console.log('✅ Usuario inscrito en el curso');
      console.log(`Fecha de inscripción: ${inscripcion.fecha_inscripcion}\n`);
    }

    // 4. Obtener todas las lecciones del curso
    console.log('4. Obteniendo lecciones del curso...');
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', curso.id)
      .order('orden', { ascending: true });

    if (leccionesError) {
      console.log('Error al obtener lecciones:', leccionesError);
    } else {
      console.log(`Total de lecciones: ${lecciones.length}`);
      lecciones.forEach((leccion, i) => {
        console.log(`  ${i + 1}. ${leccion.titulo} (ID: ${leccion.id})`);
      });
    }
    console.log('');

    // 5. Obtener cuestionarios del curso
    console.log('5. Obteniendo cuestionarios del curso...');
    const { data: cuestionarios, error: cuestionariosError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('curso_id', curso.id);

    if (cuestionariosError) {
      console.log('Error al obtener cuestionarios:', cuestionariosError);
    } else {
      console.log(`Total de cuestionarios: ${cuestionarios.length}`);
      cuestionarios.forEach((cuestionario, i) => {
        console.log(`  ${i + 1}. ${cuestionario.titulo} (Lección: ${cuestionario.leccion_id})`);
      });
    }
    console.log('');

    // 6. Buscar resultados de tests del usuario
    console.log('6. Buscando resultados de tests del usuario...');
    const { data: tests, error: testsError } = await supabase
      .from('user_test_results')
      .select('*')
      .eq('user_id', usuario.id)
      .eq('curso_id', curso.id);

    if (testsError) {
      console.log('Error al obtener tests:', testsError);
    } else {
      console.log(`Tests encontrados: ${tests.length}`);
      const leccionesAprobadas = new Set();
      tests.forEach((test, i) => {
        console.log(`  ${i + 1}. Lección ${test.leccion_id}: ${test.puntuacion}/${test.puntuacion_maxima} - ${test.aprobado ? 'APROBADO' : 'REPROBADO'}`);
        if (test.aprobado) {
          leccionesAprobadas.add(test.leccion_id);
        }
      });
      console.log(`\nLecciones aprobadas: ${leccionesAprobadas.size}`);
      console.log(`Lecciones totales: ${lecciones?.length || 0}`);

      if (lecciones?.length > 0) {
        const progresoCalculado = Math.round((leccionesAprobadas.size / lecciones.length) * 100);
        console.log(`Progreso calculado: ${progresoCalculado}%`);
      }
    }
    console.log('');

    // 7. Verificar registros en user_course_progress
    console.log('7. Verificando user_course_progress...');
    const { data: progresos, error: progresosError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', usuario.id)
      .eq('curso_id', curso.id)
      .order('ultima_actividad', { ascending: false });

    if (progresosError) {
      console.log('Error al obtener progresos:', progresosError);
    } else {
      console.log(`Registros de progreso: ${progresos.length}`);
      progresos.forEach((progreso, i) => {
        console.log(`  ${i + 1}. ${progreso.progreso_porcentaje}% - ${progreso.estado} - ${progreso.ultima_actividad}`);
      });
    }
    console.log('');

    // 8. Verificar vista user_course_summary
    console.log('8. Verificando user_course_summary...');
    const { data: resumen, error: resumenError } = await supabase
      .from('user_course_summary')
      .select('*')
      .eq('user_id', usuario.id)
      .eq('curso_id', curso.id);

    if (resumenError) {
      console.log('Error al obtener resumen:', resumenError);
    } else {
      console.log(`Registros de resumen: ${resumen.length}`);
      resumen.forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.progreso_porcentaje}% - ${r.lecciones_completadas}/${r.total_lecciones} lecciones`);
      });
    }

    console.log('\n=== DIAGNÓSTICO COMPLETADO ===');

  } catch (error) {
    console.error('Error general:', error);
  }
})();