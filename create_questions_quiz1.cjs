require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function createQuestionsQuiz1() {
  try {
    console.log('📝 Creando preguntas para Cuestionario 1: Fundamentos de Terapia Cognitiva');
    
    const quiz1Id = '7a52daad-db71-4cb5-8701-967fffbb6966';
    
    // Preguntas para el cuestionario 1
    const questions = [
      {
        pregunta: '¿Cuál es la premisa fundamental de la terapia cognitiva aplicada a las adicciones?',
        tipo: 'multiple_choice',
        orden: 1,
        explicacion: 'La terapia cognitiva se basa en la relación entre pensamientos, emociones y comportamientos.',
        opciones: [
          { opcion: 'A) Los pensamientos influyen directamente en emociones y comportamientos', es_correcta: true, orden: 1 },
          { opcion: 'B) Las emociones son independientes de los pensamientos', es_correcta: false, orden: 2 },
          { opcion: 'C) Los comportamientos no pueden modificarse a través del pensamiento', es_correcta: false, orden: 3 }
        ]
      },
      {
        pregunta: '¿Qué caracteriza al "pensamiento todo o nada" en el contexto de las adicciones?',
        tipo: 'multiple_choice',
        orden: 2,
        explicacion: 'Es una distorsión cognitiva que ve las situaciones en extremos absolutos.',
        opciones: [
          { opcion: 'A) Pensar que el consumo ocasional es aceptable', es_correcta: false, orden: 1 },
          { opcion: 'B) Creer que "si consumo una vez, ya fracasé completamente"', es_correcta: true, orden: 2 },
          { opcion: 'C) Considerar que todas las drogas tienen el mismo efecto', es_correcta: false, orden: 3 }
        ]
      },
      {
        pregunta: '¿Cuál de las siguientes NO es una distorsión cognitiva común en adicciones?',
        tipo: 'multiple_choice',
        orden: 3,
        explicacion: 'El pensamiento realista y equilibrado es lo opuesto a las distorsiones cognitivas.',
        opciones: [
          { opcion: 'A) Catastrofización', es_correcta: false, orden: 1 },
          { opcion: 'B) Minimización', es_correcta: false, orden: 2 },
          { opcion: 'C) Pensamiento realista y equilibrado', es_correcta: true, orden: 3 }
        ]
      },
      {
        pregunta: '¿Qué técnica se utiliza para identificar patrones cognitivos disfuncionales?',
        tipo: 'multiple_choice',
        orden: 4,
        explicacion: 'El registro de pensamientos permite identificar y analizar patrones cognitivos.',
        opciones: [
          { opcion: 'A) Registro de pensamientos automáticos', es_correcta: true, orden: 1 },
          { opcion: 'B) Meditación transcendental', es_correcta: false, orden: 2 },
          { opcion: 'C) Terapia de grupo exclusivamente', es_correcta: false, orden: 3 }
        ]
      },
      {
        pregunta: '¿Cómo se integra la inteligencia emocional en la terapia cognitiva para adicciones?',
        tipo: 'multiple_choice',
        orden: 5,
        explicacion: 'La inteligencia emocional potencia la autoconciencia y regulación emocional.',
        opciones: [
          { opcion: 'A) Eliminando completamente las emociones del proceso', es_correcta: false, orden: 1 },
          { opcion: 'B) Desarrollando mayor autoconciencia y regulación emocional', es_correcta: true, orden: 2 },
          { opcion: 'C) Focalizándose únicamente en aspectos racionales', es_correcta: false, orden: 3 }
        ]
      }
    ];
    
    // Insertar preguntas una por una
    for (const questionData of questions) {
      console.log(`\n📋 Creando pregunta ${questionData.orden}: ${questionData.pregunta.substring(0, 50)}...`);
      
      // Insertar la pregunta
      const { data: question, error: questionError } = await supabase
        .from('preguntas')
        .insert({
          cuestionario_id: quiz1Id,
          pregunta: questionData.pregunta,
          tipo: questionData.tipo,
          orden: questionData.orden,
          explicacion: questionData.explicacion
        })
        .select('id')
        .single();
      
      if (questionError) {
        console.log(`❌ Error al crear pregunta ${questionData.orden}:`, questionError.message);
        continue;
      }
      
      console.log(`✅ Pregunta creada con ID: ${question.id}`);
      
      // Insertar las opciones de respuesta
      const optionsToInsert = questionData.opciones.map(opt => ({
        pregunta_id: question.id,
        opcion: opt.opcion,
        es_correcta: opt.es_correcta,
        orden: opt.orden
      }));
      
      const { error: optionsError } = await supabase
        .from('opciones_respuesta')
        .insert(optionsToInsert);
      
      if (optionsError) {
        console.log(`❌ Error al crear opciones para pregunta ${questionData.orden}:`, optionsError.message);
      } else {
        console.log(`✅ ${optionsToInsert.length} opciones creadas`);
      }
    }
    
    console.log('\n🎉 Cuestionario 1 completado exitosamente!');
    
  } catch (error) {
    console.log('💥 Error general:', error.message);
  }
}

// Ejecutar la función
createQuestionsQuiz1().then(() => {
  console.log('\n✨ Proceso de creación de preguntas completado');
  process.exit(0);
});