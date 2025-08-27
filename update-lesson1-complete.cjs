const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateLesson1WithCompleteContent() {
  try {
    console.log('🔄 Actualizando lección 1 con contenido completo del archivo HTML...');
    
    // Leer el archivo HTML completo
    const htmlFilePath = path.join(__dirname, 'public', 'lessons', 'leccion-1-qu-significa-ser-adicto-.html');
    const fullHtmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    
    // Extraer solo el contenido de la lección (dentro de .lesson-content)
    const contentMatch = fullHtmlContent.match(/<div class="lesson-content"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/body>/i);
    
    if (!contentMatch) {
      console.error('❌ No se pudo extraer el contenido de la lección del archivo HTML');
      return;
    }
    
    const lessonContent = contentMatch[1].trim();
    
    console.log('📄 Contenido extraído del archivo HTML:');
    console.log('Longitud del contenido:', lessonContent.length, 'caracteres');
    console.log('Primeros 200 caracteres:', lessonContent.substring(0, 200) + '...');
    
    // Buscar la lección 1 del curso "Experto en Conductas Adictivas"
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (cursoError || !curso) {
      console.error('❌ Error encontrando el curso:', cursoError);
      return;
    }
    
    console.log('📚 Curso encontrado con ID:', curso.id);
    
    // Buscar la lección 1
    const { data: leccion, error: leccionError } = await supabase
      .from('lecciones')
      .select('id, titulo, contenido_html')
      .eq('curso_id', curso.id)
      .eq('orden', 1)
      .single();
    
    if (leccionError || !leccion) {
      console.error('❌ Error encontrando la lección 1:', leccionError);
      return;
    }
    
    console.log('📖 Lección 1 encontrada:');
    console.log('- ID:', leccion.id);
    console.log('- Título:', leccion.titulo);
    console.log('- Contenido actual (primeros 100 chars):', leccion.contenido_html?.substring(0, 100) + '...');
    
    // Actualizar la lección con el contenido completo
    const { data: updateResult, error: updateError } = await supabase
      .from('lecciones')
      .update({ 
        contenido_html: lessonContent,
        actualizado_en: new Date().toISOString()
      })
      .eq('id', leccion.id)
      .select();
    
    if (updateError) {
      console.error('❌ Error actualizando la lección:', updateError);
      return;
    }
    
    console.log('✅ Lección 1 actualizada exitosamente!');
    console.log('📊 Resultado de la actualización:', updateResult);
    
    // Verificar la actualización
    const { data: verificacion, error: verifyError } = await supabase
      .from('lecciones')
      .select('contenido_html')
      .eq('id', leccion.id)
      .single();
    
    if (verifyError) {
      console.error('❌ Error verificando la actualización:', verifyError);
      return;
    }
    
    console.log('🔍 Verificación:');
    console.log('- Longitud del contenido actualizado:', verificacion.contenido_html?.length, 'caracteres');
    console.log('- Primeros 200 caracteres del contenido actualizado:', verificacion.contenido_html?.substring(0, 200) + '...');
    
    console.log('\n🎉 ¡Proceso completado! La lección 1 ahora tiene el contenido completo del archivo HTML.');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la función
updateLesson1WithCompleteContent();