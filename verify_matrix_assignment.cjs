require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMatrixAssignment() {
  try {
    console.log('🔍 Verificando asignación del material MATRIX...');
    
    // Verificar el material MATRIX específico
    const { data: matrixMaterial, error: matrixError } = await supabase
      .from('materiales')
      .select('id, titulo, leccion_id, url_archivo')
      .eq('id', '8f6424b2-61c5-4a58-900b-ce082601609d')
      .single();
    
    if (matrixError) {
      console.error('❌ Error obteniendo material MATRIX:', matrixError);
      return;
    }
    
    console.log('\n📋 Estado actual del material MATRIX:');
    console.log(`   ID: ${matrixMaterial.id}`);
    console.log(`   Título: ${matrixMaterial.titulo}`);
    console.log(`   Lección ID: ${matrixMaterial.leccion_id}`);
    console.log(`   URL: ${matrixMaterial.url_archivo}`);
    
    if (matrixMaterial.leccion_id === '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44') {
      console.log('\n✅ El material MATRIX está correctamente asignado a la lección 1.');
    } else if (matrixMaterial.leccion_id === null) {
      console.log('\n⚠️ El material MATRIX aún no está asignado a ninguna lección.');
    } else {
      console.log(`\n⚠️ El material MATRIX está asignado a una lección diferente: ${matrixMaterial.leccion_id}`);
    }
    
    // Verificar todos los materiales de la lección 1
    const { data: lesson1Materials, error: lesson1Error } = await supabase
      .from('materiales')
      .select('id, titulo, url_archivo')
      .eq('leccion_id', '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44');
    
    if (!lesson1Error) {
      console.log('\n📚 Todos los materiales de la lección 1:');
      if (lesson1Materials.length === 0) {
        console.log('   (No hay materiales asignados)');
      } else {
        lesson1Materials.forEach((material, index) => {
          console.log(`   ${index + 1}. ${material.titulo}`);
          console.log(`      ID: ${material.id}`);
          console.log(`      URL: ${material.url_archivo}`);
        });
      }
    }
    
    // Buscar si hay otros materiales MATRIX en otras lecciones
    const { data: allMatrixMaterials, error: allMatrixError } = await supabase
      .from('materiales')
      .select('id, titulo, leccion_id, url_archivo')
      .or('titulo.ilike.%matrix%,url_archivo.ilike.%matrix%');
    
    if (!allMatrixError && allMatrixMaterials.length > 0) {
      console.log('\n🔍 Todos los materiales MATRIX en el sistema:');
      allMatrixMaterials.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.titulo}`);
        console.log(`      ID: ${material.id}`);
        console.log(`      Lección: ${material.leccion_id || 'Sin asignar'}`);
        console.log(`      URL: ${material.url_archivo}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verifyMatrixAssignment();