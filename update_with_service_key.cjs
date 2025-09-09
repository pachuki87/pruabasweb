require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY no encontrada en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function updateWithServiceKey() {
  try {
    console.log('🔧 Actualizando material con SERVICE_ROLE_KEY...');
    
    // Verificar estado actual
    const { data: current, error: currentError } = await supabase
      .from('materiales')
      .select('*')
      .eq('id', 'af6eb09c-fdfc-4b02-859f-7b0e1ab3d0eb');
    
    if (currentError) {
      console.error('❌ Error obteniendo estado actual:', currentError);
      return;
    }
    
    console.log('📋 Estado actual:', current[0]);
    
    // Actualizar con SERVICE_ROLE_KEY
    const { data: updated, error: updateError } = await supabase
      .from('materiales')
      .update({
        url_archivo: '/pdfs/master-adicciones/BLOQUE 1 TECNICO EN ADICIONES.pdf',
        titulo: 'Bloque 1: Técnico en Adicciones',
        descripcion: 'Material fundamental sobre técnicas básicas en el tratamiento de adicciones'
      })
      .eq('id', 'af6eb09c-fdfc-4b02-859f-7b0e1ab3d0eb')
      .select();
    
    if (updateError) {
      console.error('❌ Error en actualización:', updateError);
      return;
    }
    
    console.log('✅ Material actualizado exitosamente:', updated);
    
    // Verificar resultado final
    const { data: final, error: finalError } = await supabase
      .from('materiales')
      .select('*')
      .eq('id', 'af6eb09c-fdfc-4b02-859f-7b0e1ab3d0eb');
    
    if (finalError) {
      console.error('❌ Error verificando resultado:', finalError);
    } else {
      console.log('📋 Estado final:');
      console.log(`   Título: ${final[0].titulo}`);
      console.log(`   URL: ${final[0].url_archivo}`);
      console.log(`   Descripción: ${final[0].descripcion}`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

updateWithServiceKey();