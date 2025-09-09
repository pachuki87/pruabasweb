require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllLessonsMaterials() {
  try {
    console.log('🔍 Verificando materiales de todas las lecciones del Master en Adicciones...');
    
    // Obtener todas las lecciones del Master en Adicciones
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden');
    
    if (lessonsError) {
      console.error('❌ Error obteniendo lecciones:', lessonsError);
      return;
    }
    
    console.log(`📚 Total de lecciones encontradas: ${lessons.length}`);
    
    // Verificar materiales para cada lección
    for (const lesson of lessons) {
      console.log(`\n📖 Lección ${lesson.orden}: "${lesson.titulo}"`);
      console.log(`   ID: ${lesson.id}`);
      
      const { data: materials, error: materialsError } = await supabase
        .from('materiales')
        .select('id, titulo, url_archivo')
        .eq('leccion_id', lesson.id);
      
      if (materialsError) {
        console.error(`❌ Error obteniendo materiales para lección ${lesson.orden}:`, materialsError);
        continue;
      }
      
      if (materials && materials.length > 0) {
        console.log(`   📄 Materiales (${materials.length}):`);
        materials.forEach((material, index) => {
          console.log(`      ${index + 1}. ${material.titulo}`);
          console.log(`         URL: ${material.url_archivo || 'No definida'}`);
        });
      } else {
        console.log('   📄 Sin materiales asignados');
      }
    }
    
    // Verificar materiales sin asignar
    console.log('\n🔍 Verificando materiales sin asignar a lecciones...');
    const { data: unassignedMaterials, error: unassignedError } = await supabase
      .from('materiales')
      .select('id, titulo, url_archivo')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .is('leccion_id', null);
    
    if (unassignedError) {
      console.error('❌ Error obteniendo materiales sin asignar:', unassignedError);
    } else if (unassignedMaterials && unassignedMaterials.length > 0) {
      console.log(`\n📋 Materiales sin asignar (${unassignedMaterials.length}):`);
      unassignedMaterials.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.titulo}`);
        console.log(`      URL: ${material.url_archivo || 'No definida'}`);
      });
    } else {
      console.log('\n✅ No hay materiales sin asignar');
    }
    
    console.log('\n✅ Verificación completada');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkAllLessonsMaterials();