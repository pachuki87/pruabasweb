
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkQuizForLesson(lessonId) {
  console.log('Connecting to Supabase...');

  const { data: lesson, error: lessonError } = await supabase
    .from('lecciones')
    .select('titulo, tiene_cuestionario')
    .eq('id', lessonId)
    .single();

  if (lessonError) {
    console.error('Error fetching lesson:', lessonError);
    return;
  }

  console.log(`Lesson: ${lesson.titulo}`);
  console.log(`Tiene cuestionario flag: ${lesson.tiene_cuestionario}`);

  const { data: quiz, error: quizError } = await supabase
    .from('cuestionarios')
    .select('id, titulo')
    .eq('leccion_id', lessonId);

  if (quizError) {
    console.error('Error fetching quiz:', quizError);
    return;
  }

  if (quiz.length > 0) {
    console.log('Found quiz for this lesson:');
    console.log(quiz);
  } else {
    console.log('No quiz found for this lesson.');
  }
}

const lessonId = process.argv[2];
if (!lessonId) {
  console.log('Please provide a lesson ID.');
  process.exit(1);
}

checkQuizForLesson(lessonId);
