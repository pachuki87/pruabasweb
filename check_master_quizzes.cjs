const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkMasterQuizzes() {
  try {
    console.log('🔍 Verificando cuestionarios del Máster en Adicciones...');
    
    // Buscar el curso Máster en Adicciones
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05');
    
    if (cursosError) {
      console.error('❌ Error al buscar cursos:', cursosError);
      return;
    }
    
    if (!cursos || cursos.length === 0) {
      console.log('❌ No se encontró el curso "Máster en Adicciones"');
      return;
    }
    
    const curso = cursos[0];
    console.log(`✅ Curso encontrado: ${curso.titulo} (ID: ${curso.id})`);
    
    // Buscar cuestionarios para este curso
    const { data: cuestionarios, error: quizError } = await supabase
      .from('cuestionarios')
      .select(`
        id,
        titulo,
        leccion_id,
        lecciones!inner(id, titulo, orden)
      `)
      .eq('curso_id', curso.id)
      .order('leccion_id');
    
    if (quizError) {
      console.error('❌ Error al buscar cuestionarios:', quizError);
      return;
    }
    
    console.log(`\n📊 Cuestionarios encontrados: ${cuestionarios?.length || 0}`);
    
    if (cuestionarios && cuestionarios.length > 0) {
      cuestionarios.forEach((quiz, index) => {
        console.log(`${index + 1}. ${quiz.titulo}`);
        console.log(`   - ID: ${quiz.id}`);
        console.log(`   - Lección: ${quiz.lecciones?.titulo || 'Sin lección'} (ID: ${quiz.leccion_id})`);
        console.log('');
      });
    } else {
      console.log('❌ No se encontraron cuestionarios para este curso');
    }
    
    // Verificar preguntas de los cuestionarios
    if (cuestionarios && cuestionarios.length > 0) {
      console.log('\n🔍 Verificando preguntas de los cuestionarios...');
      
      for (const quiz of cuestionarios) {
        const { data: preguntas, error: preguntasError } = await supabase
          .from('preguntas')
          .select('id, pregunta, tipo, opciones, respuesta_correcta')
          .eq('cuestionario_id', quiz.id);
        
        if (preguntasError) {
          console.error(`❌ Error al buscar preguntas para ${quiz.titulo}:`, preguntasError);
          continue;
        }
        
        console.log(`\n📝 ${quiz.titulo}: ${preguntas?.length || 0} preguntas`);
        
        if (preguntas && preguntas.length > 0) {
          preguntas.forEach((pregunta, index) => {
            console.log(`   ${index + 1}. ${pregunta.pregunta.substring(0, 50)}...`);
            console.log(`      - Tipo: ${pregunta.tipo}`);
            console.log(`      - Opciones: ${pregunta.opciones ? JSON.stringify(pregunta.opciones).substring(0, 100) : 'Sin opciones'}`);
            console.log(`      - Respuesta correcta: ${pregunta.respuesta_correcta || 'Sin respuesta'}`);
          });
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkMasterQuizzes();