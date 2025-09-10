require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function diagnoseSupabaseErrors() {
  console.log('🔍 Diagnosticando errores de Supabase...');
  console.log('URL:', supabaseUrl);
  console.log('Service Key presente:', !!supabaseServiceKey);
  
  try {
    // 1. Verificar conectividad básica
    console.log('\n1. Verificando conectividad básica...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (healthError) {
      console.error('❌ Error de conectividad:', healthError.message);
    } else {
      console.log('✅ Conectividad básica OK');
    }

    // 2. Verificar datos del curso específico
    console.log('\n2. Verificando curso "Experto en Conductas Adictivas"...');
    const courseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';
    
    const { data: courseData, error: courseError } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', courseId)
      .single();
    
    if (courseError) {
      console.error('❌ Error al obtener curso:', courseError.message);
    } else {
      console.log('✅ Curso encontrado:', courseData?.titulo || 'Sin título');
      console.log('   ID:', courseData?.id);
      console.log('   Descripción:', courseData?.descripcion?.substring(0, 100) + '...');
    }

    // 3. Verificar inscripciones del usuario
    console.log('\n3. Verificando inscripciones del usuario...');
    const userId = '79bcdeb7-512b-45cd-88df-f5b44169115e';
    
    const { data: enrollments, error: enrollError } = await supabase
      .from('inscripciones')
      .select('*')
      .eq('user_id', userId);
    
    if (enrollError) {
      console.error('❌ Error al obtener inscripciones:', enrollError.message);
    } else {
      console.log('✅ Inscripciones encontradas:', enrollments?.length || 0);
      enrollments?.forEach(enrollment => {
        console.log(`   - Curso ID: ${enrollment.curso_id}, Fecha: ${enrollment.fecha_inscripcion}`);
      });
    }

    // 4. Verificar lecciones del curso
    console.log('\n4. Verificando lecciones del curso...');
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseId);
    
    if (lessonsError) {
      console.error('❌ Error al obtener lecciones:', lessonsError.message);
    } else {
      console.log('✅ Lecciones encontradas:', lessons?.length || 0);
      lessons?.slice(0, 3).forEach(lesson => {
        console.log(`   - ${lesson.titulo} (Orden: ${lesson.orden})`);
      });
    }

    // 5. Verificar cuestionarios del curso
    console.log('\n5. Verificando cuestionarios del curso...');
    const { data: quizzes, error: quizzesError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('curso_id', courseId);
    
    if (quizzesError) {
      console.error('❌ Error al obtener cuestionarios:', quizzesError.message);
    } else {
      console.log('✅ Cuestionarios encontrados:', quizzes?.length || 0);
      quizzes?.forEach(quiz => {
        console.log(`   - ${quiz.titulo}`);
      });
    }

    // 6. Verificar progreso del usuario
    console.log('\n6. Verificando progreso del usuario...');
    const { data: progress, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('curso_id', courseId);
    
    if (progressError) {
      console.error('❌ Error al obtener progreso:', progressError.message);
    } else {
      console.log('✅ Registros de progreso:', progress?.length || 0);
      const totalProgress = progress?.reduce((sum, p) => sum + (p.progreso || 0), 0) || 0;
      const avgProgress = progress?.length ? totalProgress / progress.length : 0;
      console.log(`   - Progreso promedio: ${avgProgress.toFixed(1)}%`);
    }

    // 7. Verificar respuestas de texto libre
    console.log('\n7. Verificando respuestas de texto libre...');
    const { data: responses, error: responsesError } = await supabase
      .from('respuestas_texto_libre')
      .select('*')
      .or(`user_id.eq.${userId},user_id.eq.anonymous`);
    
    if (responsesError) {
      console.error('❌ Error al obtener respuestas:', responsesError.message);
    } else {
      console.log('✅ Respuestas encontradas:', responses?.length || 0);
    }

    // 8. Verificar autenticación
    console.log('\n8. Verificando estado de autenticación...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Error de autenticación:', authError.message);
    } else {
      console.log('✅ Usuario autenticado:', user?.id || 'No autenticado');
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

diagnoseSupabaseErrors().then(() => {
  console.log('\n🏁 Diagnóstico completado');
}).catch(console.error);