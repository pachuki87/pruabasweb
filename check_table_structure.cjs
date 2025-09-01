require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

(async () => {
  try {
    console.log('🔍 Verificando estructura de la tabla lecciones...');
    
    // Intentar obtener cualquier registro de lecciones para ver las columnas
    const { data: lecciones, error } = await supabase
      .from('lecciones')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error al consultar lecciones:', error);
      return;
    }
    
    if (lecciones && lecciones.length > 0) {
      console.log('✅ Columnas disponibles en la tabla lecciones:');
      console.log(Object.keys(lecciones[0]));
      console.log('\n📋 Ejemplo de registro:');
      console.log(lecciones[0]);
    } else {
      console.log('⚠️ No hay registros en la tabla lecciones');
      
      // Intentar insertar un registro de prueba para ver la estructura
      console.log('\n🧪 Intentando insertar registro de prueba...');
      const { data: testInsert, error: insertError } = await supabase
        .from('lecciones')
        .insert({
          titulo: 'TEST',
          orden: 999
        })
        .select()
        .single();
      
      if (insertError) {
        console.log('❌ Error al insertar registro de prueba:', insertError);
      } else {
        console.log('✅ Registro de prueba insertado. Columnas disponibles:');
        console.log(Object.keys(testInsert));
        
        // Eliminar el registro de prueba
        await supabase
          .from('lecciones')
          .delete()
          .eq('id', testInsert.id);
        console.log('🗑️ Registro de prueba eliminado');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();