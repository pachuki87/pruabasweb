require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPreguntasTable() {
  console.log('🔍 Verificando tabla preguntas...');
  
  try {
    // Intentar obtener información de la tabla preguntas
    const { data, error } = await supabase
      .from('preguntas')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error al acceder a tabla preguntas:', error.message);
      
      // Verificar si la tabla existe usando información del esquema
      const { data: tables, error: schemaError } = await supabase
        .rpc('get_table_info', { table_name: 'preguntas' })
        .single();
      
      if (schemaError) {
        console.log('❌ La tabla preguntas NO existe');
        console.log('🔍 Verificando tablas similares...');
        
        // Buscar tablas que podrían contener preguntas
        const { data: allTables } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public');
        
        console.log('📋 Tablas disponibles:');
        allTables?.forEach(table => {
          console.log(`  - ${table.table_name}`);
        });
      }
    } else {
      console.log('✅ Tabla preguntas existe');
      console.log('📊 Datos de ejemplo:', data);
      
      // Verificar columnas de la tabla preguntas
      const { data: columns } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_name', 'preguntas')
        .eq('table_schema', 'public');
      
      console.log('📋 Columnas en tabla preguntas:');
      columns?.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
    }
  } catch (err) {
    console.log('❌ Error general:', err.message);
  }
}

checkPreguntasTable();