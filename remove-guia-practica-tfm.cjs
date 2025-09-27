const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeGuiaPracticaTFM() {
  const leccion6Id = '0b2dde26-092c-44a3-8694-875af52d7805';

  console.log('🔍 Buscando "GUIA PRACTICA TFM.pages" para eliminar...');

  // Find the specific material
  const { data: materials, error: materialsError } = await supabase
    .from('materiales')
    .select('*')
    .eq('leccion_id', leccion6Id);

  if (materialsError) {
    console.error('❌ Error al buscar materiales:', materialsError);
    return;
  }

  const guiaTFM = materials.find(material =>
    material.titulo === 'GUIA PRACTICA TFM' ||
    material.url_archivo?.includes('GUIA PRACTICA TFM.pages')
  );

  if (!guiaTFM) {
    console.log('❌ No se encontró el material "GUIA PRACTICA TFM.pages"');
    console.log('📚 Materiales actuales:');
    materials.forEach(material => {
      console.log(`   - ${material.titulo}`);
    });
    return;
  }

  console.log('🗑️ Eliminando "GUIA PRACTICA TFM.pages"...');
  console.log(`   ID: ${guiaTFM.id}`);
  console.log(`   Título: ${guiaTFM.titulo}`);
  console.log(`   URL: ${guiaTFM.url_archivo}`);

  // Delete the material
  const { error: deleteError } = await supabase
    .from('materiales')
    .delete()
    .eq('id', guiaTFM.id);

  if (deleteError) {
    console.error('❌ Error al eliminar el material:', deleteError);
    return;
  }

  console.log('✅ "GUIA PRACTICA TFM.pages" eliminado exitosamente');

  // Show remaining materials
  console.log('\n📚 Materiales restantes en la lección 6:');
  const { data: remainingMaterials, error: remainingError } = await supabase
    .from('materiales')
    .select('titulo, tipo_material, url_archivo')
    .eq('leccion_id', leccion6Id)
    .order('titulo');

  if (remainingError) {
    console.error('❌ Error al obtener materiales restantes:', remainingError);
    return;
  }

  remainingMaterials.forEach((material, index) => {
    console.log(`   ${index + 1}. ${material.titulo}`);
    console.log(`      Tipo: ${material.tipo_material}`);
    console.log(`      URL: ${material.url_archivo}`);
    console.log('');
  });
}

removeGuiaPracticaTFM().catch(console.error);