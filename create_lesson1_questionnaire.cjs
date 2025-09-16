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

    // Crear el cuestionario
    const { data: questionnaire, error: questionnaireError } = await supabase
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

    console.log(`✅ Cuestionario creado: ${questionnaire.titulo}`);
    console.log(`🆔 ID del cuestionario: ${questionnaire.id}\n`);

    // Preguntas Verdadero/Falso
    const trueFalseQuestions = [
      'El uso de fármacos interdictores se emplea para facilitar la abstinencia.',
      'El paciente no debe tener autonomía en entornos no supervisados.',
      'El entorno juega un papel fundamental en la recuperación del paciente.',
      'La autonomía del paciente no es relevante en la recuperación.',
      'Los fármacos interdictores se usan como parte de la farmacoterapia en adicciones.'
    ];

    // Preguntas Abiertas
    const openQuestions = [
      'Explica la importancia de la autonomía del paciente en entornos no supervisados.',
      '¿Cómo afecta la farmacoterapia en el proceso de recuperación?',
      'Describe un caso en el que el entorno haya sido determinante en la recaída o recuperación del paciente.',
      '¿Cuáles son las fases principales de un programa terapéutico en adicciones?',
      '¿Qué papel cumple el entorno en el proceso de recuperación del paciente?',
      'Menciona ejemplos de fármacos utilizados en la farmacoterapia de apoyo.'
    ];

    // Ejercicios
    const exercises = [
      'Describe las fases de un programa terapéutico y ejemplifica cada una.',
      'Explica cómo influye la familia y los amigos en el proceso de recuperación.',
      'Haz un esquema de los fármacos de apoyo más utilizados y sus efectos.',
      'Diseña un esquema de programa terapéutico para un paciente que inicia su recuperación.'
    ];

    let questionOrder = 1;
    const questionsToInsert = [];

    // Insertar preguntas V/F
    console.log('📝 Preparando preguntas Verdadero/Falso...');
    trueFalseQuestions.forEach((question, index) => {
      questionsToInsert.push({
        cuestionario_id: questionnaire.id,
        pregunta: question,
        tipo: 'verdadero_falso',
        orden: questionOrder++,
        puntos: 1
      });
    });

    // Insertar preguntas abiertas
    console.log('📝 Preparando preguntas abiertas...');
    openQuestions.forEach((question, index) => {
      questionsToInsert.push({
        cuestionario_id: questionnaire.id,
        pregunta: question,
        tipo: 'abierta',
        orden: questionOrder++,
        puntos: 2
      });
    });

    // Insertar ejercicios
    console.log('📝 Preparando ejercicios...');
    exercises.forEach((exercise, index) => {
      questionsToInsert.push({
        cuestionario_id: questionnaire.id,
        pregunta: exercise,
        tipo: 'ejercicio',
        orden: questionOrder++,
        puntos: 3
      });
    });

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
    console.log(`   ✅ Verdadero/Falso: ${trueFalseQuestions.length} (1 punto c/u)`);
    console.log(`   📝 Abiertas: ${openQuestions.length} (2 puntos c/u)`);
    console.log(`   💡 Ejercicios: ${exercises.length} (3 puntos c/u)`);
    
    const totalPoints = (trueFalseQuestions.length * 1) + (openQuestions.length * 2) + (exercises.length * 3);
    console.log(`   🎯 Puntos totales: ${totalPoints}`);
    
    console.log('\n🎉 ¡Cuestionario de la Lección 1 creado exitosamente!');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createLesson1Questionnaire();