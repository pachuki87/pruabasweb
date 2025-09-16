const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lyojcqiiixkqqtpoejdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM'
);

async function checkLesson2Structure() {
  try {
    console.log('=== VERIFICANDO LECCIÓN 2 ===');
    
    // Buscar todas las lecciones con orden 2
    const { data: lessons, error: lessonError } = await supabase
      .from('lecciones')
      .select('*, cursos(titulo)')
      .eq('orden', 2);
    
    if (lessonError) {
      console.log('Error:', lessonError);
      return;
    }
    
    console.log(`Encontradas ${lessons.length} lecciones con orden 2:`);
    
    lessons.forEach((lesson, index) => {
      console.log(`\nLección ${index + 1}:`);
      console.log('ID:', lesson.id);
      console.log('Título:', lesson.titulo);
      console.log('Curso:', lesson.cursos?.titulo || 'Sin curso');
      console.log('Tiene cuestionario:', lesson.tiene_cuestionario);
    });
    
    // Buscar específicamente la del Máster en Adicciones
    const masterLesson = lessons.find(l => 
      l.cursos?.titulo?.includes('Máster') || 
      l.titulo?.includes('TERAPIA COGNITIVA')
    );
    
    if (masterLesson) {
      console.log('\n=== LECCIÓN DEL MÁSTER ENCONTRADA ===');
      console.log('ID:', masterLesson.id);
      console.log('Título:', masterLesson.titulo);
      
      // Buscar cuestionario existente
      const { data: quiz } = await supabase
        .from('cuestionarios')
        .select('*')
        .eq('leccion_id', masterLesson.id);
      
      if (quiz && quiz.length > 0) {
        console.log('Ya tiene cuestionario:', quiz[0].titulo);
        
        // Contar preguntas
        const { data: questions } = await supabase
          .from('preguntas')
          .select('*')
          .eq('cuestionario_id', quiz[0].id);
        
        console.log('Número de preguntas:', questions ? questions.length : 0);
      } else {
        console.log('NO tiene cuestionario - listo para crear el Módulo 2');
      }
    } else {
      console.log('\n❌ No se encontró la lección del Máster en Adicciones');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkLesson2Structure();