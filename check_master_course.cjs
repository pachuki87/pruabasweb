require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

(async () => {
  try {
    // Buscar el curso 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL'
    const { data: curso, error } = await supabase
      .from('cursos')
      .select('*')
      .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
      .single();

    if (error) {
      console.log('Error al buscar curso:', error);
      return;
    }

    console.log('Curso encontrado:');
    console.log(`ID: ${curso.id}`);
    console.log(`Título: ${curso.titulo}`);
    console.log(`Descripción: ${curso.descripcion ? curso.descripcion.substring(0, 100) + '...' : 'Sin descripción'}`);
    console.log('');

    // Buscar las lecciones del curso
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, descripcion, orden, archivo_url, duracion_estimada, tiene_cuestionario')
      .eq('curso_id', curso.id)
      .order('orden');

    if (leccionesError) {
      console.log('Error al buscar lecciones:', leccionesError);
      return;
    }

    console.log('Lecciones del curso:');
    console.log('===================');
    
    if (lecciones.length > 0) {
      console.log('\nLecciones encontradas:');
      lecciones.forEach(leccion => {
        console.log(`Lección ${leccion.orden}: ${leccion.titulo}${leccion.tiene_cuestionario ? ' (Con cuestionario)' : ''}`);
        console.log(`Descripción: ${leccion.descripcion || 'Sin descripción'}`);
        console.log(`Archivo URL: ${leccion.archivo_url || 'No definido'}`);
        console.log(`Duración: ${leccion.duracion_estimada || 'No definida'} minutos`);
        console.log('---');
      });
    } else {
      console.log('No se encontraron lecciones para este curso.');
    }

    console.log(`\nTotal de lecciones: ${lecciones.length}`);
    const leccionesSinArchivo = lecciones.filter(l => !l.archivo_url || l.archivo_url.trim() === '');
    console.log(`Lecciones sin archivo: ${leccionesSinArchivo.length}`);
    
    if (leccionesSinArchivo.length > 0) {
      console.log('\nLecciones que necesitan archivo:');
      leccionesSinArchivo.forEach(l => console.log(`- Lección ${l.orden}: ${l.titulo}`));
    }

    // Verificar cuestionarios
    const leccionesConCuestionario = lecciones.filter(l => l.tiene_cuestionario);
    console.log(`\nLecciones con cuestionario: ${leccionesConCuestionario.length}`);
    
    if (leccionesConCuestionario.length > 0) {
      console.log('\nLecciones que tienen cuestionario:');
      leccionesConCuestionario.forEach(l => console.log(`- Lección ${l.orden}: ${l.titulo}`));
    }

  } catch (error) {
    console.error('Error general:', error);
  }
})();
