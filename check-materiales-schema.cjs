const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMaterialesSchema() {
  console.log('🔍 Verificando esquema de la tabla materiales...');

  // Get a sample record to see the actual columns
  const { data: sampleMaterial, error: sampleError } = await supabase
    .from('materiales')
    .select('*')
    .limit(1);

  if (sampleError) {
    console.error('❌ Error al obtener muestra:', sampleError);
    return;
  }

  if (sampleMaterial && sampleMaterial.length > 0) {
    console.log('📋 Columnas disponibles en la tabla materiales:');
    Object.keys(sampleMaterial[0]).forEach(column => {
      console.log(`   - ${column}`);
    });
    console.log('\n📝 Muestra de datos:');
    console.log(sampleMaterial[0]);
  } else {
    console.log('⚠️ No se encontraron registros en la tabla materiales');
  }
}

checkMaterialesSchema().catch(console.error);