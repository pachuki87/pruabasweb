require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUserProgressColumns() {
  try {
    console.log('🔍 Verificando columnas de user_course_progress...');
    
    // Consulta para obtener información de columnas
    const { data, error } = await supabase
      .rpc('exec_sql', {
        query: `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = 'user_course_progress' 
            AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      });
    
    if (error) {
      console.log('❌ Error con RPC, intentando método directo...');
      
      // Método alternativo: intentar hacer una consulta SELECT con LIMIT 0
      const { data: sampleData, error: selectError } = await supabase
        .from('user_course_progress')
        .select('*')
        .limit(1);
      
      if (selectError) {
        console.error('❌ Error:', selectError.message);
        return;
      }
      
      console.log('✅ Tabla user_course_progress existe');
      console.log('📊 Registros encontrados:', sampleData?.length || 0);
      
      if (sampleData && sampleData.length > 0) {
        console.log('📝 Columnas detectadas:', Object.keys(sampleData[0]));
      } else {
        console.log('⚠️  Tabla vacía, no se pueden detectar columnas desde datos');
      }
      
    } else {
      console.log('✅ Columnas de user_course_progress:');
      data.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
      });
    }
    
  } catch (err) {
    console.error('❌ Error general:', err.message);
  }
}

checkUserProgressColumns();