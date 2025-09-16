const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addModule2Questions() {
  const lessonId = 'e4546103-526d-42ff-a98b-0db4828caa44';
  const quizId = '8bf3b75d-b048-4748-aa36-80896e7f6e5b';
  
  console.log('🔧 Agregando preguntas del MÓDULO 2 - Terapia Cognitiva...');
  
  // Preguntas del MÓDULO 2 con formato correcto basado en las existentes
  const questions = [
    {
      cuestionario_id: quizId,
      leccion_id: lessonId,
      pregunta: 'La Terapia Cognitivo-Conductual (TCC) es un enfoque central en adicciones. (V/F)',
      tipo: 'verdadero_falso',
      orden: 1,
      opcion_a: 'Verdadero',
      opcion_b: 'Falso',
      respuesta_correcta: 'A'
    },
    {
      cuestionario_id: quizId,
      leccion_id: lessonId,
      pregunta: 'El modelo transteórico del cambio incluye etapas como contemplación y acción. (V/F)',
      tipo: 'verdadero_falso',
      orden: 2,
      opcion_a: 'Verdadero',
      opcion_b: 'Falso',
      respuesta_correcta: 'A'
    },
    {
      cuestionario_id: quizId,
      leccion_id: lessonId,
      pregunta: 'La terapia de aceptación y compromiso (ACT) no se aplica en adicciones. (V/F)',
      tipo: 'verdadero_falso',
      orden: 3,
      opcion_a: 'Verdadero',
      opcion_b: 'Falso',
      respuesta_correcta: 'B'
    },
    {
      cuestionario_id: quizId,
      leccion_id: lessonId,
      pregunta: '¿Qué beneficios aporta Mindfulness en el tratamiento de adicciones?',
      tipo: 'texto_libre',
      orden: 4
    },
    {
      cuestionario_id: quizId,
      leccion_id: lessonId,
      pregunta: 'Explica las diferencias principales entre TCC y ACT en adicciones.',
      tipo: 'texto_libre',
      orden: 5
    },
    {
      cuestionario_id: quizId,
      leccion_id: lessonId,
      pregunta: '¿Por qué es útil el modelo de Prochaska y DiClemente en el abordaje de pacientes con adicciones?',
      tipo: 'texto_libre',
      orden: 6
    },
    {
      cuestionario_id: quizId,
      leccion_id: lessonId,
      pregunta: 'El Mindfulness en adicciones puede ayudar a:',
      tipo: 'multiple_choice',
      orden: 7,
      opcion_a: 'Reducir impulsividad',
      opcion_b: 'Aumentar la conciencia del momento presente',
      opcion_c: 'Incrementar el estrés',
      opcion_d: 'Favorecer la autorregulación emocional',
      respuesta_correcta: 'A,B,D'
    }
  ];
  
  console.log(`\n📝 Creando ${questions.length} preguntas...`);
  
  for (const q of questions) {
    const { data: newQuestion, error } = await supabase
      .from('preguntas')
      .insert(q)
      .select()
      .single();
      
    if (error) {
      console.error(`❌ Error creando pregunta ${q.orden}:`, error);
    } else {
      console.log(`   ✅ Pregunta ${q.orden}: ${q.pregunta.substring(0, 50)}...`);
    }
  }
  
  console.log('\n🎉 ¡Preguntas del MÓDULO 2 agregadas!');
  
  // Verificar el resultado
  console.log('\n🔍 Verificando resultado...');
  const { data: finalCheck } = await supabase
    .from('preguntas')
    .select('id, pregunta, tipo, orden')
    .eq('cuestionario_id', quizId)
    .order('orden');
    
  console.log(`✅ ${finalCheck?.length || 0} preguntas creadas:`);
  finalCheck?.forEach((q, i) => {
    console.log(`   ${q.orden}. [${q.tipo}] ${q.pregunta?.substring(0, 60) || 'Sin texto'}...`);
  });
}

addModule2Questions().catch(console.error);