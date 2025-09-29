const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function discoverUserProgressSchema() {
  try {
    console.log('🔍 Descubriendo estructura real de user_course_progress...');
    
    // Intentar con campos mínimos usando course_id
    console.log('\n1️⃣ Probando campos básicos con course_id:');
    const { data: test1, error: error1 } = await supabase
      .from('user_course_progress')
      .insert({
        user_id: 'test-user-id',
        course_id: 'test-course-id'
      })
      .select();
    
    if (error1) {
      console.log('❌ Error:', error1.message);
    } else {
      console.log('✅ Éxito! Estructura encontrada:');
      console.log('📋 Columnas:', Object.keys(test1[0]));
      // Limpiar
      await supabase.from('user_course_progress').delete().eq('user_id', 'test-user-id');
      return;
    }
    
    // Intentar con chapter_id
    console.log('\n2️⃣ Probando con chapter_id:');
    const { data: test2, error: error2 } = await supabase
      .from('user_course_progress')
      .insert({
        user_id: 'test-user-id',
        course_id: 'test-course-id',
        chapter_id: 'test-chapter-id'
      })
      .select();
    
    if (error2) {
      console.log('❌ Error:', error2.message);
    } else {
      console.log('✅ Éxito! Estructura encontrada:');
      console.log('📋 Columnas:', Object.keys(test2[0]));
      // Limpiar
      await supabase.from('user_course_progress').delete().eq('user_id', 'test-user-id');
      return;
    }
    
    // Intentar con leccion_id
    console.log('\n3️⃣ Probando con leccion_id:');
    const { data: test3, error: error3 } = await supabase
      .from('user_course_progress')
      .insert({
        user_id: 'test-user-id',
        course_id: 'test-course-id',
        leccion_id: 'test-lesson-id'
      })
      .select();
    
    if (error3) {
      console.log('❌ Error:', error3.message);
    } else {
      console.log('✅ Éxito! Estructura encontrada:');
      console.log('📋 Columnas:', Object.keys(test3[0]));
      // Limpiar
      await supabase.from('user_course_progress').delete().eq('user_id', 'test-user-id');
      return;
    }
    
    // Intentar solo con user_id para ver qué campos son requeridos
    console.log('\n4️⃣ Probando solo con user_id:');
    const { data: test4, error: error4 } = await supabase
      .from('user_course_progress')
      .insert({
        user_id: 'test-user-id'
      })
      .select();
    
    if (error4) {
      console.log('❌ Error:', error4.message);
      console.log('💡 Esto nos dice qué campos son requeridos');
    } else {
      console.log('✅ Éxito! Estructura encontrada:');
      console.log('📋 Columnas:', Object.keys(test4[0]));
      // Limpiar
      await supabase.from('user_course_progress').delete().eq('user_id', 'test-user-id');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

discoverUserProgressSchema();