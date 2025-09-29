const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkVideoMaterials() {
  console.log('Conectando a Supabase...');
  
  try {
    // Buscar todos los materiales que contengan extensiones de video
    const { data: materials, error } = await supabase
      .from('materiales')
      .select('*')
      .or('url_archivo.ilike.%.mp4,url_archivo.ilike.%.avi,url_archivo.ilike.%.mov,url_archivo.ilike.%.wmv,url_archivo.ilike.%.flv,url_archivo.ilike.%.webm,url_archivo.ilike.%.mkv');
    
    if (error) {
      console.error('Error al buscar materiales:', error);
      return;
    }
    
    console.log(`\nEncontrados ${materials.length} materiales con extensiones de video:`);
    
    materials.forEach(material => {
      console.log(`\n- ID: ${material.id}`);
      console.log(`  Título: ${material.titulo}`);
      console.log(`  Tipo: ${material.tipo_material}`);
      console.log(`  URL: ${material.url_archivo}`);
      console.log(`  Lección ID: ${material.leccion_id}`);
      
      // Verificar si el tipo coincide con la extensión
      const isVideoFile = /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i.test(material.url_archivo);
      const isVideoType = material.tipo_material === 'video';
      
      if (isVideoFile && !isVideoType) {
        console.log(`  ⚠️  PROBLEMA: Archivo de video con tipo '${material.tipo_material}' (debería ser 'video')`);
      } else if (isVideoFile && isVideoType) {
        console.log(`  ✅ CORRECTO: Archivo de video con tipo correcto`);
      }
    });
    
    // También buscar materiales con tipo 'video' para verificar
    const { data: videoMaterials, error: videoError } = await supabase
      .from('materiales')
      .select('*')
      .eq('tipo_material', 'video');
    
    if (videoError) {
      console.error('Error al buscar materiales de video:', videoError);
      return;
    }
    
    console.log(`\n\nMateriales con tipo 'video' en la base de datos: ${videoMaterials.length}`);
    
    videoMaterials.forEach(material => {
      console.log(`\n- ${material.titulo}`);
      console.log(`  URL: ${material.url_archivo}`);
      console.log(`  Lección ID: ${material.leccion_id}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkVideoMaterials();