
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getAllMaterials() {
  console.log('Connecting to Supabase...');
  const { data, error } = await supabase.from('materiales').select('*');

  if (error) {
    console.error('Error fetching materials:', error);
    return;
  }

  console.log('All materials:');
  console.log(JSON.stringify(data, null, 2));
}

getAllMaterials();
