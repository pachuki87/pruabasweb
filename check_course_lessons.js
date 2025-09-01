import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const courseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

async function checkCourseLessons() {
  try {
    console.log('Consultando lecciones en el curso:', courseId);
    
    // Obtener todas las lecciones del curso
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseId)
      .order('orden', { ascending: true });
    
    if (error) {
      console.error('Error al obtener lecciones:', error);
      return;
    }
    
    console.log(`\nTotal de lecciones encontradas: ${lessons.length}`);
    console.log('\n=== LECCIONES ACTUALES EN EL CURSO ===');
    
    lessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ID: ${lesson.id}`);
      console.log(`   Título: ${lesson.titulo}`);
      console.log(`   Orden: ${lesson.orden}`);
      console.log(`   Curso ID: ${lesson.curso_id}`);
      console.log('---');
    });
    
    // Identificar duplicados por título
    const titleCounts = {};
    const duplicates = [];
    
    lessons.forEach(lesson => {
      const title = lesson.titulo.trim().toUpperCase();
      if (titleCounts[title]) {
        titleCounts[title].push(lesson);
        if (titleCounts[title].length === 2) {
          duplicates.push(...titleCounts[title]);
        } else {
          duplicates.push(lesson);
        }
      } else {
        titleCounts[title] = [lesson];
      }
    });
    
    console.log('\n=== ANÁLISIS DE DUPLICADOS ===');
    if (duplicates.length > 0) {
      console.log(`Se encontraron ${duplicates.length} lecciones duplicadas:`);
      duplicates.forEach(lesson => {
        console.log(`- ${lesson.titulo} (ID: ${lesson.id}, Orden: ${lesson.orden})`);
      });
    } else {
      console.log('No se encontraron duplicados por título.');
    }
    
    // Mostrar las 7 lecciones que deberían quedarse según la imagen
    const expectedLessons = [
      'FUNDAMENTOS P TERAPEUTICO',
      'FAMILIA Y TRABAJO EQUIPO', 
      'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
      'RECOVERY COACHING',
      'NUEVOS MODELOS TERAPEUTICOS',
      'TERAPIA COGNITIVA DROGODEPENDENENCIAS',
      'INTELIGENCIA EMOCIONAL'
    ];
    
    console.log('\n=== LECCIONES QUE DEBERÍAN QUEDARSE (según imagen) ===');
    expectedLessons.forEach((title, index) => {
      console.log(`${index + 1}. ${title}`);
    });
    
    // Verificar cuáles de las lecciones esperadas están presentes
    console.log('\n=== VERIFICACIÓN DE LECCIONES ESPERADAS ===');
    expectedLessons.forEach((expectedTitle, index) => {
      const found = lessons.find(lesson => 
        lesson.titulo.trim().toUpperCase().includes(expectedTitle.toUpperCase()) ||
        expectedTitle.toUpperCase().includes(lesson.titulo.trim().toUpperCase())
      );
      
      if (found) {
        console.log(`✓ ${index + 1}. ${expectedTitle} - ENCONTRADA (ID: ${found.id})`);
      } else {
        console.log(`✗ ${index + 1}. ${expectedTitle} - NO ENCONTRADA`);
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCourseLessons();