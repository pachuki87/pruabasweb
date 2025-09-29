require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function getLessonIds() {
  try {
    console.log('🔍 Obteniendo IDs de lecciones...');
    
    // Obtener el curso
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (cursoError) {
      console.error('❌ Error al obtener curso:', cursoError);
      return;
    }
    
    // Obtener lecciones 1 y 11
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', curso.id)
      .in('orden', [1, 11])
      .order('orden');
    
    if (error) {
      console.error('❌ Error al obtener lecciones:', error);
      return;
    }
    
    console.log('📋 Lecciones encontradas:');
    lessons.forEach(lesson => {
      console.log(`   Lección ${lesson.orden}: ${lesson.titulo}`);
      console.log(`   ID: ${lesson.id}`);
      console.log(`   URL: http://localhost:5173/student/courses/${curso.id}/lessons/${lesson.id}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

getLessonIds();