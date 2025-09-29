const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixLesson10() {
  console.log('🔧 Reparando lección 10 del Máster...');
  
  try {
    // Leer el contenido HTML del archivo
    const htmlPath = path.join(__dirname, 'public', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL', 'TRABAJO FINAL MASTER', 'contenido.html');
    
    if (!fs.existsSync(htmlPath)) {
      console.error('❌ No se encontró el archivo HTML:', htmlPath);
      return;
    }
    
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    console.log('✅ Archivo HTML leído correctamente (' + htmlContent.length + ' caracteres)');
    
    // Actualizar la lección en la base de datos
    const { data, error } = await supabase
      .from('lecciones')
      .update({
        contenido_html: htmlContent,
        archivo_url: '/course-content/MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL/TRABAJO FINAL MASTER/contenido.html'
      })
      .eq('id', '3df75902-4d3e-4141-b564-e85c06603365')
      .select();
    
    if (error) {
      console.error('❌ Error al actualizar la lección:', error);
      return;
    }
    
    console.log('✅ Lección 10 actualizada correctamente');
    console.log('📊 Datos actualizados:', data);
    
    // Verificar que se guardó correctamente
    const { data: verification, error: verifyError } = await supabase
      .from('lecciones')
      .select('id, titulo, contenido_html, archivo_url')
      .eq('id', '3df75902-4d3e-4141-b564-e85c06603365')
      .single();
    
    if (verifyError) {
      console.error('❌ Error al verificar:', verifyError);
      return;
    }
    
    console.log('\n=== VERIFICACIÓN ===');
    console.log('ID:', verification.id);
    console.log('Título:', verification.titulo);
    console.log('Contenido HTML:', verification.contenido_html ? 'SÍ (' + verification.contenido_html.length + ' chars)' : 'NO');
    console.log('Archivo URL:', verification.archivo_url);
    
    console.log('\n🎉 ¡Lección 10 reparada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

fixLesson10();