const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkCourseNames() {
  console.log('🔍 Verificando nombres de cursos en la base de datos...\n');
  
  try {
    const { data: cursos, error } = await supabase
      .from('cursos')
      .select('id, titulo');
    
    if (error) {
      console.error('❌ Error obteniendo cursos:', error);
      return;
    }
    
    console.log('📚 Cursos encontrados:');
    cursos.forEach(curso => {
      console.log(`- ID: ${curso.id}, Título: "${curso.titulo}"`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkCourseNames();