const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createRealQuizContent() {
  const lessonId = 'e4546103-526d-42ff-a98b-0db4828caa44';
  const courseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
  
  console.log('🔧 Creando contenido real para los cuestionarios del MÓDULO 2 - Terapia Cognitiva');
  
  // Primero, limpiar las preguntas existentes
  console.log('\n🧹 Limpiando preguntas existentes...');
  
  const { data: existingQuizzes } = await supabase
    .from('cuestionarios')
    .select('id')
    .eq('leccion_id', lessonId);
    
  for (const quiz of existingQuizzes || []) {
    // Eliminar opciones primero
    const { data: questions } = await supabase
      .from('preguntas')
      .select('id')
      .eq('cuestionario_id', quiz.id);
      
    for (const question of questions || []) {
      await supabase
        .from('opciones_respuesta')
        .delete()
        .eq('pregunta_id', question.id);
    }
    
    // Luego eliminar preguntas
    await supabase
      .from('preguntas')
      .delete()
      .eq('cuestionario_id', quiz.id);
  }
  
  // Eliminar cuestionarios existentes
  await supabase
    .from('cuestionarios')
    .delete()
    .eq('leccion_id', lessonId);
    
  console.log('✅ Contenido anterior eliminado');
  
  // Crear nuevo cuestionario para MÓDULO 2
  console.log('\n📝 Creando cuestionario del MÓDULO 2 - Terapia Cognitiva...');
  
  const { data: newQuiz, error: quizError } = await supabase
    .from('cuestionarios')
    .insert({
      titulo: 'MÓDULO 2 – Terapia cognitiva de las drogodependencias',
      leccion_id: lessonId,
      curso_id: courseId
    })
    .select()
    .single();
    
  if (quizError) {
    console.error('❌ Error creando cuestionario:', quizError);
    return;
  }
  
  console.log('✅ Cuestionario creado:', newQuiz.id);
  
  // Preguntas Verdadero/Falso
  const vfQuestions = [
    {
      pregunta: 'La Terapia Cognitivo-Conductual (TCC) es un enfoque central en adicciones.',
      respuesta: 'Verdadero'
    },
    {
      pregunta: 'El modelo transteórico del cambio incluye etapas como contemplación y acción.',
      respuesta: 'Verdadero'
    },
    {
      pregunta: 'La terapia de aceptación y compromiso (ACT) no se aplica en adicciones.',
      respuesta: 'Falso'
    }
  ];
  
  console.log('\n📋 Creando preguntas Verdadero/Falso...');
  
  for (let i = 0; i < vfQuestions.length; i++) {
    const vfQ = vfQuestions[i];
    
    const { data: question, error: qError } = await supabase
      .from('preguntas')
      .insert({
        cuestionario_id: newQuiz.id,
        leccion_id: lessonId,
        pregunta: vfQ.pregunta,
        tipo: 'verdadero_falso',
        orden: i + 1,
        opcion_a: 'Verdadero',
        opcion_b: 'Falso',
        respuesta_correcta: vfQ.respuesta
      })
      .select()
      .single();
      
    if (qError) {
      console.error('❌ Error creando pregunta:', qError);
      continue;
    }
    
    // Crear opciones V/F
    await supabase.from('opciones_respuesta').insert([
      {
        pregunta_id: question.id,
        opcion: 'Verdadero',
        es_correcta: vfQ.respuesta === 'Verdadero',
        orden: 1
      },
      {
        pregunta_id: question.id,
        opcion: 'Falso',
        es_correcta: vfQ.respuesta === 'Falso',
        orden: 2
      }
    ]);
    
    console.log(`   ✅ Pregunta ${i + 1}: ${vfQ.pregunta.substring(0, 50)}...`);
  }
  
  // Preguntas abiertas
  const openQuestions = [
    '¿Qué beneficios aporta Mindfulness en el tratamiento de adicciones?',
    'Explica las diferencias principales entre TCC y ACT en adicciones.',
    '¿Por qué es útil el modelo de Prochaska y DiClemente en el abordaje de pacientes con adicciones?',
    'Explica los fundamentos de la Terapia Cognitivo-Conductual (TCC) aplicados a las adicciones.',
    '¿En qué consiste la Terapia de Aceptación y Compromiso (ACT)?',
    'Describe cómo puede aplicarse el Mindfulness como herramienta terapéutica.',
    '¿Qué es el modelo transteórico del cambio y cómo se aplica en adicciones?'
  ];
  
  console.log('\n📝 Creando preguntas abiertas...');
  
  for (let i = 0; i < openQuestions.length; i++) {
    const openQ = openQuestions[i];
    
    const { error: qError } = await supabase
      .from('preguntas')
      .insert({
        cuestionario_id: newQuiz.id,
        leccion_id: lessonId,
        pregunta: openQ,
        tipo: 'texto_libre',
        orden: vfQuestions.length + i + 1
      });
      
    if (qError) {
      console.error('❌ Error creando pregunta abierta:', qError);
    } else {
      console.log(`   ✅ Pregunta ${i + 1}: ${openQ.substring(0, 50)}...`);
    }
  }
  
  // Pregunta de selección múltiple
  console.log('\n🎯 Creando pregunta de selección múltiple...');
  
  const { data: multipleChoice, error: mcError } = await supabase
    .from('preguntas')
    .insert({
      cuestionario_id: newQuiz.id,
      leccion_id: lessonId,
      pregunta: 'El Mindfulness en adicciones puede ayudar a:',
      tipo: 'multiple_choice',
      orden: vfQuestions.length + openQuestions.length + 1,
      opcion_a: 'Reducir impulsividad',
      opcion_b: 'Aumentar la conciencia del momento presente',
      opcion_c: 'Incrementar el estrés',
      opcion_d: 'Favorecer la autorregulación emocional',
      respuesta_correcta: 'A, B, D' // Múltiples respuestas correctas
    })
    .select()
    .single();
    
  if (mcError) {
    console.error('❌ Error creando pregunta múltiple:', mcError);
  } else {
    // Opciones para la pregunta múltiple
    await supabase.from('opciones_respuesta').insert([
      {
        pregunta_id: multipleChoice.id,
        opcion: 'Reducir impulsividad',
        es_correcta: true,
        orden: 1
      },
      {
        pregunta_id: multipleChoice.id,
        opcion: 'Aumentar la conciencia del momento presente',
        es_correcta: true,
        orden: 2
      },
      {
        pregunta_id: multipleChoice.id,
        opcion: 'Incrementar el estrés',
        es_correcta: false,
        orden: 3
      },
      {
        pregunta_id: multipleChoice.id,
        opcion: 'Favorecer la autorregulación emocional',
        es_correcta: true,
        orden: 4
      }
    ]);
    
    console.log('   ✅ Pregunta múltiple creada con 4 opciones');
  }
  
  console.log('\n🎉 ¡Cuestionario del MÓDULO 2 creado exitosamente!');
  console.log('📊 Resumen:');
  console.log('   - 3 preguntas Verdadero/Falso');
  console.log('   - 7 preguntas abiertas');
  console.log('   - 1 pregunta de selección múltiple');
  console.log('   - Total: 11 preguntas');
  
  // Verificar el resultado
  console.log('\n🔍 Verificando resultado...');
  const { data: finalCheck } = await supabase
    .from('preguntas')
    .select('id, pregunta, tipo')
    .eq('cuestionario_id', newQuiz.id)
    .order('orden');
    
  console.log(`✅ ${finalCheck?.length || 0} preguntas creadas correctamente`);
}

createRealQuizContent().catch(console.error);