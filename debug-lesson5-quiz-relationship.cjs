const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugLesson5QuizRelationship() {
  console.log('=== DEBUGGING LESSON 5 QUIZ RELATIONSHIP ===');
  
  const lesson5Id = 'a2ea5c33-f0bf-4aba-b823-d5dabc825511';
  
  try {
    // 1. Verificar la lección 5
    console.log('\n1️⃣ VERIFICANDO LECCIÓN 5');
    const { data: lesson, error: lessonError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('id', lesson5Id)
      .single();
    
    if (lessonError) {
      console.error('❌ Error obteniendo lección:', lessonError);
      return;
    }
    
    console.log('✅ Lección encontrada:');
    console.log(`   - ID: ${lesson.id}`);
    console.log(`   - Título: ${lesson.titulo}`);
    console.log(`   - tiene_cuestionario: ${lesson.tiene_cuestionario}`);
    console.log(`   - curso_id: ${lesson.curso_id}`);
    
    // 2. Buscar cuestionarios específicos de la lección (como hace el frontend)
    console.log('\n2️⃣ BUSCANDO CUESTIONARIOS ESPECÍFICOS (leccion_id)');
    const { data: specificQuizzes, error: specificError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('leccion_id', lesson5Id);
    
    console.log(`📊 Cuestionarios específicos encontrados: ${specificQuizzes?.length || 0}`);
    if (specificQuizzes && specificQuizzes.length > 0) {
      specificQuizzes.forEach((quiz, index) => {
        console.log(`   ${index + 1}. ${quiz.titulo} (ID: ${quiz.id})`);
      });
    } else {
      console.log('   ❌ No se encontraron cuestionarios específicos');
    }
    
    // 3. Buscar cuestionarios del curso (fallback del frontend)
    console.log('\n3️⃣ BUSCANDO CUESTIONARIOS GENERALES DEL CURSO');
    const { data: courseQuizzes, error: courseError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('curso_id', lesson.curso_id)
      .is('leccion_id', null);
    
    console.log(`📊 Cuestionarios generales del curso: ${courseQuizzes?.length || 0}`);
    if (courseQuizzes && courseQuizzes.length > 0) {
      courseQuizzes.forEach((quiz, index) => {
        console.log(`   ${index + 1}. ${quiz.titulo} (ID: ${quiz.id})`);
      });
    }
    
    // 4. Buscar TODOS los cuestionarios relacionados con la lección 5
    console.log('\n4️⃣ BUSCANDO TODOS LOS CUESTIONARIOS RELACIONADOS');
    const { data: allQuizzes, error: allError } = await supabase
      .from('cuestionarios')
      .select('*')
      .or(`leccion_id.eq.${lesson5Id},curso_id.eq.${lesson.curso_id}`);
    
    console.log(`📊 Todos los cuestionarios relacionados: ${allQuizzes?.length || 0}`);
    if (allQuizzes && allQuizzes.length > 0) {
      allQuizzes.forEach((quiz, index) => {
        console.log(`   ${index + 1}. ${quiz.titulo}`);
        console.log(`      - ID: ${quiz.id}`);
        console.log(`      - leccion_id: ${quiz.leccion_id || 'null'}`);
        console.log(`      - curso_id: ${quiz.curso_id}`);
        console.log(`      - activo: ${quiz.activo}`);
        console.log('');
      });
    }
    
    // 5. Verificar preguntas de los cuestionarios encontrados
    console.log('\n5️⃣ VERIFICANDO PREGUNTAS DE LOS CUESTIONARIOS');
    for (const quiz of allQuizzes || []) {
      const { data: questions, error: questionsError } = await supabase
        .from('preguntas')
        .select('*')
        .eq('cuestionario_id', quiz.id);
      
      console.log(`📝 Cuestionario "${quiz.titulo}": ${questions?.length || 0} preguntas`);
      if (questionsError) {
        console.log(`   ❌ Error: ${questionsError.message}`);
      }
    }
    
    // 6. DIAGNÓSTICO Y RECOMENDACIONES
    console.log('\n6️⃣ DIAGNÓSTICO Y RECOMENDACIONES');
    console.log('=' * 50);
    
    if (!specificQuizzes || specificQuizzes.length === 0) {
      console.log('🔍 PROBLEMA IDENTIFICADO: No hay cuestionarios con leccion_id específico');
      console.log('💡 SOLUCIÓN RECOMENDADA:');
      
      // Encontrar el cuestionario con más preguntas
      let bestQuiz = null;
      let maxQuestions = 0;
      
      for (const quiz of allQuizzes || []) {
        const { data: questions } = await supabase
          .from('preguntas')
          .select('id')
          .eq('cuestionario_id', quiz.id);
        
        if (questions && questions.length > maxQuestions) {
          maxQuestions = questions.length;
          bestQuiz = quiz;
        }
      }
      
      if (bestQuiz) {
        console.log(`   - Actualizar cuestionario "${bestQuiz.titulo}" (ID: ${bestQuiz.id})`);
        console.log(`   - Establecer leccion_id = '${lesson5Id}'`);
        console.log(`   - Este cuestionario tiene ${maxQuestions} preguntas`);
        
        console.log('\n📋 COMANDO SQL SUGERIDO:');
        console.log(`UPDATE cuestionarios SET leccion_id = '${lesson5Id}' WHERE id = '${bestQuiz.id}';`);
      }
    } else {
      console.log('✅ Los cuestionarios específicos están correctamente configurados');
    }
    
  } catch (error) {
    console.error('❌ Error en el diagnóstico:', error);
  }
}

debugLesson5QuizRelationship();