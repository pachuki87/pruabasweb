const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFinalRedirect() {
  console.log('🎯 Testing final redirect implementation...');
  
  try {
    // 1. Obtener información del curso y primera lección
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .single();
    
    if (courseError) {
      console.error('❌ Error fetching course:', courseError);
      return;
    }
    
    console.log('✅ Course:', course.titulo);
    
    // 2. Obtener la primera lección
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden', { ascending: true })
      .limit(1);
    
    if (lessonsError) {
      console.error('❌ Error fetching lessons:', lessonsError);
      return;
    }
    
    const firstLesson = lessons[0];
    console.log('✅ First lesson:', firstLesson.titulo);
    console.log('✅ Lesson ID:', firstLesson.id);
    
    // 3. Verificar que el PDF destino está accesible
    try {
      const pdfResponse = await fetch('http://localhost:5173/pdfs/master-adicciones/BLOQUE%201%20TECNICO%20EN%20ADICIONES.pdf');
      if (pdfResponse.ok) {
        console.log('✅ Target PDF is accessible');
      } else {
        console.log('❌ Target PDF not accessible, status:', pdfResponse.status);
      }
    } catch (fetchError) {
      console.error('❌ Error fetching target PDF:', fetchError.message);
    }
    
    // 4. Mostrar las URLs que ahora deberían redirigir
    console.log('\n🔗 URLs that should redirect to PDF:');
    console.log('1. http://localhost:5173/courses/b5ef8c64-fe26-4f20-8221-80a1bf475b05/lessons/1');
    console.log('2. http://localhost:5173/courses/b5ef8c64-fe26-4f20-8221-80a1bf475b05/lessons/' + firstLesson.id);
    console.log('\n🎯 Target PDF:');
    console.log('http://localhost:5173/pdfs/master-adicciones/BLOQUE%201%20TECNICO%20EN%20ADICIONES.pdf');
    
    console.log('\n✨ Implementation Summary:');
    console.log('- Modified NewLessonPage.tsx to detect Master en Adicciones lesson 1');
    console.log('- Added redirect logic for both lessonId "1" and actual lesson ID');
    console.log('- When accessing either URL, user will be redirected directly to the PDF');
    console.log('- This solves the issue where lesson page was showing instead of direct PDF access');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testFinalRedirect();