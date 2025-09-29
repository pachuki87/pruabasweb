import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const targetCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// Mapeo correcto de títulos a números de orden
const correctOrder = {
  'INTELIGENCIA EMOCIONAL': 1,
  'AUTOCONCIENCIA EMOCIONAL': 2,
  'AUTORREGULACIÓN EMOCIONAL': 3,
  'MOTIVACIÓN Y METAS': 4,
  'EMPATÍA Y COMPRENSIÓN': 5,
  'HABILIDADES SOCIALES': 6,
  'APLICACIÓN PRÁCTICA DE LA INTELIGENCIA EMOCIONAL': 7
};

async function fixLessonNumbers() {
  try {
    console.log('🔍 Obteniendo lecciones actuales...');
    
    // Obtener todas las lecciones del curso
    const { data: lessons, error: fetchError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', targetCourseId)
      .order('orden');
    
    if (fetchError) {
      console.error('❌ Error al obtener lecciones:', fetchError);
      return;
    }
    
    console.log(`📚 Encontradas ${lessons.length} lecciones`);
    
    // Mostrar estado actual
    console.log('\n📋 Estado actual:');
    lessons.forEach(lesson => {
      console.log(`  ${lesson.orden}: ${lesson.titulo}`);
    });
    
    // Actualizar cada lección con el número correcto
    console.log('\n🔧 Actualizando números de orden...');
    
    for (const lesson of lessons) {
      const correctOrderNumber = correctOrder[lesson.titulo];
      
      if (correctOrderNumber && lesson.orden !== correctOrderNumber) {
        console.log(`  Actualizando "${lesson.titulo}" de ${lesson.orden} a ${correctOrderNumber}`);
        
        const { error: updateError } = await supabase
          .from('lecciones')
          .update({ orden: correctOrderNumber })
          .eq('id', lesson.id);
        
        if (updateError) {
          console.error(`❌ Error actualizando lección ${lesson.id}:`, updateError);
        } else {
          console.log(`✅ Lección "${lesson.titulo}" actualizada correctamente`);
        }
      } else if (!correctOrderNumber) {
        console.log(`⚠️  Título no reconocido: "${lesson.titulo}"`);
      } else {
        console.log(`✅ Lección "${lesson.titulo}" ya tiene el orden correcto (${lesson.orden})`);
      }
    }
    
    // Verificar resultado final
    console.log('\n🔍 Verificando resultado final...');
    
    const { data: updatedLessons, error: finalError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', targetCourseId)
      .order('orden');
    
    if (finalError) {
      console.error('❌ Error al verificar resultado:', finalError);
      return;
    }
    
    console.log('\n📋 Estado final:');
    updatedLessons.forEach(lesson => {
      console.log(`  ${lesson.orden}: ${lesson.titulo}`);
    });
    
    // Verificar que tenemos exactamente 7 lecciones numeradas del 1 al 7
    const expectedNumbers = [1, 2, 3, 4, 5, 6, 7];
    const actualNumbers = updatedLessons.map(l => l.orden).sort((a, b) => a - b);
    
    if (JSON.stringify(actualNumbers) === JSON.stringify(expectedNumbers)) {
      console.log('\n✅ ¡ÉXITO! Las lecciones están correctamente numeradas del 1 al 7');
    } else {
      console.log('\n❌ ERROR: Los números no son consecutivos del 1 al 7');
      console.log('Esperado:', expectedNumbers);
      console.log('Actual:', actualNumbers);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar el script
fixLessonNumbers();