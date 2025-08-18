require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyUpdatedContent() {
  try {
    console.log('🔍 Verifying updated content for "Experto en Conductas Adictivas"...');
    
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
    
    // Get all lessons with fresh query
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('id, titulo, contenido_html, orden')
      .eq('curso_id', course.id)
      .order('orden', { ascending: true });
    
    if (lessonsError) {
      console.error('❌ Lessons error:', lessonsError);
      return;
    }
    
    console.log(`\n📚 Found ${lessons.length} lessons:`);
    
    lessons.forEach((lesson, index) => {
      console.log(`\n--- Lesson ${index + 1} (Order: ${lesson.orden}) ---`);
      console.log('ID:', lesson.id);
      console.log('Title:', lesson.titulo);
      console.log('Content length:', lesson.contenido_html ? lesson.contenido_html.length : 0);
      
      if (lesson.contenido_html) {
        // Check if it's the old short content or new full content
        if (lesson.contenido_html.length > 10000) {
          console.log('✅ FULL CONTENT - Successfully updated!');
          console.log('Content preview (first 100 chars):');
          console.log(lesson.contenido_html.substring(0, 100) + '...');
        } else {
          console.log('⚠️ SHORT CONTENT - May need update');
          console.log('Content preview:');
          console.log(lesson.contenido_html.substring(0, 200) + '...');
        }
        
        // Check text content
        const textContent = lesson.contenido_html.replace(/<[^>]*>/g, '').trim();
        console.log('Text content length (without HTML tags):', textContent.length);
      } else {
        console.log('❌ No content found!');
      }
    });
    
    // Summary
    const fullContentLessons = lessons.filter(l => l.contenido_html && l.contenido_html.length > 10000);
    const shortContentLessons = lessons.filter(l => l.contenido_html && l.contenido_html.length <= 10000);
    const emptyLessons = lessons.filter(l => !l.contenido_html);
    
    console.log('\n📊 SUMMARY:');
    console.log(`✅ Lessons with full content: ${fullContentLessons.length}`);
    console.log(`⚠️ Lessons with short content: ${shortContentLessons.length}`);
    console.log(`❌ Empty lessons: ${emptyLessons.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyUpdatedContent();