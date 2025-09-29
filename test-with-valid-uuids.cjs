const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Generar UUIDs válidos para la prueba
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function testWithValidUUIDs() {
  try {
    console.log('🔍 Probando con UUIDs válidos...');
    
    const testUserId = generateUUID();
    const testCourseId = generateUUID();
    const testChapterId = generateUUID();
    
    console.log('🆔 UUIDs generados:');
    console.log('  User ID:', testUserId);
    console.log('  Course ID:', testCourseId);
    console.log('  Chapter ID:', testChapterId);
    
    // Probar con course_id y chapter_id
    console.log('\n1️⃣ Probando con course_id + chapter_id:');
    const { data: test1, error: error1 } = await supabase
      .from('user_course_progress')
      .insert({
        user_id: testUserId,
        course_id: testCourseId,
        chapter_id: testChapterId
      })
      .select();
    
    if (error1) {
      console.log('❌ Error:', error1.message);
    } else {
      console.log('✅ Éxito! Estructura encontrada:');
      console.log('📋 Columnas:', Object.keys(test1[0]));
      console.log('📄 Datos completos:', test1[0]);
      // Limpiar
      await supabase.from('user_course_progress').delete().eq('user_id', testUserId);
      return;
    }
    
    // Probar solo con campos mínimos
    console.log('\n2️⃣ Probando solo user_id + course_id:');
    const { data: test2, error: error2 } = await supabase
      .from('user_course_progress')
      .insert({
        user_id: testUserId,
        course_id: testCourseId
      })
      .select();
    
    if (error2) {
      console.log('❌ Error:', error2.message);
    } else {
      console.log('✅ Éxito! Estructura encontrada:');
      console.log('📋 Columnas:', Object.keys(test2[0]));
      console.log('📄 Datos completos:', test2[0]);
      // Limpiar
      await supabase.from('user_course_progress').delete().eq('user_id', testUserId);
      return;
    }
    
    // Probar con curso_id (como está en types)
    console.log('\n3️⃣ Probando con curso_id (según types):');
    const { data: test3, error: error3 } = await supabase
      .from('user_course_progress')
      .insert({
        user_id: testUserId,
        curso_id: testCourseId
      })
      .select();
    
    if (error3) {
      console.log('❌ Error:', error3.message);
    } else {
      console.log('✅ Éxito! Estructura encontrada:');
      console.log('📋 Columnas:', Object.keys(test3[0]));
      console.log('📄 Datos completos:', test3[0]);
      // Limpiar
      await supabase.from('user_course_progress').delete().eq('user_id', testUserId);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testWithValidUUIDs();