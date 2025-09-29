const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function exploreDBStructure() {
  console.log('🔍 Explorando estructura de la base de datos...');
  
  try {
    // Explorar tabla usuarios
    console.log('\n👥 Tabla usuarios:');
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .limit(1);
    
    if (usuariosError) {
      console.log('❌ Error:', usuariosError.message);
    } else {
      console.log('✅ Estructura encontrada');
      if (usuarios && usuarios.length > 0) {
        console.log('Columnas:', Object.keys(usuarios[0]));
      }
    }
    
    // Explorar tabla cursos
    console.log('\n📚 Tabla cursos:');
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('*')
      .limit(1);
    
    if (cursosError) {
      console.log('❌ Error:', cursosError.message);
    } else {
      console.log('✅ Estructura encontrada');
      if (cursos && cursos.length > 0) {
        console.log('Columnas:', Object.keys(cursos[0]));
      }
    }
    
    // Explorar tabla inscripciones
    console.log('\n📝 Tabla inscripciones:');
    const { data: inscripciones, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('*')
      .limit(1);
    
    if (inscripcionesError) {
      console.log('❌ Error:', inscripcionesError.message);
    } else {
      console.log('✅ Estructura encontrada');
      if (inscripciones && inscripciones.length > 0) {
        console.log('Columnas:', Object.keys(inscripciones[0]));
      }
    }
    
    // Probar otras posibles tablas relacionadas
    const tablasAProbrar = ['user_courses', 'course_enrollments', 'enrollments', 'student_courses'];
    
    for (const tabla of tablasAProbrar) {
      console.log(`\n🔍 Probando tabla ${tabla}:`);
      const { data, error } = await supabase
        .from(tabla)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log('❌ No existe o error:', error.message);
      } else {
        console.log('✅ Tabla encontrada!');
        if (data && data.length > 0) {
          console.log('Columnas:', Object.keys(data[0]));
        } else {
          console.log('Tabla vacía');
        }
      }
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}
