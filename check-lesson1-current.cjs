const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson1Content() {
  try {
    console.log('🔍 Verificando contenido actual de la lección 1...');
    
    const { data, error } = await supabase
      .from('lecciones')
      .select('id, titulo, contenido_html, archivo_url, orden')
      .eq('orden', 1)
      .single();
    
    if (error) {
      console.error('❌ Error al consultar la lección:', error);
      return;
    }
    
    console.log('📋 Información de la lección 1:');
    console.log('ID:', data.id);
    console.log('Título:', data.titulo);
    console.log('Archivo URL:', data.archivo_url);
    console.log('\n📄 Contenido HTML actual:');
    console.log('Longitud del contenido:', data.contenido_html ? data.contenido_html.length : 0);
    
    if (data.contenido_html) {
      console.log('\n--- INICIO DEL HTML ---');
      console.log(data.contenido_html);
      console.log('--- FIN DEL HTML ---\n');
      
      // Verificar si contiene la imagen
      const hasImage = data.contenido_html.includes('<img') || data.contenido_html.includes('image');
      console.log('¿Contiene imagen?', hasImage ? '✅ Sí' : '❌ No');
      
      // Verificar contenido específico
      const hasDefinicion = data.contenido_html.includes('DEFINICIÓN DE SER ADICTO');
      const hasOrigen = data.contenido_html.includes('ORIGEN');
      const hasConcepto = data.contenido_html.includes('TODA CONDUCTA ADICTIVA');
      
      console.log('¿Contiene "DEFINICIÓN DE SER ADICTO"?', hasDefinicion ? '✅ Sí' : '❌ No');
      console.log('¿Contiene "ORIGEN"?', hasOrigen ? '✅ Sí' : '❌ No');
      console.log('¿Contiene concepto centrado?', hasConcepto ? '✅ Sí' : '❌ No');
    } else {
      console.log('❌ No hay contenido HTML almacenado');
    }
    
  } catch (err) {
    console.error('💥 Error inesperado:', err);
  }
}

checkLesson1Content();