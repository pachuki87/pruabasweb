const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateLesson2Content() {
  try {
    console.log('Actualizando contenido de la lección 2...');
    
    // Leer el archivo HTML
    const htmlPath = path.join(__dirname, 'public', 'lessons', 'leccion-2-terapia-cognitiva-drogodependencias.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Extraer solo el contenido del body para la base de datos
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1].trim() : htmlContent;
    
    // Actualizar la lección en la base de datos
    const { data, error } = await supabase
      .from('lecciones')
      .update({
        contenido_html: bodyContent
      })
      .eq('id', '172b9f29-17dd-4c7f-8a98-8c3989e296d8')
      .select();
    
    if (error) {
      console.error('Error al actualizar la lección:', error);
      return;
    }
    
    console.log('✅ Lección 2 actualizada exitosamente');
    console.log('Datos actualizados:', data);
    
    // Verificar la actualización
    const { data: verifyData, error: verifyError } = await supabase
      .from('lecciones')
      .select('id, titulo, contenido_html')
      .eq('id', '172b9f29-17dd-4c7f-8a98-8c3989e296d8')
      .single();
    
    if (verifyError) {
      console.error('Error al verificar la actualización:', verifyError);
      return;
    }
    
    console.log('\n📋 Verificación:');
    console.log('ID:', verifyData.id);
    console.log('Título:', verifyData.titulo);
    console.log('Contenido HTML (primeros 200 caracteres):', verifyData.contenido_html.substring(0, 200) + '...');
    console.log('Longitud del contenido:', verifyData.contenido_html.length, 'caracteres');
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

updateLesson2Content();