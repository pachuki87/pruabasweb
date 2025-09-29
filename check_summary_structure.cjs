require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSummaryStructure() {
  try {
    console.log('🔍 Verificando estructura real de user_course_summary\n');
    
    // Intentar insertar con diferentes combinaciones de nombres
    const testCombinations = [
      {
        name: 'Inglés estándar',
        data: {
          user_id: '00000000-0000-0000-0000-000000000000',
          course_id: 1,
          total_lessons: 0,
          completed_lessons: 0,
          progress_percentage: 0
        }
      },
      {
        name: 'Español',
        data: {
          user_id: '00000000-0000-0000-0000-000000000000',
          curso_id: 1,
          total_lecciones: 0,
          lecciones_completadas: 0,
          progreso_porcentaje: 0
        }
      },
      {
        name: 'Mixto 1',
        data: {
          user_id: '00000000-0000-0000-0000-000000000000',
          course_id: 1,
          total_lecciones: 0,
          lecciones_completadas: 0,
          progreso_porcentaje: 0
        }
      },
      {
        name: 'Mixto 2',
        data: {
          user_id: '00000000-0000-0000-0000-000000000000',
          curso_id: 1,
          total_lessons: 0,
          completed_lessons: 0,
          progress_percentage: 0
        }
      }
    ];
    
    for (const combination of testCombinations) {
      console.log(`🧪 Probando combinación: ${combination.name}`);
      console.log('   Columnas:', Object.keys(combination.data).join(', '));
      
      const { error } = await supabase
        .from('user_course_summary')
        .insert(combination.data);
      
      if (error) {
        console.log(`❌ Error:`, error.message);
        
        // Analizar el error para encontrar pistas
        if (error.message.includes('Could not find the')) {
          const match = error.message.match(/Could not find the '([^']+)' column/);
          if (match) {
            console.log(`   ❌ Columna faltante: ${match[1]}`);
          }
        }
      } else {
        console.log(`✅ ¡ÉXITO! Esta combinación funciona`);
        
        // Limpiar el registro de prueba
        await supabase
          .from('user_course_summary')
          .delete()
          .eq('user_id', '00000000-0000-0000-0000-000000000000');
        
        console.log('\n🎯 ESTRUCTURA CORRECTA ENCONTRADA:');
        Object.keys(combination.data).forEach(key => {
          console.log(`   - ${key}`);
        });
        
        return combination.data;
      }
      
      console.log('');
    }
    
    console.log('⚠️  Ninguna combinación funcionó. Verificando si la tabla existe...');
    
    // Verificar si la tabla existe
    const { data, error: selectError } = await supabase
      .from('user_course_summary')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.log('❌ Error al hacer SELECT:', selectError.message);
      if (selectError.code === 'PGRST106') {
        console.log('\n🚨 LA TABLA user_course_summary NO EXISTE');
        console.log('   Necesitamos crearla primero.');
      }
    } else {
      console.log('✅ La tabla existe pero no pudimos determinar su estructura');
      console.log('   Registros actuales:', data.length);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

checkSummaryStructure();