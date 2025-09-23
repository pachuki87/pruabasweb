const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testQuizSolution() {
  console.log('🧪 Probando solución de cuestionarios...\n');
  
  // IDs de prueba
  const testCases = [
    { leccionId: 'a0b1c2d3-e4f5-6789-abcd-ef0123456789', courseId: 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836', description: 'Lección sin cuestionario específico' },
    { leccionId: '550e8400-e29b-41d4-a716-446655440000', courseId: 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836', description: 'Lección con cuestionario específico (si existe)' }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 Test: ${testCase.description}`);
    console.log(`   Lección ID: ${testCase.leccionId}`);
    console.log(`   Curso ID: ${testCase.courseId}`);
    
    try {
      // Paso 1: Buscar cuestionario específico de lección
      console.log('   🔍 Buscando cuestionario específico...');
      const { data: specificQuiz, error: specificError } = await supabase
        .from('cuestionarios')
        .select('*')
        .eq('leccion_id', testCase.leccionId)
        .single();
      
      if (specificQuiz) {
        console.log(`   ✅ Cuestionario específico encontrado: ${specificQuiz.titulo}`);
      } else {
        console.log('   ℹ️ No hay cuestionario específico, buscando general...');
        
        // Paso 2: Buscar cuestionarios generales del curso
        const { data: generalQuizzes, error: generalError } = await supabase
          .from('cuestionarios')
          .select('*')
          .eq('curso_id', testCase.courseId)
          .is('leccion_id', null);
        
        if (generalQuizzes && generalQuizzes.length > 0) {
          console.log(`   ✅ Cuestionarios generales encontrados: ${generalQuizzes.length}`);
          generalQuizzes.forEach((quiz, index) => {
            console.log(`      ${index + 1}. ${quiz.titulo} (ID: ${quiz.id})`);
          });
          
          // Cargar preguntas del primer cuestionario
          const firstQuiz = generalQuizzes[0];
          const { data: questions } = await supabase
            .from('preguntas_cuestionario')
            .select('*')
            .eq('cuestionario_id', firstQuiz.id);
          
          console.log(`   📝 Preguntas en el primer cuestionario: ${questions?.length || 0}`);
          
        } else {
          console.log('   ❌ No se encontraron cuestionarios generales para este curso');
        }
      }
      
    } catch (error) {
      console.error('   ❌ Error:', error.message);
    }
  }
  
  console.log('\n🎯 Resumen de cuestionarios disponibles:');
  const { data: allQuizzes } = await supabase
    .from('cuestionarios')
    .select('id, titulo, leccion_id, curso_id')
    .order('titulo');
  
  if (allQuizzes) {
    allQuizzes.forEach(quiz => {
      const tipo = quiz.leccion_id ? 'ESPECÍFICO' : 'GENERAL';
      console.log(`   - ${quiz.titulo} [${tipo}] (Lección: ${quiz.leccion_id || 'N/A'}, Curso: ${quiz.curso_id})`);
    });
  }
}

testQuizSolution().catch(console.error);