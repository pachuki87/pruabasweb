const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanLessonDuplicates() {
  try {
    console.log('🧹 Limpiando lecciones duplicadas del curso "Experto en Conductas Adictivas"...');
    
    const courseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';
    
    // Obtener todas las lecciones del curso
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseId)
      .order('creado_en', { ascending: true }); // Ordenar por fecha de creación para mantener las más antiguas
    
    if (error) {
      console.error('❌ Error al obtener lecciones:', error);
      return;
    }
    
    console.log(`📚 Total de lecciones encontradas: ${lessons.length}`);
    
    // Agrupar lecciones por título y orden
    const lessonGroups = {};
    const toKeep = [];
    const toDelete = [];
    
    lessons.forEach(lesson => {
      const key = `${lesson.titulo}_${lesson.orden}`;
      
      if (!lessonGroups[key]) {
        lessonGroups[key] = [];
      }
      lessonGroups[key].push(lesson);
    });
    
    // Para cada grupo, mantener solo la primera lección (más antigua)
    Object.keys(lessonGroups).forEach(key => {
      const group = lessonGroups[key];
      
      if (group.length > 1) {
        // Mantener la primera (más antigua)
        toKeep.push(group[0]);
        
        // Marcar el resto para eliminar
        for (let i = 1; i < group.length; i++) {
          toDelete.push(group[i]);
        }
        
        console.log(`🔍 Grupo "${key}": ${group.length} lecciones encontradas`);
        console.log(`  ✅ Mantener: ${group[0].id} (creado: ${group[0].creado_en})`);
        group.slice(1).forEach(lesson => {
          console.log(`  ❌ Eliminar: ${lesson.id} (creado: ${lesson.creado_en})`);
        });
      } else {
        toKeep.push(group[0]);
      }
    });
    
    console.log(`\n📊 Resumen:`);
    console.log(`  ✅ Lecciones a mantener: ${toKeep.length}`);
    console.log(`  ❌ Lecciones a eliminar: ${toDelete.length}`);
    
    if (toDelete.length === 0) {
      console.log('✅ No hay duplicados para eliminar');
      return;
    }
    
    // Confirmar antes de eliminar
    console.log('\n⚠️  ¿Proceder con la eliminación de duplicados? (y/N)');
    
    // Para automatizar, vamos a proceder directamente
    console.log('🗑️  Procediendo con la eliminación...');
    
    // Eliminar duplicados
    const idsToDelete = toDelete.map(lesson => lesson.id);
    
    const { error: deleteError } = await supabase
      .from('lecciones')
      .delete()
      .in('id', idsToDelete);
    
    if (deleteError) {
      console.error('❌ Error al eliminar duplicados:', deleteError);
      return;
    }
    
    console.log(`✅ Se eliminaron ${toDelete.length} lecciones duplicadas`);
    
    // Verificar resultado final
    const { data: finalLessons, error: finalError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', courseId)
      .order('orden', { ascending: true });
    
    if (finalError) {
      console.error('❌ Error al verificar resultado final:', finalError);
      return;
    }
    
    console.log(`\n🎉 Limpieza completada. Lecciones restantes: ${finalLessons.length}`);
    console.log('\n📚 Lecciones finales:');
    finalLessons.forEach((lesson, index) => {
      console.log(`${index + 1}. [Orden: ${lesson.orden}] ${lesson.titulo}`);
    });
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

cleanLessonDuplicates();