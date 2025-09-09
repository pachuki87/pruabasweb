require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findMatrixDuplicates() {
  try {
    console.log('🔍 Buscando materiales MATRIX duplicados...');
    
    // Buscar todos los materiales que contengan 'matrix' en título o URL
    const { data: matrixMaterials, error } = await supabase
      .from('materiales')
      .select('id, titulo, leccion_id, url_archivo, curso_id')
      .or('titulo.ilike.%matrix%,url_archivo.ilike.%matrix%');
    
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log(`\n📋 Materiales MATRIX encontrados: ${matrixMaterials.length}`);
    
    matrixMaterials.forEach((material, index) => {
      console.log(`\n${index + 1}. Material:`);
      console.log(`   ID: ${material.id}`);
      console.log(`   Título: ${material.titulo}`);
      console.log(`   Lección ID: ${material.leccion_id}`);
      console.log(`   Curso ID: ${material.curso_id}`);
      console.log(`   URL: ${material.url_archivo}`);
    });
    
    // Buscar información de las lecciones
    if (matrixMaterials.length > 0) {
      const leccionIds = [...new Set(matrixMaterials.map(m => m.leccion_id).filter(Boolean))];
      
      if (leccionIds.length > 0) {
        const { data: lecciones, error: leccionError } = await supabase
          .from('lecciones')
          .select('id, titulo, orden')
          .in('id', leccionIds);
        
        if (!leccionError && lecciones) {
          console.log('\n📚 Información de lecciones:');
          lecciones.forEach(leccion => {
            console.log(`   Lección ${leccion.orden}: ${leccion.titulo} (ID: ${leccion.id})`);
          });
        }
      }
    }
    
    // Identificar duplicados para eliminar
    const duplicatesToDelete = matrixMaterials.filter(material => {
      // Mantener solo el que está en la lección 1 (orden 1)
      // Los demás son duplicados que deben eliminarse
      return material.leccion_id !== null; // Primero necesitamos saber qué lección es la 1
    });
    
    console.log('\n🎯 Análisis completado.');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

findMatrixDuplicates();