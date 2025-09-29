import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pjqcpqzqxbhqtjvkqzqm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqcWNwcXpxeGJocXRqdmtxenFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjY0NzQsImV4cCI6MjA1MTUwMjQ3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'
);

async function analyzeLessonContent() {
  console.log('=== ANÁLISIS DE CONTENIDO DE LECCIONES ===\n');
  
  const { data, error } = await supabase
    .from('lecciones')
    .select('id, titulo, contenido_html, orden')
    .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
    .order('orden');

  if (error) {
    console.error('Error:', error);
    return;
  }

  data.forEach((lesson, index) => {
    const contentLength = lesson.contenido_html ? lesson.contenido_html.length : 0;
    const preview = lesson.contenido_html 
      ? lesson.contenido_html.substring(0, 200).replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
      : 'Sin contenido';
    
    console.log(`Lección ${lesson.orden}: ${lesson.titulo}`);
    console.log(`ID: ${lesson.id}`);
    console.log(`Longitud del contenido: ${contentLength} caracteres`);
    console.log(`Vista previa: ${preview}...`);
    
    let status;
    if (contentLength < 1000) {
      status = '⚠️ CONTENIDO INSUFICIENTE';
    } else if (contentLength < 3000) {
      status = '🟡 CONTENIDO MODERADO';
    } else {
      status = '✅ CONTENIDO ADECUADO';
    }
    
    console.log(`Estado: ${status}`);
    console.log('---\n');
  });
  
  // Resumen
  const insufficient = data.filter(l => (l.contenido_html?.length || 0) < 1000);
  const moderate = data.filter(l => {
    const len = l.contenido_html?.length || 0;
    return len >= 1000 && len < 3000;
  });
  const adequate = data.filter(l => (l.contenido_html?.length || 0) >= 3000);
  
  console.log('=== RESUMEN ===');
  console.log(`Total de lecciones: ${data.length}`);
  console.log(`Contenido insuficiente: ${insufficient.length}`);
  console.log(`Contenido moderado: ${moderate.length}`);
  console.log(`Contenido adecuado: ${adequate.length}`);
  
  if (insufficient.length > 0) {
    console.log('\n🔴 Lecciones que necesitan ampliación:');
    insufficient.forEach(l => console.log(`  - Lección ${l.orden}: ${l.titulo}`));
  }
  
  if (moderate.length > 0) {
    console.log('\n🟡 Lecciones con contenido moderado:');
    moderate.forEach(l => console.log(`  - Lección ${l.orden}: ${l.titulo}`));
  }
}

analyzeLessonContent().catch(console.error);