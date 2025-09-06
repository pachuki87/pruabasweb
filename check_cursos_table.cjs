require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

(async () => {
  try {
    console.log('🔍 Verificando estructura de la tabla cursos...');
    
    // Intentar obtener cualquier registro de cursos para ver las columnas
    const { data: cursos, error } = await supabase
      .from('cursos')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error al consultar cursos:', error);
      return;
    }
    
    if (cursos && cursos.length > 0) {
      console.log('✅ Columnas disponibles en la tabla cursos:');
      console.log(Object.keys(cursos[0]));
      console.log('\n📋 Ejemplo de registro:');
      console.log(cursos[0]);
    } else {
      console.log('⚠️ No hay registros en la tabla cursos');
    }

    // Intentar consultar usando el nombre de columna 'title'
    console.log('\n🔍 Intentando consultar usando columna "title"...');
    const { data: titleQuery, error: titleError } = await supabase
      .from('cursos')
      .select('id, title')
      .limit(1);
    
    if (titleError) {
      console.log('❌ Error al consultar con columna "title":', titleError);
    } else {
      console.log('✅ Consulta con columna "title" exitosa:', titleQuery);
    }

    // Intentar consultar usando el nombre de columna 'titulo'
    console.log('\n🔍 Intentando consultar usando columna "titulo"...');
    const { data: tituloQuery, error: tituloError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .limit(1);
    
    if (tituloError) {
      console.log('❌ Error al consultar con columna "titulo":', tituloError);
    } else {
      console.log('✅ Consulta con columna "titulo" exitosa:', tituloQuery);
    }

  } catch (error) {
    console.error('Error general:', error);
  }
})();