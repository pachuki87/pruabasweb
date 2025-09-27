const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLessonMaterials() {
  const leccion6Id = '0b2dde26-092c-44a3-8694-875af52d7805';

  console.log('🔍 Buscando materiales para la lección 6...');

  const { data: materiales, error: materialesError } = await supabase
    .from('materiales')
    .select('*')
    .eq('leccion_id', leccion6Id);

  if (materialesError) {
    console.error('❌ Error al buscar materiales:', materialesError);
    return;
  }

  console.log('📚 Materiales actuales de la lección 6:');
  if (!materiales || materiales.length === 0) {
    console.log('   No hay materiales asociados a esta lección');
  } else {
    materiales.forEach((material, index) => {
      console.log(`   ${index + 1}. ${material.titulo}`);
      console.log(`      Tipo: ${material.tipo}`);
      console.log(`      URL: ${material.url}`);
      console.log(`      Orden: ${material.orden}`);
      console.log('');
    });
  }

  return materiales;
}

checkLessonMaterials().catch(console.error);