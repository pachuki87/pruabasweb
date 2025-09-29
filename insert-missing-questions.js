import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Preguntas específicas para cada cuestionario que necesita preguntas
const questionsData = {
  // Lección 6: Adicciones Comportamentales
  '3b94f1a2-6074-4110-9b88-e449c5bf43f4': [
    {
      pregunta: "¿Cuál es la principal diferencia entre las adicciones comportamentales y las adicciones a sustancias?",
      opciones: [
        "No existe diferencia",
        "Las comportamentales no causan daño",
        "No involucran sustancias químicas externas",
        "Son menos graves"
      ],
      correcta: 2,
      explicacion: "Las adicciones comportamentales involucran comportamientos compulsivos sin el uso de sustancias químicas externas."
    },
    {
      pregunta: "¿Cuál de las siguientes es considerada una adicción comportamental reconocida?",
      opciones: [
        "Adicción al trabajo",
        "Ludopatía (juego patológico)",
        "Adicción a las redes sociales",
        "Adicción al ejercicio"
      ],
      correcta: 1,
      explicacion: "La ludopatía es la única adicción comportamental oficialmente reconocida en el DSM-5 como trastorno del juego."
    }
  ],
  // Lección 10: Terapia integral de pareja
  'e254f246-bd7f-4703-a0d1-516001c215b0': [
    {
      pregunta: "¿Por qué es importante incluir a la pareja en el tratamiento de adicciones?",
      opciones: [
        "Para tener más control sobre el paciente",
        "Porque las adicciones afectan las dinámicas relacionales",
        "Es un requisito legal",
        "Para reducir costos del tratamiento"
      ],
      correcta: 1,
      explicacion: "Las adicciones impactan significativamente las dinámicas de pareja, y la terapia integral ayuda a abordar estos aspectos relacionales."
    }
  ],
  // Lección 11: Psicología positiva
  '613e9e5c-0900-4bc4-a0f4-b4952673b2f1': [
    {
      pregunta: "¿Cuál es el enfoque principal de la psicología positiva en el tratamiento de adicciones?",
      opciones: [
        "Eliminar completamente los pensamientos negativos",
        "Fortalecer recursos y fortalezas personales",
        "Ignorar los problemas existentes",
        "Usar solo técnicas de relajación"
      ],
      correcta: 1,
      explicacion: "La psicología positiva se enfoca en identificar y fortalecer los recursos, fortalezas y aspectos positivos de la persona para la recuperación."
    }
  ],
  // Lección 12: Mindfulness aplicado a la Conducta Adictiva
  '1fc56403-995c-41bd-9e54-efc9402a3049': [
    {
      pregunta: "¿Cómo ayuda el mindfulness en el tratamiento de adicciones?",
      opciones: [
        "Eliminando completamente los deseos",
        "Desarrollando conciencia y aceptación del momento presente",
        "Evitando todas las emociones difíciles",
        "Proporcionando distracción constante"
      ],
      correcta: 1,
      explicacion: "El mindfulness ayuda a desarrollar conciencia plena del momento presente, permitiendo observar deseos y emociones sin reaccionar automáticamente."
    }
  ]
};

async function insertMissingQuestions() {
  try {
    console.log('🚀 Iniciando inserción de preguntas faltantes...');
    
    let totalInserted = 0;
    
    // Procesar cada cuestionario que necesita preguntas
    for (const [quizId, questions] of Object.entries(questionsData)) {
      console.log(`\n📝 Procesando cuestionario: ${quizId}`);
      
      // Verificar que el cuestionario existe
      const { data: quiz, error: quizError } = await supabase
        .from('cuestionarios')
        .select('id, titulo')
        .eq('id', quizId)
        .single();
      
      if (quizError || !quiz) {
        console.log(`❌ Cuestionario ${quizId} no encontrado`);
        continue;
      }
      
      console.log(`✅ Cuestionario encontrado: ${quiz.titulo}`);
      
      // Verificar si ya tiene preguntas
      const { count: existingQuestions } = await supabase
        .from('preguntas')
        .select('*', { count: 'exact', head: true })
        .eq('cuestionario_id', quizId);
      
      if (existingQuestions > 0) {
        console.log(`⚠️  El cuestionario ya tiene ${existingQuestions} preguntas. Saltando...`);
        continue;
      }
      
      // Insertar preguntas
      for (let i = 0; i < questions.length; i++) {
        const questionData = questions[i];
        
        console.log(`  📋 Insertando pregunta ${i + 1}: ${questionData.pregunta.substring(0, 50)}...`);
        
        const { data: pregunta, error: preguntaError } = await supabase
          .from('preguntas')
          .insert({
            cuestionario_id: quizId,
            pregunta: questionData.pregunta,
            tipo: 'multiple_choice',
            orden: i + 1,
            explicacion: questionData.explicacion
          })
          .select()
          .single();
        
        if (preguntaError) {
          console.error(`    ❌ Error al insertar pregunta:`, preguntaError);
          continue;
        }
        
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
            console.error(`    ❌ Error al insertar opción:`, opcionError);
          }
        }
        
        console.log(`    ✅ Pregunta insertada con ${questionData.opciones.length} opciones`);
        totalInserted++;
      }
    }
    
    console.log(`\n🎉 ¡Inserción completada! Total de preguntas insertadas: ${totalInserted}`);
    
    // Verificar el estado final
    console.log('\n🔍 Verificando estado final...');
    for (const quizId of Object.keys(questionsData)) {
      const { count: finalCount } = await supabase
        .from('preguntas')
        .select('*', { count: 'exact', head: true })
        .eq('cuestionario_id', quizId);
      
      const { data: quiz } = await supabase
        .from('cuestionarios')
        .select('titulo')
        .eq('id', quizId)
        .single();
      
      console.log(`✅ ${quiz?.titulo || quizId}: ${finalCount} preguntas`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

insertMissingQuestions();