const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function findLesson9Quiz() {
  console.log('=== BUSCANDO LECCIÓN 9 Y SU CUESTIONARIO ===\n');
  
  try {
    // 1. Buscar lecciones con orden 9
    console.log('1️⃣ BUSCANDO LECCIONES CON ORDEN 9');
    const { data: lessons, error: lessonError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('orden', 9);
    
    if (lessonError) {
      console.error('❌ Error obteniendo lecciones:', lessonError);
      return;
    }
    
    if (!lessons || lessons.length === 0) {
      console.log('❌ No se encontraron lecciones con orden 9');
      return;
    }
    
    console.log(`✅ Encontradas ${lessons.length} lecciones con orden 9:`);
    lessons.forEach((lesson, index) => {
      console.log(`   ${index + 1}. ID: ${lesson.id} - Título: ${lesson.titulo} - Curso: ${lesson.curso_id}`);
    });
    console.log();
    
    // Procesar cada lección
     for (const lesson of lessons) {
       console.log(`\n🔍 PROCESANDO LECCIÓN: "${lesson.titulo}" (ID: ${lesson.id})`);
       
       // 2. Buscar cuestionario de la lección
       console.log('2️⃣ BUSCANDO CUESTIONARIO DE LA LECCIÓN');
       const { data: quiz, error: quizError } = await supabase
         .from('cuestionarios')
         .select('*')
         .eq('leccion_id', lesson.id)
         .single();
       
       if (quizError) {
         console.log('⚠️ No se encontró cuestionario específico, buscando por curso...');
         
         // Buscar cuestionarios generales del curso
         const { data: courseQuizzes, error: courseQuizError } = await supabase
           .from('cuestionarios')
           .select('*')
           .eq('curso_id', lesson.curso_id)
           .is('leccion_id', null);
         
         if (courseQuizError) {
           console.error('❌ Error buscando cuestionarios del curso:', courseQuizError);
           continue;
         }
         
         console.log(`📋 Encontrados ${courseQuizzes?.length || 0} cuestionarios generales del curso`);
         continue;
       }
       
       console.log('✅ Cuestionario encontrado:');
       console.log(`   - ID: ${quiz.id}`);
       console.log(`   - Título: ${quiz.titulo}`);
       console.log(`   - Lección ID: ${quiz.leccion_id}\n`);
       
       // 3. Buscar preguntas del cuestionario
       console.log('3️⃣ BUSCANDO PREGUNTAS DEL CUESTIONARIO');
       const { data: questions, error: questionsError } = await supabase
         .from('preguntas')
         .select('*')
         .eq('cuestionario_id', quiz.id)
         .order('orden');
       
       if (questionsError) {
         console.error('❌ Error obteniendo preguntas:', questionsError);
         continue;
       }
       
       console.log(`📝 Encontradas ${questions?.length || 0} preguntas`);
       
       // 4. Buscar las preguntas específicas de Verdadero/Falso
       const targetQuestions = [
         'La dopamina está implicada en los circuitos de recompensa.',
         'Las adicciones no afectan a las emociones.',
         'La gestión de emociones disfuncionales es clave en la recuperación.'
       ];
       
       console.log('\n4️⃣ BUSCANDO PREGUNTAS ESPECÍFICAS DE VERDADERO/FALSO');
       
       for (const targetText of targetQuestions) {
         const foundQuestion = questions?.find(q => 
           q.pregunta && q.pregunta.toLowerCase().includes(targetText.toLowerCase().substring(0, 20))
         );
         
         if (foundQuestion) {
           console.log(`\n✅ Pregunta encontrada: "${foundQuestion.pregunta}"`);
           console.log(`   - ID: ${foundQuestion.id}`);
           console.log(`   - Tipo: ${foundQuestion.tipo}`);
           
           // Buscar opciones existentes
           const { data: options, error: optionsError } = await supabase
             .from('opciones')
             .select('*')
             .eq('pregunta_id', foundQuestion.id);
           
           if (optionsError) {
             console.error('   ❌ Error obteniendo opciones:', optionsError);
           } else {
             console.log(`   📋 Opciones existentes: ${options?.length || 0}`);
             if (options && options.length > 0) {
               options.forEach(opt => {
                 console.log(`      - ${opt.texto} (${opt.es_correcta ? 'Correcta' : 'Incorrecta'})`);
               });
             } else {
               console.log('   ⚠️ NO HAY OPCIONES - NECESITA AGREGAR VERDADERO/FALSO');
             }
           }
         } else {
           console.log(`\n❌ No se encontró pregunta que contenga: "${targetText}"`);
         }
       }
     }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la función
findLesson9Quiz().then(() => {
  console.log('\n=== BÚSQUEDA COMPLETADA ===');
}).catch(error => {
  console.error('Error ejecutando script:', error);
});