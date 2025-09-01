import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const targetCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

async function fixExactNumbering() {
  try {
    console.log('=== CORRIGIENDO NUMERACIÓN EXACTA SEGÚN IMAGEN ===');
    
    // Mapeo exacto según la imagen
    const exactMapping = [
      { titulo: 'FUNDAMENTOS P TERAPEUTICO', orden: 1 },
      { titulo: 'TERAPIA COGNITIVA DROGODEPENDENENCIAS', orden: 2 },
      { titulo: 'FAMILIA Y TRABAJO EQUIPO', orden: 3 },
      { titulo: 'RECOVERY COACHING', orden: 4 },
      { titulo: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING', orden: 6 },
      { titulo: 'NUEVOS MODELOS TERAPEUTICOS', orden: 7 },
      { titulo: 'INTELIGENCIA EMOCIONAL', orden: 9 }
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
    
    // Actualizar cada lección con su número exacto
    for (const mapping of exactMapping) {
      const matchingLesson = currentLessons.find(lesson => 
        lesson.titulo.toUpperCase() === mapping.titulo.toUpperCase()
      );
      
      if (matchingLesson) {
        const { error: updateError } = await supabase
          .from('lecciones')
          .update({ orden: mapping.orden })
          .eq('id', matchingLesson.id);
        
        if (updateError) {
          console.error(`Error al actualizar ${matchingLesson.titulo}:`, updateError);
        } else {
          console.log(`✓ ${mapping.orden}. ${matchingLesson.titulo}`);
        }
      } else {
        console.log(`✗ No encontrada: ${mapping.titulo}`);
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
    const expectedNumbers = [1, 2, 3, 4, 6, 7, 9];
    const actualNumbers = finalLessons.map(l => l.orden).sort((a, b) => a - b);
    
    console.log('\n=== COMPARACIÓN DE NÚMEROS ===');
    console.log(`Esperados: ${expectedNumbers.join(', ')}`);
    console.log(`Actuales: ${actualNumbers.join(', ')}`);
    
    const numbersMatch = JSON.stringify(expectedNumbers) === JSON.stringify(actualNumbers);
    
    if (numbersMatch && finalLessons.length === 7) {
      console.log('\n🎉 ¡PERFECTO! La numeración coincide exactamente con la imagen');
      console.log('✅ Números: 1, 2, 3, 4, 6, 7, 9 (faltan 5 y 8)');
    } else {
      console.log('\n⚠️  La numeración aún no coincide con la imagen');
    }
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

fixExactNumbering();