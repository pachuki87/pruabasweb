const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixLesson5QuizRelationship() {
  console.log('=== FIXING LESSON 5 QUIZ RELATIONSHIP ===\n');
  
  try {
    // 1. Get lesson 5 details
    console.log('1️⃣ OBTENIENDO DETALLES DE LA LECCIÓN 5');
    const { data: lesson, error: lessonError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('orden', 5)
      .single();
    
    if (lessonError) {
      console.error('❌ Error obteniendo lección:', lessonError);
      return;
    }
    
    console.log('✅ Lección 5 encontrada:');
    console.log(`   - ID: ${lesson.id}`);
    console.log(`   - Título: ${lesson.titulo}`);
    console.log(`   - Curso ID: ${lesson.curso_id}`);
    console.log(`   - tiene_cuestionario: ${lesson.tiene_cuestionario}\n`);
    
    // 2. Find quizzes that should belong to lesson 5
    console.log('2️⃣ BUSCANDO CUESTIONARIOS QUE DEBERÍAN PERTENECER A LA LECCIÓN 5');
    const { data: potentialQuizzes, error: quizzesError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('curso_id', lesson.curso_id)
      .ilike('titulo', '%módulo 5%');
    
    if (quizzesError) {
      console.error('❌ Error buscando cuestionarios:', quizzesError);
      return;
    }
    
    console.log(`✅ Encontrados ${potentialQuizzes.length} cuestionarios potenciales:`);
    potentialQuizzes.forEach((quiz, index) => {
      console.log(`   ${index + 1}. ${quiz.titulo}`);
      console.log(`      - ID: ${quiz.id}`);
      console.log(`      - leccion_id actual: ${quiz.leccion_id}`);
      console.log(`      - curso_id: ${quiz.curso_id}`);
    });
    console.log();
    
    // 3. Update quizzes to link them to lesson 5
    console.log('3️⃣ ACTUALIZANDO RELACIONES DE CUESTIONARIOS');
    
    for (const quiz of potentialQuizzes) {
      if (quiz.leccion_id !== lesson.id) {
        console.log(`🔄 Actualizando cuestionario: ${quiz.titulo}`);
        
        const { error: updateError } = await supabase
          .from('cuestionarios')
          .update({ leccion_id: lesson.id })
          .eq('id', quiz.id);
        
        if (updateError) {
          console.error(`❌ Error actualizando cuestionario ${quiz.id}:`, updateError);
        } else {
          console.log(`✅ Cuestionario ${quiz.id} actualizado correctamente`);
        }
      } else {
        console.log(`✅ Cuestionario ya está correctamente vinculado: ${quiz.titulo}`);
      }
    }
    
    console.log();
    
    // 4. Verify the fix
    console.log('4️⃣ VERIFICANDO LA CORRECCIÓN');
    const { data: linkedQuizzes, error: verifyError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('leccion_id', lesson.id);
    
    if (verifyError) {
      console.error('❌ Error verificando cuestionarios vinculados:', verifyError);
      return;
    }
    
    console.log(`✅ Cuestionarios ahora vinculados a la lección 5: ${linkedQuizzes.length}`);
    linkedQuizzes.forEach((quiz, index) => {
      console.log(`   ${index + 1}. ${quiz.titulo}`);
    });
    
    console.log();
    console.log('🎉 CORRECCIÓN COMPLETADA');
    console.log('Ahora el QuizComponent debería poder encontrar los cuestionarios de la lección 5.');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

fixLesson5QuizRelationship();