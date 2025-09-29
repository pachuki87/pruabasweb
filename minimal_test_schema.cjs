require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testMinimalSchema() {
  try {
    console.log('🔍 Probando campos mínimos para user_test_results...');
    
    // Probar solo con campos básicos que sabemos que existen
    const { data: insertData, error: insertError } = await supabase
      .from('user_test_results')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        quiz_id: '00000000-0000-0000-0000-000000000000',
        course_id: '00000000-0000-0000-0000-000000000000'
      })
      .select();
    
    if (insertError) {
      console.log(`❌ Error: ${insertError.message}`);
      
      // Si falla, intentar con nombres en español
      console.log('\n🔄 Intentando con nombres en español...');
      const { data: insertData2, error: insertError2 } = await supabase
        .from('user_test_results')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000',
          quiz_id: '00000000-0000-0000-0000-000000000000',
          curso_id: '00000000-0000-0000-0000-000000000000'
        })
        .select();
        
      if (insertError2) {
        console.log(`❌ Error con español: ${insertError2.message}`);
      } else {
        console.log(`✅ Éxito con español! Columnas:`, Object.keys(insertData2[0]));
        await supabase.from('user_test_results').delete().eq('user_id', '00000000-0000-0000-0000-000000000000');
      }
    } else {
      console.log(`✅ Éxito con inglés! Columnas:`, Object.keys(insertData[0]));
      await supabase.from('user_test_results').delete().eq('user_id', '00000000-0000-0000-0000-000000000000');
    }
    
  } catch (err) {
    console.error('❌ Error general:', err.message);
  }
}

testMinimalSchema();