const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function verifyDatabaseStructure() {
  console.log('🔍 Verificando estructura de la base de datos...');
  
  // Tablas principales a verificar
  const tables = [
    'cursos',
    'lecciones', 
    'cuestionarios',
    'preguntas',
    'materiales',
    'inscripciones',
    'user_test_results',
    'respuestas_texto_libre'
  ];

  for (const table of tables) {
    console.log(`\n📋 Tabla: ${table}`);
    console.log('=' .repeat(50));
    
    try {
      // Obtener estructura de la tabla
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(0);
        
      if (error) {
        console.log(`❌ Error: ${error.message}`);
        continue;
      }
      
      // Intentar obtener una fila para ver las columnas
      const { data: sampleData, error: sampleError } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (sampleError) {
        console.log(`❌ Error obteniendo muestra: ${sampleError.message}`);
        continue;
      }
      
      if (sampleData && sampleData.length > 0) {
        const columns = Object.keys(sampleData[0]);
        console.log(`✅ Columnas encontradas (${columns.length}):`);
        columns.forEach(col => console.log(`   - ${col}`));
      } else {
        console.log('⚠️  Tabla vacía, no se pueden determinar las columnas');
      }
      
    } catch (err) {
      console.log(`❌ Error inesperado: ${err.message}`);
    }
  }
  
  console.log('\n🎯 Verificación completada');
}

verifyDatabaseStructure().catch(console.error);