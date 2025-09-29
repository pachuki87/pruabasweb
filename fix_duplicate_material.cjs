require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDuplicateMaterial() {
  try {
    console.log('🔧 Corrigiendo material duplicado del Bloque 1...');
    
    // Actualizar el material con ID específico para usar la ruta correcta
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
    
    console.log('✅ Material actualizado:', updated);
    
    // Verificar si hay duplicados
    const { data: duplicates, error: dupError } = await supabase
      .from('materiales')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .ilike('titulo', '%Bloque 1%');
    
    if (dupError) {
      console.error('❌ Error buscando duplicados:', dupError);
      return;
    }
    
    console.log('📋 Materiales del Bloque 1 encontrados:');
    duplicates.forEach((material, index) => {
      console.log(`${index + 1}. ID: ${material.id}`);
      console.log(`   Título: ${material.titulo}`);
      console.log(`   URL: ${material.url_archivo}`);
      console.log('---');
    });
    
    // Si hay más de uno, eliminar el que tiene la ruta incorrecta
    if (duplicates.length > 1) {
      const toDelete = duplicates.find(m => 
        m.url_archivo.includes('Bloque-1-Tecnico-en-Adicciones.pdf') && 
        m.id !== 'af6eb09c-fdfc-4b02-859f-7b0e1ab3d0eb'
      );
      
      if (toDelete) {
        console.log(`🗑️ Eliminando duplicado con ID: ${toDelete.id}`);
        
        const { error: deleteError } = await supabase
          .from('materiales')
          .delete()
          .eq('id', toDelete.id);
        
        if (deleteError) {
          console.error('❌ Error eliminando duplicado:', deleteError);
        } else {
          console.log('✅ Duplicado eliminado exitosamente');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

fixDuplicateMaterial();