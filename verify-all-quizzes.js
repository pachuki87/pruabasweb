import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAllQuizzes() {
  try {
    console.log('🔍 Verificando todos los cuestionarios del curso "Experto en Conductas Adictivas"...');
    
    // Obtener el ID del curso
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('id')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (courseError) {
      console.error('❌ Error al obtener el curso:', courseError);
      return;
    }
    
    console.log('✅ Curso encontrado:', course.id);
    
    // Obtener todas las lecciones del curso
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', course.id)
      .order('orden');
    
    if (lessonsError) {
      console.error('❌ Error al obtener lecciones:', lessonsError);
      return;
    }
    
    console.log(`\n📚 Encontradas ${lessons.length} lecciones`);
    
    // Obtener todos los cuestionarios del curso
    const { data: quizzes, error: quizzesError } = await supabase
      .from('cuestionarios')
      .select('id, titulo, leccion_id')
      .eq('curso_id', course.id);
    
    if (quizzesError) {
      console.error('❌ Error al obtener cuestionarios:', quizzesError);
      return;
    }
    
    console.log(`\n📝 Encontrados ${quizzes.length} cuestionarios`);
    
    // Verificar cada cuestionario
    const quizzesWithoutQuestions = [];
    const quizzesWithQuestions = [];
    
    for (const quiz of quizzes) {
      // Buscar la lección correspondiente
      const lesson = lessons.find(l => l.id === quiz.leccion_id);
      
      // Contar preguntas del cuestionario
      const { count: questionCount, error: questionsError } = await supabase
        .from('preguntas')
        .select('*', { count: 'exact', head: true })
        .eq('cuestionario_id', quiz.id);
      
      if (questionsError) {
        console.error(`❌ Error al contar preguntas para ${quiz.titulo}:`, questionsError);
        continue;
      }
      
      const quizInfo = {
        id: quiz.id,
        titulo: quiz.titulo,
        leccion_numero: lesson?.orden || 'N/A',
        leccion_titulo: lesson?.titulo || 'N/A',
        preguntas_count: questionCount
      };
      
      if (questionCount === 0) {
        quizzesWithoutQuestions.push(quizInfo);
        console.log(`❌ ${quiz.titulo} (Lección ${lesson?.orden || 'N/A'}) - SIN PREGUNTAS`);
      } else {
        quizzesWithQuestions.push(quizInfo);
        console.log(`✅ ${quiz.titulo} (Lección ${lesson?.orden || 'N/A'}) - ${questionCount} preguntas`);
      }
    }
    
    console.log('\n📊 RESUMEN:');
    console.log(`✅ Cuestionarios con preguntas: ${quizzesWithQuestions.length}`);
    console.log(`❌ Cuestionarios sin preguntas: ${quizzesWithoutQuestions.length}`);
    
    if (quizzesWithoutQuestions.length > 0) {
      console.log('\n🔧 Cuestionarios que necesitan preguntas:');
      quizzesWithoutQuestions.forEach(quiz => {
        console.log(`- Lección ${quiz.leccion_numero}: ${quiz.titulo}`);
        console.log(`  ID: ${quiz.id}`);
      });
    }
    
    return {
      total: quizzes.length,
      withQuestions: quizzesWithQuestions,
      withoutQuestions: quizzesWithoutQuestions
    };
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verifyAllQuizzes();