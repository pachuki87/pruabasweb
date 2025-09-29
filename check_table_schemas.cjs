const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkTableSchemas() {
  console.log('🔍 Verificando esquemas de tablas desde information_schema...');
  
  const tables = [
    'user_test_results',
    'preguntas', 
    'cuestionarios',
    'respuestas_texto_libre'
  ];

  for (const tableName of tables) {
    console.log(`\n📋 Tabla: ${tableName}`);
    console.log('=' .repeat(50));
    
    try {
      // Usar RPC para ejecutar consulta SQL
      const { data, error } = await supabase.rpc('get_table_columns', {
        table_name: tableName
      });
      
      if (error) {
        console.log(`❌ Error con RPC: ${error.message}`);
        
        // Método alternativo: intentar describir la tabla
        console.log('🔄 Intentando método alternativo...');
        const { data: altData, error: altError } = await supabase
          .from(tableName)
          .select('*')
          .limit(0);
          
        if (altError) {
          console.log(`❌ Error alternativo: ${altError.message}`);
        } else {
          console.log('✅ Tabla existe pero está vacía');
        }
        continue;
      }
      
      if (data && data.length > 0) {
        console.log(`✅ Columnas encontradas (${data.length}):`);
        data.forEach(col => {
          console.log(`   - ${col.column_name} (${col.data_type})`);
        });
      } else {
        console.log('⚠️  No se encontraron columnas');
      }
      
    } catch (err) {
      console.log(`❌ Error inesperado: ${err.message}`);
    }
  }
  
  console.log('\n🎯 Verificación de esquemas completada');
}

checkTableSchemas().catch(console.error);