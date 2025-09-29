const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkSchema() {
  try {
    // Intentar hacer una consulta simple a la tabla para ver qué columnas existen
    const { data, error } = await supabase
      .from('intentos_cuestionario')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error al consultar intentos_cuestionario:', error);
    } else {
      console.log('Consulta exitosa. Estructura de datos:');
      if (data && data.length > 0) {
        console.log('Columnas encontradas:', Object.keys(data[0]));
      } else {
        console.log('No hay datos en la tabla, pero la consulta fue exitosa.');
      }
    }
    
    // Intentar insertar un registro de prueba para ver qué columnas faltan
    console.log('\nIntentando insertar registro de prueba...');
    const testInsert = {
      user_id: '00000000-0000-0000-0000-000000000000',
      cuestionario_id: '00000000-0000-0000-0000-000000000000',
      curso_id: '00000000-0000-0000-0000-000000000000',
      aprobado: true
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('intentos_cuestionario')
      .insert(testInsert)
      .select();
    
    if (insertError) {
      console.log('Error en insert (esto nos ayuda a ver qué columnas faltan):');
      console.log(insertError.message);
    } else {
      console.log('Insert exitoso (eliminando registro de prueba...).');
      // Eliminar el registro de prueba
      await supabase
        .from('intentos_cuestionario')
        .delete()
        .eq('id', insertData[0].id);
    }
    
  } catch (err) {
    console.error('Error general:', err);
  }
  
  process.exit(0);
}

checkSchema();