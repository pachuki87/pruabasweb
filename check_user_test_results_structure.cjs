require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTableStructure() {
  try {
    // Usar rpc para ejecutar SQL directo
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'user_test_results' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `
    });

    if (error) {
      console.log('❌ Error consultando estructura:', error.message);
      
      // Intentar método alternativo - describir tabla
      const { data: descData, error: descError } = await supabase.rpc('exec_sql', {
        query: "SELECT * FROM user_test_results LIMIT 0;"
      });
      
      if (descError) {
        console.log('❌ Error alternativo:', descError.message);
      } else {
        console.log('✅ Tabla existe pero estructura no disponible');
      }
      return;
    }

    if (data && data.length > 0) {
      console.log('📊 Estructura de user_test_results:');
      data.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
    } else {
      console.log('⚠️ No se encontraron columnas para user_test_results');
    }

  } catch (err) {
    console.log('💥 Error:', err.message);
  }
}

checkTableStructure();