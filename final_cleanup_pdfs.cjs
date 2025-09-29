require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalCleanupPDFs() {
  try {
    console.log('🧹 Limpieza final de PDFs con rutas desorganizadas...');
    
    // Obtener TODOS los materiales
    const { data: allMaterials, error: fetchError } = await supabase
      .from('materiales')
      .select('*')
      .order('titulo');
    
    if (fetchError) {
      console.error('❌ Error al obtener materiales:', fetchError);
      return;
    }
    
    console.log(`\n📊 Total de materiales: ${allMaterials.length}`);
    
    // Identificar PDFs que NO están en carpetas organizadas
    const pdfsSinOrganizar = allMaterials.filter(m => 
      m.url_archivo && 
      m.url_archivo.startsWith('/pdfs/') && 
      !m.url_archivo.startsWith('/pdfs/experto-conductas-adictivas/') &&
      !m.url_archivo.startsWith('/pdfs/master-adicciones/')
    );
    
    console.log(`\n🗑️  PDFs sin organizar encontrados: ${pdfsSinOrganizar.length}`);
    
    if (pdfsSinOrganizar.length === 0) {
      console.log('✅ Todos los PDFs ya están organizados correctamente');
      return;
    }
    
    // Mostrar los PDFs que se van a eliminar
    console.log('\n📋 PDFs que serán eliminados (rutas desorganizadas):');
    pdfsSinOrganizar.forEach((pdf, index) => {
      console.log(`${index + 1}. ${pdf.titulo} (ID: ${pdf.id})`);
      console.log(`   Ruta: ${pdf.url_archivo}`);
      console.log(`   Curso: ${pdf.curso_id}`);
      console.log('');
    });
    
    // Eliminar los registros
    console.log('⚠️  ELIMINANDO registros con rutas desorganizadas...');
    
    const idsToDelete = pdfsSinOrganizar.map(pdf => pdf.id);
    
    const { error: deleteError } = await supabase
      .from('materiales')
      .delete()
      .in('id', idsToDelete);
    
    if (deleteError) {
      console.error('❌ Error al eliminar PDFs:', deleteError);
      return;
    }
    
    console.log(`\n✅ Eliminados ${pdfsSinOrganizar.length} registros con rutas desorganizadas`);
    
    // Verificación final
    const { data: finalMaterials, error: finalError } = await supabase
      .from('materiales')
      .select('*');
    
    if (finalError) {
      console.error('❌ Error en verificación final:', finalError);
      return;
    }
    
    const expertoPDFs = finalMaterials.filter(m => 
      m.url_archivo && m.url_archivo.startsWith('/pdfs/experto-conductas-adictivas/')
    );
    
    const masterPDFs = finalMaterials.filter(m => 
      m.url_archivo && m.url_archivo.startsWith('/pdfs/master-adicciones/')
    );
    
    const remainingUnorganized = finalMaterials.filter(m => 
      m.url_archivo && 
      m.url_archivo.startsWith('/pdfs/') && 
      !m.url_archivo.startsWith('/pdfs/experto-conductas-adictivas/') &&
      !m.url_archivo.startsWith('/pdfs/master-adicciones/')
    );
    
    console.log('\n📊 ESTADÍSTICAS FINALES:');
    console.log(`Total de materiales: ${finalMaterials.length}`);
    console.log(`PDFs Experto en Conductas Adictivas: ${expertoPDFs.length}`);
    console.log(`PDFs Máster en Adicciones: ${masterPDFs.length}`);
    console.log(`PDFs sin organizar restantes: ${remainingUnorganized.length}`);
    
    if (remainingUnorganized.length > 0) {
      console.log('\n⚠️  PDFs sin organizar que aún quedan:');
      remainingUnorganized.forEach(pdf => {
        console.log(`  - ${pdf.titulo}: ${pdf.url_archivo}`);
      });
    } else {
      console.log('\n🎉 ¡PERFECTO! Todos los PDFs están organizados correctamente');
    }
    
    console.log('\n✅ Limpieza final completada');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza final:', error);
  }
}

finalCleanupPDFs();