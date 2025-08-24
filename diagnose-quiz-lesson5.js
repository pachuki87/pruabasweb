import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';
const supabase = createClient(supabaseUrl, supabaseKey);

const QUIZ_ID = '6a097982-a0fc-4e7d-851d-d3bad2195e70';

async function diagnoseQuiz() {
  console.log(`🔍 Diagnosticando cuestionario: ${QUIZ_ID}`);
  console.log('=' .repeat(60));

  try {
    // 1. Verificar si el cuestionario existe
    console.log('\n1️⃣ Verificando existencia del cuestionario...');
    const { data: quiz, error: quizError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('id', QUIZ_ID)
      .single();

    if (quizError) {
      console.log('❌ Error al buscar cuestionario:', quizError.message);
      return;
    }

    if (!quiz) {
      console.log('❌ Cuestionario no encontrado');
      return;
    }

    console.log('✅ Cuestionario encontrado:');
    console.log(`   - ID: ${quiz.id}`);
    console.log(`   - Título: ${quiz.titulo}`);
    console.log(`   - Lección ID: ${quiz.leccion_id}`);
    console.log(`   - Creado: ${quiz.created_at}`);

    // 2. Obtener información de la lección
    console.log('\n2️⃣ Obteniendo información de la lección...');
    const { data: lesson, error: lessonError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('id', quiz.leccion_id)
      .single();

    if (lesson) {
      console.log('✅ Lección encontrada:');
      console.log(`   - Título: ${lesson.titulo}`);
      console.log(`   - Número: ${lesson.numero_leccion}`);
      console.log(`   - Archivo: ${lesson.archivo_url}`);
    } else {
      console.log('❌ Lección no encontrada');
    }

    // 3. Verificar preguntas asociadas
    console.log('\n3️⃣ Verificando preguntas asociadas...');
    const { data: questions, error: questionsError } = await supabase
      .from('preguntas')
      .select('*')
      .eq('cuestionario_id', QUIZ_ID);

    if (questionsError) {
      console.log('❌ Error al buscar preguntas:', questionsError.message);
      return;
    }

    console.log(`📊 Preguntas encontradas: ${questions?.length || 0}`);
    
    if (!questions || questions.length === 0) {
      console.log('❌ No hay preguntas asociadas a este cuestionario');
      console.log('\n💡 SOLUCIÓN: Necesitas insertar preguntas para este cuestionario');
      return;
    }

    // 4. Verificar opciones de respuesta para cada pregunta
    console.log('\n4️⃣ Verificando opciones de respuesta...');
    for (const question of questions) {
      console.log(`\n   Pregunta: ${question.texto_pregunta}`);
      
      const { data: options, error: optionsError } = await supabase
        .from('opciones_respuesta')
        .select('*')
        .eq('pregunta_id', question.id);

      if (optionsError) {
        console.log(`   ❌ Error al buscar opciones: ${optionsError.message}`);
        continue;
      }

      console.log(`   📝 Opciones encontradas: ${options?.length || 0}`);
      
      if (!options || options.length === 0) {
        console.log('   ❌ Esta pregunta no tiene opciones de respuesta');
      } else {
        options.forEach((option, index) => {
          console.log(`      ${index + 1}. ${option.texto_opcion} ${option.es_correcta ? '✅' : ''}`);
        });
      }
    }

    console.log('\n' + '=' .repeat(60));
    console.log('🎯 DIAGNÓSTICO COMPLETADO');
    
    if (questions.length === 0) {
      console.log('\n🚨 PROBLEMA IDENTIFICADO: El cuestionario no tiene preguntas');
      console.log('💡 SOLUCIÓN: Ejecutar script para insertar preguntas');
    } else {
      console.log('\n✅ El cuestionario tiene preguntas. El problema puede estar en el frontend.');
    }

  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
  }
}

// Ejecutar diagnóstico
diagnoseQuiz();