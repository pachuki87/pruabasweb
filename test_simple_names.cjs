require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSimpleNames() {
  try {
    console.log('🔍 Probando nombres más simples para user_test_results...');
    
    // Probar con nombres más simples
    const testCases = [
      {
        name: 'Nombres cortos',
        data: {
          user_id: '00000000-0000-0000-0000-000000000000',
          quiz_id: '00000000-0000-0000-0000-000000000000',
          course_id: '00000000-0000-0000-0000-000000000000',
          puntuacion: 85,
          puntuacion_maxima: 100,
          correctas: 8,
          incorrectas: 2,
          aprobado: true
        }
      },
      {
        name: 'Con total',
        data: {
          user_id: '00000000-0000-0000-0000-000000000000',
          quiz_id: '00000000-0000-0000-0000-000000000000',
          course_id: '00000000-0000-0000-0000-000000000000',
          puntuacion: 85,
          puntuacion_maxima: 100,
          total: 10,
          correctas: 8,
          incorrectas: 2,
          aprobado: true
        }
      },
      {
        name: 'Solo básicos',
        data: {
          user_id: '00000000-0000-0000-0000-000000000000',
          quiz_id: '00000000-0000-0000-0000-000000000000',
          course_id: '00000000-0000-0000-0000-000000000000',
          puntuacion: 85,
          puntuacion_maxima: 100
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
        console.log(`✅ ¡ÉXITO con ${testCase.name}!`);
        console.log(`📋 Columnas:`, Object.keys(insertData[0]));
        
        // Limpiar
        await supabase
          .from('user_test_results')
          .delete()
          .eq('user_id', '00000000-0000-0000-0000-000000000000');
        
        break; // Si funciona, no probar más
      }
    }
    
  } catch (err) {
    console.error('❌ Error general:', err.message);
  }
}

testSimpleNames();