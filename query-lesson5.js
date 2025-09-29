import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function queryLesson5() {
  try {
    console.log('Buscando lección 5...');
    
    // Buscar lección 5
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('orden', 5);
    
    if (lessonsError) {
      console.error('Error al buscar lecciones:', lessonsError);
      return;
    }
    
    console.log('Lecciones encontradas:', lessons);
    
    if (lessons && lessons.length > 0) {
      const lesson5 = lessons[0];
      console.log('\n=== INFORMACIÓN DE LECCIÓN 5 ===');
      console.log('ID:', lesson5.id);
      console.log('Título:', lesson5.titulo);
      console.log('Número:', lesson5.numero_leccion);
      console.log('Contenido:', lesson5.contenido ? lesson5.contenido.substring(0, 200) + '...' : 'Sin contenido');
      
      // Buscar cuestionarios asociados
      const { data: quizzes, error: quizzesError } = await supabase
        .from('cuestionarios')
        .select('*')
        .eq('leccion_id', lesson5.id);
      
      if (quizzesError) {
        console.error('Error al buscar cuestionarios:', quizzesError);
      } else {
        console.log('\n=== CUESTIONARIOS ===');
        console.log('Cuestionarios encontrados:', quizzes?.length || 0);
        if (quizzes && quizzes.length > 0) {
          quizzes.forEach(quiz => {
            console.log(`- Quiz ID: ${quiz.id}, Título: ${quiz.titulo}`);
          });
        }
      }
      
      // Buscar materiales asociados
      const { data: materials, error: materialsError } = await supabase
        .from('materiales')
        .select('*')
        .eq('leccion_id', lesson5.id);
      
      if (materialsError) {
        console.error('Error al buscar materiales:', materialsError);
      } else {
        console.log('\n=== MATERIALES ===');
        console.log('Materiales encontrados:', materials?.length || 0);
        if (materials && materials.length > 0) {
          materials.forEach(material => {
            console.log(`- Material: ${material.titulo}, Tipo: ${material.tipo}`);
          });
        }
      }
    } else {
      console.log('No se encontró la lección 5');
    }
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

queryLesson5();