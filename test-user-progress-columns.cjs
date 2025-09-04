const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testUserProgressColumns() {
  try {
    console.log('🧪 Probando estructura de user_course_progress...');
    
    // Primero, intentar con curso_id (como está en types)
    console.log('\n1️⃣ Probando con curso_id (según types):');
    const { data: test1, error: error1 } = await supabase
      .from('user_course_progress')
      .insert({
        user_id: 'test-user-id',
        curso_id: 'test-course-id',
        chapter_id: 'test-chapter-id',
        progress_percentage: 0,
        last_accessed_at: new Date().toISOString(),
        time_spent_minutes: 0,
        is_completed: false
      })
      .select();
    
    if (error1) {
      console.log('❌ Error con curso_id:', error1.message);
    } else {
      console.log('✅ Éxito con curso_id');
      // Limpiar el registro de prueba
      await supabase.from('user_course_progress').delete().eq('user_id', 'test-user-id');
    }
    
    // Segundo, intentar con course_id (como sugieren los logs)
    console.log('\n2️⃣ Probando con course_id (según logs de error):');
    const { data: test2, error: error2 } = await supabase
      .from('user_course_progress')
      .insert({
        user_id: 'test-user-id',
        course_id: 'test-course-id',
        chapter_id: 'test-chapter-id',
        progress_percentage: 0,
        last_accessed_at: new Date().toISOString(),
        time_spent_minutes: 0,
        is_completed: false
      })
      .select();
    
    if (error2) {
      console.log('❌ Error con course_id:', error2.message);
    } else {
      console.log('✅ Éxito con course_id');
      // Limpiar el registro de prueba
      await supabase.from('user_course_progress').delete().eq('user_id', 'test-user-id');
    }
    
    // Tercero, intentar con leccion_id en lugar de chapter_id
    console.log('\n3️⃣ Probando con leccion_id en lugar de chapter_id:');
    const { data: test3, error: error3 } = await supabase
      .from('user_course_progress')
      .insert({
        user_id: 'test-user-id',
        curso_id: 'test-course-id',
        leccion_id: 'test-lesson-id',
        progress_percentage: 0,
        last_accessed_at: new Date().toISOString(),
        time_spent_minutes: 0,
        is_completed: false
      })
      .select();
    
    if (error3) {
      console.log('❌ Error con leccion_id:', error3.message);
    } else {
      console.log('✅ Éxito con leccion_id');
      // Limpiar el registro de prueba
      await supabase.from('user_course_progress').delete().eq('user_id', 'test-user-id');
    }
    
    // Cuarto, intentar la combinación course_id + leccion_id
    console.log('\n4️⃣ Probando con course_id + leccion_id:');
    const { data: test4, error: error4 } = await supabase
      .from('user_course_progress')
      .insert({
        user_id: 'test-user-id',
        course_id: 'test-course-id',
        leccion_id: 'test-lesson-id',
        progress_percentage: 0,
        last_accessed_at: new Date().toISOString(),
        time_spent_minutes: 0,
        is_completed: false
      })
      .select();
    
    if (error4) {
      console.log('❌ Error con course_id + leccion_id:', error4.message);
    } else {
      console.log('✅ Éxito con course_id + leccion_id');
      console.log('📋 Estructura correcta encontrada:', Object.keys(test4[0]));
      // Limpiar el registro de prueba
      await supabase.from('user_course_progress').delete().eq('user_id', 'test-user-id');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testUserProgressColumns();