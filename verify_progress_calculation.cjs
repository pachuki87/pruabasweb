const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function verifyProgressCalculation() {
  try {
    console.log('🔍 Verificando cálculo de progreso...');
    
    // Obtener usuario Pablo
    const { data: users, error: userError } = await supabase
      .from('usuarios')
      .select('id, nombre')
      .eq('nombre', 'pablo')
      .single();
    
    if (userError || !users) {
      console.error('❌ Error obteniendo usuario pablo:', userError);
      return;
    }
    
    console.log(`👤 Usuario encontrado: ${users.nombre} (${users.id})`);
    
    // Obtener cursos
    const { data: courses, error: coursesError } = await supabase
      .from('cursos')
      .select('id, titulo');
    
    if (coursesError) {
      console.error('❌ Error obteniendo cursos:', coursesError);
      return;
    }
    
    console.log(`📚 Cursos encontrados: ${courses.length}`);
    
    for (const course of courses) {
      console.log(`\n📖 Analizando curso: ${course.titulo}`);
      
      // Contar cuestionarios totales
      const { count: totalQuizzes, error: quizzesError } = await supabase
        .from('cuestionarios')
        .select('*', { count: 'exact', head: true })
        .eq('curso_id', course.id);
      
      if (quizzesError) {
        console.error('❌ Error contando cuestionarios:', quizzesError);
        continue;
      }
      
      // Obtener IDs de cuestionarios
      const { data: quizIds } = await supabase
        .from('cuestionarios')
        .select('id')
        .eq('curso_id', course.id);
      
      const questionIds = quizIds?.map(q => q.id) || [];
      
      // Contar cuestionarios completados por Pablo
      let completedQuizzes = 0;
      if (questionIds.length > 0) {
        const { count, error: attemptsError } = await supabase
          .from('user_test_results')
          .select('cuestionario_id', { count: 'exact', head: true })
          .eq('user_id', users.id)
          .in('cuestionario_id', questionIds);
        
        if (attemptsError) {
          console.error('❌ Error contando cuestionarios completados:', attemptsError);
        } else {
          completedQuizzes = count || 0;
        }
      }
      
      // Calcular progreso
      let progressPercentage = 0;
      if (totalQuizzes > 0 && completedQuizzes > 0) {
        progressPercentage = Math.round((completedQuizzes / totalQuizzes) * 100);
      }
      
      console.log(`   📊 Cuestionarios: ${completedQuizzes}/${totalQuizzes}`);
      console.log(`   📈 Progreso calculado: ${progressPercentage}%`);
      
      // Verificar datos en user_test_results
      if (questionIds.length > 0) {
        const { data: testResults } = await supabase
          .from('user_test_results')
          .select('*')
          .eq('user_id', users.id)
          .in('cuestionario_id', questionIds);
        
        if (testResults && testResults.length > 0) {
          console.log(`   ✅ Tests completados encontrados:`);
          testResults.forEach((test, index) => {
            console.log(`      ${index + 1}. Quiz: ${test.cuestionario_id}, Score: ${test.score}, Aprobado: ${test.aprobado}`);
          });
        } else {
          console.log(`   ⚠️ No se encontraron tests completados`);
        }
      }
    }
    
    console.log('\n🎉 Verificación completada');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verifyProgressCalculation();