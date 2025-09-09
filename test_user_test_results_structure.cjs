const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Generar UUID válido
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function testUserTestResultsStructure() {
  console.log('🔍 Probando estructura de user_test_results con UUIDs válidos...');
  
  const testUserId = generateUUID();
  const testQuizId = generateUUID();
  
  // Probar con columnas que parecen existir
  const testCases = [
    {
      name: 'Solo user_id y quiz_id (UUIDs válidos)',
      data: {
        user_id: testUserId,
        quiz_id: testQuizId
      }
    },
    {
      name: 'Con attempt_number',
      data: {
        user_id: testUserId,
        quiz_id: testQuizId,
        attempt_number: 1
      }
    },
    {
      name: 'Con passed',
      data: {
        user_id: testUserId,
        quiz_id: testQuizId,
        passed: true
      }
    },
    {
      name: 'Con answers_data',
      data: {
        user_id: testUserId,
        quiz_id: testQuizId,
        answers_data: {}
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🧪 Probando: ${testCase.name}`);
    console.log('=' .repeat(50));
    
    try {
      const { data, error } = await supabase
        .from('user_test_results')
        .insert(testCase.data)
        .select();
        
      if (error) {
        console.log(`❌ Error: ${error.message}`);
        if (error.details) {
          console.log(`   Detalles: ${error.details}`);
        }
      } else {
        console.log(`✅ Inserción exitosa!`);
        console.log(`   Columnas que funcionan:`, Object.keys(testCase.data));
        console.log(`   Estructura completa del registro:`);
        if (data && data.length > 0) {
          const record = data[0];
          Object.keys(record).forEach(key => {
            console.log(`     - ${key}: ${typeof record[key]} = ${record[key]}`);
          });
          
          // Limpiar el registro de prueba
          await supabase
            .from('user_test_results')
            .delete()
            .eq('id', record.id);
          console.log(`🧹 Registro de prueba eliminado`);
        }
        break; // Si una inserción funciona, ya tenemos la estructura
      }
    } catch (err) {
      console.log(`❌ Error inesperado: ${err.message}`);
    }
  }
  
  console.log('\n🎯 Prueba de estructura completada');
}

testUserTestResultsStructure().catch(console.error);