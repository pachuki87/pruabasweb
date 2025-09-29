const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkAnswerOptions() {
  const quizId = '5931480d-27d0-4845-a11e-817f23452764';

  // First get all questions for this quiz
  const { data: preguntas, error: preguntasError } = await supabase
    .from('preguntas')
    .select('id, pregunta, tipo')
    .eq('cuestionario_id', quizId);

  if (preguntasError) {
    console.error('Error getting questions:', preguntasError);
    return;
  }

  console.log('Checking answer options for', preguntas?.length || 0, 'questions\n');

  if (preguntas && preguntas.length > 0) {
    for (const pregunta of preguntas) {
      console.log(`\n${pregunta.pregunta.substring(0, 50)}... (ID: ${pregunta.id})`);
      console.log(`Type: ${pregunta.tipo}`);

      // Check for answer options
      const { data: opciones, error: opcionesError } = await supabase
        .from('opciones_respuesta')
        .select('*')
        .eq('pregunta_id', pregunta.id)
        .order('orden');

      if (opcionesError) {
        console.error('Error getting options:', opcionesError);
        continue;
      }

      if (opciones && opciones.length > 0) {
        opciones.forEach(opcion => {
          console.log(`  ${opcion.orden}. ${opcion.opcion} ${opcion.es_correcta ? '(CORRECT)' : ''}`);
        });
      } else {
        console.log('  No answer options found');
      }
    }
  }
}

checkAnswerOptions();