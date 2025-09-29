const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkQuizContent() {
  const lessonId = 'e4546103-526d-42ff-a98b-0db4828caa44';
  
  console.log('🔍 Verificando contenido completo de cuestionarios para la lección:', lessonId);
  
  // Obtener cuestionarios
  const { data: quizzes, error: quizError } = await supabase
    .from('cuestionarios')
    .select('*')
    .eq('leccion_id', lessonId);
    
  if (quizError) {
    console.error('❌ Error al obtener cuestionarios:', quizError);
    return;
  }
  
  console.log(`\n📝 Cuestionarios encontrados: ${quizzes?.length || 0}`);
  
  for (const quiz of quizzes || []) {
    console.log(`\n🎯 CUESTIONARIO: "${quiz.titulo}"`);
    console.log(`   ID: ${quiz.id}`);
    
    // Obtener preguntas del cuestionario
    const { data: questions, error: questionsError } = await supabase
      .from('preguntas')
      .select('*')
      .eq('cuestionario_id', quiz.id)
      .order('id');
      
    if (questionsError) {
      console.error('❌ Error al obtener preguntas:', questionsError);
      continue;
    }
    
    console.log(`   📋 Preguntas (${questions?.length || 0}):`);
    
    for (let i = 0; i < (questions?.length || 0); i++) {
      const question = questions[i];
      console.log(`\n   ${i + 1}. PREGUNTA:`);
      console.log(`      Texto: "${question.texto_pregunta}"`);
      console.log(`      Tipo: ${question.tipo_pregunta}`);
      
      // Obtener opciones si las hay
      const { data: options, error: optionsError } = await supabase
        .from('opciones_respuesta')
        .select('*')
        .eq('pregunta_id', question.id)
        .order('id');
        
      if (optionsError) {
        console.error('      ❌ Error al obtener opciones:', optionsError);
      } else if (options && options.length > 0) {
        console.log(`      Opciones (${options.length}):`);
        options.forEach((option, idx) => {
          const correctMark = option.es_correcta ? ' ✅' : '';
          console.log(`        ${String.fromCharCode(97 + idx)}) ${option.texto_opcion}${correctMark}`);
        });
      } else {
        console.log('      (Sin opciones - pregunta abierta)');
      }
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('🔍 BÚSQUEDA DE CONTENIDO ESPECÍFICO:');
  console.log('Buscando menciones de:');
  console.log('- "fármacos interdictores"');
  console.log('- "autonomía del paciente"');
  console.log('- "entorno"');
  console.log('- "farmacoterapia"');
  
  let foundContent = false;
  
  for (const quiz of quizzes || []) {
    const { data: questions } = await supabase
      .from('preguntas')
      .select('*')
      .eq('cuestionario_id', quiz.id);
      
    for (const question of questions || []) {
      const text = question.texto_pregunta.toLowerCase();
      if (text.includes('fármaco') || text.includes('autonomía') || text.includes('entorno') || text.includes('farmacoterapia')) {
        console.log(`\n✅ ENCONTRADO en "${quiz.titulo}":`);
        console.log(`   "${question.texto_pregunta}"`);
        foundContent = true;
      }
    }
  }
  
  if (!foundContent) {
    console.log('\n❌ NO se encontró el contenido específico mencionado.');
    console.log('Las preguntas actuales parecen ser genéricas, no del contenido del curso.');
  }
}

checkQuizContent().catch(console.error);