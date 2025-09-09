require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Usar service key para bypass RLS
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAllQuestions() {
  try {
    console.log('📝 Creando preguntas para ambos cuestionarios...');
    
    const quiz1Id = '7a52daad-db71-4cb5-8701-967fffbb6966';
    const quiz2Id = '73571904-d8e5-41ee-9485-60d4996819a8';
    
    // Preguntas para Cuestionario 1: Fundamentos de Terapia Cognitiva
    const quiz1Questions = [
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
      }
    ];
    
    // Preguntas para Cuestionario 2: Técnicas de Intervención Cognitiva
    const quiz2Questions = [
      {
        pregunta: '¿Qué técnica se utiliza para identificar patrones cognitivos disfuncionales?',
        tipo: 'multiple_choice',
        orden: 1,
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
        orden: 2,
        explicacion: 'La inteligencia emocional potencia la autoconciencia y regulación emocional.',
        opciones: [
          { opcion: 'A) Eliminando completamente las emociones del proceso', es_correcta: false, orden: 1 },
          { opcion: 'B) Desarrollando mayor autoconciencia y regulación emocional', es_correcta: true, orden: 2 },
          { opcion: 'C) Focalizándose únicamente en aspectos racionales', es_correcta: false, orden: 3 }
        ]
      },
      {
        pregunta: '¿Cuál es el objetivo principal de las técnicas de reestructuración cognitiva?',
        tipo: 'multiple_choice',
        orden: 3,
        explicacion: 'La reestructuración cognitiva busca modificar pensamientos disfuncionales por otros más adaptativos.',
        opciones: [
          { opcion: 'A) Eliminar todos los pensamientos negativos', es_correcta: false, orden: 1 },
          { opcion: 'B) Modificar pensamientos disfuncionales por otros más adaptativos', es_correcta: true, orden: 2 },
          { opcion: 'C) Aumentar la velocidad del pensamiento', es_correcta: false, orden: 3 }
        ]
      }
    ];
    
    // Función para crear preguntas de un cuestionario
    async function createQuestionsForQuiz(questions, quizId, quizName) {
      console.log(`\n🎯 Creando preguntas para ${quizName}`);
      
      for (const questionData of questions) {
        console.log(`\n📋 Creando pregunta ${questionData.orden}: ${questionData.pregunta.substring(0, 50)}...`);
        
        // Insertar la pregunta usando SQL directo
        const { data: question, error: questionError } = await supabase
          .from('preguntas')
          .insert({
            cuestionario_id: quizId,
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
    }
    
    // Crear preguntas para ambos cuestionarios
    await createQuestionsForQuiz(quiz1Questions, quiz1Id, 'Cuestionario 1: Fundamentos de Terapia Cognitiva');
    await createQuestionsForQuiz(quiz2Questions, quiz2Id, 'Cuestionario 2: Técnicas de Intervención Cognitiva');
    
    // Actualizar la lección para indicar que tiene cuestionario
    console.log('\n🔄 Actualizando lección para indicar que tiene cuestionario...');
    const { error: updateError } = await supabase
      .from('lecciones')
      .update({ tiene_cuestionario: true })
      .eq('id', 'e4546103-526d-42ff-a98b-0db4828caa44');
    
    if (updateError) {
      console.log('❌ Error al actualizar lección:', updateError.message);
    } else {
      console.log('✅ Lección actualizada: tiene_cuestionario = true');
    }
    
    console.log('\n🎉 Todos los cuestionarios creados exitosamente!');
    
  } catch (error) {
    console.log('💥 Error general:', error.message);
  }
}

// Ejecutar la función
createAllQuestions().then(() => {
  console.log('\n✨ Proceso completado');
  process.exit(0);
});