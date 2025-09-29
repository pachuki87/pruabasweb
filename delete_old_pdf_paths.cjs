require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteOldPDFPaths() {
  try {
    console.log('🗑️  Eliminando PDFs con rutas antiguas...');
    
    // Primero, obtener todos los materiales con rutas antiguas
    const { data: oldPDFs, error: fetchError } = await supabase
      .from('materiales')
      .select('*')
      .like('url_archivo', '/pdfs/%')
      .not('url_archivo', 'like', '/pdfs/experto-conductas-adictivas/%')
      .not('url_archivo', 'like', '/pdfs/master-adicciones/%');
    
    if (fetchError) {
      console.error('❌ Error al obtener PDFs antiguos:', fetchError);
      return;
    }
    
    console.log(`\n📊 PDFs con rutas antiguas encontrados: ${oldPDFs.length}`);
    
    if (oldPDFs.length === 0) {
      console.log('✅ No hay PDFs con rutas antiguas para eliminar');
      return;
    }
    
    // Mostrar los PDFs que se van a eliminar
    console.log('\n📋 PDFs que serán eliminados:');
    oldPDFs.forEach(pdf => {
      console.log(`  - ${pdf.titulo} (ID: ${pdf.id})`);
      console.log(`    Ruta: ${pdf.url_archivo}`);
      console.log(`    Curso: ${pdf.curso_id}`);
    });
    
    // Confirmar eliminación
    console.log('\n⚠️  ATENCIÓN: Se eliminarán estos registros de la base de datos');
    console.log('Procediendo con la eliminación...');
    
    // Eliminar los registros
    const idsToDelete = oldPDFs.map(pdf => pdf.id);
    
    const { error: deleteError } = await supabase
      .from('materiales')
      .delete()
      .in('id', idsToDelete);
    
    if (deleteError) {
      console.error('❌ Error al eliminar PDFs:', deleteError);
      return;
    }
    
    console.log(`\n✅ Eliminados ${oldPDFs.length} registros con rutas antiguas`);
    
    // Verificar el resultado
    const { data: remainingPDFs, error: verifyError } = await supabase
      .from('materiales')
      .select('count')
      .like('url_archivo', '/pdfs/%')
      .not('url_archivo', 'like', '/pdfs/experto-conductas-adictivas/%')
      .not('url_archivo', 'like', '/pdfs/master-adicciones/%');
    
    if (verifyError) {
      console.error('❌ Error al verificar:', verifyError);
      return;
    }
    
    console.log('\n🔍 Verificación final:');
    console.log(`PDFs con rutas antiguas restantes: ${remainingPDFs.length}`);
    
    // Mostrar estadísticas finales
    const { data: allPDFs, error: statsError } = await supabase
      .from('materiales')
      .select('*');
    
    if (!statsError) {
      const expertoPDFs = allPDFs.filter(p => p.url_archivo && p.url_archivo.startsWith('/pdfs/experto-conductas-adictivas/'));
      const masterPDFs = allPDFs.filter(p => p.url_archivo && p.url_archivo.startsWith('/pdfs/master-adicciones/'));
      
      console.log('\n📊 ESTADÍSTICAS FINALES:');
      console.log(`Total de materiales: ${allPDFs.length}`);
      console.log(`PDFs Experto en Conductas Adictivas: ${expertoPDFs.length}`);
      console.log(`PDFs Máster en Adicciones: ${masterPDFs.length}`);
    }
    
    console.log('\n✅ Limpieza completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la eliminación:', error);
  }
}

deleteOldPDFPaths();