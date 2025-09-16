const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🔧 Configurando Supabase...');
console.log('URL:', process.env.VITE_SUPABASE_URL);
console.log('Key:', process.env.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'NO configurada');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

console.log('✅ Cliente Supabase creado');

async function checkLessonQuizStatus() {
  try {
    console.log('🔍 Verificando estado de la lección del MÓDULO 1...');
    
    // Verificar la lección específica
    const { data: lesson, error: lessonError } = await supabase
      .from('lecciones')
      .select('id, titulo, tiene_cuestionario, orden, curso_id')
      .eq('id', '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44')
      .single();
    
    if (lessonError) {
      console.error('❌ Error consultando lección:', lessonError);
      return;
    }
    
    console.log('📖 Datos de la lección:');
    console.log('   ID:', lesson.id);
    console.log('   Título:', lesson.titulo);
    console.log('   Tiene cuestionario:', lesson.tiene_cuestionario);
    console.log('   Orden:', lesson.orden);
    console.log('   Curso ID:', lesson.curso_id);
    
    // Si no tiene cuestionario marcado, actualizarlo
    if (!lesson.tiene_cuestionario) {
      console.log('⚠️  La lección NO tiene marcado que tiene cuestionario');
      console.log('🔧 Actualizando campo tiene_cuestionario...');
      
      const { data: updateData, error: updateError } = await supabase
        .from('lecciones')
        .update({ tiene_cuestionario: true })
        .eq('id', '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44')
        .select();
      
      if (updateError) {
        console.error('❌ Error actualizando lección:', updateError);
      } else {
        console.log('✅ Lección actualizada correctamente:', updateData);
      }
    } else {
      console.log('✅ La lección ya tiene marcado que tiene cuestionario');
    }
    
    // Verificar si existen cuestionarios para esta lección
    const { data: quizzes, error: quizzesError } = await supabase
      .from('cuestionarios')
      .select('id, titulo, leccion_id')
      .eq('leccion_id', '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44');
    
    if (quizzesError) {
      console.error('❌ Error consultando cuestionarios:', quizzesError);
    } else {
      console.log('📝 Cuestionarios encontrados:', quizzes.length);
      quizzes.forEach(quiz => {
        console.log(`   - ${quiz.titulo} (ID: ${quiz.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkLessonQuizStatus();