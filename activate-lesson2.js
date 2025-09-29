import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

const LESSON_ID = '2b1d91ce-2b59-4f49-b227-626f803bd74d';

async function activateLesson2() {
  console.log('🔧 Activando lección 2...');
  console.log(`ID de lección: ${LESSON_ID}`);
  console.log('=' .repeat(50));

  try {
    // Activar la lección
    const { data, error } = await supabase
      .from('lecciones')
      .update({ activa: true })
      .eq('id', LESSON_ID)
      .select();

    if (error) {
      console.log('❌ Error al activar la lección:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Lección activada exitosamente:');
      console.log(`   - Título: ${data[0].titulo}`);
      console.log(`   - Estado activo: ${data[0].activa}`);
      console.log(`   - Orden: ${data[0].orden}`);
    } else {
      console.log('❌ No se encontró la lección para actualizar');
    }

    // Verificar el estado final
    console.log('\n🔍 Verificando estado final...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('id', LESSON_ID)
      .single();

    if (verifyError) {
      console.log('❌ Error al verificar:', verifyError.message);
    } else {
      console.log('✅ Estado verificado:');
      console.log(`   - Título: ${verifyData.titulo}`);
      console.log(`   - Activa: ${verifyData.activa}`);
      console.log(`   - Contenido HTML: ${verifyData.contenido_html ? `${verifyData.contenido_html.length} caracteres` : 'Vacío'}`);
      console.log(`   - Archivo URL: ${verifyData.archivo_url || 'No definido'}`);
    }

  } catch (error) {
    console.error('❌ Error durante la activación:', error);
  }
}

// Ejecutar activación
activateLesson2().then(() => {
  console.log('\n🏁 Proceso de activación completado.');
  console.log('\n🌐 La lección 2 debería estar ahora visible en:');
  console.log('http://localhost:5173/student/courses/b5ef8c64-fe26-4f20-8221-80a1bf475b05/lessons/2b1d91ce-2b59-4f49-b227-626f803bd74d');
}).catch(console.error);