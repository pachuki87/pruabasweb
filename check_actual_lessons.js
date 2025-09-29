import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const targetCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

async function checkActualLessons() {
  try {
    console.log('🔍 Verificando lecciones actuales en la base de datos...');
    
    // Obtener todas las lecciones del curso
    const { data: lessons, error: fetchError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', targetCourseId)
      .order('orden');

    if (fetchError) {
      console.error('❌ Error al obtener lecciones:', fetchError);
      return;
    }

    console.log(`\n📚 Encontradas ${lessons.length} lecciones en el curso:`);
    console.log('\n=== LECCIONES ACTUALES ===');
    lessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ID: ${lesson.id}`);
      console.log(`   Título: "${lesson.titulo}"`);
      console.log(`   Orden actual: ${lesson.orden}`);
      console.log('');
    });

    console.log('\n=== NÚMEROS QUE NECESITO ASIGNAR ===');
    console.log('Según la imagen del usuario: 9, 7, 4, 2, 6, 3, 1');
    console.log('\nPor favor, confirma cuál lección debe tener cada número.');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la función
checkActualLessons();