require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserProgressSchema() {
  console.log('🔍 Verificando esquema de user_course_progress...');
  
  try {
    // Intentar acceder a la tabla directamente para ver qué columnas acepta
    console.log('📋 Intentando insertar registro de prueba para ver estructura...');
    
    // Primero intentar con columnas básicas
    const testInsert1 = await supabase
      .from('user_course_progress')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        curso_id: 1,
        chapter_id: 1
      })
      .select();
    
    if (testInsert1.error) {
      console.log('❌ Error con chapter_id:', testInsert1.error.message);
      
      // Intentar sin chapter_id
      const testInsert2 = await supabase
        .from('user_course_progress')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000',
          curso_id: 1
        })
        .select();
      
      if (testInsert2.error) {
        console.log('❌ Error sin chapter_id:', testInsert2.error.message);
        
        // Intentar con leccion_id en lugar de chapter_id
        const testInsert3 = await supabase
          .from('user_course_progress')
          .insert({
            user_id: '00000000-0000-0000-0000-000000000000',
            curso_id: 1,
            leccion_id: 1
          })
          .select();
        
        if (testInsert3.error) {
          console.log('❌ Error con leccion_id:', testInsert3.error.message);
        } else {
          console.log('✅ Funciona con leccion_id');
          // Limpiar el registro de prueba
          await supabase
            .from('user_course_progress')
            .delete()
            .eq('user_id', '00000000-0000-0000-0000-000000000000');
        }
      } else {
        console.log('✅ Funciona sin chapter_id');
        // Limpiar el registro de prueba
        await supabase
          .from('user_course_progress')
          .delete()
          .eq('user_id', '00000000-0000-0000-0000-000000000000');
      }
    } else {
      console.log('✅ Funciona con chapter_id');
      // Limpiar el registro de prueba
      await supabase
        .from('user_course_progress')
        .delete()
        .eq('user_id', '00000000-0000-0000-0000-000000000000');
    }
    
    // Verificar si hay datos en la tabla
    const { data: sampleData, error: dataError } = await supabase
      .from('user_course_progress')
      .select('*')
      .limit(3);
    
    if (dataError) {
      console.log('❌ Error al obtener datos de ejemplo:', dataError.message);
    } else {
      console.log('\n📊 Datos de ejemplo:');
      console.log(sampleData);
    }
    
    // Verificar si existe una tabla chapters o similar
    console.log('\n🔍 Buscando tablas relacionadas con chapters...');
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', '%chapter%');
    
    if (tables && tables.length > 0) {
      console.log('📋 Tablas relacionadas con chapters:');
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    } else {
      console.log('❌ No se encontraron tablas relacionadas con chapters');
    }
    
  } catch (err) {
    console.log('❌ Error general:', err.message);
  }
}

checkUserProgressSchema();