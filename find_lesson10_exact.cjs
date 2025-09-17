const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findLesson10() {
  console.log('🔍 Buscando la lección 10 específica...\n');
  
  try {
    const courseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
    
    // 1. Buscar todas las lecciones del curso ordenadas
    console.log('📚 Obteniendo todas las lecciones del curso Máster en Adicciones:');
    const { data: allLessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseId)
      .order('orden');
    
    if (lessonsError) {
      console.error('❌ Error al buscar lecciones:', lessonsError);
      return;
    }
    
    console.log(`✅ Encontradas ${allLessons.length} lecciones:`);
    allLessons.forEach((lesson, index) => {
      console.log(`  ${index + 1}. ID: ${lesson.id}`);
      console.log(`     Título: ${lesson.titulo}`);
      console.log(`     Orden: ${lesson.orden}`);
      console.log(`     Archivo URL: ${lesson.archivo_url || 'No definido'}`);
      console.log('     ---');
    });
    
    // 2. Buscar específicamente por "trabajo final" o "tfm"
    console.log('\n🎯 Buscando lecciones relacionadas con "trabajo final" o "tfm":');
    const { data: tfmLessons, error: tfmError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseId)
      .or('titulo.ilike.%trabajo final%,titulo.ilike.%tfm%');
    
    if (tfmError) {
      console.error('❌ Error al buscar lecciones TFM:', tfmError);
    } else {
      console.log(`✅ Encontradas ${tfmLessons.length} lecciones relacionadas con TFM:`);
      tfmLessons.forEach(lesson => {
        console.log(`  - ID: ${lesson.id}`);
        console.log(`  - Título: ${lesson.titulo}`);
        console.log(`  - Orden: ${lesson.orden}`);
        console.log(`  - Archivo URL: ${lesson.archivo_url || 'No definido'}`);
        console.log('  ---');
      });
    }
    
    // 3. Si hay una lección 10 (la décima en orden), verificar sus materiales
    if (allLessons.length >= 10) {
      const lesson10 = allLessons[9]; // Índice 9 para la lección 10
      console.log(`\n🔍 Verificando materiales para la lección #10: ${lesson10.titulo}`);
      
      const { data: materials, error: materialsError } = await supabase
        .from('materiales')
        .select('*')
        .eq('leccion_id', lesson10.id);
      
      if (materialsError) {
        console.error('❌ Error al buscar materiales:', materialsError);
      } else {
        console.log(`📄 Encontrados ${materials.length} materiales para la lección 10:`);
        materials.forEach(material => {
          console.log(`  - ID: ${material.id}`);
          console.log(`  - Título: ${material.titulo}`);
          console.log(`  - URL: ${material.url_archivo}`);
          console.log(`  - Tipo: ${material.tipo_material || 'No definido'}`);
          console.log('  ---');
        });
      }
    } else {
      console.log('\n⚠️ No hay suficientes lecciones para tener una lección #10');
    }
    
    // 4. Verificar si hay materiales que deberían estar asociados a la lección 10
    console.log('\n🔍 Buscando materiales que podrían pertenecer a la lección 10:');
    const { data: tfmMaterials, error: tfmMaterialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('curso_id', courseId)
      .or('titulo.ilike.%trabajo final%,titulo.ilike.%tfm%,titulo.ilike.%guia practica%');
    
    if (tfmMaterialsError) {
      console.error('❌ Error al buscar materiales TFM:', tfmMaterialsError);
    } else {
      console.log(`📄 Encontrados ${tfmMaterials.length} materiales relacionados con TFM:`);
      tfmMaterials.forEach(material => {
        console.log(`  - ID: ${material.id}`);
        console.log(`  - Título: ${material.titulo}`);
        console.log(`  - URL: ${material.url_archivo}`);
        console.log(`  - Lección ID: ${material.leccion_id || 'No asignado'}`);
        console.log('  ---');
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

findLesson10();