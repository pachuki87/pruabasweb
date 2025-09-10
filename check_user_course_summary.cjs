const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserCourseSummary() {
  try {
    console.log('🔍 Verificando datos en user_course_summary...');
    
    // Obtener todos los registros de user_course_summary
    const { data: summaryData, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('*');
    
    if (summaryError) {
      console.error('❌ Error obteniendo user_course_summary:', summaryError);
      return;
    }
    
    console.log(`📊 Total registros en user_course_summary: ${summaryData?.length || 0}`);
    
    if (summaryData && summaryData.length > 0) {
      console.log('\n📋 Registros encontrados:');
      summaryData.forEach((record, index) => {
        console.log(`\n${index + 1}. Registro:`);
        console.log(`   - ID: ${record.id}`);
        console.log(`   - User ID: ${record.user_id}`);
        console.log(`   - Curso ID: ${record.curso_id}`);
        console.log(`   - Progreso: ${record.porcentaje_progreso}%`);
        console.log(`   - Lecciones completadas: ${record.lecciones_completadas}/${record.total_lecciones}`);
        console.log(`   - Tiempo gastado: ${record.tiempo_total_gastado} min`);
        console.log(`   - Último acceso: ${record.ultimo_acceso_en}`);
      });
    }
    
    // Buscar específicamente para Pablo
    const pabloUserId = '83508eb3-e26e-4312-90f7-9a06901d4126';
    console.log(`\n🔍 Buscando registros para Pablo (${pabloUserId})...`);
    
    const { data: pabloData, error: pabloError } = await supabase
      .from('user_course_summary')
      .select('*')
      .eq('user_id', pabloUserId);
    
    if (pabloError) {
      console.error('❌ Error buscando datos de Pablo:', pabloError);
      return;
    }
    
    console.log(`📊 Registros de Pablo: ${pabloData?.length || 0}`);
    
    if (pabloData && pabloData.length > 0) {
      console.log('\n📋 Datos de progreso de Pablo:');
      pabloData.forEach((record, index) => {
        console.log(`\n${index + 1}. Curso:`);
        console.log(`   - Curso ID: ${record.curso_id}`);
        console.log(`   - Progreso: ${record.porcentaje_progreso}%`);
        console.log(`   - Lecciones: ${record.lecciones_completadas}/${record.total_lecciones}`);
        console.log(`   - Tiempo: ${record.tiempo_total_gastado} min`);
      });
    } else {
      console.log('❌ No se encontraron registros de progreso para Pablo en user_course_summary');
    }
    
    // Verificar también user_course_progress para Pablo
    console.log('\n🔍 Verificando user_course_progress para Pablo...');
    
    const { data: progressData, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', pabloUserId);
    
    if (progressError) {
      console.error('❌ Error obteniendo user_course_progress:', progressError);
      return;
    }
    
    console.log(`📊 Registros en user_course_progress para Pablo: ${progressData?.length || 0}`);
    
    if (progressData && progressData.length > 0) {
      console.log('\n📋 Datos en user_course_progress:');
      progressData.forEach((record, index) => {
        console.log(`\n${index + 1}. Registro:`);
        console.log(`   - Curso ID: ${record.curso_id}`);
        console.log(`   - Progreso: ${record.progreso_porcentaje}%`);
        console.log(`   - Actualizado: ${record.updated_at}`);
      });
    }
    
    // Verificar inscripciones de Pablo
    console.log('\n🔍 Verificando inscripciones de Pablo...');
    
    const { data: enrollmentData, error: enrollmentError } = await supabase
      .from('inscripciones')
      .select(`
        *,
        cursos:curso_id (
          id,
          titulo
        )
      `)
      .eq('user_id', pabloUserId);
    
    if (enrollmentError) {
      console.error('❌ Error obteniendo inscripciones:', enrollmentError);
      return;
    }
    
    console.log(`📊 Inscripciones de Pablo: ${enrollmentData?.length || 0}`);
    
    if (enrollmentData && enrollmentData.length > 0) {
      console.log('\n📋 Cursos inscritos:');
      enrollmentData.forEach((record, index) => {
        console.log(`\n${index + 1}. Inscripción:`);
        console.log(`   - Curso: ${record.cursos?.titulo || 'Sin título'}`);
        console.log(`   - Curso ID: ${record.curso_id}`);
        console.log(`   - Fecha inscripción: ${record.fecha_inscripcion}`);
        console.log(`   - Estado: ${record.estado}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkUserCourseSummary()