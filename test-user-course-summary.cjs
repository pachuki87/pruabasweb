const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testUserCourseSummary() {
  try {
    const userId = '98c473d9-011e-4a6b-a646-9c41b007d3ae'; // pablocfv@gmail.com
    
    console.log('🔍 Probando vista user_course_summary...');
    
    // Probar la vista user_course_summary
    const { data: summary, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('*')
      .eq('user_id', userId);
    
    if (summaryError) {
      console.error('❌ Error en user_course_summary:', summaryError);
    } else {
      console.log('✅ Registros en user_course_summary:', summary?.length || 0);
      if (summary && summary.length > 0) {
        summary.forEach((record, i) => {
          console.log(`${i + 1}. ${record.course_title} - Progreso: ${record.overall_progress || 0}%`);
          console.log('   Detalles:', record);
        });
      } else {
        console.log('📋 No hay registros en user_course_summary para este usuario');
      }
    }
    
    // Verificar las tablas base individualmente
    console.log('\n🔍 Verificando tablas base...');
    
    // Verificar inscripciones
    const { data: inscripciones, error: inscError } = await supabase
      .from('inscripciones')
      .select('*')
      .eq('user_id', userId);
    
    console.log('📋 Inscripciones del usuario:', inscripciones?.length || 0);
    if (inscripciones && inscripciones.length > 0) {
      inscripciones.forEach((ins, i) => {
        console.log(`${i + 1}. Course ID: ${ins.course_id}`);
      });
    }
    
    // Verificar cursos
    if (inscripciones && inscripciones.length > 0) {
      const courseId = inscripciones[0].course_id;
      const { data: curso, error: cursoError } = await supabase
        .from('cursos')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (cursoError) {
        console.error('❌ Error al obtener curso:', cursoError);
      } else {
        console.log('📚 Curso:', curso.titulo);
      }
    }
    
    // Verificar user_course_progress
    const { data: progress, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', userId);
    
    console.log('📊 Registros de progreso:', progress?.length || 0);
    if (progress && progress.length > 0) {
      progress.forEach((prog, i) => {
        console.log(`${i + 1}. Course: ${prog.course_id}, Chapter: ${prog.chapter_id}, Completed: ${prog.is_completed}`);
      });
    }
    
    // Probar getUserProgressStats directamente
    console.log('\n🔍 Probando función getUserProgressStats...');
    const { data: stats, error: statsError } = await supabase
      .rpc('get_user_progress_stats', { p_user_id: userId });
    
    if (statsError) {
      console.error('❌ Error en getUserProgressStats:', statsError);
    } else {
      console.log('✅ Stats del usuario:', stats);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testUserCourseSummary();