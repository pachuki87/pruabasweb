import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const targetCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// Números que necesito asignar según la imagen: 9, 7, 4, 2, 6, 3, 1
const newNumbers = [9, 7, 4, 2, 6, 3, 1];

async function updateLessonNumbers() {
  try {
    console.log('🔍 Obteniendo lecciones actuales...');
    
    // Obtener todas las lecciones del curso ordenadas por su orden actual
    const { data: lessons, error: fetchError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', targetCourseId)
      .order('orden');

    if (fetchError) {
      console.error('❌ Error al obtener lecciones:', fetchError);
      return;
    }

    console.log(`📚 Encontradas ${lessons.length} lecciones:`);
    lessons.forEach(lesson => {
      console.log(`  - ${lesson.orden}) ${lesson.titulo}`);
    });

    console.log('\n🔄 Asignando nuevos números de orden...');
    console.log('Números a asignar:', newNumbers.join(', '));
    
    // Actualizar cada lección con su nuevo número
    for (let i = 0; i < lessons.length && i < newNumbers.length; i++) {
      const lesson = lessons[i];
      const newOrder = newNumbers[i];
      
      console.log(`📝 Cambiando "${lesson.titulo}" de ${lesson.orden} a ${newOrder}`);
      
      const { error: updateError } = await supabase
        .from('lecciones')
        .update({ orden: newOrder })
        .eq('id', lesson.id);

      if (updateError) {
        console.error(`❌ Error actualizando lección ${lesson.titulo}:`, updateError);
      } else {
        console.log(`✅ Actualizada: ${lesson.titulo} -> ${newOrder}`);
      }
    }

    console.log('\n🔍 Verificando resultado final...');
    
    // Verificar el resultado final
    const { data: updatedLessons, error: verifyError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', targetCourseId)
      .order('orden');

    if (verifyError) {
      console.error('❌ Error al verificar resultado:', verifyError);
      return;
    }

    console.log('\n📋 RESULTADO FINAL:');
    updatedLessons.forEach(lesson => {
      console.log(`  ${lesson.orden}) ${lesson.titulo}`);
    });

    console.log('\n✅ ¡Actualización completada!');
    console.log('Los números ahora son:', updatedLessons.map(l => l.orden).sort((a,b) => a-b).join(', '));
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la función
updateLessonNumbers();