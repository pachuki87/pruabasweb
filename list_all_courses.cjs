require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

(async () => {
  try {
    // Listar todos los cursos disponibles
    const { data: cursos, error } = await supabase
      .from('cursos')
      .select('id, titulo, descripcion')
      .order('titulo');

    if (error) {
      console.log('Error al buscar cursos:', error);
      return;
    }

    console.log('Cursos disponibles:');
    console.log('===================');
    
    if (cursos.length > 0) {
      cursos.forEach(curso => {
        console.log(`ID: ${curso.id}`);
        console.log(`Título: ${curso.titulo}`);
        console.log(`Descripción: ${curso.descripcion ? curso.descripcion.substring(0, 100) + '...' : 'Sin descripción'}`);
        console.log('---');
      });
      console.log(`\nTotal de cursos: ${cursos.length}`);
    } else {
      console.log('No se encontraron cursos.');
    }

  } catch (error) {
    console.error('Error general:', error);
  }
})();