require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugLessonContent() {
  try {
    console.log('🔍 Debugging lesson content for "Experto en Conductas Adictivas"...');
    
    // Get course ID
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (courseError) {
      console.error('❌ Course error:', courseError);
      return;
    }
    
    console.log('✅ Course found:', course);
    
    // Get first lesson to debug
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('id, titulo, contenido_html')
      .eq('curso_id', course.id)
      .order('orden', { ascending: true })
      .limit(3);
    
    if (lessonsError) {
      console.error('❌ Lessons error:', lessonsError);
      return;
    }
    
    console.log('\n📚 First 3 lessons:');
    lessons.forEach((lesson, index) => {
      console.log(`\n--- Lesson ${index + 1} ---`);
      console.log('ID:', lesson.id);
      console.log('Title:', lesson.titulo);
      console.log('Content length:', lesson.contenido_html ? lesson.contenido_html.length : 0);
      
      if (lesson.contenido_html) {
        console.log('Content preview (first 200 chars):');
        console.log(lesson.contenido_html.substring(0, 200) + '...');
        
        // Check if it contains actual content or just HTML structure
        const textContent = lesson.contenido_html.replace(/<[^>]*>/g, '').trim();
        console.log('Text content length (without HTML tags):', textContent.length);
        console.log('Text preview:', textContent.substring(0, 100) + '...');
      } else {
        console.log('❌ No content found!');
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugLessonContent();