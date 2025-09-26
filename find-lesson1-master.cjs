const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findLesson1Master() {
  try {
    console.log('Buscando la lección 1 del master...');
    
    // Buscar todas las lecciones con orden = 1
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('orden', 1);
    
    if (error) {
      console.error('Error al buscar la lección 1:', error);
      return null;
    }
    
    if (lessons && lessons.length > 0) {
      console.log(`Se encontraron ${lessons.length} lecciones con orden 1:`);
      
      lessons.forEach((lesson, index) => {
        console.log(`\n--- Lección ${index + 1} ---`);
        console.log('ID:', lesson.id);
        console.log('Título:', lesson.titulo);
        console.log('Orden:', lesson.orden);
        console.log('Descripción:', lesson.descripcion);
      });
      
      // Usar la primera lección encontrada para buscar materiales
      const lesson = lessons[0];
      
      // Buscar materiales existentes para esta lección
      const { data: materials, error: materialsError } = await supabase
        .from('materiales')
        .select('*')
        .eq('leccion_id', lesson.id);
      
      if (materialsError) {
        console.error('Error al buscar materiales:', materialsError);
      } else {
        console.log('\nMateriales existentes:', materials.length);
        materials.forEach((material, index) => {
          console.log(`${index + 1}. ${material.titulo} (${material.tipo})`);
        });
      }
      
      return lessons;
    } else {
      console.log('No se encontró la lección 1');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

findLesson1Master();