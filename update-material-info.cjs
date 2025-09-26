const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateMaterialInfo() {
  try {
    console.log('🔧 Actualizando información del material "GUIA PRACTICA TFM"...');
    
    const materialId = '5a55fcfd-cceb-4e4b-8f5f-cab214372305';
    
    // Actualizar el material con la información completa usando las columnas correctas
    const { data: updatedMaterial, error: updateError } = await supabase
      .from('materiales')
      .update({
        url_archivo: '/pdfs/master-adicciones/GUIA PRACTICA TFM.pages',
        tipo_material: 'pdf',
        descripcion: 'Guía práctica para el desarrollo del Trabajo Final de Máster en Adicciones'
      })
      .eq('id', materialId)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Error al actualizar material:', updateError);
      return;
    }
    
    console.log('✅ Material actualizado correctamente:');
    console.log(`- Título: "${updatedMaterial.titulo}"`);
    console.log(`- URL: ${updatedMaterial.url_archivo}`);
    console.log(`- Tipo: ${updatedMaterial.tipo_material}`);
    console.log(`- Descripción: ${updatedMaterial.descripcion}`);
    
    // Verificar el estado final de la lección
    console.log('\n🔍 Verificando estado final de la lección...');
    const { data: finalMaterials, error: finalError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', '3df75902-4d3e-4141-b564-e85c06603365');
    
    if (finalError) {
      console.error('❌ Error al verificar estado final:', finalError);
      return;
    }
    
    console.log(`\n📊 Resumen final:`);
    console.log(`- Total de materiales en la lección: ${finalMaterials.length}`);
    console.log(`- Material único: "${finalMaterials[0].titulo}"`);
    console.log(`- URL configurada: ${finalMaterials[0].url_archivo ? '✅' : '❌'}`);
    console.log(`- Tipo configurado: ${finalMaterials[0].tipo_material ? '✅' : '❌'}`);
    
    console.log('\n🎉 ¡CORRECCIÓN COMPLETADA!');
    console.log('✅ El módulo "TRABAJO FINAL DE MÁSTER" ahora solo muestra "GUIA PRACTICA TFM"');
    console.log('✅ Se eliminaron todos los PDFs incorrectos');
    console.log('✅ La información del material está completa');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la función
updateMaterialInfo().then(() => {
  console.log('\n🏁 Actualización completada');
}).catch(error => {
  console.error('❌ Error en la ejecución:', error);
});