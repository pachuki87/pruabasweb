import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findOrCreateCurso() {
  try {
    // Buscar curso existente
    const { data: cursos, error: searchError } = await supabase
      .from('cursos')
      .select('*')
      .ilike('titulo', '%conductas adictivas%');

    if (searchError) {
      console.error('Error buscando curso:', searchError);
      return;
    }

    if (cursos && cursos.length > 0) {
      console.log('Curso encontrado:');
      console.log(JSON.stringify(cursos[0], null, 2));
      return cursos[0];
    }

    // Si no existe, crear el curso
    console.log('Curso no encontrado. Creando nuevo curso...');
    
    const { data: nuevoCurso, error: createError } = await supabase
      .from('cursos')
      .insert({
        titulo: 'Curso Experto en Conductas Adictivas',
        descripcion: 'Curso completo sobre el manejo y tratamiento de conductas adictivas, incluyendo fundamentos teóricos, técnicas de intervención y casos prácticos.',
        profesor_id: null,
        imagen_url: null
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creando curso:', createError);
      return;
    }

    console.log('Nuevo curso creado:');
    console.log(JSON.stringify(nuevoCurso, null, 2));
    return nuevoCurso;

  } catch (error) {
    console.error('Error general:', error);
  }
}

findOrCreateCurso();