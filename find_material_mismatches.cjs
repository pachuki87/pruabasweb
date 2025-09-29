const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

async function findMaterialMismatches() {
  console.log('Connecting to Supabase...');
  const { data: materials, error } = await supabase.from('materiales').select('*');

  if (error) {
    console.error('Error fetching materials:', error);
    return;
  }

  console.log('Checking for material mismatches...');
  const mismatches = [];

  // Get all files in the public directory
  const publicFiles = getAllFiles('C:/Users/pabli/OneDrive/Desktop/institutoooo - copia/pruabasweb/public');

  const videoExtensions = ['.mp4', '.mov', '.avi'];

  // Check for video files in public that are in materials with wrong type
  for (const file of publicFiles) {
    const fileLower = file.toLowerCase();
    const isVideo = videoExtensions.some(ext => fileLower.endsWith(ext));

    if (isVideo) {
      const material = materials.find(m => m.url_archivo && m.url_archivo.toLowerCase().includes(path.basename(fileLower)));
      if (material && material.tipo_material !== 'video') {
        mismatches.push({ id: material.id, title: material.titulo, url: material.url_archivo, type: material.tipo_material, expected_type: 'video' });
      }
    }
  }

  // Check for mismatches in the materials table
  for (const material of materials) {
    const url = material.url_archivo.toLowerCase();
    const tipo = material.tipo_material;

    if (url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.avi')) {
      if (tipo !== 'video') {
        if (!mismatches.some(m => m.id === material.id)) {
            mismatches.push({ id: material.id, title: material.titulo, url: material.url_archivo, type: tipo, expected_type: 'video' });
        }
      }
    } else if (url.endsWith('.pptx')) {
      if (tipo !== 'presentacion') {
        if (!mismatches.some(m => m.id === material.id)) {
            mismatches.push({ id: material.id, title: material.titulo, url: material.url_archivo, type: tipo, expected_type: 'presentacion' });
        }
      }
    } else if (url.endsWith('.pdf')) {
      if (tipo !== 'pdf') {
        if (!mismatches.some(m => m.id === material.id)) {
            mismatches.push({ id: material.id, title: material.titulo, url: material.url_archivo, type: tipo, expected_type: 'pdf' });
        }
      }
    }
  }

  if (mismatches.length > 0) {
    console.log('Found mismatches:');
    console.log(JSON.stringify(mismatches, null, 2));
  } else {
    console.log('No mismatches found.');
  }
}

findMaterialMismatches();