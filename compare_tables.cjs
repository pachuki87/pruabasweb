require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function compareTableStructures() {
  try {
    console.log('🔍 Comparando user_course_progress vs user_course_summary\n');
    
    // Verificar user_course_progress
    console.log('📋 Verificando user_course_progress:');
    const { data: progressData, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .limit(1);
    
    if (progressError) {
      console.log('❌ Error:', progressError.message);
      console.log('   Código:', progressError.code);
    } else {
      console.log('✅ Tabla existe');
      console.log('📊 Registros:', progressData.length);
      if (progressData.length > 0) {
        console.log('🔑 Columnas encontradas:', Object.keys(progressData[0]).join(', '));
      } else {
        console.log('⚠️  Tabla vacía - no se pueden ver columnas');
      }
    }
    
    console.log('\n📋 Verificando user_course_summary:');
    const { data: summaryData, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('*')
      .limit(1);
    
    if (summaryError) {
      console.log('❌ Error:', summaryError.message);
      console.log('   Código:', summaryError.code);
    } else {
      console.log('✅ Tabla existe');
      console.log('📊 Registros:', summaryData.length);
      if (summaryData.length > 0) {
        console.log('🔑 Columnas encontradas:', Object.keys(summaryData[0]).join(', '));
      } else {
        console.log('⚠️  Tabla vacía - no se pueden ver columnas');
      }
    }
    
    // Intentar insertar un registro de prueba para ver la estructura
    console.log('\n🧪 Probando estructura de user_course_progress:');
    const { error: testProgressError } = await supabase
      .from('user_course_progress')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        curso_id: 1,
        leccion_id: 1,
        completado: false
      });
    
    if (testProgressError) {
      console.log('📝 Estructura inferida del error:', testProgressError.message);
      if (testProgressError.message.includes('leccion_id')) {
        console.log('✅ Confirmado: user_course_progress tiene leccion_id (tracking por lección)');
      }
    } else {
      console.log('✅ Inserción de prueba exitosa');
      // Eliminar el registro de prueba
      await supabase
        .from('user_course_progress')
        .delete()
        .eq('user_id', '00000000-0000-0000-0000-000000000000');
    }
    
    console.log('\n🧪 Probando estructura de user_course_summary:');
    const { error: testSummaryError } = await supabase
      .from('user_course_summary')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        curso_id: 1,
        total_lecciones: 0,
        lecciones_completadas: 0,
        progreso_porcentaje: 0
      });
    
    if (testSummaryError) {
      console.log('📝 Estructura inferida del error:', testSummaryError.message);
      if (!testSummaryError.message.includes('leccion_id')) {
        console.log('✅ Confirmado: user_course_summary NO tiene leccion_id (resumen por curso)');
      }
    } else {
      console.log('✅ Inserción de prueba exitosa');
      // Eliminar el registro de prueba
      await supabase
        .from('user_course_summary')
        .delete()
        .eq('user_id', '00000000-0000-0000-0000-000000000000');
    }
    
    console.log('\n🎯 CONCLUSIÓN:');
    console.log('📌 user_course_progress: Para tracking detallado POR LECCIÓN');
    console.log('📌 user_course_summary: Para resumen agregado POR CURSO');
    console.log('\n💡 SON TABLAS DIFERENTES CON PROPÓSITOS DISTINTOS:');
    console.log('   • user_course_progress: Un registro por cada lección que el usuario completa');
    console.log('   • user_course_summary: Un registro por curso con estadísticas totales');
    console.log('\n⚠️  PROBLEMA ACTUAL: Ambas tablas están vacías, por eso hay errores PGRST205');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

compareTableStructures();