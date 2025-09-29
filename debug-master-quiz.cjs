const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function debugMasterQuiz() {
  try {
    console.log('🔍 Buscando cuestionarios del Máster de Adicciones...');
    
    // Primero, buscar el curso "Máster de Adicciones"
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .ilike('titulo', '%máster%adicciones%')
      .single();
    
    if (cursoError) {
      console.error('❌ Error buscando curso:', cursoError);
      return;
    }
    
    console.log('✅ Curso encontrado:', curso);
    
    // Buscar cuestionarios de este curso
    const { data: cuestionarios, error: cuestionariosError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('curso_id', curso.id);
    
    if (cuestionariosError) {
      console.error('❌ Error buscando cuestionarios:', cuestionariosError);
      return;
    }
    
    console.log(`\n📋 Cuestionarios encontrados: ${cuestionarios.length}`);
    
    for (const cuestionario of cuestionarios) {
      console.log(`\n🎯 Procesando cuestionario: ${cuestionario.titulo}`);
      console.log(`   ID: ${cuestionario.id}`);
      
      // Buscar preguntas con opciones (igual que en QuizAttemptPage)
      const { data: questionsData, error: questionsError } = await supabase
        .from('preguntas')
        .select(`
          *,
          opciones_respuesta (id, opcion, es_correcta, orden, pregunta_id)
        `)
        .eq('cuestionario_id', cuestionario.id)
        .order('orden');
      
      if (questionsError) {
        console.error('❌ Error cargando preguntas:', questionsError);
        continue;
      }
      
      console.log(`   📝 Preguntas encontradas: ${questionsData?.length || 0}`);
      
      if (questionsData && questionsData.length > 0) {
        questionsData.forEach((pregunta, index) => {
          console.log(`\n   Pregunta ${index + 1}: ${pregunta.pregunta}`);
          console.log(`   Opciones de respuesta: ${pregunta.opciones_respuesta?.length || 0}`);
          
          if (pregunta.opciones_respuesta && pregunta.opciones_respuesta.length > 0) {
            pregunta.opciones_respuesta
              .sort((a, b) => a.orden - b.orden)
              .forEach((opcion, opIndex) => {
                const letra = String.fromCharCode(65 + opIndex);
                const correcta = opcion.es_correcta ? ' ✅' : '';
                console.log(`     ${letra}. ${opcion.opcion}${correcta}`);
              });
          } else {
            console.log('     ⚠️ No hay opciones de respuesta');
          }
        });
      } else {
        console.log('   ⚠️ No se encontraron preguntas para este cuestionario');
      }
    }
    
    console.log('\n✅ Análisis completado');
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

debugMasterQuiz();