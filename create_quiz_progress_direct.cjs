const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Función alternativa usando inserción básica
async function createProgressBasic() {
  console.log('🚀 Iniciando creación de progreso básico...');
  
  const userIds = [
    '6b9b8a2e-8f4c-4d5e-9a1b-2c3d4e5f6789',
    'a1b2c3d4-e5f6-7890-1234-567890abcdef'
  ];
  
  for (const userId of userIds) {
    console.log(`\n👤 Procesando usuario: ${userId}`);
    
    // Intentar con diferentes estructuras de datos para user_course_progress
    const progressStructures = [
      {
        user_id: userId,
        curso_id: 'b5ef8c64-fe26-4f20-8221-80a1bf475b05',
        leccion_id: '123e4567-e89b-12d3-a456-426614174000',
        is_completed: true,
        progreso: 100
      },
      {
        user_id: userId,
        curso_id: 'b5ef8c64-fe26-4f20-8221-80a1bf475b05',
        chapter_id: '123e4567-e89b-12d3-a456-426614174000',
        is_completed: true,
        progreso: 100
      },
      {
        user_id: userId,
        course_id: 'b5ef8c64-fe26-4f20-8221-80a1bf475b05',
        lesson_id: '123e4567-e89b-12d3-a456-426614174000',
        completed: true,
        progress: 100
      },
      // Estructura mínima
      {
        user_id: userId,
        curso_id: 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'
      }
    ];
    
    let progressSuccess = false;
    for (let i = 0; i < progressStructures.length; i++) {
      console.log(`🔄 Intentando progreso estructura ${i + 1}...`);
      
      const { data, error } = await supabase
        .from('user_course_progress')
        .insert(progressStructures[i])
        .select();
      
      if (error) {
        console.log(`❌ Error progreso estructura ${i + 1}:`, error.message);
      } else {
        console.log(`✅ Éxito progreso estructura ${i + 1}:`, data);
        progressSuccess = true;
        break;
      }
    }
    
    if (!progressSuccess) {
      console.log('⚠️ No se pudo crear progreso con ninguna estructura');
    }
    
    // Intentar crear resultado de test
    const testStructures = [
      {
        user_id: userId,
        curso_id: 'b5ef8c64-fe26-4f20-8221-80a1bf475b05',
        leccion_id: '123e4567-e89b-12d3-a456-426614174000',
        score: 85,
        total_questions: 10,
        passed: true
      },
      {
        user_id: userId,
        course_id: 'b5ef8c64-fe26-4f20-8221-80a1bf475b05',
        lesson_id: '123e4567-e89b-12d3-a456-426614174000',
        score: 85,
        total_questions: 10,
        passed: true
      },
      // Estructura mínima
      {
        user_id: userId,
        score: 85
      }
    ];
    
    let testSuccess = false;
    for (let i = 0; i < testStructures.length; i++) {
      console.log(`🔄 Intentando test estructura ${i + 1}...`);
      
      const { data, error } = await supabase
        .from('user_test_results')
        .insert(testStructures[i])
        .select();
      
      if (error) {
        console.log(`❌ Error test estructura ${i + 1}:`, error.message);
      } else {
        console.log(`✅ Éxito test estructura ${i + 1}:`, data);
        testSuccess = true;
        break;
      }
    }
    
    if (!testSuccess) {
      console.log('⚠️ No se pudo crear resultado de test con ninguna estructura');
    }
  }
  
  // Verificar resultados finales
  console.log('\n🔍 Verificando resultados finales...');
  
  try {
    const { data: progressData, count: progressCount } = await supabase
      .from('user_course_progress')
      .select('*', { count: 'exact' });
    
    const { data: testData, count: testCount } = await supabase
      .from('user_test_results')
      .select('*', { count: 'exact' });
    
    console.log('📊 Registros finales:');
    console.log(`   - Progreso de lecciones: ${progressCount || 0}`);
    console.log(`   - Resultados de tests: ${testCount || 0}`);
    
    if (progressData && progressData.length > 0) {
      console.log('\n📋 Datos de progreso encontrados:');
      progressData.forEach((item, index) => {
        console.log(`   ${index + 1}. Usuario: ${item.user_id}, Curso: ${item.curso_id || item.course_id}`);
      });
    }
    
    if (testData && testData.length > 0) {
      console.log('\n📋 Datos de tests encontrados:');
      testData.forEach((item, index) => {
        console.log(`   ${index + 1}. Usuario: ${item.user_id}, Score: ${item.score}`);
      });
    }
    
  } catch (error) {
    console.log('❌ Error verificando resultados:', error.message);
  }
}

// Función para inspeccionar estructura de tablas
async function inspectTableStructure() {
  console.log('🔍 Inspeccionando estructura de tablas...');
  
  const tables = ['user_course_progress', 'user_test_results', 'user_course_summary'];
  
  for (const table of tables) {
    console.log(`\n📋 Tabla: ${table}`);
    
    // Intentar obtener algunos registros para ver la estructura
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`❌ Error accediendo a ${table}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`✅ Estructura de ${table}:`, Object.keys(data[0]));
    } else {
      console.log(`⚠️ Tabla ${table} está vacía`);
    }
  }
}

async function main() {
  console.log('🎯 Iniciando script de creación de progreso directo...');
  
  // Primero inspeccionar estructura
  await inspectTableStructure();
  
  // Luego intentar crear datos
  await createProgressBasic();
  
  console.log('\n✨ Script completado');
}

main().catch(console.error);