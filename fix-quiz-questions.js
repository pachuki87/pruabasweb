import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixQuizQuestions() {
  const targetQuizId = 'eab3cbb6-2699-4887-9026-f5c38e2a6534';
  
  console.log(`\n=== CORRIGIENDO PREGUNTAS DEL CUESTIONARIO ${targetQuizId} ===\n`);
  
  try {
    // 1. Buscar el cuestionario recién creado para DSM-5
    console.log('1. Buscando cuestionario recién creado...');
    const { data: newQuiz, error: newQuizError } = await supabase
      .from('cuestionarios')
      .select('id, titulo')
      .eq('titulo', 'Cuestionario: Criterios diagnósticos DSM-5')
      .neq('id', targetQuizId)
      .order('creado_en', { ascending: false })
      .limit(1)
      .single();
    
    if (newQuizError || !newQuiz) {
      console.log('❌ No se encontró el cuestionario recién creado');
      return;
    }
    
    console.log(`✅ Cuestionario fuente encontrado: ${newQuiz.id}`);
    
    // 2. Obtener preguntas del cuestionario recién creado
    console.log('2. Obteniendo preguntas del cuestionario fuente...');
    const { data: questions, error: questionsError } = await supabase
      .from('preguntas')
      .select(`
        id,
        pregunta,
        tipo,
        orden,
        explicacion,
        opciones_respuesta (
          id,
          opcion,
          es_correcta,
          orden
        )
      `)
      .eq('cuestionario_id', newQuiz.id)
      .order('orden');
    
    if (questionsError || !questions || questions.length === 0) {
      console.log('❌ No se encontraron preguntas en el cuestionario fuente');
      return;
    }
    
    console.log(`✅ Encontradas ${questions.length} preguntas`);
    
    // 3. Insertar preguntas en el cuestionario objetivo
    console.log('3. Insertando preguntas en el cuestionario objetivo...');
    
    for (const question of questions) {
      // Insertar pregunta
      const { data: newQuestion, error: questionError } = await supabase
        .from('preguntas')
        .insert({
          cuestionario_id: targetQuizId,
          pregunta: question.pregunta,
          tipo: question.tipo,
          orden: question.orden,
          explicacion: question.explicacion
        })
        .select()
        .single();
      
      if (questionError) {
        console.error(`❌ Error al insertar pregunta: ${questionError.message}`);
        continue;
      }
      
      console.log(`  ✅ Pregunta insertada: ${newQuestion.id}`);
      
      // Insertar opciones de respuesta
      if (question.opciones_respuesta && question.opciones_respuesta.length > 0) {
        for (const option of question.opciones_respuesta) {
          const { error: optionError } = await supabase
            .from('opciones_respuesta')
            .insert({
              pregunta_id: newQuestion.id,
              opcion: option.opcion,
              es_correcta: option.es_correcta,
              orden: option.orden
            });
          
          if (optionError) {
            console.error(`❌ Error al insertar opción: ${optionError.message}`);
          }
        }
        
        console.log(`    ✅ ${question.opciones_respuesta.length} opciones insertadas`);
      }
    }
    
    // 4. Eliminar el cuestionario duplicado
    console.log('4. Eliminando cuestionario duplicado...');
    
    // Primero eliminar opciones de respuesta
    for (const question of questions) {
      await supabase
        .from('opciones_respuesta')
        .delete()
        .eq('pregunta_id', question.id);
    }
    
    // Luego eliminar preguntas
    await supabase
      .from('preguntas')
      .delete()
      .eq('cuestionario_id', newQuiz.id);
    
    // Finalmente eliminar cuestionario
    await supabase
      .from('cuestionarios')
      .delete()
      .eq('id', newQuiz.id);
    
    console.log('✅ Cuestionario duplicado eliminado');
    
    // 5. Verificación final
    console.log('5. Verificación final...');
    const { data: finalCheck, error: finalError } = await supabase
      .from('preguntas')
      .select('id')
      .eq('cuestionario_id', targetQuizId);
    
    if (finalError) {
      console.error('❌ Error en verificación final:', finalError.message);
    } else {
      console.log(`✅ Verificación exitosa: ${finalCheck.length} preguntas en el cuestionario objetivo`);
    }
    
    console.log('\n🎉 ¡Corrección completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar el script
fixQuizQuestions();