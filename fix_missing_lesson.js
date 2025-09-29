import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const targetCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

async function fixMissingLesson() {
  try {
    console.log('=== BUSCANDO LECCIÓN FALTANTE ===');
    
    // Buscar la lección "Intervención Familiar y Recovery Mentoring" en toda la base de datos
    const { data: allLessons, error } = await supabase
      .from('lecciones')
      .select('*');
    
    if (error) {
      console.error('Error al obtener lecciones:', error);
      return;
    }
    
    // Buscar lecciones que contengan palabras clave relacionadas
    const searchTerms = ['INTERVENCION', 'FAMILIAR', 'RECOVERY', 'MENTORING'];
    
    const candidates = allLessons.filter(lesson => {
      const title = lesson.titulo.toUpperCase();
      return searchTerms.some(term => title.includes(term));
    });
    
    console.log('Candidatos encontrados:');
    candidates.forEach(lesson => {
      console.log(`- "${lesson.titulo}" (ID: ${lesson.id}, Curso: ${lesson.curso_id})`);
    });
    
    // Si no encontramos la lección específica, vamos a crear una nueva
    if (candidates.length === 0) {
      console.log('\nNo se encontró la lección. Creando nueva lección...');
      
      const { data: newLesson, error: createError } = await supabase
        .from('lecciones')
        .insert({
          titulo: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
          curso_id: targetCourseId,
          orden: 3,
          contenido: 'Contenido de la lección sobre intervención familiar y recovery mentoring.',
          duracion: 60
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error al crear nueva lección:', createError);
        return;
      }
      
      console.log(`✓ Nueva lección creada: ${newLesson.titulo} (ID: ${newLesson.id})`);
    } else {
      // Si encontramos candidatos, usar el primero y moverlo al curso correcto
      const selectedLesson = candidates[0];
      
      console.log(`\nUsando lección existente: "${selectedLesson.titulo}"`);
      
      const { error: updateError } = await supabase
        .from('lecciones')
        .update({
          titulo: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
          curso_id: targetCourseId,
          orden: 3
        })
        .eq('id', selectedLesson.id);
      
      if (updateError) {
        console.error('Error al actualizar lección:', updateError);
        return;
      }
      
      console.log(`✓ Lección actualizada y movida al curso correcto`);
    }
    
    // Ahora reordenar todas las lecciones para que estén en orden consecutivo 1-7
    console.log('\n=== REORDENANDO TODAS LAS LECCIONES ===');
    
    const { data: currentLessons, error: fetchError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', targetCourseId)
      .order('orden', { ascending: true });
    
    if (fetchError) {
      console.error('Error al obtener lecciones actuales:', fetchError);
      return;
    }
    
    console.log(`Lecciones actuales: ${currentLessons.length}`);
    
    // Reordenar consecutivamente
    for (let i = 0; i < currentLessons.length; i++) {
      const lesson = currentLessons[i];
      const newOrder = i + 1;
      
      if (lesson.orden !== newOrder) {
        const { error: reorderError } = await supabase
          .from('lecciones')
          .update({ orden: newOrder })
          .eq('id', lesson.id);
        
        if (reorderError) {
          console.error(`Error al reordenar lección ${lesson.id}:`, reorderError);
        } else {
          console.log(`✓ Reordenada: "${lesson.titulo}" -> orden ${newOrder}`);
        }
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
    
    if (finalLessons.length === 7) {
      console.log('\n✅ CURSO CORREGIDO EXITOSAMENTE - 7 LECCIONES EN ORDEN CONSECUTIVO');
    } else {
      console.log(`\n⚠️  ATENCIÓN: Se esperaban 7 lecciones, pero hay ${finalLessons.length}`);
    }
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

fixMissingLesson();