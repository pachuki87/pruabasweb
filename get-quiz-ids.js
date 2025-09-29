import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getQuizIds() {
  try {
    const { data: cuestionarios, error } = await supabase
      .from('cuestionarios')
      .select('id, titulo, leccion_id, curso_id')
      .limit(10);
    
    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('📋 Cuestionarios disponibles:');
    cuestionarios?.forEach((quiz, index) => {
      console.log(`${index + 1}. ID: ${quiz.id}`);
      console.log(`   Título: ${quiz.titulo}`);
      console.log(`   Lección ID: ${quiz.leccion_id}`);
      console.log(`   Curso ID: ${quiz.curso_id}`);
      console.log(`   URL de prueba: http://localhost:5173/student/quizzes/attempt/${quiz.id}`);
      console.log('');
    });

    if (cuestionarios && cuestionarios.length > 0) {
      console.log(`🎯 Para probar, usa esta URL: http://localhost:5173/student/quizzes/attempt/${cuestionarios[0].id}`);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

getQuizIds();