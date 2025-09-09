import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simular exactamente lo que hace QuizAttemptPage.tsx
async function testQuizAttemptPage() {
  const quizId = '1e9291a8-cc44-4d8c-bfbf-3aea525ed4fe';
  
  console.log('🎯 Simulando QuizAttemptPage para quiz:', quizId);
  console.log('📍 URL simulada: /student/quizzes/attempt/' + quizId);
  
  try {
    // 1. Verificar autenticación (como hace useAuth)
    console.log('\n1️⃣ Verificando autenticación...');
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('❌ Error de autenticación:', authError.message);
      console.error('Detalles completos:', authError);
    } else {
      console.log('✅ Auth check OK');
      console.log('Usuario autenticado:', authUser.user ? 'Sí' : 'No');
    }

    // 2. Fetch quiz data (línea 65-70 de QuizAttemptPage.tsx)
    console.log('\n2️⃣ Obteniendo datos del cuestionario...');
    const { data: quizData, error: quizError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('id', quizId)
      .single();

    if (quizError) {
      console.error('❌ Error obteniendo cuestionario:', quizError.message);
      console.error('Código de error:', quizError.code);
      console.error('Detalles completos:', quizError);
      return;
    } else {
      console.log('✅ Cuestionario obtenido correctamente');
      console.log('Título:', quizData.titulo);
      console.log('Curso ID:', quizData.curso_id);
      console.log('Lección ID:', quizData.leccion_id);
    }

    // 3. Fetch quiz questions (línea 77-85 de QuizAttemptPage.tsx)
    console.log('\n3️⃣ Obteniendo preguntas del cuestionario...');
    const { data: questionsData, error: questionsError } = await supabase
      .from('preguntas')
      .select(`
        *,
        opciones_respuesta (*)
      `)
      .eq('cuestionario_id', quizId)
      .order('orden');

    if (questionsError) {
      console.error('❌ Error obteniendo preguntas:', questionsError.message);
      console.error('Código de error:', questionsError.code);
      console.error('Detalles completos:', questionsError);
      return;
    } else {
      console.log('✅ Preguntas obtenidas correctamente');
      console.log('Número de preguntas:', questionsData?.length || 0);
      
      if (questionsData && questionsData.length > 0) {
        console.log('Primera pregunta:', questionsData[0].pregunta);
        console.log('Opciones de la primera pregunta:', questionsData[0].opciones_respuesta?.length || 0);
      }
    }

    // 4. Simular otras consultas que podrían estar fallando
    console.log('\n4️⃣ Probando consultas adicionales...');
    
    // Test inscripciones
    const { data: inscripciones, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('*')
      .limit(1);
    
    if (inscripcionesError) {
      console.error('❌ Error consultando inscripciones:', inscripcionesError.message);
    } else {
      console.log('✅ Consulta inscripciones OK');
    }

    // Test lecciones
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .limit(1);
    
    if (leccionesError) {
      console.error('❌ Error consultando lecciones:', leccionesError.message);
    } else {
      console.log('✅ Consulta lecciones OK');
    }

    // Test respuestas_texto_libre
    const { data: respuestas, error: respuestasError } = await supabase
      .from('respuestas_texto_libre')
      .select('*')
      .limit(1);
    
    if (respuestasError) {
      console.error('❌ Error consultando respuestas_texto_libre:', respuestasError.message);
    } else {
      console.log('✅ Consulta respuestas_texto_libre OK');
    }

    console.log('\n🎉 Simulación completada exitosamente');
    console.log('\n📝 Resumen:');
    console.log('- Cuestionario cargado:', quizData ? '✅' : '❌');
    console.log('- Preguntas cargadas:', questionsData && questionsData.length > 0 ? '✅' : '❌');
    console.log('- Número de preguntas:', questionsData?.length || 0);
    
    if (questionsData && questionsData.length === 0) {
      console.log('\n⚠️  PROBLEMA IDENTIFICADO: El cuestionario no tiene preguntas asociadas');
      console.log('Esto explicaría por qué el cuestionario se carga pero no se ven las preguntas.');
    }

  } catch (error) {
    console.error('💥 Error general en la simulación:', error);
  }
}

// Ejecutar la simulación
testQuizAttemptPage().then(() => {
  console.log('\n🏁 Test completado');
}).catch(error => {
  console.error('💥 Error ejecutando test:', error);
});