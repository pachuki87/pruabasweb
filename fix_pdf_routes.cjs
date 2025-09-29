require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixPDFRoutes() {
  console.log('🔧 Iniciando corrección de rutas de PDFs...');
  
  try {
    // Correcciones específicas identificadas
    const corrections = [
      {
        oldUrl: '/pdfs/intervencion-Familiar-en-Adicciones-y.-Recovery-Mentoring-1.pdf',
        newUrl: '/pdfs/master-adicciones/intervencion-Familiar-en-Adicciones-y.-Recovery-Mentoring-1.pdf',
        description: 'Intervención Familiar y Recovery Mentoring (Máster)'
      },
      {
        oldUrl: '/pdfs/BLOQUE-1-TECNICO-EN-ADICCIONES.pdf',
        newUrl: '/pdfs/master-adicciones/BLOQUE-1-TECNICO-EN-ADICCIONES.pdf',
        description: 'Bloque 1: Técnico en Adicciones (Máster)'
      }
    ];

    console.log(`\n📋 Se corregirán ${corrections.length} rutas:\n`);

    for (const correction of corrections) {
      console.log(`🔄 Corrigiendo: ${correction.description}`);
      console.log(`   Desde: ${correction.oldUrl}`);
      console.log(`   Hacia: ${correction.newUrl}`);

      // Actualizar la ruta en la base de datos
      const { data, error } = await supabase
        .from('materiales')
        .update({ url_archivo: correction.newUrl })
        .eq('url_archivo', correction.oldUrl);

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ Actualizado correctamente`);
      }
      console.log('');
    }

    // Verificar materiales que apuntan a archivos inexistentes
    console.log('🔍 Verificando materiales con rutas problemáticas...');
    
    const problematicUrls = [
      '/pdfs/PPT INTELIGENCIA EMOCIONAL.pdf',
      '/pdfs/Recovery Coach reinservida.pdf'
    ];

    for (const url of problematicUrls) {
      const { data, error } = await supabase
        .from('materiales')
        .select('id, titulo, url_archivo')
        .eq('url_archivo', url);

      if (error) {
        console.log(`❌ Error consultando ${url}: ${error.message}`);
      } else if (data && data.length > 0) {
        console.log(`⚠️  Material problemático encontrado:`);
        console.log(`   ID: ${data[0].id}`);
        console.log(`   Título: ${data[0].titulo}`);
        console.log(`   URL: ${data[0].url_archivo}`);
        console.log(`   🗑️  Este material debería ser eliminado o corregido manualmente`);
      }
    }

    console.log('\n✅ Proceso de corrección completado.');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

fixPDFRoutes();