require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson3Materials() {
  try {
    console.log('🔍 Verificando materiales de la lección 3...');
    
    // Obtener información de la lección 3
    const { data: lesson3, error: lesson3Error } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .eq('orden', 3)
      .single();
    
    if (lesson3Error) {
      console.error('❌ Error obteniendo lección 3:', lesson3Error);
      return;
    }
    
    console.log('📚 Lección 3:', lesson3);
    
    // Obtener materiales asignados a la lección 3
    const { data: materials, error: materialsError } = await supabase
      .from('materiales')
      .select('id, titulo, leccion_id')
      .eq('leccion_id', lesson3.id);
    
    if (materialsError) {
      console.error('❌ Error obteniendo materiales:', materialsError);
      return;
    }
    
    console.log('📄 Materiales en lección 3:', materials);
    
    // Verificar específicamente el material MATRIX
    const { data: matrixMaterial, error: matrixError } = await supabase
      .from('materiales')
      .select('id, titulo, leccion_id')
      .ilike('titulo', '%MATRIX%');
    
    if (matrixError) {
      console.error('❌ Error buscando material MATRIX:', matrixError);
      return;
    }
    
    console.log('🎯 Material MATRIX encontrado:', matrixMaterial);
    
    // Verificar todos los materiales del curso Master en Adicciones
    const { data: allMaterials, error: allError } = await supabase
      .from('materiales')
      .select('id, titulo, leccion_id')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('leccion_id');
    
    if (allError) {
      console.error('❌ Error obteniendo todos los materiales:', allError);
      return;
    }
    
    console.log('📋 Todos los materiales del curso Master en Adicciones:');
    allMaterials.forEach(material => {
      console.log(`  - ${material.titulo} (Lección ID: ${material.leccion_id})`);
    });
    
    console.log('✅ Verificación completada');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkLesson3Materials();