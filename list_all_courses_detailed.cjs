const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function listAllCourses() {
  try {
    console.log('🔍 Listando todos los cursos disponibles...');
    
    const { data: cursos, error } = await supabase
      .from('cursos')
      .select('id, titulo, descripcion, teacher_id')
      .order('titulo');
    
    if (error) {
      console.error('❌ Error al buscar cursos:', error);
      return;
    }
    
    console.log(`\n📚 Total de cursos encontrados: ${cursos?.length || 0}\n`);
    
    if (cursos && cursos.length > 0) {
      cursos.forEach((curso, index) => {
        console.log(`${index + 1}. "${curso.titulo}"`);
        console.log(`   - ID: ${curso.id}`);
        console.log(`   - Descripción: ${curso.descripcion ? curso.descripcion.substring(0, 100) + '...' : 'Sin descripción'}`);
        console.log(`   - Teacher ID: ${curso.teacher_id}`);
        console.log('');
      });
      
      // Buscar específicamente cursos que contengan "adicciones" o "master"
      const cursosAdicciones = cursos.filter(curso => 
        curso.titulo.toLowerCase().includes('adicciones') || 
        curso.titulo.toLowerCase().includes('master') ||
        curso.titulo.toLowerCase().includes('máster')
      );
      
      if (cursosAdicciones.length > 0) {
        console.log('\n🎯 Cursos relacionados con adicciones/master:');
        cursosAdicciones.forEach(curso => {
          console.log(`- "${curso.titulo}" (ID: ${curso.id})`);
        });
      }
    } else {
      console.log('❌ No se encontraron cursos');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

listAllCourses();