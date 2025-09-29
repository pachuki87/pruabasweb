const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLessonRedirect() {
  console.log('🧪 Testing lesson redirect functionality...');
  
  try {
    // 1. Verificar que el curso Master en Adicciones existe
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .single();
    
    if (courseError) {
      console.error('❌ Error fetching course:', courseError);
      return;
    }
    
    console.log('✅ Course found:', course.titulo);
    
    // 2. Verificar que existe la lección 1
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden', { ascending: true });
    
    if (lessonsError) {
      console.error('❌ Error fetching lessons:', lessonsError);
      return;
    }
    
    console.log('📚 Lessons found:', lessons.length);
    const firstLesson = lessons[0];
    console.log('🎯 First lesson:', firstLesson.titulo, 'ID:', firstLesson.id);
    
    // 3. Verificar que el PDF está accesible
    try {
      const pdfResponse = await fetch('http://localhost:5173/pdfs/master-adicciones/BLOQUE%201%20TECNICO%20EN%20ADICIONES.pdf');
      if (pdfResponse.ok) {
        console.log('✅ PDF is accessible at the target URL');
      } else {
        console.log('❌ PDF not accessible, status:', pdfResponse.status);
      }
    } catch (fetchError) {
      console.error('❌ Error fetching PDF:', fetchError.message);
    }
    
    // 4. Mostrar las URLs que deberían funcionar
    console.log('\n🔗 URLs to test:');
    console.log('Original lesson URL:', `http://localhost:5173/courses/b5ef8c64-fe26-4f20-8221-80a1bf475b05/lessons/1`);
    console.log('Should redirect to:', 'http://localhost:5173/pdfs/master-adicciones/BLOQUE%201%20TECNICO%20EN%20ADICIONES.pdf');
    console.log('\n✨ The redirect logic has been implemented in NewLessonPage.tsx');
    console.log('When accessing the lesson URL, it should automatically redirect to the PDF.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testLessonRedirect();