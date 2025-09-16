const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createLesson1Questionnaire() {
  try {
    console.log('🔧 Creando cuestionario para la Lección 1...\n');

    // IDs conocidos
    const courseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
    const lesson1Id = '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44';

    // Verificar si ya existe un cuestionario para esta lección
    const { data: existingQuiz } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('leccion_id', lesson1Id)
      .single();

    let questionnaire;
    
    if (existingQuiz) {
      console.log(`✅ Cuestionario ya existe: ${existingQuiz.titulo}`);
      console.log(`🆔 ID del cuestionario: ${existingQuiz.id}\n`);
      questionnaire = existingQuiz;
    } else {
      // Crear el cuestionario
      const { data: newQuestionnaire, error: questionnaireError } = await supabase
        .from('cuestionarios')
        .insert({
          titulo: 'MÓDULO 1 – Fundamentos del programa terapéutico en adicciones',
          curso_id: courseId,
          leccion_id: lesson1Id
        })
        .select()
        .single();

      if (questionnaireError) {
        console.error('❌ Error al crear cuestionario:', questionnaireError);
        return;
      }

      console.log(`✅ Cuestionario creado: ${newQuestionnaire.titulo}`);
      console.log(`🆔 ID del cuestionario: ${newQuestionnaire.id}\n`);
      questionnaire = newQuestionnaire;
    }

    // Preguntas Verdadero/Falso - usando 'multiple_choice' con opciones A/B
    const trueFalseQuestions = [
      {
        pregunta: 'El uso de fármacos interdictores se emplea para facilitar la abstinencia.',
        opcion_a: 'Verdadero',
        opcion_b: 'Falso',
        respuesta_correcta: 'A',
        explicacion: 'Los fármacos interdictores ayudan a mantener la abstinencia.'
      },
      {
        pregunta: 'El paciente no debe tener autonomía en entornos no supervisados.',
        opcion_a: 'Verdadero',
        opcion_b: 'Falso',
        respuesta_correcta: 'B',
        explicacion: 'La autonomía del paciente es fundamental para su recuperación.'
      },
      {
        pregunta: 'El entorno juega un papel fundamental en la recuperación del paciente.',
        opcion_a: 'Verdadero',
        opcion_b: 'Falso',
        respuesta_correcta: 'A',
        explicacion: 'El entorno influye significativamente en el proceso de recuperación.'
      },
      {
        pregunta: 'La autonomía del paciente no es relevante en la recuperación.',
        opcion_a: 'Verdadero',
        opcion_b: 'Falso',
        respuesta_correcta: 'B',
        explicacion: 'La autonomía es esencial para el control del proceso de recuperación.'
      },
      {
        pregunta: 'Los fármacos interdictores se usan como parte de la farmacoterapia en adicciones.',
        opcion_a: 'Verdadero',
        opcion_b: 'Falso',
        respuesta_correcta: 'A',
        explicacion: 'Son una herramienta importante del tratamiento farmacológico.'
      }
    ];

    // Preguntas Abiertas - usando 'texto_libre'
    const openQuestions = [
      'Explica la importancia de la autonomía del paciente en entornos no supervisados.',
      '¿Cómo afecta la farmacoterapia en el proceso de recuperación?',
      'Describe un caso en el que el entorno haya sido determinante en la recaída o recuperación del paciente.',
      '¿Cuáles son las fases principales de un programa terapéutico en adicciones?',
      '¿Qué papel cumple el entorno en el proceso de recuperación del paciente?',
      'Menciona ejemplos de fármacos utilizados en la farmacoterapia de apoyo.'
    ];

    // Ejercicios - usando 'texto_libre'
    const exercises = [
      'Describe las fases de un programa terapéutico y ejemplifica cada una.',
      'Explica cómo influye la familia y los amigos en el proceso de recuperación.',
      'Haz un esquema de los fármacos de apoyo más utilizados y sus efectos.',
      'Diseña un esquema de programa terapéutico para un paciente que inicia su recuperación.'
    ];

    let questionOrder = 1;
    const questionsToInsert = [];

    // Insertar preguntas V/F como multiple_choice
    console.log('📝 Preparando preguntas Verdadero/Falso...');
    trueFalseQuestions.forEach((question, index) => {
      questionsToInsert.push({
        cuestionario_id: questionnaire.id,
        leccion_id: lesson1Id,
        pregunta: question.pregunta,
        tipo: 'multiple_choice',
        orden: questionOrder++,
        opcion_a: question.opcion_a,
        opcion_b: question.opcion_b,
        respuesta_correcta: question.respuesta_correcta,
        explicacion: question.explicacion
      });
    });

    // Insertar preguntas abiertas
    console.log('📝 Preparando preguntas abiertas...');
    openQuestions.forEach((question, index) => {
      questionsToInsert.push({
        cuestionario_id: questionnaire.id,
        leccion_id: lesson1Id,
        pregunta: question,
        tipo: 'texto_libre',
        orden: questionOrder++,
        explicacion: 'Respuesta abierta evaluada por el instructor.'
      });
    });

    // Insertar ejercicios
    console.log('📝 Preparando ejercicios...');
    exercises.forEach((exercise, index) => {
      questionsToInsert.push({
        cuestionario_id: questionnaire.id,
        leccion_id: lesson1Id,
        pregunta: exercise,
        tipo: 'texto_libre',
        orden: questionOrder++,
        explicacion: 'Ejercicio práctico que requiere desarrollo detallado.'
      });
    });

    // Verificar si ya existen preguntas
    const { data: existingQuestions } = await supabase
      .from('preguntas')
      .select('*')
      .eq('cuestionario_id', questionnaire.id);

    if (existingQuestions && existingQuestions.length > 0) {
      console.log(`⚠️  Ya existen ${existingQuestions.length} preguntas para este cuestionario`);
      console.log('🔄 Eliminando preguntas existentes para recrear...');
      
      const { error: deleteError } = await supabase
        .from('preguntas')
        .delete()
        .eq('cuestionario_id', questionnaire.id);

      if (deleteError) {
        console.error('❌ Error al eliminar preguntas existentes:', deleteError);
        return;
      }
    }

    // Insertar todas las preguntas
    console.log(`\n🔄 Insertando ${questionsToInsert.length} preguntas...`);
    
    const { data: insertedQuestions, error: questionsError } = await supabase
      .from('preguntas')
      .insert(questionsToInsert)
      .select();

    if (questionsError) {
      console.error('❌ Error al insertar preguntas:', questionsError);
      return;
    }

    console.log(`✅ ${insertedQuestions.length} preguntas insertadas correctamente\n`);

    // Resumen
    console.log('📊 RESUMEN DEL CUESTIONARIO CREADO:');
    console.log(`   📋 Título: ${questionnaire.titulo}`);
    console.log(`   🆔 ID: ${questionnaire.id}`);
    console.log(`   ❓ Total preguntas: ${insertedQuestions.length}`);
    console.log(`   ✅ Verdadero/Falso: ${trueFalseQuestions.length}`);
    console.log(`   📝 Abiertas: ${openQuestions.length}`);
    console.log(`   💡 Ejercicios: ${exercises.length}`);
    
    console.log('\n🎉 ¡Cuestionario de la Lección 1 creado exitosamente!');
    console.log('🌐 Ahora debería aparecer en el frontend cuando accedas a la Lección 1');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createLesson1Questionnaire();