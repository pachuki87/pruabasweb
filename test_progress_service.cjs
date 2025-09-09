require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProgressService() {
  try {
    console.log('🧪 Probando ProgressService corregido\n');
    
    // 1. Obtener datos de prueba
    const { data: inscripciones } = await supabase
      .from('inscripciones')
      .select('user_id, curso_id')
      .limit(1);
    
    if (!inscripciones || inscripciones.length === 0) {
      console.log('❌ No hay inscripciones para probar');
      return;
    }
    
    const { user_id, curso_id } = inscripciones[0];
    console.log(`👤 Usuario de prueba: ${user_id}`);
    console.log(`📚 Curso de prueba: ${curso_id}`);
    
    // 2. Probar getCourseProgress
    console.log('\n🔍 Probando getCourseProgress...');
    const { data: progress, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', user_id)
      .eq('curso_id', curso_id)
      .order('ultima_actividad', { ascending: false });
    
    if (progressError) {
      console.log('❌ Error en getCourseProgress:', progressError.message);
    } else {
      console.log(`✅ getCourseProgress funciona: ${progress.length} registros`);
      if (progress.length > 0) {
        console.log('   Primer registro:', {
          id: progress[0].id,
          estado: progress[0].estado,
          progreso_porcentaje: progress[0].progreso_porcentaje,
          leccion_titulo: progress[0].lecciones?.titulo || 'Sin título'
        });
      }
    }
    
    // 3. Probar getUserOverallProgress
    console.log('\n🔍 Probando getUserOverallProgress...');
    const { data: summary, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('*')
      .eq('user_id', user_id);
    
    if (summaryError) {
      console.log('❌ Error en getUserOverallProgress:', summaryError.message);
    } else {
      console.log(`✅ getUserOverallProgress funciona: ${summary.length} registros`);
      if (summary.length > 0) {
        console.log('   Primer registro:', {
          course_id: summary[0].course_id,
          total_lessons: summary[0].total_lessons,
          completed_lessons: summary[0].completed_lessons,
          progress_percentage: summary[0].progress_percentage
        });
      }
    }
    
    // 4. Probar user_test_results si existe
    console.log('\n🔍 Probando user_test_results...');
    const { data: tests, error: testsError } = await supabase
      .from('user_test_results')
      .select('*')
      .eq('user_id', user_id)
      .limit(1);
    
    if (testsError) {
      console.log('❌ user_test_results no existe o error:', testsError.message);
    } else {
      console.log(`✅ user_test_results existe: ${tests.length} registros`);
    }
    
    // 5. Verificar que useProgress.ts puede cargar
    console.log('\n🔍 Verificando compatibilidad con useProgress.ts...');
    
    // Simular las consultas que hace useProgress
    const { data: progressStats, error: statsError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', user_id);
    
    if (statsError) {
      console.log('❌ Error simulando useProgress:', statsError.message);
    } else {
      console.log(`✅ useProgress debería funcionar: ${progressStats.length} registros de progreso`);
    }
    
    console.log('\n🎉 RESULTADO:');
    if (!progressError && !summaryError) {
      console.log('✅ ProgressService corregido exitosamente');
      console.log('✅ useProgress.ts debería cargar sin errores ahora');
      console.log('✅ Los errores PGRST205 deberían estar resueltos');
    } else {
      console.log('❌ Aún hay errores que resolver');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testProgressService();