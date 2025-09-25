const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

async function createMissingOptions() {
  const quizId = '5931480d-27d0-4845-a11e-817f23452764';

  // Get all questions for this quiz
  const { data: preguntas, error: preguntasError } = await supabase
    .from('preguntas')
    .select('id, pregunta, tipo')
    .eq('cuestionario_id', quizId);

  if (preguntasError) {
    console.error('Error getting questions:', preguntasError);
    return;
  }

  console.log('Creating missing answer options for', preguntas?.length || 0, 'questions\n');

  const opcionesToCreate = [];

  if (preguntas && preguntas.length > 0) {
    for (const pregunta of preguntas) {
      // Check if options already exist
      const { data: existingOptions, error: checkError } = await supabase
        .from('opciones_respuesta')
        .select('*')
        .eq('pregunta_id', pregunta.id);

      if (checkError) {
        console.error('Error checking existing options:', checkError);
        continue;
      }

      if (existingOptions && existingOptions.length > 0) {
        console.log(`Options already exist for question: ${pregunta.pregunta.substring(0, 50)}...`);
        continue;
      }

      // Create options based on question type
      if (pregunta.tipo === 'verdadero_falso') {
        console.log(`Creating true/false options for: ${pregunta.pregunta.substring(0, 50)}...`);

        // Determine correct answer based on question content
        let esCorrectoVerdadero = false;
        if (pregunta.pregunta.includes('afectan más a mujeres') ||
            pregunta.pregunta.includes('interseccionalidad ayuda') ||
            pregunta.pregunta.includes('masculinidades no tienen relación')) {
          esCorrectoVerdadero = true;
        }

        opcionesToCreate.push({
          pregunta_id: pregunta.id,
          opcion: 'Verdadero',
          es_correcta: esCorrectoVerdadero,
          orden: 1
        });

        opcionesToCreate.push({
          pregunta_id: pregunta.id,
          opcion: 'Falso',
          es_correcta: !esCorrectoVerdadero,
          orden: 2
        });
      } else if (pregunta.tipo === 'multiple_choice') {
        console.log(`Creating multiple choice options for: ${pregunta.pregunta.substring(0, 50)}...`);

        // For the vulnerability factors question, correct answers are a, c, d (not b)
        const opciones = [
          { opcion: 'Violencia doméstica', es_correcta: true, orden: 1 },
          { opcion: 'Redes de apoyo sólidas', es_correcta: false, orden: 2 },
          { opcion: 'Estigmatización social', es_correcta: true, orden: 3 },
          { opcion: 'Acceso a tratamiento especializado', es_correcta: true, orden: 4 }
        ];

        for (const opt of opciones) {
          opcionesToCreate.push({
            pregunta_id: pregunta.id,
            opcion: opt.opcion,
            es_correcta: opt.es_correcta,
            orden: opt.orden
          });
        }
      }
    }
  }

  // Insert all missing options
  if (opcionesToCreate.length > 0) {
    console.log(`\nInserting ${opcionesToCreate.length} missing answer options...`);

    const { data, error } = await supabase
      .from('opciones_respuesta')
      .insert(opcionesToCreate)
      .select();

    if (error) {
      console.error('Error inserting options:', error);
      return;
    }

    console.log('✅ Successfully inserted', data?.length || 0, 'answer options');
  } else {
    console.log('✅ All answer options already exist');
  }
}

createMissingOptions();