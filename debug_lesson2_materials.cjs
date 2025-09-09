const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function debugLesson2Materials() {
  try {
    const lessonId = 'e4546103-526d-42ff-a98b-0db4828caa44';
    
    console.log('🔍 Verificando materiales para lección 2...');
    console.log('🆔 Lesson ID:', lessonId);
    
    // Verificar todos los materiales para esta lección específica
    const { data: materialesData, error: materialesError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lessonId);
    
    if (materialesError) {
      console.error('❌ Error:', materialesError);
      return;
    }
    
    console.log(`\n📊 Total materiales encontrados: ${materialesData?.length || 0}`);
    
    if (materialesData && materialesData.length > 0) {
      console.log('\n📋 Detalles de cada material:');
      materialesData.forEach((material, index) => {
        console.log(`\n   📄 Material ${index + 1}:`);
        console.log(`      🆔 ID: ${material.id}`);
        console.log(`      📝 Título: ${material.titulo}`);
        console.log(`      🔗 URL: ${material.url_archivo}`);
        console.log(`      📁 Tipo: ${material.tipo_material}`);
        console.log(`      📅 Creado: ${material.creado_en}`);
        
        // Extraer y decodificar nombre del archivo
        const fileName = material.url_archivo.split('/').pop() || material.url_archivo;
        const decodedFileName = decodeURIComponent(fileName);
        console.log(`      📎 Nombre archivo: ${decodedFileName}`);
      });
    } else {
      console.log('\n❌ No se encontraron materiales para esta lección');
    }
    
    // Verificar también si hay materiales duplicados por título o URL
    if (materialesData && materialesData.length > 1) {
      console.log('\n🔍 Verificando duplicados...');
      const titulos = materialesData.map(m => m.titulo);
      const urls = materialesData.map(m => m.url_archivo);
      
      const titulosDuplicados = titulos.filter((titulo, index) => titulos.indexOf(titulo) !== index);
      const urlsDuplicadas = urls.filter((url, index) => urls.indexOf(url) !== index);
      
      if (titulosDuplicados.length > 0) {
        console.log('⚠️ Títulos duplicados encontrados:', titulosDuplicados);
      }
      
      if (urlsDuplicadas.length > 0) {
        console.log('⚠️ URLs duplicadas encontradas:', urlsDuplicadas);
      }
      
      if (titulosDuplicados.length === 0 && urlsDuplicadas.length === 0) {
        console.log('✅ No se encontraron duplicados obvios');
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

debugLesson2Materials();