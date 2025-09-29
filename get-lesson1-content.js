import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getLessonContent() {
  try {
    // Buscar la lección 1 del curso "Experto en Conductas Adictivas"
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id')
      .ilike('titulo', '%conductas adictivas%')
      .single();

    if (cursosError) {
      console.error('Error al buscar el curso:', cursosError);
      return;
    }

    console.log('Curso encontrado:', cursos.id);

    // Obtener la primera lección del curso
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', cursos.id)
      .eq('orden', 1)
      .single();

    if (leccionesError) {
      console.error('Error al obtener la lección 1:', leccionesError);
      return;
    }

    console.log('Lección 1 encontrada:');
    console.log('ID:', lecciones.id);
    console.log('Título:', lecciones.titulo);
    console.log('Descripción:', lecciones.descripcion);
    console.log('Contenido HTML length:', lecciones.contenido_html?.length || 0);

    // Guardar el contenido actual en un archivo para referencia
    if (lecciones.contenido_html) {
      fs.writeFileSync('lesson1-current-content.html', lecciones.contenido_html, 'utf8');
      console.log('Contenido actual guardado en lesson1-current-content.html');
    }

    // Guardar información de la lección en JSON
    const lessonInfo = {
      id: lecciones.id,
      titulo: lecciones.titulo,
      descripcion: lecciones.descripcion,
      orden: lecciones.orden,
      duracion_estimada: lecciones.duracion_estimada,
      imagen_url: lecciones.imagen_url,
      tiene_cuestionario: lecciones.tiene_cuestionario
    };

    fs.writeFileSync('lesson1-info.json', JSON.stringify(lessonInfo, null, 2), 'utf8');
    console.log('Información de la lección guardada en lesson1-info.json');

  } catch (error) {
    console.error('Error general:', error);
  }
}

getLessonContent();