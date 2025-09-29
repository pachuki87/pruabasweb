const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson2Questions() {
  try {
    console.log('🔍 Verificando lecciones disponibles...');
    
    // Primero buscar todas las lecciones para encontrar la lección 2
    const { data: allLessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .order('orden');
    
    if (lessonsError) {
      console.error('❌ Error al obtener lecciones:', lessonsError);
      return;
    }
    
    console.log(`\n📚 Lecciones encontradas: ${allLessons.length}`);
    
    // Buscar la lección 2 por título o orden
    const lesson2 = allLessons.find(l => 
      l.titulo.includes('¿Qué es una adicción') || 
      l.orden === 2 ||
      l.titulo.includes('adicción')
    );
    
    if (!lesson2) {
      console.log('❌ No se encontró la lección 2');
      console.log('📋 Lecciones disponibles:');
      allLessons.forEach(lesson => {
        console.log(`   - ID: ${lesson.id}, Orden: ${lesson.orden}, Título: ${lesson.titulo}`);
      });
      return;
    }
    
    console.log(`\n✅ Lección 2 encontrada:`);
    console.log(`   ID: ${lesson2.id}`);
    console.log(`   Título: ${lesson2.titulo}`);
    console.log(`   Orden: ${lesson2.orden}`);
    console.log(`   Tiene cuestionario: ${lesson2.tiene_cuestionario}`);
    
    // Obtener todos los cuestionarios de esta lección
    const { data: quizzes, error: quizzesError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('leccion_id', lesson2.id);
    
    if (quizzesError) {
      console.error('❌ Error al obtener cuestionarios:', quizzesError);
      return;
    }
    
    console.log(`\n📋 Cuestionarios encontrados: ${quizzes.length}`);
    
    for (const quiz of quizzes) {
      console.log(`\n🎯 Cuestionario: "${quiz.titulo}" (ID: ${quiz.id})`);
      console.log(`   Descripción: ${quiz.descripcion || 'Sin descripción'}`);
      
      // Obtener preguntas de este cuestionario
      const { data: questions, error: questionsError } = await supabase
        .from('preguntas')
        .select(`
          id,
          pregunta,
          tipo,
          opciones_respuesta (
            id,
            opcion,
            es_correcta,
            orden
          )
        `)
        .eq('cuestionario_id', quiz.id)
        .order('id');
      
      if (questionsError) {
        console.error(`   ❌ Error al obtener preguntas:`, questionsError);
        continue;
      }
      
      console.log(`   📝 Preguntas (${questions.length}):`);
      
      questions.forEach((question, index) => {
        console.log(`\n   ${index + 1}. Pregunta: "${question.pregunta}"`);
        console.log(`      Tipo: ${question.tipo}`);
        
        if (question.opciones_respuesta && question.opciones_respuesta.length > 0) {
          console.log(`      Opciones:`);
          question.opciones_respuesta
            .sort((a, b) => a.orden - b.orden)
            .forEach((option, optIndex) => {
              const correctMark = option.es_correcta ? ' ✅' : '';
              console.log(`        ${optIndex + 1}. ${option.opcion}${correctMark}`);
            });
        } else {
          console.log(`      Sin opciones (pregunta de texto libre)`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkLesson2Questions();