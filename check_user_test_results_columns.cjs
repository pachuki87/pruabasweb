require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUserTestResultsColumns() {
  try {
    console.log('🔍 Verificando columnas de user_test_results...');
    
    // Intentar hacer una consulta SELECT con LIMIT 1
    const { data: sampleData, error: selectError } = await supabase
      .from('user_test_results')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.error('❌ Error:', selectError.message);
      return;
    }
    
    console.log('✅ Tabla user_test_results existe');
    console.log('📊 Registros encontrados:', sampleData?.length || 0);
    
    if (sampleData && sampleData.length > 0) {
      console.log('📝 Columnas detectadas:', Object.keys(sampleData[0]));
    } else {
      console.log('⚠️  Tabla vacía, intentando insertar un registro de prueba para detectar columnas...');
      
      // Intentar insertar un registro mínimo para ver qué columnas acepta
      const { data: insertData, error: insertError } = await supabase
        .from('user_test_results')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000',
          quiz_id: '00000000-0000-0000-0000-000000000000',
          course_id: '00000000-0000-0000-0000-000000000000',
          score: 0
        })
        .select();
      
      if (insertError) {
        console.log('❌ Error en insert (esto nos ayuda a ver las columnas requeridas):', insertError.message);
      } else {
        console.log('✅ Insert exitoso, columnas detectadas:', Object.keys(insertData[0]));
        
        // Limpiar el registro de prueba
        await supabase
          .from('user_test_results')
          .delete()
          .eq('user_id', '00000000-0000-0000-0000-000000000000');
      }
    }
    
  } catch (err) {
    console.error('❌ Error general:', err.message);
  }
}

checkUserTestResultsColumns();