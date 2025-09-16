const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkLessonsStructure() {
  console.log('🔍 Verificando estructura de lecciones del Máster en Adicciones...\n');
  
  try {
    // Obtener el ID del curso
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
      .single();
    
    if (cursoError) {
      console.error('❌ Error obteniendo curso:', cursoError);
      return;
    }
    
    console.log(`📚 Curso encontrado: ${curso.titulo} (ID: ${curso.id})\n`);
    
    // Obtener todas las lecciones del curso
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', curso.id)
      .order('orden');
    
    if (leccionesError) {
      console.error('❌ Error obteniendo lecciones:', leccionesError);
      return;
    }
    
    console.log(`📖 Lecciones encontradas (${lecciones.length}):`);
    lecciones.forEach(leccion => {
      console.log(`- Orden: ${leccion.orden}, ID: ${leccion.id}, Título: "${leccion.titulo}"`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkLessonsStructure();