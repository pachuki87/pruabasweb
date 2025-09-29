require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkObsoletePdfs() {
  try {
    console.log('🔍 Verificando estructura de la tabla materiales...');
    
    // Primero obtener algunos registros para ver la estructura
    const { data: sample, error: sampleError } = await supabase
      .from('materiales')
      .select('*')
      .limit(3);
    
    if (sampleError) {
      console.error('❌ Error consultando materiales:', sampleError);
      return;
    }
    
    if (sample && sample.length > 0) {
      console.log('\n📋 ESTRUCTURA DE LA TABLA MATERIALES:');
      console.log('Columnas disponibles:', Object.keys(sample[0]));
      console.log('\nEjemplo de registro:');
      console.log(JSON.stringify(sample[0], null, 2));
    }
    
    // Buscar materiales que contengan rutas de PDFs
    const { data: materiales, error } = await supabase
      .from('materiales')
      .select('*');
    
    if (error) {
      console.error('❌ Error consultando todos los materiales:', error);
      return;
    }
    
    console.log(`\n📊 TOTAL DE MATERIALES: ${materiales?.length || 0}`);
    
    if (materiales && materiales.length > 0) {
      // Buscar materiales que puedan tener rutas obsoletas
      const materialesConArchivos = materiales.filter(m => {
        // Buscar en todas las propiedades que puedan contener rutas de archivos
        const jsonStr = JSON.stringify(m).toLowerCase();
        return jsonStr.includes('.pdf') || jsonStr.includes('/pdfs/');
      });
      
      console.log(`\n📁 MATERIALES CON REFERENCIAS A PDFs: ${materialesConArchivos.length}`);
      
      materialesConArchivos.forEach((material, index) => {
        console.log(`\n${index + 1}. ${material.titulo || material.nombre || 'Sin título'}`);
        console.log(`   ID: ${material.id}`);
        console.log(`   Datos completos:`);
        console.log(JSON.stringify(material, null, 2));
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkObsoletePdfs();