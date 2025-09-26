
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function downloadLessonFile(filePath) {
  console.log('Connecting to Supabase...');
  const { data, error } = await supabase.storage
    .from('cursomasteradicciones')
    .download(filePath);

  if (error) {
    console.error('Error downloading file:', error);
    return;
  }

  console.log('File content:');
  console.log(await data.text());
}

const filePath = process.argv[2];
if (!filePath) {
  console.log('Please provide a file path.');
  process.exit(1);
}

downloadLessonFile(filePath);
