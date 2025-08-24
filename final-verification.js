import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalVerification() {
  try {
    console.log('🔍 VERIFICACIÓN FINAL DE TODOS LOS CUESTIONARIOS');
    console.log('=' .repeat(50));
    
    // Obtener el curso
    const { data: course } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (!course) {
      console.log('❌ Curso no encontrado');
      return;
    }
    
    console.log(`📚 Curso: ${course.titulo}`);
    console.log(`🆔 ID: ${course.id}\n`);
    
    // Obtener todas las lecciones del curso
    const { data: lessons } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', course.id)
      .order('orden');
    
    console.log(`📖 Total de lecciones: ${lessons?.length || 0}\n`);
    
    let totalQuizzes = 0;
    let totalQuestions = 0;
    let lessonsWithQuizzes = 0;
    
    // Verificar cada lección
    for (const lesson of lessons || []) {
      console.log(`📝 Lección ${lesson.orden}: ${lesson.titulo}`);
      
      // Obtener cuestionarios de esta lección
      const { data: quizzes } = await supabase
        .from('cuestionarios')
        .select('id, titulo')
        .eq('leccion_id', lesson.id);
      
      if (!quizzes || quizzes.length === 0) {
        console.log('   ❌ Sin cuestionarios');
      } else {
        lessonsWithQuizzes++;
        totalQuizzes += quizzes.length;
        
        for (const quiz of quizzes) {
          console.log(`   ✅ ${quiz.titulo}`);
          console.log(`      🆔 ID: ${quiz.id}`);
          
          // Contar preguntas
          const { count: questionCount } = await supabase
            .from('preguntas')
            .select('*', { count: 'exact', head: true })
            .eq('cuestionario_id', quiz.id);
          
          totalQuestions += questionCount || 0;
          console.log(`      📋 Preguntas: ${questionCount}`);
          
          // Verificar que las preguntas tienen opciones
          if (questionCount > 0) {
            const { data: questions } = await supabase
              .from('preguntas')
              .select('id')
              .eq('cuestionario_id', quiz.id);
            
            let questionsWithOptions = 0;
            for (const question of questions || []) {
              const { count: optionCount } = await supabase
                .from('opciones_respuesta')
                .select('*', { count: 'exact', head: true })
                .eq('pregunta_id', question.id);
              
              if (optionCount > 0) {
                questionsWithOptions++;
              }
            }
            console.log(`      🔘 Preguntas con opciones: ${questionsWithOptions}/${questionCount}`);
          }
        }
      }
      console.log('');
    }
    
    // Resumen final
    console.log('📊 RESUMEN FINAL');
    console.log('=' .repeat(30));
    console.log(`📖 Total de lecciones: ${lessons?.length || 0}`);
    console.log(`📝 Lecciones con cuestionarios: ${lessonsWithQuizzes}`);
    console.log(`📋 Total de cuestionarios: ${totalQuizzes}`);
    console.log(`❓ Total de preguntas: ${totalQuestions}`);
    
    if (lessonsWithQuizzes === (lessons?.length || 0)) {
      console.log('\n🎉 ¡PERFECTO! Todas las lecciones tienen cuestionarios');
    } else {
      console.log(`\n⚠️  Faltan cuestionarios en ${(lessons?.length || 0) - lessonsWithQuizzes} lecciones`);
    }
    
  } catch (error) {
    console.error('❌ Error en verificación:', error);
  }
}

finalVerification();