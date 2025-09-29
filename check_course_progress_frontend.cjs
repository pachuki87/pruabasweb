require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const userId = '79bcdeb7-512b-45cd-88df-f5b44169115e';
const courseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';

async function checkCourseProgress() {
  console.log('🔍 Verificando progreso del curso desde el frontend...');
  
  try {
    // 1. Verificar inscripción del usuario
    console.log('\n1. Verificando inscripción del usuario...');
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('inscripciones')
      .select('*')
      .eq('user_id', userId)
      .eq('curso_id', courseId)
      .single();
    
    if (enrollmentError) {
      console.error('❌ Error al obtener inscripción:', enrollmentError.message);
    } else {
      console.log('✅ Inscripción encontrada:', enrollment);
    }
    
    // 2. Verificar datos del curso
    console.log('\n2. Verificando datos del curso...');
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', courseId)
      .single();
    
    if (courseError) {
      console.error('❌ Error al obtener curso:', courseError.message);
    } else {
      console.log('✅ Curso encontrado:', {
        id: course.id,
        titulo: course.titulo,
        descripcion: course.descripcion?.substring(0, 100) + '...'
      });
    }
    
    // 3. Verificar progreso del usuario
    console.log('\n3. Verificando progreso del usuario...');
    const { data: progress, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('curso_id', courseId);
    
    if (progressError) {
      console.error('❌ Error al obtener progreso:', progressError.message);
    } else {
      console.log('✅ Registros de progreso:', progress?.length || 0);
      if (progress && progress.length > 0) {
        progress.forEach((p, index) => {
          console.log(`   ${index + 1}. Lección ${p.leccion_id}: ${p.progreso}% - ${p.tiempo_estudio}min`);
        });
        
        const totalProgress = progress.reduce((sum, p) => sum + (p.progreso || 0), 0);
        const avgProgress = totalProgress / progress.length;
        console.log(`   📊 Progreso promedio: ${avgProgress.toFixed(1)}%`);
      }
    }
    
    // 4. Verificar vista user_course_summary
    console.log('\n4. Verificando vista user_course_summary...');
    const { data: summary, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('*')
      .eq('user_id', userId)
      .eq('curso_id', courseId);
    
    if (summaryError) {
      console.error('❌ Error al obtener resumen:', summaryError.message);
    } else {
      console.log('✅ Resumen del curso:', summary);
      if (summary && summary.length > 0) {
        summary.forEach(s => {
          console.log(`   📋 ${s.curso_titulo}: ${s.progreso_promedio}% completado`);
          console.log(`   ⏱️  Tiempo total: ${s.tiempo_total_estudio} minutos`);
        });
      }
    }
    
    // 5. Verificar lecciones del curso
    console.log('\n5. Verificando lecciones del curso...');
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', courseId)
      .order('orden', { ascending: true });
    
    if (lessonsError) {
      console.error('❌ Error al obtener lecciones:', lessonsError.message);
    } else {
      console.log('✅ Lecciones encontradas:', lessons?.length || 0);
      if (lessons && lessons.length > 0) {
        lessons.forEach((lesson, index) => {
          console.log(`   ${index + 1}. ${lesson.titulo} (ID: ${lesson.id})`);
        });
      }
    }
    
    // 6. Simular la llamada del dashboard
    console.log('\n6. Simulando llamadas del dashboard...');
    
    // Simular fetchStats para estudiante
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Usuario autenticado:', user ? user.email : 'No autenticado');
    
    // Fetch enrolled courses count
    const { count: enrolledCoursesCount, error: enrolledError } = await supabase
      .from('inscripciones')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (enrolledError) {
      console.error('❌ Error al contar cursos inscritos:', enrolledError.message);
    } else {
      console.log('✅ Cursos inscritos:', enrolledCoursesCount);
    }
    
    // Fetch completed quizzes count
    const { count: completedQuizzesCount, error: quizzesError } = await supabase
      .from('respuestas_texto_libre')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (quizzesError) {
      console.error('❌ Error al contar cuestionarios:', quizzesError.message);
    } else {
      console.log('✅ Respuestas de cuestionarios:', completedQuizzesCount);
    }
    
    console.log('\n✅ Verificación de progreso completada');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

checkCourseProgress();