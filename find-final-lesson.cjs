const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findFinalLesson() {
  try {
    console.log('🔍 Buscando la lección "TRABAJO FINAL DE MÁSTER"...');
    
    // Buscar la lección por título
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .ilike('titulo', '%TRABAJO FINAL DE MÁSTER%');
    
    if (lessonsError) {
      console.error('❌ Error al buscar lecciones:', lessonsError);
      return;
    }
    
    if (!lessons || lessons.length === 0) {
      console.log('⚠️ No se encontró la lección "TRABAJO FINAL DE MÁSTER"');
      
      // Buscar lecciones similares
      const { data: similarLessons, error: similarError } = await supabase
        .from('lecciones')
        .select('*')
        .or('titulo.ilike.%TRABAJO%,titulo.ilike.%FINAL%,titulo.ilike.%MÁSTER%,titulo.ilike.%MASTER%');
      
      if (similarError) {
        console.error('❌ Error al buscar lecciones similares:', similarError);
        return;
      }
      
      console.log('📋 Lecciones similares encontradas:');
      similarLessons?.forEach(lesson => {
        console.log(`- ID: ${lesson.id}, Título: "${lesson.titulo}", Curso: ${lesson.curso_id}`);
      });
      
      return;
    }
    
    console.log(`✅ Lección encontrada:`);
    lessons.forEach(lesson => {
      console.log(`- ID: ${lesson.id}`);
      console.log(`- Título: "${lesson.titulo}"`);
      console.log(`- Curso ID: ${lesson.curso_id}`);
      console.log(`- Número de lección: ${lesson.numero_leccion}`);
      console.log(`- Creada: ${lesson.created_at}`);
      console.log('---');
    });
    
    // Ahora buscar los materiales de esta lección
    const lessonId = lessons[0].id;
    console.log(`\n🔍 Buscando materiales para la lección ID: ${lessonId}...`);
    
    const { data: materials, error: materialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lessonId);
    
    if (materialsError) {
      console.error('❌ Error al buscar materiales:', materialsError);
      return;
    }
    
    if (!materials || materials.length === 0) {
      console.log('⚠️ No se encontraron materiales para esta lección');
      return;
    }
    
    console.log(`\n📄 Materiales encontrados (${materials.length}):`);
    materials.forEach((material, index) => {
      console.log(`${index + 1}. ID: ${material.id}`);
      console.log(`   Título: "${material.titulo}"`);
      console.log(`   Tipo: ${material.tipo}`);
      console.log(`   URL: ${material.url}`);
      console.log(`   Creado: ${material.created_at}`);
      console.log('---');
    });
    
    // Identificar cuáles mantener y cuáles eliminar
    console.log('\n🎯 Análisis de materiales:');
    const toKeep = [];
    const toRemove = [];
    
    materials.forEach(material => {
      const title = material.titulo.toLowerCase();
      if (title.includes('guia') && title.includes('practica') && title.includes('tfm')) {
        toKeep.push(material);
        console.log(`✅ MANTENER: "${material.titulo}" (ID: ${material.id})`);
      } else {
        toRemove.push(material);
        console.log(`❌ ELIMINAR: "${material.titulo}" (ID: ${material.id})`);
      }
    });
    
    console.log(`\n📊 Resumen:`);
    console.log(`- Materiales a mantener: ${toKeep.length}`);
    console.log(`- Materiales a eliminar: ${toRemove.length}`);
    
    return {
      lesson: lessons[0],
      materials,
      toKeep,
      toRemove
    };
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la función
findFinalLesson().then(() => {
  console.log('\n🏁 Análisis completado');
}).catch(error => {
  console.error('❌ Error en la ejecución:', error);
});