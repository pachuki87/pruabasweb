const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyLesson4Quiz() {
  try {
    console.log('🔍 Verificando el cuestionario de la lección 4...');
    
    // 1. Buscar la lección 4
    const { data: courseData, error: courseError } = await supabase
      .from('cursos')
      .select('id')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (courseError) {
      console.error('❌ Error finding course:', courseError);
      return;
    }
    
    const { data: lessonData, error: lessonError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden, tiene_cuestionario')
      .eq('curso_id', courseData.id)
      .eq('orden', 4)
      .single();
    
    if (lessonError) {
      console.error('❌ Error finding lesson 4:', lessonError);
      return;
    }
    
    console.log('✅ Lección 4 encontrada:', {
      id: lessonData.id,
      titulo: lessonData.titulo,
      orden: lessonData.orden,
      tiene_cuestionario: lessonData.tiene_cuestionario
    });
    
    // 2. Buscar el cuestionario asociado
    const { data: quizData, error: quizError } = await supabase
      .from('cuestionarios')
      .select('id, titulo, leccion_id')
      .eq('leccion_id', lessonData.id);
    
    if (quizError) {
      console.error('❌ Error finding quiz:', quizError);
      return;
    }
    
    console.log('📝 Cuestionarios encontrados:', quizData);
    
    // 3. Verificar el cuestionario específico "Criterio de diagnóstico DSM V"
    const dsmQuiz = quizData.find(q => q.titulo === 'Criterio de diagnóstico DSM V');
    
    if (!dsmQuiz) {
      console.error('❌ No se encontró el cuestionario "Criterio de diagnóstico DSM V"');
      return;
    }
    
    console.log('✅ Cuestionario DSM V encontrado:', dsmQuiz);
    
    // 4. Verificar las preguntas del cuestionario
    const { data: questionsData, error: questionsError } = await supabase
      .from('preguntas')
      .select('id, pregunta, tipo, cuestionario_id')
      .eq('cuestionario_id', dsmQuiz.id);
    
    if (questionsError) {
      console.error('❌ Error finding questions:', questionsError);
      return;
    }
    
    console.log('❓ Preguntas encontradas:', questionsData);
    
    if (questionsData.length === 0) {
      console.error('❌ No se encontraron preguntas para el cuestionario');
      return;
    }
    
    // 5. Verificar que es una pregunta de texto libre
    const textQuestion = questionsData.find(q => q.tipo === 'texto_libre');
    
    if (!textQuestion) {
      console.error('❌ No se encontró pregunta de texto libre');
      return;
    }
    
    console.log('✅ Pregunta de texto libre encontrada:', textQuestion);
    
    console.log('\n🎉 ¡Verificación completada exitosamente!');
    console.log('📋 Resumen:');
    console.log(`   - Lección 4: ${lessonData.titulo}`);
    console.log(`   - Cuestionario: ${dsmQuiz.titulo}`);
    console.log(`   - Pregunta: ${textQuestion.pregunta}`);
    console.log(`   - Tipo: ${textQuestion.tipo}`);
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  }
}

verifyLesson4Quiz();