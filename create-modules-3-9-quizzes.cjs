const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Definir las preguntas para cada módulo basadas en el PDF
const modulesData = {
  3: {
    title: "EVALUACIÓN Y DIAGNÓSTICO EN ADICCIONES",
    questions: [
      {
        text: "¿Cuál es el primer paso en la evaluación de un paciente con problemas de adicción?",
        type: "multiple_choice",
        options: ["Realizar pruebas de laboratorio", "Establecer una relación terapéutica", "Aplicar cuestionarios estandarizados", "Derivar a otros especialistas"],
        correctAnswer: "b"
      },
      {
        text: "El DSM-5 clasifica los trastornos por uso de sustancias en:",
        type: "multiple_choice",
        options: ["Leve, moderado y grave", "Agudo y crónico", "Primario y secundario", "Físico y psicológico"],
        correctAnswer: "a"
      },
      {
        text: "¿Qué instrumento es más utilizado para evaluar la gravedad de la dependencia alcohólica?",
        type: "multiple_choice",
        options: ["CAGE", "AUDIT", "MAST", "Todos los anteriores"],
        correctAnswer: "d"
      },
      {
        text: "La entrevista motivacional se caracteriza por:",
        type: "multiple_choice",
        options: ["Ser directiva y confrontativa", "Explorar la ambivalencia del paciente", "Centrarse solo en los problemas", "Evitar hablar de cambio"],
        correctAnswer: "b"
      },
      {
        text: "Describe los criterios diagnósticos principales para el trastorno por uso de sustancias según el DSM-5.",
        type: "texto_libre",
        options: null,
        correctAnswer: null
      }
    ]
  },
  4: {
    title: "NEUROBIOLOGÍA DE LAS ADICCIONES",
    questions: [
      {
        text: "¿Qué neurotransmisor está más implicado en el sistema de recompensa cerebral?",
        type: "multiple_choice",
        options: ["Serotonina", "Dopamina", "GABA", "Acetilcolina"],
        correctAnswer: "b"
      },
      {
        text: "El circuito de recompensa cerebral incluye principalmente:",
        type: "multiple_choice",
        options: ["Área tegmental ventral y núcleo accumbens", "Hipocampo y amígdala", "Corteza prefrontal y cerebelo", "Tálamo y hipotálamo"],
        correctAnswer: "a"
      },
      {
        text: "La tolerancia a una sustancia se debe a:",
        type: "multiple_choice",
        options: ["Cambios en los receptores cerebrales", "Aumento del metabolismo", "Adaptación neuronal", "Todas las anteriores"],
        correctAnswer: "d"
      },
      {
        text: "¿Qué área cerebral está más afectada en la toma de decisiones en personas con adicción?",
        type: "multiple_choice",
        options: ["Corteza prefrontal", "Cerebelo", "Tronco encefálico", "Lóbulo temporal"],
        correctAnswer: "a"
      },
      {
        text: "Explica el concepto de neuroplasticidad y su relación con la recuperación de las adicciones.",
        type: "texto_libre",
        options: null,
        correctAnswer: null
      }
    ]
  },
  5: {
    title: "TRATAMIENTO FARMACOLÓGICO",
    questions: [
      {
        text: "¿Cuál es el fármaco de primera elección para el tratamiento de mantenimiento en la dependencia de opiáceos?",
        type: "multiple_choice",
        options: ["Naloxona", "Metadona", "Buprenorfina", "B y C son correctas"],
        correctAnswer: "d"
      },
      {
        text: "El disulfiram actúa:",
        type: "multiple_choice",
        options: ["Bloqueando receptores de dopamina", "Inhibiendo la aldehído deshidrogenasa", "Aumentando la serotonina", "Reduciendo la ansiedad"],
        correctAnswer: "b"
      },
      {
        text: "¿Qué medicamento se utiliza para prevenir recaídas en alcoholismo?",
        type: "multiple_choice",
        options: ["Naltrexona", "Acamprosato", "Disulfiram", "Todas las anteriores"],
        correctAnswer: "d"
      },
      {
        text: "La buprenorfina tiene la ventaja de:",
        type: "multiple_choice",
        options: ["Menor riesgo de sobredosis", "Efecto techo para la depresión respiratoria", "Menor potencial de abuso", "Todas las anteriores"],
        correctAnswer: "d"
      },
      {
        text: "Describe las indicaciones y contraindicaciones del uso de naltrexona en el tratamiento de adicciones.",
        type: "texto_libre",
        options: null,
        correctAnswer: null
      }
    ]
  },
  6: {
    title: "PREVENCIÓN DE RECAÍDAS",
    questions: [
      {
        text: "El modelo de prevención de recaídas de Marlatt se basa en:",
        type: "multiple_choice",
        options: ["Identificar situaciones de alto riesgo", "Desarrollar estrategias de afrontamiento", "Modificar expectativas sobre el consumo", "Todas las anteriores"],
        correctAnswer: "d"
      },
      {
        text: "¿Qué es el 'efecto de violación de la abstinencia'?",
        type: "multiple_choice",
        options: ["Una recaída completa tras un consumo puntual", "La culpa que siente el paciente tras consumir", "El proceso cognitivo que lleva de un lapsus a una recaída", "La pérdida de motivación para el tratamiento"],
        correctAnswer: "c"
      },
      {
        text: "Las situaciones de alto riesgo más comunes incluyen:",
        type: "multiple_choice",
        options: ["Estados emocionales negativos", "Presión social", "Estados emocionales positivos", "Todas las anteriores"],
        correctAnswer: "d"
      },
      {
        text: "¿Cuál es la diferencia entre un lapsus y una recaída?",
        type: "multiple_choice",
        options: ["No hay diferencia, son sinónimos", "El lapsus es un consumo puntual, la recaída es volver al patrón anterior", "El lapsus es más grave que la recaída", "Depende de la sustancia consumida"],
        correctAnswer: "b"
      },
      {
        text: "Desarrolla un plan de prevención de recaídas para un paciente con dependencia alcohólica.",
        type: "texto_libre",
        options: null,
        correctAnswer: null
      }
    ]
  },
  7: {
    title: "ADICCIONES COMPORTAMENTALES",
    questions: [
      {
        text: "¿Cuál de las siguientes NO es considerada una adicción comportamental en el DSM-5?",
        type: "multiple_choice",
        options: ["Juego patológico", "Adicción a internet", "Trastorno por atracón", "Adicción al sexo"],
        correctAnswer: "b"
      },
      {
        text: "El juego patológico se caracteriza por:",
        type: "multiple_choice",
        options: ["Necesidad de apostar cantidades crecientes", "Irritabilidad al intentar reducir el juego", "Mentir sobre la extensión del juego", "Todas las anteriores"],
        correctAnswer: "d"
      },
      {
        text: "¿Qué neurotransmisor está más implicado en las adicciones comportamentales?",
        type: "multiple_choice",
        options: ["Dopamina", "Serotonina", "Noradrenalina", "GABA"],
        correctAnswer: "a"
      },
      {
        text: "El tratamiento de primera línea para el juego patológico es:",
        type: "multiple_choice",
        options: ["Farmacológico con ISRS", "Terapia cognitivo-conductual", "Grupos de autoayuda", "Internamiento hospitalario"],
        correctAnswer: "b"
      },
      {
        text: "Analiza las similitudes y diferencias entre las adicciones a sustancias y las adicciones comportamentales.",
        type: "texto_libre",
        options: null,
        correctAnswer: null
      }
    ]
  },
  8: {
    title: "ADICCIONES EN POBLACIONES ESPECIALES",
    questions: [
      {
        text: "¿Cuál es la principal diferencia en el tratamiento de adicciones en adolescentes?",
        type: "multiple_choice",
        options: ["Mayor duración del tratamiento", "Enfoque más familiar y sistémico", "Uso de medicación específica", "Internamiento obligatorio"],
        correctAnswer: "b"
      },
      {
        text: "En mujeres embarazadas con dependencia de opiáceos, el tratamiento recomendado es:",
        type: "multiple_choice",
        options: ["Desintoxicación inmediata", "Tratamiento de mantenimiento con metadona", "Abstinencia completa", "Esperar al parto para iniciar tratamiento"],
        correctAnswer: "b"
      },
      {
        text: "¿Qué factor es más importante en el desarrollo de adicciones en adolescentes?",
        type: "multiple_choice",
        options: ["Factores genéticos", "Presión de pares", "Disponibilidad de sustancias", "Problemas familiares"],
        correctAnswer: "b"
      },
      {
        text: "En personas mayores, las adicciones más comunes son:",
        type: "multiple_choice",
        options: ["Alcohol y benzodiacepinas", "Cannabis y cocaína", "Heroína y anfetaminas", "Drogas sintéticas"],
        correctAnswer: "a"
      },
      {
        text: "Diseña un programa de tratamiento específico para adolescentes con problemas de adicción.",
        type: "texto_libre",
        options: null,
        correctAnswer: null
      }
    ]
  },
  9: {
    title: "ASPECTOS LEGALES Y ÉTICOS",
    questions: [
      {
        text: "¿Cuál es el principio ético fundamental en el tratamiento de adicciones?",
        type: "multiple_choice",
        options: ["Beneficencia", "Autonomía", "Justicia", "No maleficencia"],
        correctAnswer: "b"
      },
      {
        text: "La confidencialidad en el tratamiento de adicciones:",
        type: "multiple_choice",
        options: ["Es absoluta en todos los casos", "Puede romperse si hay riesgo para terceros", "No aplica en casos de menores", "Depende del tipo de sustancia"],
        correctAnswer: "b"
      },
      {
        text: "¿En qué casos es obligatorio el tratamiento de adicciones?",
        type: "multiple_choice",
        options: ["Nunca, siempre es voluntario", "Cuando hay orden judicial", "En casos de violencia doméstica", "B y C son correctas"],
        correctAnswer: "d"
      },
      {
        text: "El consentimiento informado debe incluir:",
        type: "multiple_choice",
        options: ["Riesgos y beneficios del tratamiento", "Alternativas terapéuticas", "Derecho a rechazar el tratamiento", "Todas las anteriores"],
        correctAnswer: "d"
      },
      {
        text: "Analiza los dilemas éticos que pueden surgir en el tratamiento de un paciente con adicción que rechaza el tratamiento pero pone en riesgo a su familia.",
        type: "texto_libre",
        options: null,
        correctAnswer: null
      }
    ]
  }
};

