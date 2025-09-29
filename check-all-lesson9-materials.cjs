const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllLesson9Materials() {
  try {
    console.log('🔍 Buscando todas las lecciones con orden 9...');
    
    // Buscar todas las lecciones con orden 9
    const { data: lessons, error: lessonError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('orden', 9);
    
    if (lessonError) {
      console.error('❌ Error buscando lecciones:', lessonError);
      return;
    }
    
    console.log('📋 Lecciones encontradas con orden 9:', lessons.length);
    
    for (const lesson of lessons) {
      console.log(`\n📚 Lección: ${lesson.titulo} (ID: ${lesson.id})`);
      
      // Obtener materiales para cada lección
      const { data: materials, error: materialsError } = await supabase
        .from('materiales')
        .select('*')
        .eq('leccion_id', lesson.id);
      
      if (materialsError) {
        console.error('❌ Error obteniendo materiales:', materialsError);
        continue;
      }
      
      console.log(`📄 Materiales encontrados: ${materials.length}`);
      materials.forEach((material, index) => {
        console.log(`  ${index + 1}. ${material.titulo} (${material.tipo_material})`);
        console.log(`     URL: ${material.url_archivo}`);
      });
    }
    
    // También buscar materiales que puedan tener 'inteligencia emocional' en el título
    console.log('\n🔍 Buscando materiales con "inteligencia emocional"...');
    const { data: emotionalMaterials, error: emotionalError } = await supabase
      .from('materiales')
      .select('*, lecciones(titulo, orden)')
      .ilike('titulo', '%inteligencia%emocional%');
    
    if (emotionalError) {
      console.error('❌ Error buscando materiales emocionales:', emotionalError);
    } else {
      console.log('📄 Materiales de inteligencia emocional:', emotionalMaterials.length);
      emotionalMaterials.forEach((material, index) => {
        console.log(`  ${index + 1}. ${material.titulo}`);
        console.log(`     Lección: ${material.lecciones?.titulo} (Orden: ${material.lecciones?.orden})`);
        console.log(`     URL: ${material.url_archivo}`);
      });
    }
    
    // Buscar materiales con 'cuaderno' en el título
    console.log('\n🔍 Buscando materiales con "cuaderno"...');
    const { data: cuadernoMaterials, error: cuadernoError } = await supabase
      .from('materiales')
      .select('*, lecciones(titulo, orden)')
      .ilike('titulo', '%cuaderno%');
    
    if (cuadernoError) {
      console.error('❌ Error buscando materiales de cuaderno:', cuadernoError);
    } else {
      console.log('📄 Materiales con "cuaderno":', cuadernoMaterials.length);
      cuadernoMaterials.forEach((material, index) => {
        console.log(`  ${index + 1}. ${material.titulo}`);
        console.log(`     Lección: ${material.lecciones?.titulo} (Orden: ${material.lecciones?.orden})`);
        console.log(`     URL: ${material.url_archivo}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkAllLesson9Materials();