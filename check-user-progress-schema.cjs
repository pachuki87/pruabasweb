const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkUserProgressSchema() {
  try {
    console.log('🔍 Verificando estructura de user_course_progress...');
    
    // Consultar la estructura de la tabla usando information_schema
    const { data: columns, error: schemaError } = await supabase
      .rpc('execute_sql', {
        query: `
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns 
          WHERE table_name = 'user_course_progress' 
          AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      });

    if (schemaError) {
      console.error('❌ Error consultando esquema:', schemaError);
      
      // Método alternativo: consultar datos existentes
      console.log('🔄 Intentando método alternativo...');
      const { data: sampleData, error: dataError } = await supabase
        .from('user_course_progress')
        .select('*')
        .limit(1);
      
      if (dataError) {
        console.error('❌ Error consultando datos:', dataError);
        return;
      }
      
      if (sampleData && sampleData.length > 0) {
        console.log('📋 Columnas encontradas en los datos:');
        Object.keys(sampleData[0]).forEach(column => {
          console.log(`  - ${column}`);
        });
      } else {
        console.log('⚠️ No hay datos en user_course_progress');
      }
      return;
    }

    console.log('📋 Estructura de user_course_progress:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // También verificar si hay datos
    const { data: count, error: countError } = await supabase
      .from('user_course_progress')
      .select('*', { count: 'exact', head: true });
    
    if (!countError) {
      console.log(`\n📊 Total de registros: ${count?.length || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkUserProgressSchema();