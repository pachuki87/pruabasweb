import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function identifyMisplacedLessons() {
  console.log('=== IDENTIFICANDO LECCIONES MAL UBICADAS ===\n');
  
  const wrongCourseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836'; // Experto en Conductas Adictivas
  const correctCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'; // MÁSTER EN ADICCIONES
  
  // Obtener información de ambos cursos
  const { data: courses, error: coursesError } = await supabase
    .from('cursos')
    .select('id, titulo')
    .in('id', [wrongCourseId, correctCourseId]);
  
  if (coursesError) {
    console.error('Error obteniendo cursos:', coursesError);
    return;
  }
  
  console.log('CURSOS:');
  courses.forEach(course => {
    console.log(`- ${course.id}: ${course.titulo}`);
  });
  
  console.log('\n--- LECCIONES EN CURSO INCORRECTO ---');
  
  // Obtener lecciones del curso que NO debería tener lecciones de inteligencia emocional
  const { data: wrongLessons, error: wrongError } = await supabase
    .from('lecciones')
    .select('id, titulo, orden')
    .eq('curso_id', wrongCourseId)
    .order('orden', { ascending: true });
  
  if (wrongError) {
    console.error('Error obteniendo lecciones del curso incorrecto:', wrongError);
    return;
  }
  
  console.log(`\nLecciones en curso ${wrongCourseId}:`);
  
  // Identificar lecciones de inteligencia emocional
  const emotionalIntelligenceKeywords = [
    'inteligencia emocional',
    'emocional',
    'autoconciencia',
    'autorregulación',
    'empatía',
    'habilidades sociales'
  ];
  
  const misplacedLessons = [];
  const correctLessons = [];
  
  wrongLessons.forEach(lesson => {
    const isEmotionalLesson = emotionalIntelligenceKeywords.some(keyword => 
      lesson.titulo.toLowerCase().includes(keyword)
    );
    
    if (isEmotionalLesson) {
      misplacedLessons.push(lesson);
      console.log(`❌ LECCIÓN MAL UBICADA: ${lesson.orden}) ${lesson.titulo} (ID: ${lesson.id})`);
    } else {
      correctLessons.push(lesson);
      console.log(`✅ LECCIÓN CORRECTA: ${lesson.orden}) ${lesson.titulo} (ID: ${lesson.id})`);
    }
  });
  
  console.log('\n--- LECCIONES EN CURSO CORRECTO ---');
  
  // Obtener lecciones del curso correcto
  const { data: correctCourseLessons, error: correctError } = await supabase
    .from('lecciones')
    .select('id, titulo, orden')
    .eq('curso_id', correctCourseId)
    .order('orden', { ascending: true });
  
  if (correctError) {
    console.error('Error obteniendo lecciones del curso correcto:', correctError);
    return;
  }
  
  console.log(`\nLecciones actuales en curso ${correctCourseId}:`);
  correctCourseLessons.forEach(lesson => {
    console.log(`${lesson.orden}) ${lesson.titulo} (ID: ${lesson.id})`);
  });
  
  console.log('\n=== RESUMEN ===');
  console.log(`Lecciones mal ubicadas encontradas: ${misplacedLessons.length}`);
  console.log(`Lecciones que deben quedarse en ${wrongCourseId}: ${correctLessons.length}`);
  console.log(`Lecciones actuales en ${correctCourseId}: ${correctCourseLessons.length}`);
  
  if (misplacedLessons.length > 0) {
    console.log('\n🔄 LECCIONES A MOVER:');
    misplacedLessons.forEach(lesson => {
      console.log(`- ${lesson.titulo} (ID: ${lesson.id}, Orden actual: ${lesson.orden})`);
    });
  }
  
  return {
    misplacedLessons,
    correctLessons,
    correctCourseLessons,
    wrongCourseId,
    correctCourseId
  };
}

identifyMisplacedLessons().catch(console.error);