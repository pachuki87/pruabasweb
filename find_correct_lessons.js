import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const targetCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// Lecciones que deberían estar según la imagen
const expectedLessons = [
  'FUNDAMENTOS P TERAPEUTICO',
  'FAMILIA Y TRABAJO EQUIPO', 
  'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
  'RECOVERY COACHING',
  'NUEVOS MODELOS TERAPEUTICOS',
  'TERAPIA COGNITIVA DROGODEPENDENENCIAS',
  'INTELIGENCIA EMOCIONAL'
];

async function findCorrectLessons() {
  try {
    console.log('Buscando las lecciones correctas en toda la base de datos...');
    
    // Obtener todas las lecciones de la base de datos
    const { data: allLessons, error } = await supabase
      .from('lecciones')
      .select('*');
    
    if (error) {
      console.error('Error al obtener todas las lecciones:', error);
      return;
    }
    
    console.log(`Total de lecciones en la base de datos: ${allLessons.length}`);
    
    const foundLessons = [];
    const notFoundLessons = [];
    
    expectedLessons.forEach((expectedTitle, index) => {
      console.log(`\nBuscando: "${expectedTitle}"`);
      
      // Buscar coincidencias más flexibles
      const matches = allLessons.filter(lesson => {
        const lessonTitle = lesson.titulo.trim().toUpperCase();
        const expectedUpper = expectedTitle.toUpperCase();
        
        // Coincidencia exacta
        if (lessonTitle === expectedUpper) return true;
        
        // Coincidencia parcial (contiene palabras clave)
        const expectedWords = expectedUpper.split(' ');
        const lessonWords = lessonTitle.split(' ');
        
        // Si al menos 2 palabras coinciden o si es una palabra clave importante
        const matchingWords = expectedWords.filter(word => 
          lessonWords.some(lWord => lWord.includes(word) || word.includes(lWord))
        );
        
        return matchingWords.length >= Math.min(2, expectedWords.length);
      });
      
      if (matches.length > 0) {
        console.log(`  ✓ Encontradas ${matches.length} coincidencias:`);
        matches.forEach(match => {
          console.log(`    - "${match.titulo}" (ID: ${match.id}, Curso: ${match.curso_id})`);
        });
        
        // Tomar la mejor coincidencia (la primera)
        foundLessons.push({
          order: index + 1,
          expectedTitle,
          lesson: matches[0]
        });
      } else {
        console.log(`  ✗ No encontrada`);
        notFoundLessons.push(expectedTitle);
      }
    });
    
    console.log('\n=== RESUMEN DE LECCIONES ENCONTRADAS ===');
    foundLessons.forEach(item => {
      console.log(`${item.order}. ${item.expectedTitle}`);
      console.log(`   Encontrada: "${item.lesson.titulo}" (ID: ${item.lesson.id})`);
      console.log(`   Curso actual: ${item.lesson.curso_id}`);
      console.log('---');
    });
    
    if (notFoundLessons.length > 0) {
      console.log('\n=== LECCIONES NO ENCONTRADAS ===');
      notFoundLessons.forEach(title => {
        console.log(`- ${title}`);
      });
    }
    
    console.log(`\n=== PLAN DE ACCIÓN ===`);
    console.log(`Lecciones encontradas: ${foundLessons.length}/7`);
    console.log(`Lecciones a mover al curso ${targetCourseId}: ${foundLessons.filter(item => item.lesson.curso_id !== targetCourseId).length}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

findCorrectLessons();