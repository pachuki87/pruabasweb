require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyFinalMaterials() {
  try {
    console.log('🔍 Verificando estado final de materiales del Master en Adicciones...');
    
    // Obtener todos los materiales del curso Master
    const { data: materials, error } = await supabase
      .from('materiales')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('titulo');
    
    if (error) {
      console.error('❌ Error obteniendo materiales:', error);
      return;
    }
    
    console.log(`📚 Total de materiales encontrados: ${materials.length}`);
    console.log('\n📋 Lista de materiales:');
    
    materials.forEach((material, index) => {
      console.log(`\n${index + 1}. ${material.titulo}`);
      console.log(`   ID: ${material.id}`);
      console.log(`   URL: ${material.url_archivo}`);
      console.log(`   Tipo: ${material.tipo_material}`);
      console.log(`   Descripción: ${material.descripcion || 'Sin descripción'}`);
      
      // Verificar si es el material que acabamos de actualizar
      if (material.id === 'af6eb09c-fdfc-4b02-859f-7b0e1ab3d0eb') {
        console.log('   ✅ MATERIAL ACTUALIZADO CORRECTAMENTE');
      }
    });
    
    // Buscar duplicados por título
    const titleCounts = {};
    materials.forEach(material => {
      const baseTitle = material.titulo.toLowerCase().replace(/\s*\([^)]*\)\s*/g, '').trim();
      titleCounts[baseTitle] = (titleCounts[baseTitle] || 0) + 1;
    });
    
    console.log('\n🔍 Verificando duplicados:');
    const duplicates = Object.entries(titleCounts).filter(([title, count]) => count > 1);
    
    if (duplicates.length > 0) {
      console.log('⚠️ Posibles duplicados encontrados:');
      duplicates.forEach(([title, count]) => {
        console.log(`   - "${title}": ${count} ocurrencias`);
      });
    } else {
      console.log('✅ No se encontraron duplicados');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verifyFinalMaterials();