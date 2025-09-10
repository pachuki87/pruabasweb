require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUserProgress() {
  try {
    console.log('🔍 Depurando progreso del usuario...');
    
    // 1. Verificar usuarios existentes
    console.log('\n1. Verificando usuarios:');
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, nombre, email')
      .limit(5);
    
    if (usersError) {
      console.error('Error obteniendo usuarios:', usersError);
    } else {
      console.log(`📊 Usuarios encontrados: ${users?.length || 0}`);
      users?.forEach(user => {
        console.log(`  - ${user.nombre || 'Sin nombre'} (${user.email}) - ID: ${user.id}`);
      });
    }
    
    // 2. Verificar cursos existentes
    console.log('\n2. Verificando cursos:');
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, titulo')
      .limit(5);
    
    if (coursesError) {
      console.error('Error obteniendo cursos:', coursesError);
    } else {
      console.log(`📊 Cursos encontrados: ${courses?.length || 0}`);
      courses?.forEach(course => {
        console.log(`  - ${course.titulo} - ID: ${course.id}`);
      });
    }
    
    // 3. Verificar lecciones existentes
    console.log('\n3. Verificando lecciones:');
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, titulo, curso_id')
      .limit(5);
    
    if (lessonsError) {
      console.error('Error obteniendo lecciones:', lessonsError);
    } else {
      console.log(`📊 Lecciones encontradas: ${lessons?.length || 0}`);
      lessons?.forEach(lesson => {
        console.log(`  - ${lesson.titulo} (Curso: ${lesson.curso_id}) - ID: ${lesson.id}`);
      });
    }
    
    // 4. Verificar progreso de usuario
    console.log('\n4. Verificando progreso de usuarios:');
    const { data: progress, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .limit(10);
    
    if (progressError) {
      console.error('Error obteniendo progreso:', progressError);
    } else {
      console.log(`📊 Registros de progreso encontrados: ${progress?.length || 0}`);
      progress?.forEach(p => {
        console.log(`  - Usuario: ${p.user_id}, Curso: ${p.curso_id}, Lección: ${p.leccion_id}, Progreso: ${p.progreso_porcentaje}%`);
      });
    }
    
    // 5. Verificar inscripciones de usuarios
    console.log('\n5. Verificando inscripciones:');
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('user_courses')
      .select('*')
      .limit(10);
    
    if (enrollmentsError) {
      console.error('Error obteniendo inscripciones:', enrollmentsError);
    } else {
      console.log(`📊 Inscripciones encontradas: ${enrollments?.length || 0}`);
      enrollments?.forEach(e => {
        console.log(`  - Usuario: ${e.user_id}, Curso: ${e.course_id}, Estado: ${e.status}`);
      });
    }
    
    // 6. Verificar vista user_course_summary
    console.log('\n6. Verificando vista user_course_summary:');
    const { data: summary, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('*')
      .limit(5);
    
    if (summaryError) {
      console.error('Error obteniendo resumen:', summaryError);
    } else {
      console.log(`📊 Registros en vista resumen: ${summary?.length || 0}`);
      summary?.forEach(s => {
        console.log(`  - Usuario: ${s.user_id}, Curso: ${s.course_titulo}, Progreso: ${s.porcentaje_progreso}%`);
      });
    }
    
    console.log('\n✅ Depuración completada');
    
  } catch (error) {
    console.error('❌ Error durante la depuración:', error);
  }
}

debugUserProgress();