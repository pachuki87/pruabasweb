require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMaterialesStructure() {
  try {
    console.log('🔍 VERIFICANDO ESTRUCTURA DE LA TABLA MATERIALES\n');
    
    // Obtener algunos materiales para ver la estructura
    const { data: materials, error: materialsError } = await supabase
      .from('materiales')
      .select('*')
      .limit(3);
    
    if (materialsError) {
      console.error('❌ Error al obtener materiales:', materialsError);
      return;
    }
    
    console.log('📚 ESTRUCTURA DE MATERIALES:');
    if (materials && materials.length > 0) {
      console.log('📋 Columnas disponibles:');
      Object.keys(materials[0]).forEach(key => {
        console.log(`   - ${key}: ${typeof materials[0][key]} (${materials[0][key]})`);
      });
      
      console.log('\n📊 EJEMPLOS DE MATERIALES:');
      materials.forEach((material, index) => {
        console.log(`${index + 1}. Material:`);
        Object.entries(material).forEach(([key, value]) => {
          console.log(`   ${key}: ${value}`);
        });
        console.log('');
      });
    } else {
      console.log('❌ No se encontraron materiales');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkMaterialesStructure();