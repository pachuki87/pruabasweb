require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testUserTestResultsSchema() {
  try {
    console.log('🔍 Probando diferentes estructuras para user_test_results...');
    
    // Probar con nombres en español
    const testCases = [
      {
        name: 'Español completo',
        data: {
          user_id: '00000000-0000-0000-0000-000000000000',
          quiz_id: '00000000-0000-0000-0000-000000000000',
          curso_id: '00000000-0000-0000-0000-000000000000',
          puntuacion: 85,
          total_preguntas: 10,
          respuestas_correctas: 8,
          respuestas_incorrectas: 2
        }
      },
      {
        name: 'Mixto español-inglés',
        data: {
          user_id: '00000000-0000-0000-0000-000000000000',
          quiz_id: '00000000-0000-0000-0000-000000000000',
          course_id: '00000000-0000-0000-0000-000000000000',
          puntuacion: 85,
          total_preguntas: 10,
          respuestas_correctas: 8,
          respuestas_incorrectas: 2
        }
      },
      {
        name: 'Solo campos básicos',
        data: {
          user_id: '00000000-0000-0000-0000-000000000000',
          quiz_id: '00000000-0000-0000-0000-000000000000'
        }
      }
    ];
    
    for (const testCase of testCases) {
      console.log(`\n🧪 Probando: ${testCase.name}`);
      
      const { data: insertData, error: insertError } = await supabase
        .from('user_test_results')
        .insert(testCase.data)
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
        
        break; // Si uno funciona, no necesitamos probar más
      }
    }
    
  } catch (err) {
    console.error('❌ Error general:', err.message);
  }
}

testUserTestResultsSchema();