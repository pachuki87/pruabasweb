const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyLesson1Questionnaire() {
  try {
    console.log('🔍 Verificando cuestionarios de la Lección 1...\n');

    // Obtener el curso MÁSTER EN ADICCIONES
    const { data: courses, error: coursesError } = await supabase
      .from('cursos')
      .select('*')
      .ilike('titulo', '%MÁSTER EN ADICCIONES%');

    if (coursesError) {
      console.error('❌ Error al obtener cursos:', coursesError);
      return;
    }

    if (!courses || courses.length === 0) {
      console.error('❌ No se encontró el curso MÁSTER EN ADICCIONES');
      return;
    }

    const course = courses[0];
    console.log(`📚 Curso encontrado: ${course.titulo}`);
    console.log(`🆔 ID del curso: ${course.id}\n`);

    // Obtener la Lección 1
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', course.id)
      .order('orden');

    if (lessonsError) {
      console.error('❌ Error al obtener lecciones:', lessonsError);
      return;
    }

    const lesson1 = lessons.find(l => l.orden === 1);
    if (!lesson1) {
      console.error('❌ No se encontró la Lección 1');
      return;
    }

    console.log(`📖 Lección 1: ${lesson1.titulo}`);
    console.log(`🆔 ID de la lección: ${lesson1.id}\n`);

    // Verificar cuestionarios asociados a la Lección 1
    const { data: questionnaires, error: questionnairesError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('leccion_id', lesson1.id);

    if (questionnairesError) {
      console.error('❌ Error al obtener cuestionarios:', questionnairesError);
      return;
    }

    console.log(`📝 Cuestionarios encontrados para Lección 1: ${questionnaires?.length || 0}`);

    if (questionnaires && questionnaires.length > 0) {
      questionnaires.forEach((quiz, index) => {
        console.log(`\n📋 Cuestionario ${index + 1}:`);
        console.log(`   - ID: ${quiz.id}`);
        console.log(`   - Título: ${quiz.titulo}`);
        console.log(`   - Creado: ${quiz.creado_en}`);
      });

      // Verificar preguntas de cada cuestionario
      for (const quiz of questionnaires) {
        const { data: questions, error: questionsError } = await supabase
          .from('preguntas')
          .select('*')
          .eq('cuestionario_id', quiz.id);

        if (questionsError) {
          console.error(`❌ Error al obtener preguntas del cuestionario ${quiz.id}:`, questionsError);
          continue;
        }

        console.log(`\n❓ Preguntas del cuestionario "${quiz.titulo}": ${questions?.length || 0}`);
        
        if (questions && questions.length > 0) {
          questions.forEach((q, i) => {
            console.log(`   ${i + 1}. ${q.pregunta} (Tipo: ${q.tipo})`);
          });
        }
      }
    } else {
      console.log('⚠️  NO HAY CUESTIONARIOS para la Lección 1');
      console.log('🔧 Necesitamos crear el cuestionario con las preguntas proporcionadas');
    }

    // Verificar también cuestionarios a nivel de curso
    const { data: courseQuizzes, error: courseQuizzesError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('curso_id', course.id)
      .is('leccion_id', null);

    if (!courseQuizzesError && courseQuizzes && courseQuizzes.length > 0) {
      console.log(`\n📚 Cuestionarios a nivel de curso: ${courseQuizzes.length}`);
      courseQuizzes.forEach((quiz, index) => {
        console.log(`   ${index + 1}. ${quiz.titulo}`);
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verifyLesson1Questionnaire();