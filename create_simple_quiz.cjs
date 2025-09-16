const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSimpleQuiz() {
  const lessonId = 'e4546103-526d-42ff-a98b-0db4828caa44';
  const courseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
  
  console.log('🔧 Actualizando contenido de preguntas existentes...');
  
  // Buscar cuestionarios existentes para esta lección
  const { data: existingQuizzes } = await supabase
    .from('cuestionarios')
    .select('id')
    .eq('leccion_id', lessonId);
    
  if (!existingQuizzes || existingQuizzes.length === 0) {
    console.log('❌ No se encontraron cuestionarios existentes');
    return;
  }
  
  const quizId = existingQuizzes[0].id;
  console.log('✅ Usando cuestionario existente:', quizId);
  
  // Buscar preguntas existentes
  const { data: existingQuestions } = await supabase
    .from('preguntas')
    .select('*')
    .eq('cuestionario_id', quizId)
    .order('orden');
    
  console.log(`📋 Encontradas ${existingQuestions?.length || 0} preguntas existentes`);
  
  if (existingQuestions && existingQuestions.length > 0) {
    // Actualizar las primeras preguntas con contenido del MÓDULO 2
    const newQuestions = [
      'La Terapia Cognitivo-Conductual (TCC) es un enfoque central en adicciones.',
      'El modelo transteórico del cambio incluye etapas como contemplación y acción.',
      'La terapia de aceptación y compromiso (ACT) no se aplica en adicciones.',
      '¿Qué beneficios aporta Mindfulness en el tratamiento de adicciones?',
      'Explica las diferencias principales entre TCC y ACT en adicciones.',
      '¿Por qué es útil el modelo de Prochaska y DiClemente en el abordaje de pacientes con adicciones?'
    ];
    
    console.log('\n🔄 Actualizando preguntas existentes...');
    
    for (let i = 0; i < Math.min(newQuestions.length, existingQuestions.length); i++) {
      const questionId = existingQuestions[i].id;
      const newText = newQuestions[i];
      
      const { error } = await supabase
        .from('preguntas')
        .update({
          pregunta: newText
        })
        .eq('id', questionId);
        
      if (error) {
        console.error(`❌ Error actualizando pregunta ${i + 1}:`, error);
      } else {
        console.log(`   ✅ Pregunta ${i + 1} actualizada: ${newText.substring(0, 50)}...`);
      }
    }
  }
  
  console.log('\n🎉 ¡Actualización completada!');
  
  // Verificar el resultado
  console.log('\n🔍 Verificando resultado...');
  const { data: finalCheck } = await supabase
    .from('preguntas')
    .select('id, pregunta, tipo')
    .eq('cuestionario_id', quizId)
    .order('orden');
    
  console.log(`✅ ${finalCheck?.length || 0} preguntas verificadas:`);
  finalCheck?.forEach((q, i) => {
    console.log(`   ${i + 1}. ${q.pregunta?.substring(0, 60) || 'Sin texto'}...`);
  });
}

createSimpleQuiz().catch(console.error);