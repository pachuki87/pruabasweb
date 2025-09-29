const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSpecificGuide() {
  const leccion6Id = '0b2dde26-092c-44a3-8694-875af52d7805';

  console.log('🔍 Verificando materiales específicos de la lección 6...');

  const { data: allMaterials, error: allMaterialsError } = await supabase
    .from('materiales')
    .select('titulo, url_archivo, tipo_material, descripcion')
    .eq('leccion_id', leccion6Id);

  if (allMaterialsError) {
    console.error('❌ Error al obtener materiales:', allMaterialsError);
    return;
  }

  console.log('📚 Materiales detallados de la lección 6:');
  allMaterials.forEach((material, index) => {
    console.log(`\n${index + 1}. ${material.titulo}`);
    console.log(`   Tipo: ${material.tipo_material}`);
    console.log(`   URL: ${material.url_archivo}`);
    if (material.descripcion) {
      console.log(`   Descripción: ${material.descripcion}`);
    }
  });

  // Check for Valentín Escudero guide specifically
  const valentinGuide = allMaterials.find(material =>
    material.titulo.toLowerCase().includes('valentin') ||
    (material.url_archivo && material.url_archivo.toLowerCase().includes('valentin'))
  );

  if (valentinGuide) {
    console.log('\n✅ Se encontró la guía de Valentín Escudero:');
    console.log(valentinGuide);
  } else {
    console.log('\n❌ No se encontró la guía específica de Valentín Escudero');
    console.log('📝 Se necesita añadir: "Guía Práctica para la Intervención Familiar - Valentín Escudero 2023"');
  }
}

checkSpecificGuide().catch(console.error);