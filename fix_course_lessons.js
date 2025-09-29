import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const targetCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// IDs de las lecciones correctas que deben quedarse (según el análisis anterior)
const correctLessonIds = [
  '2b2dc10b-f59a-443d-9fbf-45f48db0a478', // Fundamentos del Proceso Terapéutico
  '76fc1485-a45a-42eb-841f-681f9043409a', // Familia y Trabajo en Equipo
  'd7dc3475-de20-47b3-8845-c3b74a881004', // Terapia Cognitiva en Drogodependencias (para INTERVENCION FAMILIAR)
  '370ffd17-a907-4a5d-87d0-c6a505c9f65c', // Recovery Coaching
  '6f19cf7b-f441-4356-a67a-3175cf49b0d2', // Nuevos Modelos Terapéuticos
  'd7dc3475-de20-47b3-8845-c3b74a881004', // Terapia Cognitiva en Drogodependencias (para TERAPIA COGNITIVA)
  '9b17bcf3-02cc-4081-aeae-fb4cdf6c8f84'  // Introducción a la Inteligencia Emocional
];

// Títulos correctos en el orden de la imagen
const correctTitles = [
  'FUNDAMENTOS P TERAPEUTICO',
  'FAMILIA Y TRABAJO EQUIPO',
  'INTERVENCION FAMILIAR Y RECOVERY MENTORING', 
  'RECOVERY COACHING',
  'NUEVOS MODELOS TERAPEUTICOS',
  'TERAPIA COGNITIVA DROGODEPENDENENCIAS',
  'INTELIGENCIA EMOCIONAL'
];

async function fixCourseLessons() {
  try {
    console.log('=== INICIANDO CORRECCIÓN DEL CURSO ===');
    console.log(`Curso ID: ${targetCourseId}`);
    
    // 1. Obtener todas las lecciones actuales del curso
    const { data: currentLessons, error: fetchError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', targetCourseId)
      .order('orden', { ascending: true });
    
    if (fetchError) {
      console.error('Error al obtener lecciones actuales:', fetchError);
      return;
    }
    
    console.log(`\nLecciones actuales en el curso: ${currentLessons.length}`);
    
    // 2. Identificar lecciones a eliminar (las que no están en la lista correcta)
    const lessonsToDelete = currentLessons.filter(lesson => 
      !correctLessonIds.includes(lesson.id)
    );
    
    console.log(`\nLecciones a eliminar: ${lessonsToDelete.length}`);
    lessonsToDelete.forEach(lesson => {
      console.log(`- ${lesson.titulo} (ID: ${lesson.id})`);
    });
    
    // 3. Eliminar lecciones incorrectas
    if (lessonsToDelete.length > 0) {
      console.log('\nEliminando lecciones incorrectas...');
      
      for (const lesson of lessonsToDelete) {
        const { error: deleteError } = await supabase
          .from('lecciones')
          .delete()
          .eq('id', lesson.id);
        
        if (deleteError) {
          console.error(`Error al eliminar lección ${lesson.id}:`, deleteError);
        } else {
          console.log(`✓ Eliminada: ${lesson.titulo}`);
        }
      }
    }
    
    // 4. Obtener las lecciones correctas que quedaron
    const { data: remainingLessons, error: remainingError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', targetCourseId);
    
    if (remainingError) {
      console.error('Error al obtener lecciones restantes:', remainingError);
      return;
    }
    
    console.log(`\nLecciones restantes: ${remainingLessons.length}`);
    
    // 5. Renumerar las lecciones correctas según el orden de la imagen
    console.log('\nRenumerando lecciones según el orden correcto...');
    
    // Mapear cada lección correcta con su nuevo orden
    const lessonUpdates = [];
    
    correctTitles.forEach((expectedTitle, index) => {
      const newOrder = index + 1;
      
      // Buscar la lección correspondiente
      let matchingLesson = null;
      
      if (index === 0) { // FUNDAMENTOS P TERAPEUTICO
        matchingLesson = remainingLessons.find(l => l.titulo.includes('Fundamentos'));
      } else if (index === 1) { // FAMILIA Y TRABAJO EQUIPO
        matchingLesson = remainingLessons.find(l => l.titulo.includes('Familia'));
      } else if (index === 2) { // INTERVENCION FAMILIAR Y RECOVERY MENTORING
        matchingLesson = remainingLessons.find(l => l.titulo.includes('Terapia Cognitiva') && l.orden !== newOrder);
      } else if (index === 3) { // RECOVERY COACHING
        matchingLesson = remainingLessons.find(l => l.titulo.includes('Recovery Coaching'));
      } else if (index === 4) { // NUEVOS MODELOS TERAPEUTICOS
        matchingLesson = remainingLessons.find(l => l.titulo.includes('Nuevos Modelos'));
      } else if (index === 5) { // TERAPIA COGNITIVA DROGODEPENDENENCIAS
        matchingLesson = remainingLessons.find(l => l.titulo.includes('Terapia Cognitiva'));
      } else if (index === 6) { // INTELIGENCIA EMOCIONAL
        matchingLesson = remainingLessons.find(l => l.titulo.includes('Inteligencia Emocional'));
      }
      
      if (matchingLesson) {
        lessonUpdates.push({
          id: matchingLesson.id,
          newOrder: newOrder,
          newTitle: expectedTitle,
          currentTitle: matchingLesson.titulo
        });
      }
    });
    
    // 6. Actualizar el orden y títulos
    for (const update of lessonUpdates) {
      const { error: updateError } = await supabase
        .from('lecciones')
        .update({ 
          orden: update.newOrder,
          titulo: update.newTitle
        })
        .eq('id', update.id);
      
      if (updateError) {
        console.error(`Error al actualizar lección ${update.id}:`, updateError);
      } else {
        console.log(`✓ ${update.newOrder}. "${update.newTitle}" (era: "${update.currentTitle}")`);
      }
    }
    
    // 7. Verificación final
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
    
    console.log('\n✅ CORRECCIÓN COMPLETADA');
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

fixCourseLessons();