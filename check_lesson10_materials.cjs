const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson10Materials() {
  console.log('🔍 Verificando datos de la lección 10...\n');
  
  try {
    // 1. Buscar la lección 10 en el curso Máster en Adicciones
    const courseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
    
    console.log('📚 Buscando lección 10 en el curso:', courseId);
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseId)
      .ilike('titulo', '%10%')
      .order('orden');
    
    if (lessonsError) {
      console.error('❌ Error al buscar lecciones:', lessonsError);
      return;
    }
    
    console.log(`✅ Encontradas ${lessons.length} lecciones que contienen "10":`);
    lessons.forEach(lesson => {
      console.log(`  - ID: ${lesson.id}`);
      console.log(`  - Título: ${lesson.titulo}`);
      console.log(`  - Orden: ${lesson.orden}`);
      console.log(`  - Archivo URL: ${lesson.archivo_url || 'No definido'}`);
      console.log('  ---');
    });
    
    // 2. Buscar materiales para cada lección encontrada
    for (const lesson of lessons) {
      console.log(`\n🔍 Verificando materiales para lección: ${lesson.titulo}`);
      
      const { data: materials, error: materialsError } = await supabase
        .from('materiales')
        .select('*')
        .eq('leccion_id', lesson.id);
      
      if (materialsError) {
        console.error('❌ Error al buscar materiales:', materialsError);
        continue;
      }
      
      console.log(`📄 Encontrados ${materials.length} materiales:`);
      materials.forEach(material => {
        console.log(`  - ID: ${material.id}`);
        console.log(`  - Título: ${material.titulo}`);
        console.log(`  - URL: ${material.url_archivo}`);
        console.log(`  - Tipo: ${material.tipo_material || 'No definido'}`);
        console.log('  ---');
      });
      
      if (materials.length === 0) {
        console.log('⚠️ No se encontraron materiales para esta lección');
      }
    }
    
    // 3. También buscar materiales por curso_id (por si están asociados al curso y no a la lección)
    console.log(`\n🔍 Verificando materiales asociados directamente al curso...`);
    const { data: courseMaterials, error: courseMaterialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('curso_id', courseId)
      .is('leccion_id', null);
    
    if (courseMaterialsError) {
      console.error('❌ Error al buscar materiales del curso:', courseMaterialsError);
    } else {
      console.log(`📄 Encontrados ${courseMaterials.length} materiales asociados al curso:`);
      courseMaterials.forEach(material => {
        console.log(`  - ID: ${material.id}`);
        console.log(`  - Título: ${material.titulo}`);
        console.log(`  - URL: ${material.url_archivo}`);
        console.log('  ---');
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkLesson10Materials();