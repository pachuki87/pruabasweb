require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testCompleteSchema() {
  try {
    console.log('🔍 Probando estructura completa para user_test_results...');
    
    // Basado en los errores, incluir todos los campos requeridos
    const { data: insertData, error: insertError } = await supabase
      .from('user_test_results')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        quiz_id: '00000000-0000-0000-0000-000000000000',
        course_id: '00000000-0000-0000-0000-000000000000',
        puntuacion: 85,
        puntuacion_maxima: 100,
        respuestas_correctas: 8,
        respuestas_incorrectas: 2,
        aprobado: true
      })
      .select();
    
    if (insertError) {
      console.log(`❌ Error: ${insertError.message}`);
      
      // Si falla, probar con nombres alternativos
      console.log('\n🔄 Probando nombres alternativos...');
      const { data: insertData2, error: insertError2 } = await supabase
        .from('user_test_results')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000',
          quiz_id: '00000000-0000-0000-0000-000000000000',
          course_id: '00000000-0000-0000-0000-000000000000',
          puntuacion: 85,
          puntuacion_maxima: 100,
          total_preguntas: 10,
          preguntas_correctas: 8,
          preguntas_incorrectas: 2,
          paso: true
        })
        .select();
        
      if (insertError2) {
        console.log(`❌ Error alternativo: ${insertError2.message}`);
      } else {
        console.log(`✅ Éxito con nombres alternativos! Columnas:`, Object.keys(insertData2[0]));
        await supabase.from('user_test_results').delete().eq('user_id', '00000000-0000-0000-0000-000000000000');
      }
    } else {
      console.log(`✅ Éxito! Columnas detectadas:`, Object.keys(insertData[0]));
      console.log(`📋 Estructura completa:`, insertData[0]);
      
      // Limpiar el registro de prueba
      await supabase
        .from('user_test_results')
        .delete()
        .eq('user_id', '00000000-0000-0000-0000-000000000000');
    }
    
  } catch (err) {
    console.error('❌ Error general:', err.message);
  }
}

testCompleteSchema();