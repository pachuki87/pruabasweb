const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkMaterialesLeccion5() {
  try {
    console.log('🔍 Checking materiales for lesson 5...');
    
    // First, get lesson 5 info
    const { data: lessonData, error: lessonError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('orden', 5)
      .single();
    
    if (lessonError) {
      console.error('❌ Error getting lesson 5:', lessonError);
      return;
    }
    
    console.log('📚 Lesson 5 found:', lessonData);
    
    // Get materiales for this lesson
    const { data: materialesData, error: materialesError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lessonData.id);
    
    if (materialesError) {
      console.error('❌ Error getting materiales:', materialesError);
      return;
    }
    
    console.log('📄 Materiales found:', materialesData);
    
    // Check if files exist in the expected locations
    for (const material of materialesData) {
      const fileName = material.url_archivo.split('/').pop();
      const decodedFileName = decodeURIComponent(fileName);
      console.log(`\n🔍 Checking material: ${material.titulo}`);
      console.log(`   URL: ${material.url_archivo}`);
      console.log(`   File name: ${fileName}`);
      console.log(`   Decoded: ${decodedFileName}`);
      
      // Expected paths
      const expectedPath1 = `/pdfs/master-adicciones/${encodeURIComponent(decodedFileName)}`;
      const expectedPath2 = `/pdfs/master-adicciones/5) PSICOLOGIA ADICCIONES/${encodeURIComponent(decodedFileName)}`;
      
      console.log(`   Expected path 1: ${expectedPath1}`);
      console.log(`   Expected path 2: ${expectedPath2}`);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

checkMaterialesLeccion5();
