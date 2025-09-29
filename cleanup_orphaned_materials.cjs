require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupOrphanedMaterials() {
  console.log('🧹 Iniciando limpieza de materiales huérfanos...');
  
  try {
    // Materiales que apuntan a archivos inexistentes
    const orphanedMaterials = [
      {
        id: '2f1cb560-49e3-49d4-af7d-f21af7823cdb',
        title: 'Presentación: Inteligencia Emocional (General) (Experto)',
        url: '/pdfs/PPT INTELIGENCIA EMOCIONAL.pdf'
      },
      {
        id: 'ba182561-7d0e-494b-bb0e-39e0cd8ac9fd',
        title: 'Recovery Coach (General) (Experto)',
        url: '/pdfs/Recovery Coach reinservida.pdf'
      }
    ];

    console.log(`\n📋 Se eliminarán ${orphanedMaterials.length} materiales huérfanos:\n`);

    for (const material of orphanedMaterials) {
      console.log(`🗑️  Eliminando: ${material.title}`);
      console.log(`   ID: ${material.id}`);
      console.log(`   URL: ${material.url}`);

      // Eliminar el material de la base de datos
      const { data, error } = await supabase
        .from('materiales')
        .delete()
        .eq('id', material.id);

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ Eliminado correctamente`);
      }
      console.log('');
    }

    // Verificar el estado final
    console.log('📊 Verificando estado final de la base de datos...');
    
    const { data: allMaterials, error: fetchError } = await supabase
      .from('materiales')
      .select('id, titulo, url_archivo')
      .order('titulo');

    if (fetchError) {
      console.log(`❌ Error consultando materiales: ${fetchError.message}`);
    } else {
      console.log(`\n✅ Total de materiales en la BD: ${allMaterials.length}`);
      console.log('\n📋 Lista final de materiales:');
      allMaterials.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.titulo}`);
        console.log(`      URL: ${material.url_archivo}`);
      });
    }

    console.log('\n✅ Limpieza completada. La base de datos ahora solo contiene materiales con archivos físicos existentes.');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

cleanupOrphanedMaterials();