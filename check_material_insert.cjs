require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMaterial() {
  try {
    console.log('🔍 Verificando material con ID: af6eb09c-fdfc-4b02-859f-7b0e1ab3d0eb');
    
    // Buscar por ID específico
    const { data: byId, error: errorId } = await supabase
      .from('materiales')
      .select('*')
      .eq('id', 'af6eb09c-fdfc-4b02-859f-7b0e1ab3d0eb');
    
    if (errorId) {
      console.error('❌ Error buscando por ID:', errorId);
    } else {
      console.log('📋 Material por ID:', byId);
    }
    
    // Buscar por URL similar
    const { data: byUrl, error: errorUrl } = await supabase
      .from('materiales')
      .select('*')
      .ilike('url_archivo', '%BLOQUE-1-TECNICO-EN-ADICCIONES%');
    
    if (errorUrl) {
      console.error('❌ Error buscando por URL:', errorUrl);
    } else {
      console.log('📋 Materiales con URL similar:', byUrl);
    }
    
    // Buscar todos los materiales del curso Master
    const { data: allMaster, error: errorMaster } = await supabase
      .from('materiales')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('titulo');
    
    if (errorMaster) {
      console.error('❌ Error buscando materiales del Master:', errorMaster);
    } else {
      console.log('📚 Todos los materiales del Master en Adicciones:');
      allMaster.forEach((material, index) => {
        console.log(`${index + 1}. ${material.titulo} - ${material.url_archivo}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkMaterial();