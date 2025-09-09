require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testEnglishSchema() {
  try {
    console.log('🔍 Probando estructura en inglés para user_test_results...');
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_test_results')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        quiz_id: '00000000-0000-0000-0000-000000000000',
        course_id: '00000000-0000-0000-0000-000000000000',
        score: 85,
        total_questions: 10,
        correct_answers: 8,
        incorrect_answers: 2,
        passed: true
      })
      .select();
    
    if (insertError) {
      console.log(`❌ Error: ${insertError.message}`);
    } else {
      console.log(`✅ Éxito! Columnas detectadas:`, Object.keys(insertData[0]));
      
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

testEnglishSchema();