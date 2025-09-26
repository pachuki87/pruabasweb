
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateMaterialType(materialId, newType) {
  console.log('Connecting to Supabase...');
  const { data, error } = await supabase
    .from('materiales')
    .update({ tipo_material: newType })
    .eq('id', materialId);

  if (error) {
    console.error('Error updating material type:', error);
    return;
  }

  console.log('Material type updated successfully:', data);
}

const materialId = process.argv[2];
const newType = process.argv[3];

if (!materialId || !newType) {
  console.log('Please provide a material ID and a new type.');
  process.exit(1);
}

updateMaterialType(materialId, newType);
