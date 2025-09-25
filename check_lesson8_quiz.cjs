const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkQuizQuestions() {
  const quizId = '5931480d-27d0-4845-a11e-817f23452764';

  const { data: preguntas, error } = await supabase
    .from('preguntas')
    .select('*')
    .eq('cuestionario_id', quizId);

  if (error) {
    console.error('Error checking questions:', error);
    return;
  }

  console.log('Existing questions:', preguntas?.length || 0);
  if (preguntas && preguntas.length > 0) {
    preguntas.forEach((p, i) => {
      console.log(`${i + 1}. ${p.pregunta}`);
    });
  } else {
    console.log('No questions found - need to create them');
  }
}

checkQuizQuestions();