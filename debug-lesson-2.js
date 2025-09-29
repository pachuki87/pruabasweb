import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugLesson2() {
  console.log('🔍 Debugging Lesson 2 - ID: 2b1d91ce-2b59-4f49-b227-626f803bd74d');
  
  try {
    // 1. Obtener datos completos de la lección 2
    const { data: lessonData, error: lessonError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('id', '2b1d91ce-2b59-4f49-b227-626f803bd74d')
      .single();
    
    if (lessonError) {
      console.error('❌ Error fetching lesson:', lessonError);
      return;
    }
    
    console.log('📊 Lesson 2 Data:');
    console.log('- ID:', lessonData.id);
    console.log('- Título:', lessonData.titulo);
    console.log('- Orden:', lessonData.orden);
    console.log('- Activa:', lessonData.activa);
    console.log('- Archivo URL:', lessonData.archivo_url);
    console.log('- Contenido HTML length:', lessonData.contenido_html ? lessonData.contenido_html.length : 'NULL');
    console.log('- Contenido HTML preview:', lessonData.contenido_html ? lessonData.contenido_html.substring(0, 200) + '...' : 'NULL');
    
    // 2. Mostrar información del archivo
    if (lessonData.archivo_url) {
      console.log('\n🔗 File URL:', lessonData.archivo_url);
    } else {
      console.log('\n❌ No archivo_url found');
    }
    
    // 3. Verificar el curso al que pertenece
    const { data: courseData, error: courseError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('id', lessonData.curso_id)
      .single();
    
    if (courseError) {
      console.error('❌ Error fetching course:', courseError);
    } else {
      console.log('\n📚 Course Data:');
      console.log('- Course ID:', courseData.id);
      console.log('- Course Title:', courseData.titulo);
    }
    
    // 4. Verificar todas las lecciones del curso para comparar
    const { data: allLessons, error: allLessonsError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden, activa, archivo_url, contenido_html')
      .eq('curso_id', lessonData.curso_id)
      .order('orden');
    
    if (allLessonsError) {
      console.error('❌ Error fetching all lessons:', allLessonsError);
    } else {
      console.log('\n📋 All lessons in course:');
      allLessons.forEach(lesson => {
        console.log(`- Lesson ${lesson.orden}: ${lesson.titulo}`);
        console.log(`  ID: ${lesson.id}`);
        console.log(`  Active: ${lesson.activa}`);
        console.log(`  Has archivo_url: ${!!lesson.archivo_url}`);
        console.log(`  Has contenido_html: ${!!lesson.contenido_html} (${lesson.contenido_html ? lesson.contenido_html.length : 0} chars)`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Ejecutar el diagnóstico
debugLesson2().then(() => {
  console.log('\n✅ Diagnosis complete');
  process.exit(0);
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});