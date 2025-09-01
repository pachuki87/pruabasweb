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

    console.log('Curso encontrado:');
    console.log(`ID: ${curso.id}`);
    console.log(`Título: ${curso.titulo}`);
    console.log(`Descripción: ${curso.descripcion ? curso.descripcion.substring(0, 100) + '...' : 'Sin descripción'}`);
    console.log('');

    // Buscar las lecciones del curso
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, contenido_html, orden, archivo_url')
      .eq('curso_id', curso.id)
      .order('orden');

    if (leccionesError) {
      console.log('Error al buscar lecciones:', leccionesError);
      return;
    }

    console.log('Lecciones del curso:');
    console.log('===================');
    
    lecciones.forEach(leccion => {
      console.log(`Lección ${leccion.orden}: ${leccion.titulo}`);
      console.log(`Contenido HTML: ${leccion.contenido_html ? leccion.contenido_html.length + ' caracteres' : 'VACÍO'}`);
      console.log(`Archivo URL: ${leccion.archivo_url || 'No definido'}`);
      console.log('---');
    });

    console.log(`\nTotal de lecciones: ${lecciones.length}`);
    const leccionesVacias = lecciones.filter(l => !l.contenido_html || l.contenido_html.trim() === '');
    console.log(`Lecciones vacías: ${leccionesVacias.length}`);
    
    if (leccionesVacias.length > 0) {
      console.log('\nLecciones que necesitan contenido:');
      leccionesVacias.forEach(l => console.log(`- Lección ${l.orden}: ${l.titulo}`));
    }

  } catch (error) {
    console.error('Error general:', error);
  }
})();