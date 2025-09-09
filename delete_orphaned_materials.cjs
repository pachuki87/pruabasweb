require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteOrphanedMaterials() {
  try {
    console.log('🗑️ ELIMINANDO MATERIALES HUÉRFANOS');
    console.log('=' .repeat(40));
    
    // IDs de materiales huérfanos identificados
    const orphanedIds = [
      'ce009d75-ef06-4d2f-8a45-7fa6cf459c37', // Informe: Educación Emocional (ruta antigua)
      '630671f0-71b5-44c1-bf2e-f38a9da13fd8', // Manual MATRIX (master-adicciones inexistente)
      '172e743d-07da-4028-ae31-25a11ee8a535', // Manual MATRIX (Experto, ruta general)
      'ae3bf56c-0677-4cf2-b2d6-54cfe5ee2112'  // Manual MATRIX (Máster, ruta general)
    ];
    
    console.log(`📊 Materiales a eliminar: ${orphanedIds.length}`);
    
    // Obtener información de los materiales antes de eliminar
    const { data: materialsToDelete, error: fetchError } = await supabase
      .from('materiales')
      .select('*')
      .in('id', orphanedIds);
    
    if (fetchError) {
      console.error('❌ Error al obtener materiales:', fetchError);
      return;
    }
    
    console.log('\n🔍 MATERIALES A ELIMINAR:');
    materialsToDelete.forEach((material, index) => {
      console.log(`   ${index + 1}. ${material.titulo}`);
      console.log(`      📂 Ruta: ${material.url_archivo}`);
      console.log(`      🆔 ID: ${material.id}`);
      console.log('');
    });
    
    // Eliminar materiales huérfanos
    const { error: deleteError } = await supabase
      .from('materiales')
      .delete()
      .in('id', orphanedIds);
    
    if (deleteError) {
      console.error('❌ Error al eliminar materiales:', deleteError);
      return;
    }
    
    console.log('✅ Materiales huérfanos eliminados exitosamente');
    
    // Verificar el resultado
    const { data: remainingMaterials, error: countError } = await supabase
      .from('materiales')
      .select('id')
      .eq('tipo_material', 'pdf');
    
    if (countError) {
      console.error('❌ Error al contar materiales restantes:', countError);
      return;
    }
    
    console.log(`\n📊 RESULTADO:`);
    console.log(`   📋 Materiales restantes en BD: ${remainingMaterials.length}`);
    console.log(`   🗑️ Materiales eliminados: ${orphanedIds.length}`);
    
  } catch (error) {
    console.error('❌ Error en la eliminación:', error);
  }
}

deleteOrphanedMaterials();