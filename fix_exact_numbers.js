import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const CURSO_ID = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
const EXACT_NUMBERS = [9, 7, 4, 2, 6, 3, 1]; // Los números exactos que deben usarse

async function fixExactNumbers() {
  try {
    console.log('🔍 Consultando lecciones actuales en el curso...');
    
    // Obtener todas las lecciones del curso ordenadas por su orden actual
    const { data: lessons, error: fetchError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', CURSO_ID)
      .order('orden', { ascending: true });

    if (fetchError) {
      console.error('❌ Error al obtener lecciones:', fetchError);
      return;
    }

    console.log(`📚 Encontradas ${lessons.length} lecciones:`);
    lessons.forEach((lesson, index) => {
      console.log(`  ${index + 1}. ${lesson.titulo} (orden actual: ${lesson.orden})`);
    });

    if (lessons.length !== EXACT_NUMBERS.length) {
      console.error(`❌ Error: Se esperaban ${EXACT_NUMBERS.length} lecciones, pero se encontraron ${lessons.length}`);
      return;
    }

    console.log('\n🔄 Asignando números exactos a cada lección...');
    
    // Asignar cada número exacto a cada lección en el orden que aparecen
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const newOrder = EXACT_NUMBERS[i];
      
      console.log(`  Actualizando "${lesson.titulo}" de orden ${lesson.orden} a orden ${newOrder}`);
      
      const { error: updateError } = await supabase
        .from('lecciones')
        .update({ orden: newOrder })
        .eq('id', lesson.id);

      if (updateError) {
        console.error(`❌ Error al actualizar lección ${lesson.id}:`, updateError);
        return;
      }
    }

    console.log('\n✅ Numeración actualizada exitosamente!');
    
    // Verificar el resultado final
    console.log('\n🔍 Verificando resultado final...');
    const { data: finalLessons, error: finalError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', CURSO_ID)
      .order('orden', { ascending: true });

    if (finalError) {
      console.error('❌ Error en verificación final:', finalError);
      return;
    }

    console.log(`\n📋 Resultado final (${finalLessons.length} lecciones):`);
    finalLessons.forEach(lesson => {
      console.log(`  ${lesson.orden}) ${lesson.titulo}`);
    });

    // Verificar que se usaron exactamente los números correctos
    const usedNumbers = finalLessons.map(l => l.orden).sort((a, b) => a - b);
    const expectedNumbers = [...EXACT_NUMBERS].sort((a, b) => a - b);
    
    const numbersMatch = JSON.stringify(usedNumbers) === JSON.stringify(expectedNumbers);
    
    if (numbersMatch) {
      console.log('\n🎉 ¡PERFECTO! Se usaron exactamente los números correctos: ' + EXACT_NUMBERS.join(', '));
    } else {
      console.log('\n❌ ERROR: Los números no coinciden');
      console.log('  Esperados:', expectedNumbers.join(', '));
      console.log('  Obtenidos:', usedNumbers.join(', '));
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

fixExactNumbers();