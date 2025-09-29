require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceUpdateMaterial() {
  try {
    console.log('🔧 Forzando actualización del material del Bloque 1...');
    
    // Primero verificar el estado actual
    const { data: current, error: currentError } = await supabase
      .from('materiales')
      .select('*')
      .eq('id', 'af6eb09c-fdfc-4b02-859f-7b0e1ab3d0eb');
    
    if (currentError) {
      console.error('❌ Error obteniendo estado actual:', currentError);
      return;
    }
    
    console.log('📋 Estado actual del material:');
    console.log(current[0]);
    
    // Actualizar con valores específicos
    const updateData = {
      url_archivo: '/pdfs/master-adicciones/BLOQUE 1 TECNICO EN ADICIONES.pdf',
      titulo: 'Bloque 1: Técnico en Adicciones',
      descripcion: 'Material fundamental sobre técnicas básicas en el tratamiento de adicciones'
    };
    
    console.log('🔄 Aplicando actualización:', updateData);
    
    const { data: updated, error: updateError } = await supabase
      .from('materiales')
      .update(updateData)
      .eq('id', 'af6eb09c-fdfc-4b02-859f-7b0e1ab3d0eb')
      .select();
    
    if (updateError) {
      console.error('❌ Error en actualización:', updateError);
      return;
    }
    
    console.log('✅ Actualización aplicada. Resultado:', updated);
    
    // Verificar nuevamente
    const { data: final, error: finalError } = await supabase
      .from('materiales')
      .select('*')
      .eq('id', 'af6eb09c-fdfc-4b02-859f-7b0e1ab3d0eb');
    
    if (finalError) {
      console.error('❌ Error verificando resultado final:', finalError);
    } else {
      console.log('📋 Estado final verificado:');
      console.log(final[0]);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

forceUpdateMaterial();