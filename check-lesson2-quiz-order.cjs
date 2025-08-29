const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://ixcvzqfquwjqpqkqvqzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4Y3Z6cWZxdXdqcXBxa3F2cXp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTkyNTU3MCwiZXhwIjoyMDUxNTAxNTcwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson2QuizOrder() {
  try {
    console.log('🔍 Verificando el orden de cuestionarios para la lección 2...');
    
    // Primero encontrar la lección 2
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .order('orden');
    
    if (lessonsError) {
      console.error('❌ Error obteniendo lecciones:', lessonsError);
      return;
    }
    
    console.log('📚 Lecciones encontradas:');
    lessons.forEach(lesson => {
      console.log(`  - ID: ${lesson.id}, Orden: ${lesson.orden}, Título: ${lesson.titulo}`);
    });
    
    // Encontrar lección 2 (orden 2 o título que contenga "¿Qué es una adicción")
    const lesson2 = lessons.find(l => l.orden === 2 || l.titulo.includes('¿Qué es una adicción'));
    
    if (!lesson2) {
      console.log('❌ No se encontró la lección 2');
      return;
    }
    
    console.log(`\n✅ Lección 2 encontrada: ${lesson2.titulo} (ID: ${lesson2.id})`);
    
    // Obtener todos los cuestionarios de esta lección SIN LIMIT para ver el orden
    const { data: quizzes, error: quizzesError } = await supabase
      .from('cuestionarios')
      .select('id, titulo, created_at')
      .eq('leccion_id', lesson2.id)
      .order('created_at'); // Ordenar por fecha de creación
    
    if (quizzesError) {
      console.error('❌ Error obteniendo cuestionarios:', quizzesError);
      return;
    }
    
    console.log(`\n📝 Cuestionarios para la lección 2 (ordenados por fecha de creación):`);
    quizzes.forEach((quiz, index) => {
      console.log(`  ${index + 1}. ID: ${quiz.id}, Título: ${quiz.titulo}, Creado: ${quiz.created_at}`);
    });
    
    // Simular la consulta actual que usa .limit(1)
    const { data: firstQuiz, error: firstQuizError } = await supabase
      .from('cuestionarios')
      .select('id, titulo')
      .eq('leccion_id', lesson2.id)
      .limit(1);
    
    if (firstQuizError) {
      console.error('❌ Error obteniendo primer cuestionario:', firstQuizError);
      return;
    }
    
    console.log(`\n🎯 Cuestionario que se obtiene actualmente con .limit(1):`);
    console.log(`   ID: ${firstQuiz[0]?.id}, Título: ${firstQuiz[0]?.titulo}`);
    
    // Buscar específicamente el cuestionario de texto libre
    const { data: textQuiz, error: textQuizError } = await supabase
      .from('cuestionarios')
      .select('id, titulo')
      .eq('leccion_id', lesson2.id)
      .eq('titulo', 'Definición conducta adictiva');
    
    if (textQuizError) {
      console.error('❌ Error obteniendo cuestionario de texto:', textQuizError);
      return;
    }
    
    console.log(`\n📝 Cuestionario de texto libre encontrado:`);
    if (textQuiz && textQuiz.length > 0) {
      console.log(`   ID: ${textQuiz[0].id}, Título: ${textQuiz[0].titulo}`);
    } else {
      console.log('   ❌ No se encontró el cuestionario de texto libre');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkLesson2QuizOrder();