// Función para obtener el ID del curso "Máster en Adicciones"
async function getCourseId() {
  const { data, error } = await supabase
    .from('cursos')
    .select('id')
    .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
    .single();

  if (error) {
    console.error('❌ Error obteniendo curso:', error);
    return null;
  }

  return data.id;
}

// Función para obtener el ID de la lección por número de módulo
async function getLessonId(courseId, moduleNumber) {
  const { data, error } = await supabase
    .from('lecciones')
    .select('id')
    .eq('curso_id', courseId)
    .eq('titulo', `Módulo ${moduleNumber}`)
    .single();

  if (error) {
    console.error(`❌ Error obteniendo lección del Módulo ${moduleNumber}:`, error);
    return null;
  }

  return data.id;
}

// Función para crear cuestionario para un módulo
async function createModuleQuiz(courseId, moduleNumber, moduleData) {
  try {
    console.log(`\n📚 Creando cuestionario para Módulo ${moduleNumber}: ${moduleData.title}`);

    // Obtener ID de la lección
    const lessonId = await getLessonId(courseId, moduleNumber);
    if (!lessonId) {
      console.error(`❌ No se encontró la lección para el Módulo ${moduleNumber}`);
      return false;
    }

    // Verificar si ya existe un cuestionario para esta lección
    const { data: existingQuiz } = await supabase
      .from('cuestionarios')
      .select('id')
      .eq('leccion_id', lessonId)
      .single();

    let quizId;
    if (existingQuiz) {
      console.log(`ℹ️ Ya existe cuestionario para Módulo ${moduleNumber}, usando existente`);
      quizId = existingQuiz.id;
    } else {
      // Crear nuevo cuestionario
      const { data: newQuiz, error: quizError } = await supabase
        .from('cuestionarios')
        .insert({
          titulo: `Cuestionario Módulo ${moduleNumber}`,
          curso_id: courseId,
          leccion_id: lessonId
        })
        .select('id')
        .single();

      if (quizError) {
        console.error(`❌ Error creando cuestionario para Módulo ${moduleNumber}:`, quizError);
        return false;
      }

      quizId = newQuiz.id;
      console.log(`✅ Cuestionario creado con ID: ${quizId}`);
    }

    // Eliminar preguntas existentes para este cuestionario
    await supabase
      .from('preguntas')
      .delete()
      .eq('cuestionario_id', quizId);

    // Insertar nuevas preguntas
    let insertedCount = 0;
    for (let i = 0; i < moduleData.questions.length; i++) {
      const question = moduleData.questions[i];
      
      const questionData = {
        cuestionario_id: quizId,
        texto_pregunta: question.text,
        tipo_pregunta: question.type,
        orden: i + 1
      };

      // Agregar opciones y respuesta correcta para preguntas de selección múltiple
      if (question.type === 'multiple_choice' && question.options) {
        questionData.opcion_a = question.options[0];
        questionData.opcion_b = question.options[1];
        questionData.opcion_c = question.options[2];
        questionData.opcion_d = question.options[3];
        questionData.respuesta_correcta = question.correctAnswer;
      }

      const { error: questionError } = await supabase
        .from('preguntas')
        .insert(questionData);

      if (questionError) {
        console.error(`❌ Error insertando pregunta ${i + 1}:`, questionError);
      } else {
        insertedCount++;
      }
    }

    console.log(`✅ Módulo ${moduleNumber} completado: ${insertedCount}/${moduleData.questions.length} preguntas insertadas`);
    return true;

  } catch (error) {
    console.error(`❌ Error procesando Módulo ${moduleNumber}:`, error);
    return false;
  }
}

// Función principal
async function main() {
  try {
    console.log('🚀 Iniciando creación de cuestionarios para Módulos 3-9...\n');

    // Obtener ID del curso
    const courseId = await getCourseId();
    if (!courseId) {
      console.error('❌ No se pudo obtener el ID del curso "Máster en Adicciones"');
      return;
    }

    console.log(`✅ Curso encontrado con ID: ${courseId}`);

    // Crear cuestionarios para cada módulo
    let successCount = 0;
    for (const moduleNumber of Object.keys(modulesData)) {
      const moduleData = modulesData[moduleNumber];
      const success = await createModuleQuiz(courseId, parseInt(moduleNumber), moduleData);
      if (success) {
        successCount++;
      }
    }

    console.log(`\n🎉 PROCESO COMPLETADO`);
    console.log(`✅ ${successCount}/${Object.keys(modulesData).length} módulos procesados exitosamente`);

    // Verificar total de preguntas insertadas
    const totalQuestions = Object.values(modulesData).reduce((sum, module) => sum + module.questions.length, 0);
    console.log(`📊 Total de preguntas procesadas: ${totalQuestions}`);

  } catch (error) {
    console.error('❌ Error en el proceso principal:', error);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { modulesData, createModuleQuiz };