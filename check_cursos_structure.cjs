require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCursosStructure() {
  try {
    console.log('🔍 VERIFICANDO ESTRUCTURA DE LA TABLA CURSOS\n');
    
    // Obtener todos los cursos para ver la estructura
    const { data: courses, error: coursesError } = await supabase
      .from('cursos')
      .select('*')
      .limit(5);
    
    if (coursesError) {
      console.error('❌ Error al obtener cursos:', coursesError);
      return;
    }
    
    console.log('📚 ESTRUCTURA DE CURSOS:');
    if (courses && courses.length > 0) {
      console.log('📋 Columnas disponibles:');
      Object.keys(courses[0]).forEach(key => {
        console.log(`   - ${key}: ${typeof courses[0][key]} (${courses[0][key]})`);
      });
      
      console.log('\n📊 TODOS LOS CURSOS:');
      courses.forEach((course, index) => {
        console.log(`${index + 1}. Curso:`);
        Object.entries(course).forEach(([key, value]) => {
          console.log(`   ${key}: ${value}`);
        });
        console.log('');
      });
    } else {
      console.log('❌ No se encontraron cursos');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkCursosStructure();