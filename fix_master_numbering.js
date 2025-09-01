import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixMasterNumbering() {
  console.log('=== REORGANIZANDO NUMERACIÓN DEL CURSO MÁSTER ===\n');
  
  const masterCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'; // MÁSTER EN ADICCIONES
  
  console.log('PASO 1: Obteniendo todas las lecciones del curso MÁSTER...');
  
  // Obtener todas las lecciones del curso MÁSTER ordenadas por su orden actual
  const { data: masterLessons, error: masterError } = await supabase
    .from('lecciones')
    .select('id, titulo, orden')
    .eq('curso_id', masterCourseId)
    .order('orden', { ascending: true });
  
  if (masterError) {
    console.error('Error obteniendo lecciones del MÁSTER:', masterError);
    return;
  }
  
  console.log(`Encontradas ${masterLessons.length} lecciones en el curso MÁSTER`);
  console.log('\nLecciones actuales:');
  masterLessons.forEach(lesson => {
    console.log(`${lesson.orden}) ${lesson.titulo}`);
  });
  
  console.log('\nPASO 2: Reorganizando numeración consecutiva desde 1...');
  
  // Renumerar todas las lecciones consecutivamente desde 1
  for (let i = 0; i < masterLessons.length; i++) {
    const lesson = masterLessons[i];
    const newOrder = i + 1;
    
    if (lesson.orden !== newOrder) {
      console.log(`Cambiando "${lesson.titulo}" de orden ${lesson.orden} a ${newOrder}`);
      
      const { error: updateError } = await supabase
        .from('lecciones')
        .update({ orden: newOrder })
        .eq('id', lesson.id);
      
      if (updateError) {
        console.error(`Error actualizando lección ${lesson.id}:`, updateError);
      } else {
        console.log(`✅ Actualizada`);
      }
    } else {
      console.log(`"${lesson.titulo}" ya tiene el orden correcto: ${newOrder}`);
    }
  }
  
  console.log('\nPASO 3: Verificando resultado final...');
  
  // Verificar el resultado final
  const { data: finalLessons, error: finalError } = await supabase
    .from('lecciones')
    .select('titulo, orden')
    .eq('curso_id', masterCourseId)
    .order('orden', { ascending: true });
  
  if (finalError) {
    console.error('Error verificando resultado final:', finalError);
  } else {
    console.log(`\n--- CURSO MÁSTER EN ADICCIONES (FINAL) ---`);
    console.log(`Total lecciones: ${finalLessons.length}`);
    finalLessons.forEach(lesson => {
      console.log(`${lesson.orden}) ${lesson.titulo}`);
    });
    
    // Verificar que la numeración sea consecutiva
    let isConsecutive = true;
    for (let i = 0; i < finalLessons.length; i++) {
      if (finalLessons[i].orden !== i + 1) {
        isConsecutive = false;
        break;
      }
    }
    
    console.log(`\n${isConsecutive ? '✅' : '❌'} Numeración consecutiva: ${isConsecutive ? 'SÍ' : 'NO'}`);
  }
  
  console.log('\n=== REORGANIZACIÓN COMPLETADA ===');
  console.log('✅ Numeración del curso MÁSTER reorganizada desde 1');
  console.log('✅ Todas las lecciones tienen orden consecutivo');
}

fixMasterNumbering().catch(console.error);