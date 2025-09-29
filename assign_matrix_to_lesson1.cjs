require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function assignMatrixToLesson1() {
  try {
    console.log('🔧 Asignando material MATRIX a la lección 1...');
    
    const materialId = '8f6424b2-61c5-4a58-900b-ce082601609d';
    const leccion1Id = '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44';
    
    // Actualizar el material para asignarlo a la lección 1
    const { data, error } = await supabase
      .from('materiales')
      .update({ leccion_id: leccion1Id })
      .eq('id', materialId)
      .select();
    
    if (error) {
      console.error('❌ Error asignando material:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Material MATRIX asignado exitosamente a la lección 1:');
      console.log(`   ID: ${data[0].id}`);
      console.log(`   Título: ${data[0].titulo}`);
      console.log(`   Lección ID: ${data[0].leccion_id}`);
      console.log(`   URL: ${data[0].url_archivo}`);
    } else {
      console.log('✅ Material actualizado (sin datos de retorno)');
    }
    
    // Verificar que la asignación fue exitosa
    const { data: verification, error: verifyError } = await supabase
      .from('materiales')
      .select('id, titulo, leccion_id')
      .eq('leccion_id', leccion1Id);
    
    if (!verifyError) {
      console.log('\n📋 Materiales en la lección 1 después de la asignación:');
      verification.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.titulo} (ID: ${material.id})`);
      });
    }
    
    console.log('\n✅ Proceso completado. El material MATRIX ahora está correctamente asignado a la lección 1.');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

assignMatrixToLesson1();