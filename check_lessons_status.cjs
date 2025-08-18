const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkLessonsStatus() {
  try {
    // Obtener el curso de Inteligencia Emocional
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'Inteligencia Emocional')
      .single();

    if (cursoError) {
      console.error('Error obteniendo curso:', cursoError);
      return;
    }

    console.log('Curso encontrado:', curso.titulo);

    // Obtener todas las lecciones del curso
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, descripcion, contenido_html, orden')
      .eq('curso_id', curso.id)
      .order('orden', { ascending: true });

    if (leccionesError) {
      console.error('Error obteniendo lecciones:', leccionesError);
      return;
    }

    console.log('\n=== ESTADO DE LAS LECCIONES ===');
    console.log(`Total de lecciones: ${lecciones.length}`);
    
    lecciones.forEach(leccion => {
      console.log(`\n${leccion.orden}. ${leccion.titulo}`);
      console.log(`   ID: ${leccion.id}`);
      console.log(`   Descripción: ${leccion.descripcion || 'Sin descripción'}`);
      
      if (leccion.contenido_html) {
        console.log(`   Contenido HTML: ${leccion.contenido_html.length} caracteres`);
        console.log(`   Estado: ✅ TIENE CONTENIDO`);
      } else {
        console.log(`   Contenido HTML: VACÍO`);
        console.log(`   Estado: ❌ SIN CONTENIDO`);
      }
    });

    // Contar lecciones con y sin contenido
    const conContenido = lecciones.filter(l => l.contenido_html && l.contenido_html.trim().length > 0);
    const sinContenido = lecciones.filter(l => !l.contenido_html || l.contenido_html.trim().length === 0);
    
    console.log('\n=== RESUMEN ===');
    console.log(`Lecciones con contenido: ${conContenido.length}`);
    console.log(`Lecciones sin contenido: ${sinContenido.length}`);
    
    if (sinContenido.length > 0) {
      console.log('\nLecciones que necesitan contenido:');
      sinContenido.forEach(l => {
        console.log(`- ${l.orden}. ${l.titulo} (ID: ${l.id})`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkLessonsStatus();