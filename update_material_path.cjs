require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateMaterialPath() {
  try {
    console.log('🔧 Actualizando ruta del material del Bloque 1...');
    
    // Actualizar el material para usar la ruta correcta con espacios
    const { data: updated, error: updateError } = await supabase
      .from('materiales')
      .update({
        url_archivo: '/pdfs/master-adicciones/BLOQUE 1 TECNICO EN ADICIONES.pdf',
        titulo: 'Bloque 1: Técnico en Adicciones'
      })
      .eq('id', 'af6eb09c-fdfc-4b02-859f-7b0e1ab3d0eb')
      .select();
    
    if (updateError) {
      console.error('❌ Error actualizando material:', updateError);
      return;
    }
    
    console.log('✅ Material actualizado exitosamente:', updated);
    
    // Verificar el estado final
    const { data: final, error: finalError } = await supabase
      .from('materiales')
      .select('*')
      .eq('id', 'af6eb09c-fdfc-4b02-859f-7b0e1ab3d0eb');
    
    if (finalError) {
      console.error('❌ Error verificando estado final:', finalError);
    } else {
      console.log('📋 Estado final del material:');
      console.log(`   ID: ${final[0].id}`);
      console.log(`   Título: ${final[0].titulo}`);
      console.log(`   URL: ${final[0].url_archivo}`);
      console.log(`   Curso ID: ${final[0].curso_id}`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

updateMaterialPath();