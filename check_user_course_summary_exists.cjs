require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserCourseSummary() {
  console.log('🔍 Verificando si existe la vista user_course_summary...');
  
  try {
    const { data, error } = await supabase
      .from('user_course_summary')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ La vista user_course_summary NO existe:', error.message);
      return false;
    }
    
    console.log('✅ La vista user_course_summary existe y funciona');
    console.log('📊 Datos de ejemplo:', data);
    return true;
  } catch (err) {
    console.error('❌ Error al verificar la vista:', err.message);
    return false;
  }
}

checkUserCourseSummary()
  .then(exists => {
    if (!exists) {
      console.log('\n🚨 ACCIÓN REQUERIDA: Necesitas crear la vista user_course_summary');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });