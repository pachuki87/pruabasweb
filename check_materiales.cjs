require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMateriales() {
  try {
    console.log('🔍 Verificando materiales en la base de datos...');
    
    // Obtener todos los materiales actuales
    const { data: materiales, error } = await supabase
      .from('materiales')
      .select('*')
      .order('titulo');
    
    if (error) {
      console.error('❌ Error al obtener materiales:', error);
      return;
    }
    
    console.log(`\n📚 MATERIALES EN BASE DE DATOS (${materiales.length} total):`);
    materiales.forEach((material, index) => {
      console.log(`${index + 1}. ${material.titulo}`);
      console.log(`   📂 Tipo: ${material.tipo_material || 'No especificado'}`);
      console.log(`   🔗 URL: ${material.url_archivo}`);
      console.log(`   📚 Curso ID: ${material.curso_id}`);
      if (material.leccion_id) {
        console.log(`   📖 Lección ID: ${material.leccion_id}`);
      }
      console.log('');
    });
    
    // Verificar PDFs disponibles
    const pdfsDir = path.join(__dirname, 'public', 'pdfs');
    const masterPdfsDir = path.join(pdfsDir, 'master-adicciones');
    
    console.log('\n📁 PDFs DISPONIBLES EN CARPETA:');
    
    // PDFs en carpeta principal
    const mainPdfs = fs.readdirSync(pdfsDir).filter(file => 
      file.endsWith('.pdf') && !fs.statSync(path.join(pdfsDir, file)).isDirectory()
    );
    
    console.log('\n📂 Carpeta principal (/pdfs):');
    mainPdfs.forEach((pdf, index) => {
      console.log(`${index + 1}. ${pdf}`);
    });
    
    // PDFs en carpeta master-adicciones
    if (fs.existsSync(masterPdfsDir)) {
      const masterPdfs = fs.readdirSync(masterPdfsDir).filter(file => file.endsWith('.pdf'));
      console.log('\n📂 Carpeta master-adicciones:');
      masterPdfs.forEach((pdf, index) => {
        console.log(`${index + 1}. ${pdf}`);
      });
    }
    
    // Obtener cursos para referencia
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .order('titulo');
    
    if (!cursosError && cursos) {
      console.log('\n🎓 CURSOS DISPONIBLES:');
      cursos.forEach((curso, index) => {
        console.log(`${index + 1}. ${curso.titulo} (ID: ${curso.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkMateriales();