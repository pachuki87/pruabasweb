import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLessonNumbering() {
  console.log('=== VERIFICACIÓN DE NUMERACIÓN DE LECCIONES ===\n');
  
  // IDs de los cursos
  const courseIds = [
    'b5ef8c64-fe26-4f20-8221-80a1bf475b05', // MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL
    'd7c3e503-ed61-4d7a-9e5f-aedc407d4836'  // Experto en Conductas Adictivas
  ];
  
  for (const courseId of courseIds) {
    console.log(`\n--- CURSO: ${courseId} ---`);
    
    // Obtener información del curso
    const { data: courseData, error: courseError } = await supabase
      .from('cursos')
      .select('titulo')
      .eq('id', courseId)
      .single();
    
    if (courseError) {
      console.error('Error obteniendo curso:', courseError);
      continue;
    }
    
    console.log(`Título del curso: ${courseData.titulo}`);
    
    // Obtener todas las lecciones del curso ordenadas por 'orden'
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', courseId)
      .order('orden', { ascending: true });
    
    if (error) {
      console.error('Error obteniendo lecciones:', error);
      continue;
    }
    
    console.log(`\nTotal de lecciones: ${lessons.length}`);
    console.log('\nNumeración actual de las lecciones:');
    console.log('-----------------------------------');
    
    lessons.forEach((lesson, index) => {
      console.log(`${lesson.orden}) ${lesson.titulo}`);
      console.log(`   ID: ${lesson.id}`);
    });
    
    // Verificar si la numeración es consecutiva
    console.log('\n--- ANÁLISIS DE NUMERACIÓN ---');
    const expectedNumbers = Array.from({length: lessons.length}, (_, i) => i + 1);
    const actualNumbers = lessons.map(l => l.orden).sort((a, b) => a - b);
    
    console.log(`Números esperados (consecutivos): ${expectedNumbers.join(', ')}`);
    console.log(`Números actuales: ${actualNumbers.join(', ')}`);
    
    const isConsecutive = JSON.stringify(expectedNumbers) === JSON.stringify(actualNumbers);
    console.log(`¿Numeración consecutiva?: ${isConsecutive ? 'SÍ' : 'NO'}`);
    
    if (!isConsecutive) {
      console.log('\n⚠️  PROBLEMAS DETECTADOS:');
      
      // Detectar números duplicados
      const duplicates = actualNumbers.filter((num, index) => actualNumbers.indexOf(num) !== index);
      if (duplicates.length > 0) {
        console.log(`   - Números duplicados: ${[...new Set(duplicates)].join(', ')}`);
      }
      
      // Detectar números faltantes
      const missing = expectedNumbers.filter(num => !actualNumbers.includes(num));
      if (missing.length > 0) {
        console.log(`   - Números faltantes: ${missing.join(', ')}`);
      }
      
      // Detectar números fuera de rango
      const outOfRange = actualNumbers.filter(num => num < 1 || num > lessons.length);
      if (outOfRange.length > 0) {
        console.log(`   - Números fuera de rango: ${outOfRange.join(', ')}`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
  }
}

checkLessonNumbering().catch(console.error);