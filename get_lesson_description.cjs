
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getLessonDescription(lessonId) {
  console.log('Connecting to Supabase...');
  const { data, error } = await supabase
    .from('lecciones')
    .select('descripcion')
    .eq('id', lessonId)
    .single();

  if (error) {
    console.error('Error fetching lesson description:', error);
    return;
  }

  console.log('Lesson description:');
  console.log(data.descripcion);
}

const lessonId = process.argv[2];
if (!lessonId) {
  console.log('Please provide a lesson ID.');
  process.exit(1);
}

getLessonDescription(lessonId);
