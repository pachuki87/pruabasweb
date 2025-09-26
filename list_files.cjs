
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listFiles(bucketName) {
  console.log('Connecting to Supabase...');
  const { data, error } = await supabase.storage.from(bucketName).list();

  if (error) {
    console.error('Error listing files:', error);
    return;
  }

  console.log('Files in bucket', bucketName, ':');
  console.log(data);
}

const bucketName = process.argv[2];
if (!bucketName) {
  console.log('Please provide a bucket name.');
  process.exit(1);
}

listFiles(bucketName);
