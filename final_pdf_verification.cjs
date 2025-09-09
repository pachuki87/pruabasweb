require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function finalVerification() {
  try {
    // Obtener todos los materiales de la BD
    const { data: materials, error } = await supabase
      .from('materiales')
      .select('id, titulo, url_archivo')
      .order('id');

    if (error) {
      console.error('Error obteniendo materiales:', error);
      return;
    }

    console.log('=== VERIFICACIÓN FINAL DE RUTAS DE PDFs ===\n');

    let allCorrect = true;
    const problematicFiles = [];

    for (const material of materials) {
      const currentUrl = material.url_archivo;
      
      // Verificar si el archivo existe físicamente
      const physicalPath = path.join('public', currentUrl.replace('/pdfs/', 'pdfs/'));
      const fileExists = fs.existsSync(physicalPath);
      
      console.log(`✓ ${material.titulo}`);
      console.log(`  URL: ${currentUrl}`);
      console.log(`  Existe: ${fileExists ? '✅ SÍ' : '❌ NO'}`);
      
      if (!fileExists) {
        allCorrect = false;
        problematicFiles.push({
          id: material.id,
          titulo: material.titulo,
          url: currentUrl
        });
      }
      
      console.log('');
    }
    
    console.log('=== RESUMEN ===');
    console.log(`Total de materiales: ${materials.length}`);
    console.log(`Archivos correctos: ${materials.length - problematicFiles.length}`);
    console.log(`Archivos problemáticos: ${problematicFiles.length}`);
    
    if (problematicFiles.length > 0) {
      console.log('\n=== ARCHIVOS PROBLEMÁTICOS ===');
      problematicFiles.forEach(file => {
        console.log(`- ${file.titulo}: ${file.url}`);
      });
    }
    
    if (allCorrect) {
      console.log('\n🎉 ¡Todos los archivos PDF están correctamente vinculados!');
    } else {
      console.log('\n⚠️  Hay archivos que necesitan corrección manual.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

finalVerification();