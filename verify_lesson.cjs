const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ixqjqjqjqjqjqjqjqjqj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cWpxanFqcWpxanFqcWpxanFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjU5NzcsImV4cCI6MjA1MTUwMTk3N30.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'
);

async function verifyLesson() {
  try {
    const { data, error } = await supabase
      .from('lecciones')
      .select('titulo, contenido_html')
      .eq('orden', 1)
      .single();
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Título:', data.titulo);
    
    const hasImage = data.contenido_html.includes('<img src="/lessons/images-leccion-1/que-es-adiccion.jpg"');
    const hasSVG = data.contenido_html.includes('<svg');
    
    console.log('Contiene imagen:', hasImage);
    console.log('Contiene SVG:', hasSVG);
    
    if (hasImage && !hasSVG) {
      console.log('✅ ÉXITO: La lección ahora usa la imagen real');
    } else {
      console.log('❌ ERROR: Aún contiene SVG o no tiene la imagen');
    }
    
    // Mostrar un fragmento del contenido para debug
    const imgIndex = data.contenido_html.indexOf('<img');
    if (imgIndex !== -1) {
      const fragment = data.contenido_html.substring(imgIndex, imgIndex + 200);
      console.log('Fragmento de imagen encontrado:', fragment);
    }
    
  } catch (err) {
    console.error('Error ejecutando consulta:', err);
  }
}

verifyLesson();