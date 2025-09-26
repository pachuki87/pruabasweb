import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson5Quiz() {
  try {
    console.log('=== VERIFICANDO ESTADO DEL CUESTIONARIO LECCIÓN 5 ===');
    
    // Obtener información de la lección 5
    const { data: lesson, error: lessonError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('id', 'a2ea5c33-f0bf-4aba-b823-d5dabc825511')
      .single();
    
    if (lessonError) {
      console.error('Error al obtener lección:', lessonError);
      return;
    }
    
    console.log('Lección 5 info:');
    console.log('- ID:', lesson.id);
    console.log('- Título:', lesson.titulo);
    console.log('- tiene_cuestionario:', lesson.tiene_cuestionario);
    
    // Obtener cuestionarios asociados
    const { data: quizzes, error: quizzesError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('leccion_id', lesson.id);
    
    if (quizzesError) {
      console.error('Error al obtener cuestionarios:', quizzesError);
      return;
    }
    
    console.log('\n=== CUESTIONARIOS ENCONTRADOS ===');
    console.log('Total cuestionarios:', quizzes.length);
    
    quizzes.forEach((quiz, index) => {
      console.log(`\nCuestionario ${index + 1}:`);
      console.log('- ID:', quiz.id);
      console.log('- Título:', quiz.titulo);
      console.log('- Activo:', quiz.activo);
      console.log('- Creado:', quiz.creado_en);
    });
    
    // Verificar preguntas de cada cuestionario
    for (const quiz of quizzes) {
      const { data: questions, error: questionsError } = await supabase
        .from('preguntas')
        .select('*')
        .eq('cuestionario_id', quiz.id);
      
      if (!questionsError) {
        console.log(`\nPreguntas del cuestionario "${quiz.titulo}": ${questions.length}`);
      }
    }
    
    // Sugerencia de corrección
    console.log('\n=== DIAGNÓSTICO ===');
    if (quizzes.length > 0 && !lesson.tiene_cuestionario) {
      console.log('❌ PROBLEMA ENCONTRADO: La lección tiene cuestionarios pero el campo "tiene_cuestionario" está en false');
      console.log('✅ SOLUCIÓN: Actualizar el campo "tiene_cuestionario" a true');
    } else if (quizzes.length === 0) {
      console.log('❌ PROBLEMA: No hay cuestionarios asociados a esta lección');
    } else {
      console.log('✅ La configuración parece correcta');
    }
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

checkLesson5Quiz();