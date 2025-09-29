const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fixInscripcionesTable() {
  console.log('🔧 Corrigiendo estructura de la tabla inscripciones...');
  
  try {
    // Verificar estructura actual
    console.log('📋 Verificando estructura actual...');
    const { data: currentData, error: currentError } = await supabase
      .from('inscripciones')
      .select('*')
      .limit(1);
    
    if (currentError) {
      console.log('❌ Error al acceder a inscripciones:', currentError.message);
      return;
    }
    
    console.log('✅ Tabla inscripciones accesible');
    
    // Intentar insertar un registro de prueba para verificar si falta la columna id
    console.log('🧪 Probando inserción con id...');
    const testUserId = '00000000-0000-0000-0000-000000000000';
    const testCourseId = '00000000-0000-0000-0000-000000000001';
    
    const { data: insertData, error: insertError } = await supabase
      .from('inscripciones')
      .insert({
        id: '00000000-0000-0000-0000-000000000002',
        user_id: testUserId,
        curso_id: testCourseId
      })
      .select();
    
    if (insertError) {
      if (insertError.message.includes("id") || insertError.code === 'PGRST204') {
        console.log('❌ Confirmado: falta columna id en inscripciones');
        console.log('📝 Error:', insertError.message);
        console.log('');
        console.log('🚨 ACCIÓN REQUERIDA:');
        console.log('1. Ve a Supabase Dashboard > SQL Editor');
        console.log('2. Ejecuta el archivo: fix-inscripciones-id.sql');
        console.log('3. Esto añadirá la columna id faltante');
        console.log('');
        console.log('📄 Contenido del archivo SQL:');
        console.log('ALTER TABLE inscripciones ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;');
        console.log('ALTER TABLE inscripciones ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();');
      } else {
        console.log('❌ Error diferente:', insertError.message);
      }
    } else {
      console.log('✅ La tabla inscripciones ya tiene columna id');
      // Limpiar el registro de prueba
      await supabase
        .from('inscripciones')
        .delete()
        .eq('id', '00000000-0000-0000-0000-000000000002');
    }
    
    // Mostrar estructura actual
    console.log('\n📊 Datos actuales en inscripciones:');
    const { data: allData, error: allError } = await supabase
      .from('inscripciones')
      .select('*');
    
    if (allError) {
      console.log('❌ Error al obtener datos:', allError.message);
    } else {
      console.log(`✅ Total registros: ${allData.length}`);
      allData.forEach((row, index) => {
        console.log(`${index + 1}. ID: ${row.id || 'N/A'}, User: ${row.user_id}, Course: ${row.curso_id}`);
      });
    }
    
  } catch (error) {
    console.error('💥 Error inesperado:', error);
  }
}

fixInscripcionesTable();