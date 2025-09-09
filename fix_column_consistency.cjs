require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixColumnConsistency() {
  try {
    console.log('🔍 Verificando consistencia de columnas entre tablas\n');
    
    // 1. Verificar estructura de user_course_progress
    console.log('📋 Verificando user_course_progress...');
    const { data: progressData, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .limit(1);
    
    if (progressError) {
      console.log('❌ Error en user_course_progress:', progressError.message);
    } else {
      console.log('✅ user_course_progress existe');
      console.log('   Registros:', progressData.length);
      if (progressData.length > 0) {
        console.log('   Columnas encontradas:', Object.keys(progressData[0]).join(', '));
      }
    }
    
    // 2. Verificar estructura de user_course_summary
    console.log('\n📋 Verificando user_course_summary...');
    const { data: summaryData, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('*')
      .limit(1);
    
    if (summaryError) {
      console.log('❌ Error en user_course_summary:', summaryError.message);
    } else {
      console.log('✅ user_course_summary existe');
      console.log('   Registros:', summaryData.length);
      if (summaryData.length > 0) {
        console.log('   Columnas encontradas:', Object.keys(summaryData[0]).join(', '));
      }
    }
    
    // 3. Probar inserción en user_course_progress con diferentes nombres
    console.log('\n🧪 Probando inserción en user_course_progress...');
    
    // Obtener un usuario e inscripción válidos
    const { data: inscripciones } = await supabase
      .from('inscripciones')
      .select('user_id, curso_id')
      .limit(1);
    
    const { data: lecciones } = await supabase
      .from('lecciones')
      .select('id, curso_id')
      .limit(1);
    
    if (inscripciones.length > 0 && lecciones.length > 0) {
      const testData = {
        user_id: inscripciones[0].user_id,
        curso_id: inscripciones[0].curso_id,
        leccion_id: lecciones[0].id,
        progreso_porcentaje: 50.0,
        tiempo_estudiado: 30,
        completado: false
      };
      
      console.log('📝 Probando con nombres en español:', Object.keys(testData).join(', '));
      
      const { error: insertError1 } = await supabase
        .from('user_course_progress')
        .insert(testData);
      
      if (insertError1) {
        console.log('❌ Error con nombres en español:', insertError1.message);
        
        // Probar con nombres en inglés
        const testDataEnglish = {
          user_id: inscripciones[0].user_id,
          course_id: inscripciones[0].curso_id,
          lesson_id: lecciones[0].id,
          progress_percentage: 50.0,
          time_studied: 30,
          completed: false
        };
        
        console.log('📝 Probando con nombres en inglés:', Object.keys(testDataEnglish).join(', '));
        
        const { error: insertError2 } = await supabase
          .from('user_course_progress')
          .insert(testDataEnglish);
        
        if (insertError2) {
          console.log('❌ Error con nombres en inglés:', insertError2.message);
        } else {
          console.log('✅ ¡Funciona con nombres en inglés!');
          // Limpiar registro de prueba
          await supabase
            .from('user_course_progress')
            .delete()
            .eq('user_id', inscripciones[0].user_id)
            .eq('course_id', inscripciones[0].curso_id)
            .eq('lesson_id', lecciones[0].id);
        }
      } else {
        console.log('✅ ¡Funciona con nombres en español!');
        // Limpiar registro de prueba
        await supabase
          .from('user_course_progress')
          .delete()
          .eq('user_id', inscripciones[0].user_id)
          .eq('curso_id', inscripciones[0].curso_id)
          .eq('leccion_id', lecciones[0].id);
      }
    }
    
    // 4. Verificar si hay datos existentes en user_course_progress
    console.log('\n📊 Verificando datos existentes...');
    const { data: existingProgress, count: progressCount } = await supabase
      .from('user_course_progress')
      .select('*', { count: 'exact' });
    
    console.log(`📈 user_course_progress: ${progressCount} registros`);
    
    const { data: existingSummary, count: summaryCount } = await supabase
      .from('user_course_summary')
      .select('*', { count: 'exact' });
    
    console.log(`📈 user_course_summary: ${summaryCount} registros`);
    
    // 5. Mostrar recomendaciones
    console.log('\n💡 RECOMENDACIONES:');
    
    if (progressCount === 0 && summaryCount > 0) {
      console.log('⚠️  user_course_progress está vacía pero user_course_summary tiene datos');
      console.log('   Esto puede causar inconsistencias en la aplicación');
      console.log('   Recomendación: Poblar user_course_progress con datos iniciales');
    }
    
    if (progressCount > 0 && summaryCount > 0) {
      console.log('✅ Ambas tablas tienen datos');
      console.log('   Verificar que los datos sean consistentes entre sí');
    }
    
    console.log('\n🔧 Para solucionar problemas de carga en useProgress.ts:');
    console.log('1. Verificar que ProgressService use los nombres de columna correctos');
    console.log('2. Asegurar que ambas tablas tengan datos consistentes');
    console.log('3. Verificar que las políticas RLS permitan acceso a los datos');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

fixColumnConsistency();