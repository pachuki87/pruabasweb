require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCurrentRoutes() {
  try {
    const { data, error } = await supabase
      .from('materiales')
      .select('id, titulo, url_archivo')
      .order('id');

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('=== RUTAS ACTUALES EN LA BASE DE DATOS ===');
    data.forEach(material => {
      console.log(`ID: ${material.id}`);
      console.log(`Título: ${material.titulo}`);
      console.log(`URL: ${material.url_archivo}`);
      console.log('---');
    });

    console.log(`\nTotal de materiales: ${data.length}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCurrentRoutes();