import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson2() {
  try {
    console.log('🔍 Verificando lección 2...');
    
    // Buscar el curso
    const { data: course } = await supabase
      .from('cursos')
      .select('id')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (!course) {
      console.log('❌ Curso no encontrado');
      return;
    }
    
    // Buscar lección 2
    const { data: lesson } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', course.id)
      .eq('orden', 2)
      .single();
    
    if (!lesson) {
      console.log('❌ Lección 2 no encontrada');
      return;
    }
    
    console.log(`✅ Lección 2 encontrada: ${lesson.titulo}`);
    
    // Buscar cuestionarios para esta lección
    const { data: quizzes } = await supabase
      .from('cuestionarios')
      .select('id, titulo')
      .eq('leccion_id', lesson.id);
    
    console.log(`📋 Cuestionarios encontrados para lección 2: ${quizzes?.length || 0}`);
    
    if (quizzes && quizzes.length > 0) {
      for (const quiz of quizzes) {
        console.log(`  - ${quiz.titulo} (ID: ${quiz.id})`);
        
        // Verificar preguntas
        const { count: questionCount } = await supabase
          .from('preguntas')
          .select('*', { count: 'exact', head: true })
          .eq('cuestionario_id', quiz.id);
        
        console.log(`    Preguntas: ${questionCount}`);
      }
    } else {
      console.log('⚠️  No hay cuestionarios para la lección 2');
      console.log('📝 Necesitamos crear el cuestionario para la lección 2');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkLesson2();