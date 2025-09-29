import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function diagnoseSpecificQuiz() {
  const quizId = 'eab3cbb6-2699-4887-9026-f5c38e2a6534';
  
  console.log(`\n=== DIAGNÓSTICO DEL CUESTIONARIO ${quizId} ===\n`);
  
  try {
    // 1. Verificar si el cuestionario existe
    console.log('1. Verificando existencia del cuestionario...');
    const { data: quiz, error: quizError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('id', quizId)
      .single();
    
    if (quizError) {
      console.log('❌ Error al buscar cuestionario:', quizError.message);
      return;
    }
    
    if (!quiz) {
      console.log('❌ El cuestionario no existe en la base de datos');
      return;
    }
    
    console.log('✅ Cuestionario encontrado:');
    console.log(`   - ID: ${quiz.id}`);
    console.log(`   - Título: ${quiz.titulo}`);
    console.log(`   - Lección ID: ${quiz.leccion_id}`);
    console.log(`   - Creado: ${quiz.created_at}`);
    
    // 2. Verificar preguntas asociadas
    console.log('\n2. Verificando preguntas asociadas...');
    const { data: questions, error: questionsError } = await supabase
      .from('preguntas')
      .select('*')
      .eq('cuestionario_id', quizId);
    
    if (questionsError) {
      console.log('❌ Error al buscar preguntas:', questionsError.message);
      return;
    }
    
    if (!questions || questions.length === 0) {
      console.log('❌ No se encontraron preguntas para este cuestionario');
      console.log('   Esto explica por qué no se muestra contenido en la página');
      
      // Buscar si hay archivos de cuestionario para esta lección
      console.log('\n3. Buscando información de la lección...');
      const { data: lesson, error: lessonError } = await supabase
        .from('lecciones')
        .select('*')
        .eq('id', quiz.leccion_id)
        .single();
      
      if (lesson) {
        console.log(`   - Lección: ${lesson.titulo}`);
        console.log(`   - Número: ${lesson.numero_leccion}`);
        console.log(`   - Archivo URL: ${lesson.archivo_url || 'No especificado'}`);
      }
      
      return;
    }
    
    console.log(`✅ Se encontraron ${questions.length} preguntas:`);
    questions.forEach((q, index) => {
      console.log(`   ${index + 1}. ${q.texto_pregunta}`);
    });
    
    // 3. Verificar opciones de respuesta
    console.log('\n3. Verificando opciones de respuesta...');
    for (const question of questions) {
      const { data: options, error: optionsError } = await supabase
        .from('opciones_respuesta')
        .select('*')
        .eq('pregunta_id', question.id);
      
      if (optionsError) {
        console.log(`❌ Error al buscar opciones para pregunta ${question.id}:`, optionsError.message);
        continue;
      }
      
      if (!options || options.length === 0) {
        console.log(`❌ Pregunta "${question.texto_pregunta}" no tiene opciones de respuesta`);
      } else {
        console.log(`✅ Pregunta "${question.texto_pregunta}" tiene ${options.length} opciones`);
      }
    }
    
  } catch (error) {
    console.error('Error durante el diagnóstico:', error);
  }
}

diagnoseSpecificQuiz();