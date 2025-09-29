const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkQuizStatus() {
  try {
    // Obtener el curso
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (cursoError) {
      console.error('Error obteniendo curso:', cursoError);
      return;
    }
    
    console.log('Curso ID:', curso?.id);
    
    // Obtener cuestionarios
    const { data: cuestionarios, error: quizError } = await supabase
      .from('cuestionarios')
      .select('id, titulo, leccion_id')
      .eq('curso_id', curso?.id);
    
    if (quizError) {
      console.error('Error obteniendo cuestionarios:', quizError);
      return;
    }
    
    console.log('Cuestionarios encontrados:', cuestionarios?.length || 0);
    
    if (cuestionarios && cuestionarios.length > 0) {
      cuestionarios.forEach(c => {
        console.log(`- ${c.titulo} (Lección ID: ${c.leccion_id})`);
      });
    } else {
      console.log('No se encontraron cuestionarios para este curso.');
    }
    
    // Verificar lecciones del curso
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, tiene_cuestionario')
      .eq('curso_id', curso?.id)
      .order('orden');
    
    if (leccionesError) {
      console.error('Error obteniendo lecciones:', leccionesError);
      return;
    }
    
    console.log('\nLecciones del curso:');
    lecciones?.forEach(l => {
      console.log(`- Lección ${l.id}: ${l.titulo} (Tiene cuestionario: ${l.tiene_cuestionario})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkQuizStatus();