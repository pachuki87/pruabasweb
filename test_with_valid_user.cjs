require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testWithValidUser() {
  try {
    console.log('🔍 Obteniendo un user_id válido...');
    
    // Primero obtener un user_id válido de user_course_progress
    const { data: validUsers, error: userError } = await supabase
      .from('user_course_progress')
      .select('user_id')
      .limit(1);
    
    if (userError || !validUsers || validUsers.length === 0) {
      console.log('❌ No se encontraron usuarios válidos');
      return;
    }
    
    const validUserId = validUsers[0].user_id;
    console.log('✅ User ID válido encontrado:', validUserId);
    
    // Obtener un quiz_id válido
    const { data: validQuizzes, error: quizError } = await supabase
      .from('cuestionarios')
      .select('id, curso_id')
      .limit(1);
    
    if (quizError || !validQuizzes || validQuizzes.length === 0) {
      console.log('❌ No se encontraron cuestionarios válidos');
      return;
    }
    
    const validQuizId = validQuizzes[0].id;
    const validCourseId = validQuizzes[0].curso_id;
    console.log('✅ Quiz ID válido:', validQuizId);
    console.log('✅ Course ID válido:', validCourseId);
    
    console.log('\n🧪 Probando inserción con IDs válidos...');
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_test_results')
      .insert({
        user_id: validUserId,
        quiz_id: validQuizId,
        course_id: validCourseId,
        puntuacion: 85,
        puntuacion_maxima: 100
      })
      .select();
    
    if (insertError) {
      console.log(`❌ Error: ${insertError.message}`);
    } else {
      console.log(`✅ ¡ÉXITO! Estructura básica confirmada`);
      console.log(`📋 Columnas detectadas:`, Object.keys(insertData[0]));
      console.log(`🎯 Datos completos:`, insertData[0]);
      
      // Limpiar el registro de prueba
      await supabase
        .from('user_test_results')
        .delete()
        .eq('id', insertData[0].id);
        
      console.log(`🧹 Registro de prueba eliminado`);
    }
    
  } catch (err) {
    console.error('❌ Error general:', err.message);
  }
}

testWithValidUser();