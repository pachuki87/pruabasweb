require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

(async () => {
  try {
    // Buscar el curso 'Experto en Conductas Adictivas'
    const { data: curso, error } = await supabase
      .from('cursos')
      .select('*')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();

    if (error) {
      console.log('Error al buscar curso:', error);
      return;
    }

    console.log('Curso EXPERTO encontrado:');
    console.log(`ID: ${curso.id}`);
    console.log(`Título: ${curso.titulo}`);
    console.log('');

    // Buscar las lecciones del curso
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, descripcion, orden, archivo_url, duracion_estimada')
      .eq('curso_id', curso.id)
      .order('orden');

    if (leccionesError) {
      console.log('Error al buscar lecciones:', leccionesError);
      return;
    }

    console.log('Lecciones del curso EXPERTO:');
    console.log('============================');
    
    if (lecciones.length > 0) {
      lecciones.forEach(leccion => {
        console.log(`${leccion.orden}. ${leccion.titulo}`);
        console.log(`   Descripción: ${leccion.descripcion || 'Sin descripción'}`);
        console.log(`   Archivo: ${leccion.archivo_url || 'No definido'}`);
        console.log(`   Duración: ${leccion.duracion_estimada || 'No definida'} min`);
        console.log('');
      });
    } else {
      console.log('No se encontraron lecciones para este curso.');
    }

    console.log(`Total de lecciones en EXPERTO: ${lecciones.length}`);

  } catch (error) {
    console.error('Error general:', error);
  }
})();