
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateLessonContent(lessonId, newContent) {
  console.log('Connecting to Supabase...');
  const { data, error } = await supabase
    .from('lecciones')
    .update({ descripcion: newContent, archivo_url: null })
    .eq('id', lessonId);

  if (error) {
    console.error('Error updating lesson content:', error);
    return;
  }

  console.log('Lesson content updated successfully:', data);
}

const lessonId = process.argv[2];
const filePath = process.argv[3];

if (!lessonId || !filePath) {
  console.log('Please provide a lesson ID and a file path.');
  process.exit(1);
}

const newContent = fs.readFileSync(filePath, 'utf-8');

updateLessonContent(lessonId, newContent);
