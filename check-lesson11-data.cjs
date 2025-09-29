const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ixqkqvfkpbwriqvaiims.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cWtxdmZrcGJ3cmlxdmFpaW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzE0NzYsImV4cCI6MjA1MDU0NzQ3Nn0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson11Data() {
  try {
    console.log('🔍 Verificando datos de la lección 11...');
    
    // Buscar la lección 11
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('orden', 11);
    
    if (error) {
      console.error('❌ Error al obtener lección 11:', error);
      return;
    }
    
    if (!lessons || lessons.length === 0) {
      console.log('❌ No se encontró la lección 11');
      return;
    }
    
    const lesson = lessons[0];
    console.log('✅ Lección 11 encontrada:');
    console.log('ID:', lesson.id);
    console.log('Título:', lesson.titulo);
    console.log('Orden:', lesson.orden);
    console.log('Archivo URL:', lesson.archivo_url);
    console.log('Contenido HTML (primeros 200 chars):', lesson.contenido_html ? lesson.contenido_html.substring(0, 200) + '...' : 'VACÍO');
    console.log('Contenido HTML length:', lesson.contenido_html ? lesson.contenido_html.length : 0);
    console.log('Tiene cuestionario:', lesson.tiene_cuestionario);
    console.log('Video URL:', lesson.video_url);
    
    // Verificar materiales asociados
    const { data: materials, error: materialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lesson.id);
    
    if (materialsError) {
      console.error('❌ Error al obtener materiales:', materialsError);
    } else {
      console.log('📚 Materiales encontrados:', materials.length);
      materials.forEach((material, index) => {
        console.log(`  ${index + 1}. ${material.titulo} (${material.tipo}) - ${material.url}`);
      });
    }
    
    // Verificar cuestionarios
    if (lesson.tiene_cuestionario) {
      const { data: quizzes, error: quizzesError } = await supabase
        .from('cuestionarios')
        .select('*')
        .eq('leccion_id', lesson.id);
      
      if (quizzesError) {
        console.error('❌ Error al obtener cuestionarios:', quizzesError);
      } else {
        console.log('📝 Cuestionarios encontrados:', quizzes.length);
        quizzes.forEach((quiz, index) => {
          console.log(`  ${index + 1}. ${quiz.titulo} (ID: ${quiz.id})`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkLesson11Data();