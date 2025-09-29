require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

(async () => {
  try {
    // Verificar estructura de las tablas directamente con SQL
    const tablas = ['cursos', 'lecciones', 'cuestionarios', 'materiales', 'inscripciones'];
    
    for (const tabla of tablas) {
      console.log(`\nVerificando tabla ${tabla}...`);
      
      const { data, error } = await supabase
        .from(tabla)
        .select()
        .limit(1);
      
      if (error) {
        console.log(`Error al verificar tabla ${tabla}:`, error);
        continue;
      }
      
      if (data && data.length > 0) {
        console.log(`Columnas en tabla ${tabla}:`);
        const columnas = Object.keys(data[0]);
        columnas.forEach(col => console.log(`- ${col}`));
      } else {
        console.log(`No se encontraron registros en la tabla ${tabla}.`);
        
        // Intentar obtener la estructura de la tabla con SQL
        const { data: tableInfo, error: tableError } = await supabase
          .rpc('get_table_columns', { table_name: tabla });
          
        if (tableError) {
          console.log(`No se pudo obtener la estructura de la tabla ${tabla}:`, tableError);
        } else if (tableInfo) {
          console.log(`Estructura de la tabla ${tabla} (sin datos):`);
          console.log(tableInfo);
        }
      }
    }

    // Verificar si hay inconsistencias entre 'title' y 'titulo'
    console.log('\n\nVerificando inconsistencias entre "title" y "titulo"...');
    
    // Verificar en la tabla cursos
    const { data: cursosData, error: cursosError } = await supabase
      .from('cursos')
      .select()
      .limit(1);
      
    if (!cursosError && cursosData && cursosData.length > 0) {
      const cursosColumns = Object.keys(cursosData[0]);
      console.log('\nEn tabla cursos:');
      console.log('- Tiene columna "title":', cursosColumns.includes('title'));
      console.log('- Tiene columna "titulo":', cursosColumns.includes('titulo'));
    }
    
    // Verificar en la tabla lecciones
    const { data: leccionesData, error: leccionesError } = await supabase
      .from('lecciones')
      .select()
      .limit(1);
      
    if (!leccionesError && leccionesData && leccionesData.length > 0) {
      const leccionesColumns = Object.keys(leccionesData[0]);
      console.log('\nEn tabla lecciones:');
      console.log('- Tiene columna "title":', leccionesColumns.includes('title'));
      console.log('- Tiene columna "titulo":', leccionesColumns.includes('titulo'));
    }
    
    // Verificar en la tabla cuestionarios
    const { data: cuestionariosData, error: cuestionariosError } = await supabase
      .from('cuestionarios')
      .select()
      .limit(1);
      
    if (!cuestionariosError && cuestionariosData && cuestionariosData.length > 0) {
      const cuestionariosColumns = Object.keys(cuestionariosData[0]);
      console.log('\nEn tabla cuestionarios:');
      console.log('- Tiene columna "title":', cuestionariosColumns.includes('title'));
      console.log('- Tiene columna "titulo":', cuestionariosColumns.includes('titulo'));
    }

  } catch (error) {
    console.error('Error general:', error);
  }
})();
