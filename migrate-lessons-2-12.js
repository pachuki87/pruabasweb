import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeo de archivos de lecciones a IDs de lecciones
const lessonMapping = {
  'leccion-2-qu-es-una-adiccin-1-cuestionario.html': 2,
  'leccion-3-consecuencias-de-las-adicciones.html': 3,
  'leccion-4-criterios-para-diagnosticar-una-conducta-adictiva-segn-dsm-51-cuestionario.html': 4,
  'leccion-5-material-complementario-y-ejercicios2-cuestionarios.html': 5,
  'leccion-6-adicciones-comportamentales2-cuestionarios.html': 6,
  'leccion-7-la-familia.html': 7,
  'leccion-8-la-recada.html': 8,
  'leccion-9-nuevas-terapias-psicolgicas.html': 9,
  'leccion-10-terapia-integral-de-pareja1-cuestionario.html': 10,
  'leccion-11-psicologa-positiva1-cuestionario.html': 11,
  'leccion-12-mindfulness-aplicado-a-la-conducta-adictiva1-cuestionario.html': 12
};

// Función para limpiar y procesar el contenido HTML
function cleanHtmlContent(htmlContent) {
  // Remover scripts y estilos innecesarios
  let cleanContent = htmlContent
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Convertir rutas de imágenes a rutas relativas
  cleanContent = cleanContent.replace(
    /src=["']([^"']*\/images-leccion-\d+\/[^"']*)["']/gi,
    (match, imagePath) => {
      // Extraer solo la parte relevante de la ruta
      const pathParts = imagePath.split('/');
      const imagesFolderIndex = pathParts.findIndex(part => part.startsWith('images-leccion-'));
      if (imagesFolderIndex !== -1) {
        const relativePath = '/lessons/' + pathParts.slice(imagesFolderIndex).join('/');
        return `src="${relativePath}"`;
      }
      return match;
    }
  );

  return cleanContent;
}

// Función para leer el contenido de un archivo HTML
function readLessonFile(filename) {
  const filePath = path.join(__dirname, 'public', 'lessons', filename);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Archivo no encontrado: ${filename}`);
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`❌ Error leyendo archivo ${filename}:`, error.message);
    return null;
  }
}

// Función para actualizar una lección en Supabase
async function updateLessonInSupabase(lessonId, filename) {
  try {
    // Construir la URL del archivo
    const archivoUrl = `/lessons/${filename}`;
    
    const { data, error } = await supabase
      .from('lecciones')
      .update({ archivo_url: archivoUrl })
      .eq('orden', lessonId)
      .select();

    if (error) {
      console.error(`❌ Error actualizando lección ${lessonId}:`, error.message);
      return false;
    }

    if (data && data.length > 0) {
      console.log(`✅ Lección ${lessonId} actualizada exitosamente con archivo_url: ${archivoUrl}`);
      return true;
    } else {
      console.log(`⚠️  No se encontró la lección ${lessonId} en la base de datos`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error actualizando lección ${lessonId}:`, error.message);
    return false;
  }
}

// Función principal de migración
async function migrateLessons() {
  console.log('🚀 Iniciando migración de lecciones 2-12...');
  console.log('=' .repeat(50));

  const results = {
    successful: [],
    failed: [],
    notFound: []
  };

  for (const [filename, lessonId] of Object.entries(lessonMapping)) {
    console.log(`\n📖 Procesando: ${filename} (Lección ${lessonId})`);
    
    // Leer contenido del archivo
    const htmlContent = readLessonFile(filename);
    
    if (!htmlContent) {
      results.notFound.push({ filename, lessonId });
      continue;
    }

    console.log(`📄 Contenido leído: ${htmlContent.length} caracteres`);
    
    // Limpiar y actualizar el contenido del archivo HTML
    const cleanContent = cleanHtmlContent(htmlContent);
    
    // Escribir el contenido limpio de vuelta al archivo
    const filePath = path.join(__dirname, 'public', 'lessons', filename);
    fs.writeFileSync(filePath, cleanContent, 'utf8');
    console.log(`📝 Archivo ${filename} actualizado con contenido limpio`);
    
    // Actualizar la URL del archivo en Supabase
    const success = await updateLessonInSupabase(lessonId, filename);
    
    if (success) {
      results.successful.push({ filename, lessonId });
    } else {
      results.failed.push({ filename, lessonId });
    }

    // Pequeña pausa entre actualizaciones
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Mostrar resumen final
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RESUMEN DE MIGRACIÓN');
  console.log('=' .repeat(50));
  
  console.log(`\n✅ Exitosas (${results.successful.length}):`);
  results.successful.forEach(({ filename, lessonId }) => {
    console.log(`   - Lección ${lessonId}: ${filename}`);
  });

  if (results.failed.length > 0) {
    console.log(`\n❌ Fallidas (${results.failed.length}):`);
    results.failed.forEach(({ filename, lessonId }) => {
      console.log(`   - Lección ${lessonId}: ${filename}`);
    });
  }

  if (results.notFound.length > 0) {
    console.log(`\n⚠️  Archivos no encontrados (${results.notFound.length}):`);
    results.notFound.forEach(({ filename, lessonId }) => {
      console.log(`   - Lección ${lessonId}: ${filename}`);
    });
  }

  console.log(`\n🎯 Total procesado: ${Object.keys(lessonMapping).length} lecciones`);
  console.log(`✅ Exitosas: ${results.successful.length}`);
  console.log(`❌ Fallidas: ${results.failed.length}`);
  console.log(`⚠️  No encontradas: ${results.notFound.length}`);
  
  if (results.successful.length === Object.keys(lessonMapping).length) {
    console.log('\n🎉 ¡Migración completada exitosamente!');
  } else {
    console.log('\n⚠️  Migración completada con algunos errores.');
  }
}

// Ejecutar migración
migrateLessons().catch(error => {
  console.error('💥 Error fatal en la migración:', error);
  process.exit(1);
});