const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_KEY);

async function analyzeProgressCalculation() {
  console.log('=== ANÁLISIS DE CÁLCULO DE PROGRESO ===');

  try {
    // 1. Obtener usuario Pablo
    const { data: user, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', 'pablocardonafeliu@gmail.com')
      .single();

    if (userError) {
      console.error('Error al obtener usuario:', userError);
      return;
    }

    console.log('Usuario:', user.nombre, user.email);
    console.log('ID:', user.id);
    console.log('');

    // 2. Obtener el curso MÁSTER EN ADICCIONES
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('*')
      .ilike('titulo', '%MÁSTER EN ADICCIONES%')
      .single();

    if (courseError) {
      console.error('Error al obtener curso:', courseError);
      return;
    }

    console.log('Curso:', course.titulo);
    console.log('ID:', course.id);
    console.log('');

    // 3. Obtener todas las lecciones del curso
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', course.id)
      .order('orden', { ascending: true });

    if (lessonsError) {
      console.error('Error al obtener lecciones:', lessonsError);
      return;
    }

    console.log('Total de lecciones:', lessons.length);
    lessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.titulo} (ID: ${lesson.id})`);
    });
    console.log('');

    // 4. Obtener resultados de tests del usuario para este curso
    const { data: testResults, error: testError } = await supabase
      .from('user_test_results')
      .select('*')
      .eq('user_id', user.id)
      .eq('curso_id', course.id);

    if (testError) {
      console.error('Error al obtener resultados:', testError);
      return;
    }

    console.log('Resultados de tests:', testResults.length);
    const completedLessons = new Set();
    testResults.forEach(result => {
      console.log(`- Lección ${result.leccion_id}: ${result.puntuacion}/${result.puntuacion_maxima} (${result.aprobado ? 'Aprobado' : 'Reprobado'})`);
      if (result.aprobado) {
        completedLessons.add(result.leccion_id);
      }
    });
    console.log('');

    // 5. Obtener registros de progreso
    const { data: progressRecords, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('curso_id', course.id)
      .order('ultima_actividad', { ascending: false });

    if (progressError) {
      console.error('Error al obtener progreso:', progressError);
      return;
    }

    console.log('Registros de progreso:', progressRecords.length);
    progressRecords.forEach((record, index) => {
      console.log(`${index + 1}. Progreso: ${record.progreso_porcentaje}% - ${record.estado} - ${record.ultima_actividad}`);
    });
    console.log('');

    // 6. Análisis del problema
    console.log('=== ANÁLISIS DEL PROBLEMA ===');
    console.log('Lecciones completadas (aprobadas):', completedLessons.size);
    console.log('Total de lecciones:', lessons.length);
    console.log('Progreso esperado:', Math.round((completedLessons.size / lessons.length) * 100) + '%');
    console.log('Progreso actual mostrado:', progressRecords[0]?.progreso_porcentaje + '%' || '0%');
    console.log('');

    // 7. Verificar si hay lecciones sin tests
    const lessonsWithTests = new Set(testResults.map(r => r.leccion_id));
    const lessonsWithoutTests = lessons.filter(l => !lessonsWithTests.has(l.id));

    console.log('Lecciones sin tests asociados:', lessonsWithoutTests.length);
    lessonsWithoutTests.forEach(lesson => {
      console.log(`- ${lesson.titulo} (ID: ${lesson.id})`);
    });
    console.log('');

    // 8. Verificar si los tests corresponden a lecciones existentes
    const validLessons = new Set(lessons.map(l => l.id));
    const invalidTestLessons = testResults.filter(r => !validLessons.has(r.leccion_id));

    console.log('Tests con lecciones inválidas:', invalidTestLessons.length);
    invalidTestLessons.forEach(test => {
      console.log(`- Test ID: ${test.id} - Lección inválida: ${test.leccion_id}`);
    });

  } catch (error) {
    console.error('Error en el análisis:', error);
  }
}

analyzeProgressCalculation().catch(console.error);