import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const targetCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

async function addRecoveryCoaching() {
  try {
    console.log('=== AGREGANDO LECCIÓN RECOVERY COACHING ===');
    
    // Crear la lección faltante "RECOVERY COACHING"
    const { data: newLesson, error: createError } = await supabase
      .from('lecciones')
      .insert({
        titulo: 'RECOVERY COACHING',
        curso_id: targetCourseId,
        orden: 4, // Será reordenada después
        descripcion: 'Lección sobre Recovery Coaching.',
        duracion_estimada: 60
      })
      .select()
      .single();
    
    if (createError) {
      console.error('Error al crear lección Recovery Coaching:', createError);
      return;
    }
    
    console.log(`✓ Nueva lección creada: ${newLesson.titulo} (ID: ${newLesson.id})`);
    
    // Ahora reordenar todas las lecciones según el orden correcto de la imagen
    console.log('\n=== REORDENANDO SEGÚN IMAGEN ===');
    
    const correctOrder = [
      'FUNDAMENTOS P TERAPEUTICO',
      'FAMILIA Y TRABAJO EQUIPO',
      'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
      'RECOVERY COACHING',
      'NUEVOS MODELOS TERAPEUTICOS',
      'TERAPIA COGNITIVA DROGODEPENDENENCIAS',
      'INTELIGENCIA EMOCIONAL'
    ];
    
    // Obtener todas las lecciones actuales
    const { data: currentLessons, error: fetchError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', targetCourseId);
    
    if (fetchError) {
      console.error('Error al obtener lecciones:', fetchError);
      return;
    }
    
    console.log(`Lecciones actuales: ${currentLessons.length}`);
    
    // Reordenar cada lección según el orden correcto
    for (let i = 0; i < correctOrder.length; i++) {
      const expectedTitle = correctOrder[i];
      const newOrder = i + 1;
      
      // Buscar la lección que corresponde a este título
      const matchingLesson = currentLessons.find(lesson => 
        lesson.titulo.toUpperCase() === expectedTitle.toUpperCase()
      );
      
      if (matchingLesson) {
        const { error: updateError } = await supabase
          .from('lecciones')
          .update({ orden: newOrder })
          .eq('id', matchingLesson.id);
        
        if (updateError) {
          console.error(`Error al actualizar orden de ${matchingLesson.titulo}:`, updateError);
        } else {
          console.log(`✓ ${newOrder}. ${matchingLesson.titulo}`);
        }
      } else {
        console.log(`✗ No encontrada: ${expectedTitle}`);
      }
    }
    
    // Verificación final
    console.log('\n=== VERIFICACIÓN FINAL ===');
    const { data: finalLessons, error: finalError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', targetCourseId)
      .order('orden', { ascending: true });
    
    if (finalError) {
      console.error('Error en verificación final:', finalError);
      return;
    }
    
    console.log(`\nTotal de lecciones finales: ${finalLessons.length}`);
    finalLessons.forEach(lesson => {
      console.log(`${lesson.orden}. ${lesson.titulo}`);
    });
    
    // Verificar que coincida exactamente con la imagen
    const expectedTitles = [
      'FUNDAMENTOS P TERAPEUTICO',
      'FAMILIA Y TRABAJO EQUIPO', 
      'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
      'RECOVERY COACHING',
      'NUEVOS MODELOS TERAPEUTICOS',
      'TERAPIA COGNITIVA DROGODEPENDENENCIAS',
      'INTELIGENCIA EMOCIONAL'
    ];
    
    let allMatch = true;
    console.log('\n=== COMPARACIÓN CON IMAGEN ===');
    for (let i = 0; i < expectedTitles.length; i++) {
      const expected = expectedTitles[i];
      const actual = finalLessons[i]?.titulo || 'NO ENCONTRADA';
      const match = actual.toUpperCase() === expected.toUpperCase();
      
      console.log(`${i + 1}. ${match ? '✓' : '✗'} Esperado: "${expected}" | Actual: "${actual}"`);
      
      if (!match) allMatch = false;
    }
    
    if (allMatch && finalLessons.length === 7) {
      console.log('\n🎉 ¡PERFECTO! El curso coincide exactamente con la imagen');
      console.log('✅ 7 lecciones en orden consecutivo 1-7');
    } else {
      console.log('\n⚠️  Aún hay diferencias con la imagen');
    }
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

addRecoveryCoaching();