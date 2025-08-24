const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugLesson2() {
  console.log('🔍 Debugging Lesson 2 data...');
  
  try {
    // Obtener datos de la lección 2
    const { data: lesson, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('id', '2b1d91ce-2b59-4f49-b227-626f803bd74d')
      .single();
    
    if (error) {
      console.error('❌ Error fetching lesson:', error);
      return;
    }
    
    console.log('✅ Lesson 2 data found:');
    console.log('📋 ID:', lesson.id);
    console.log('📝 Título:', lesson.titulo);
    console.log('📊 Orden:', lesson.orden);
    console.log('🔗 Archivo URL:', lesson.archivo_url || 'null');
    console.log('📄 Contenido HTML length:', lesson.contenido_html ? lesson.contenido_html.length : 'null');
    
    if (lesson.contenido_html) {
      console.log('📖 Contenido HTML preview (first 300 chars):');
      console.log(lesson.contenido_html.substring(0, 300) + '...');
      
      // Verificar si contiene placeholder
      if (lesson.contenido_html.includes('Contenido pendiente de asignar')) {
        console.log('⚠️  WARNING: Database content contains placeholder text!');
      } else {
        console.log('✅ Database content appears to be valid (no placeholder detected)');
      }
    }
    
    // Verificar si el archivo existe
    if (lesson.archivo_url) {
      console.log('\n🔍 Checking file availability...');
      try {
        const response = await fetch(lesson.archivo_url);
        console.log('📡 File response status:', response.status);
        
        if (response.ok) {
          const fileContent = await response.text();
          console.log('📄 File content length:', fileContent.length);
          
          if (fileContent.includes('Contenido pendiente de asignar')) {
            console.log('⚠️  WARNING: File content contains placeholder text!');
          } else {
            console.log('✅ File content appears to be valid (no placeholder detected)');
          }
          
          console.log('📖 File content preview (first 300 chars):');
          console.log(fileContent.substring(0, 300) + '...');
        } else {
          console.log('❌ File not accessible:', response.statusText);
        }
      } catch (fileError) {
        console.log('❌ Error fetching file:', fileError.message);
      }
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

debugLesson2();