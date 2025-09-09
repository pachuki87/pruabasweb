require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testUpdatedSchema() {
  try {
    console.log('🔍 Probando estructura actualizada para user_test_results...');
    
    const { data: insertData, error: insertError } = await supabase
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
        aprobado: true
      })
      .select();
    
    if (insertError) {
      console.log(`❌ Error: ${insertError.message}`);
    } else {
      console.log(`✅ ¡ÉXITO! Estructura correcta confirmada`);
      console.log(`📋 Columnas detectadas:`, Object.keys(insertData[0]));
      console.log(`🎯 Datos insertados:`, insertData[0]);
      
      // Limpiar el registro de prueba
      await supabase
        .from('user_test_results')
        .delete()
        .eq('user_id', '00000000-0000-0000-0000-000000000000');
        
      console.log(`🧹 Registro de prueba eliminado`);
    }
    
  } catch (err) {
    console.error('❌ Error general:', err.message);
  }
}

testUpdatedSchema();