require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

(async () => {
  try {
    const masterCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'; // MÁSTER EN ADICCIONES

    console.log('Verificando lecciones para el curso: MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL');
    console.log('==================================================================================');

    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, contenido_html, orden')
      .eq('curso_id', masterCourseId)
      .order('orden');

    if (leccionesError) {
      console.log('Error al buscar lecciones:', leccionesError);
      return;
    }

    console.log(`Total de lecciones encontradas: ${lecciones.length}`);
    console.log('\nLecciones del curso:');
    console.log('--------------------');
    
    if (lecciones.length === 0) {
      console.log('No se encontraron lecciones para este curso.');
    } else {
      lecciones.forEach(leccion => {
        console.log(`Lección ${leccion.orden}: ${leccion.titulo}`);

        console.log(`Contenido HTML: ${leccion.contenido_html ? leccion.contenido_html.length + ' caracteres' : 'VACÍO'}`);
        console.log('---');
      });
    }

  } catch (error) {
    console.error('Error general:', error);
  }
})();