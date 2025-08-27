import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);
const CURSO_ID = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';

async function verifyLessons() {
  try {
    // Consultar lecciones del curso
    const { data: lecciones, error } = await supabase
      .from('lecciones')
      .select('id, titulo, orden, duracion_estimada, tiene_cuestionario, creado_en')
      .eq('curso_id', CURSO_ID)
      .order('orden');
    
    if (error) {
      console.error('Error consultando lecciones:', error);
      return;
    }
    
    console.log(`\nEncontradas ${lecciones.length} lecciones en el curso:`);
    console.log('=' .repeat(60));
    
    lecciones.forEach((leccion, index) => {
      console.log(`${index + 1}. ${leccion.titulo}`);
      console.log(`   ID: ${leccion.id}`);
      console.log(`   Orden: ${leccion.orden}`);
      console.log(`   Duración: ${leccion.duracion_estimada} min`);
      console.log(`   Cuestionario: ${leccion.tiene_cuestionario ? 'Sí' : 'No'}`);
      console.log(`   Creado: ${new Date(leccion.creado_en).toLocaleString()}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

verifyLessons();