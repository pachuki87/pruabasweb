import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const QUIZ_ID = '6a097982-a0fc-4e7d-851d-d3bad2195e70';

// Preguntas para la lección 5: Material Complementario y Ejercicios
const lesson5Questions = [
  {
    pregunta: "¿Cuál es el objetivo principal de los ejercicios prácticos en el tratamiento de adicciones?",
    opciones: [
      "Mantener ocupado al paciente",
      "Desarrollar habilidades de afrontamiento y autocontrol",
      "Cumplir con los requisitos del tratamiento",
      "Evaluar el progreso únicamente"
    ],
    correcta: 1,
    explicacion: "Los ejercicios prácticos están diseñados para desarrollar habilidades específicas de afrontamiento, autocontrol y manejo de situaciones de riesgo en la vida real."
  },
  {
    pregunta: "¿Qué tipo de material complementario es más efectivo para reforzar el aprendizaje en adicciones?",
    opciones: [
      "Solo material teórico",
      "Únicamente videos educativos",
      "Combinación de teoría, ejercicios prácticos y casos reales",
      "Exclusivamente testimonios personales"
    ],
    correcta: 2,
    explicacion: "La combinación de diferentes tipos de material (teoría, práctica y casos reales) proporciona un aprendizaje más completo y efectivo para el tratamiento de adicciones."
  },
  {
    pregunta: "¿Por qué son importantes los ejercicios de autorregistro en el tratamiento de adicciones?",
    opciones: [
      "Para llevar un control administrativo",
      "Para aumentar la autoconciencia y identificar patrones",
      "Solo para satisfacer al terapeuta",
      "Para comparar con otros pacientes"
    ],
    correcta: 1,
    explicacion: "Los ejercicios de autorregistro ayudan a aumentar la autoconciencia del paciente sobre sus patrones de comportamiento, emociones y situaciones de riesgo."
  }
];

async function insertLesson5Questions() {
  try {
    console.log(`🔧 Insertando preguntas para el cuestionario: ${QUIZ_ID}`);
    console.log('=' .repeat(60));

    // Verificar que el cuestionario existe
    const { data: quiz, error: quizError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('id', QUIZ_ID)
      .single();

    if (quizError || !quiz) {
      throw new Error('Cuestionario no encontrado');
    }

    console.log(`✅ Cuestionario encontrado: ${quiz.titulo}`);

    // Verificar si ya existen preguntas
    const { data: existingQuestions } = await supabase
      .from('preguntas')
      .select('id')
      .eq('cuestionario_id', QUIZ_ID);

    if (existingQuestions && existingQuestions.length > 0) {
      console.log(`⚠️  Ya existen ${existingQuestions.length} preguntas. Eliminando preguntas existentes...`);
      
      // Eliminar opciones de respuesta existentes
      for (const question of existingQuestions) {
        await supabase
          .from('opciones_respuesta')
          .delete()
          .eq('pregunta_id', question.id);
      }
      
      // Eliminar preguntas existentes
      await supabase
        .from('preguntas')
        .delete()
        .eq('cuestionario_id', QUIZ_ID);
      
      console.log('✅ Preguntas existentes eliminadas');
    }

    // Insertar nuevas preguntas
    console.log('\n📝 Insertando nuevas preguntas...');
    
    for (let i = 0; i < lesson5Questions.length; i++) {
      const questionData = lesson5Questions[i];
      
      console.log(`\n   Insertando pregunta ${i + 1}: ${questionData.pregunta.substring(0, 50)}...`);
      
      // Insertar pregunta
      const { data: pregunta, error: preguntaError } = await supabase
        .from('preguntas')
        .insert({
          cuestionario_id: QUIZ_ID,
          pregunta: questionData.pregunta,
          tipo: 'multiple_choice',
          orden: i + 1,
          explicacion: questionData.explicacion
        })
        .select()
        .single();
      
      if (preguntaError) {
        console.error(`   ❌ Error al insertar pregunta ${i + 1}:`, preguntaError);
        continue;
      }
      
      console.log(`   ✅ Pregunta insertada con ID: ${pregunta.id}`);
      
      // Insertar opciones de respuesta
      for (let j = 0; j < questionData.opciones.length; j++) {
        const { error: opcionError } = await supabase
          .from('opciones_respuesta')
          .insert({
            pregunta_id: pregunta.id,
            opcion: questionData.opciones[j],
            es_correcta: j === questionData.correcta,
            orden: j + 1
          });
        
        if (opcionError) {
          console.error(`   ❌ Error al insertar opción ${j + 1}:`, opcionError);
        }
      }
      
      console.log(`   ✅ ${questionData.opciones.length} opciones insertadas`);
    }

    // Actualizar la lección para marcar que tiene cuestionario
    await supabase
      .from('lecciones')
      .update({ tiene_cuestionario: true })
      .eq('id', quiz.leccion_id);

    console.log('\n' + '=' .repeat(60));
    console.log('🎉 ¡Preguntas insertadas exitosamente!');
    console.log(`📊 Total de preguntas: ${lesson5Questions.length}`);
    console.log('✅ El cuestionario de la lección 5 ahora debería mostrar contenido');
    
  } catch (error) {
    console.error('❌ Error durante la inserción:', error);
  }
}

// Ejecutar inserción
insertLesson5Questions();