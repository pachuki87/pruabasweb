require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function finalCleanup() {
  try {
    console.log('🧹 Limpieza final de duplicados...');
    
    // Eliminar el Bloque 1 con URL incorrecta (con guiones)
    console.log('🗑️ Eliminando Bloque 1 con URL incorrecta (con guiones)...');
    const { error: deleteError } = await supabase
      .from('materiales')
      .delete()
      .eq('id', '899cb720-ee03-48b8-bc59-b6302a8d710f');
    
    if (deleteError) {
      console.error('❌ Error eliminando material:', deleteError);
    } else {
      console.log('✅ Material con URL incorrecta eliminado');
    }
    
    // Eliminar duplicado de Intervención Familiar (mantener solo uno)
    console.log('\n🗑️ Eliminando duplicado de Intervención Familiar...');
    const { error: deleteError2 } = await supabase
      .from('materiales')
      .delete()
      .eq('id', '03a4c464-e812-4745-8773-fd7be5be58a1');
    
    if (deleteError2) {
      console.error('❌ Error eliminando duplicado:', deleteError2);
    } else {
      console.log('✅ Duplicado de Intervención Familiar eliminado');
    }
    
    // Verificación final
    console.log('\n📊 Estado final de materiales del Master en Adicciones:');
    const { data: finalMaterials, error: finalError } = await supabase
      .from('materiales')
      .select('id, titulo, url_archivo, descripcion')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('titulo');
    
    if (finalError) {
      console.error('❌ Error en verificación final:', finalError);
    } else {
      console.log(`\n✅ Total de materiales: ${finalMaterials.length}`);
      console.log('\n📋 Lista final de materiales:');
      finalMaterials.forEach((material, index) => {
        console.log(`\n${index + 1}. ${material.titulo}`);
        console.log(`   ID: ${material.id}`);
        console.log(`   URL: ${material.url_archivo}`);
        console.log(`   Descripción: ${material.descripcion || 'Sin descripción'}`);
        
        // Marcar el material que se actualizó
        if (material.id === 'af6eb09c-fdfc-4b02-859f-7b0e1ab3d0eb') {
          console.log('   🎯 MATERIAL ACTUALIZADO CORRECTAMENTE');
        }
      });
    }
    
    console.log('\n🎉 Limpieza completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

finalCleanup();