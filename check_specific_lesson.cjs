const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSpecificLesson() {
  const lessonId = 'e4546103-526d-42ff-a98b-0db4828caa44';
  
  console.log('🔍 Verificando lección específica:', lessonId);
  
  // Verificar datos de la lección
  const { data: lesson, error: lessonError } = await supabase
    .from('lecciones')
    .select('id, titulo, tiene_cuestionario')
    .eq('id', lessonId)
    .single();
    
  if (lessonError) {
    console.error('❌ Error al obtener lección:', lessonError);
    return;
  }
  
  console.log('📚 Lección encontrada:');
  console.log('  - ID:', lesson.id);
  console.log('  - Título:', lesson.titulo);
  console.log('  - Tiene cuestionario:', lesson.tiene_cuestionario);
  
  // Verificar cuestionarios asociados
  const { data: quizzes, error: quizError } = await supabase
    .from('cuestionarios')
    .select('*')
    .eq('leccion_id', lessonId);
    
  if (quizError) {
    console.error('❌ Error al obtener cuestionarios:', quizError);
    return;
  }
  
  console.log('\n📝 Cuestionarios encontrados:', quizzes?.length || 0);
  if (quizzes && quizzes.length > 0) {
    quizzes.forEach((quiz, index) => {
      console.log(`  ${index + 1}. ${quiz.titulo} (ID: ${quiz.id})`);
    });
  }
  
  // Verificar preguntas si hay cuestionarios
  if (quizzes && quizzes.length > 0) {
    for (const quiz of quizzes) {
      const { data: questions, error: questionsError } = await supabase
        .from('preguntas')
        .select('*')
        .eq('cuestionario_id', quiz.id);
        
      if (questionsError) {
        console.error('❌ Error al obtener preguntas:', questionsError);
      } else {
        console.log(`\n❓ Preguntas en "${quiz.titulo}": ${questions?.length || 0}`);
      }
    }
  }
  
  // Resumen
  console.log('\n📊 RESUMEN:');
  console.log('  - Campo tiene_cuestionario:', lesson.tiene_cuestionario ? '✅ TRUE' : '❌ FALSE');
  console.log('  - Cuestionarios en BD:', quizzes?.length || 0);
  console.log('  - ¿Debería mostrar quiz?:', lesson.tiene_cuestionario && quizzes?.length > 0 ? '✅ SÍ' : '❌ NO');
}

checkSpecificLesson().catch(console.error);