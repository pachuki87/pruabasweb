const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Usar la clave de servicio para evitar RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mapeo de módulos del PDF con lecciones existentes en Supabase (UUIDs reales)
const moduloLeccionMap = {
  3: "f86d4f76-90c9-42aa-91c1-7e8fca2dfcb0", // Módulo 3 -> "FAMILIA Y TRABAJO EQUIPO"
  4: "a0d939f6-8774-49b7-9a72-cb126a3afaa3", // Módulo 4 -> "RECOVERY COACHING"
  5: "a2ea5c33-f0bf-4aba-b823-d5dabc825511", // Módulo 5 -> "INTERVENCION FAMILIAR Y RECOVERY MENTORING"
  6: "0b2dde26-092c-44a3-8694-875af52d7805", // Módulo 6 -> "NUEVOS MODELOS TERAPEUTICOS"
  7: "5d9a7bb3-b059-406e-9940-08c3a81d475c"  // Módulo 7 -> "INTELIGENCIA EMOCIONAL"
};

// Datos de los cuestionarios por módulo
const cuestionariosPorModulo = {
  3: {
    titulo: "Cuestionario Módulo 3: Neurobiología de las Adicciones",
    preguntas: [
      {
        pregunta: "¿Cuál es el principal neurotransmisor implicado en el sistema de recompensa cerebral?",
        tipo: "seleccion_multiple",
        opcion_a: "Serotonina",
        opcion_b: "Dopamina",
        opcion_c: "GABA",
        opcion_d: "Acetilcolina",
        respuesta_correcta: "B"
      },
      {
        pregunta: "¿Qué estructura cerebral es fundamental en el circuito de recompensa?",
        tipo: "seleccion_multiple",
        opcion_a: "Hipocampo",
        opcion_b: "Amígdala",
        opcion_c: "Núcleo accumbens",
        opcion_d: "Corteza prefrontal",
        respuesta_correcta: "C"
      },
      {
        pregunta: "Explica cómo la neuroplasticidad contribuye al desarrollo de la adicción.",
        tipo: "texto_libre",
        respuesta_correcta: null
      },
      {
        pregunta: "¿Cuál es el papel de la corteza prefrontal en las adicciones?",
        tipo: "seleccion_multiple",
        opcion_a: "Control de impulsos y toma de decisiones",
        opcion_b: "Procesamiento de emociones",
        opcion_c: "Memoria a largo plazo",
        opcion_d: "Coordinación motora",
        respuesta_correcta: "A"
      },
      {
        pregunta: "Describe los cambios neurobiológicos que ocurren en el cerebro durante el proceso de adicción.",
        tipo: "texto_libre",
        respuesta_correcta: null
      }
    ]
  },
  4: {
    titulo: "Cuestionario Módulo 4: Factores de Riesgo y Protección",
    preguntas: [
      {
        pregunta: "¿Cuál de los siguientes es un factor de riesgo individual para el desarrollo de adicciones?",
        tipo: "seleccion_multiple",
        opcion_a: "Apoyo familiar fuerte",
        opcion_b: "Predisposición genética",
        opcion_c: "Actividades recreativas saludables",
        opcion_d: "Red social positiva",
        respuesta_correcta: "B"
      },
      {
        pregunta: "Los factores de protección familiares incluyen:",
        tipo: "seleccion_multiple",
        opcion_a: "Conflictos constantes",
        opcion_b: "Falta de supervisión",
        opcion_c: "Comunicación abierta y apoyo",
        opcion_d: "Consumo de sustancias por parte de los padres",
        respuesta_correcta: "C"
      },
      {
        pregunta: "Analiza la interacción entre factores de riesgo genéticos y ambientales en el desarrollo de adicciones.",
        tipo: "texto_libre",
        respuesta_correcta: null
      },
      {
        pregunta: "¿Qué papel juega la edad de inicio en el consumo como factor de riesgo?",
        tipo: "seleccion_multiple",
        opcion_a: "No tiene relevancia",
        opcion_b: "Inicio temprano aumenta el riesgo",
        opcion_c: "Inicio tardío aumenta el riesgo",
        opcion_d: "Solo importa el tipo de sustancia",
        respuesta_correcta: "B"
      },
      {
        pregunta: "Describe estrategias para fortalecer los factores de protección en adolescentes.",
        tipo: "texto_libre",
        respuesta_correcta: null
      }
    ]
  },
  5: {
    titulo: "Cuestionario Módulo 5: Evaluación y Diagnóstico",
    preguntas: [
      {
        pregunta: "¿Cuál es el primer paso en el proceso de evaluación de adicciones?",
        tipo: "seleccion_multiple",
        opcion_a: "Aplicar tests psicológicos",
        opcion_b: "Realizar análisis de laboratorio",
        opcion_c: "Establecer rapport y recoger historia clínica",
        opcion_d: "Derivar a especialista",
        respuesta_correcta: "C"
      },
      {
        pregunta: "El DSM-5 clasifica los trastornos por uso de sustancias en:",
        tipo: "seleccion_multiple",
        opcion_a: "Leve, moderado y grave",
        opcion_b: "Agudo y crónico",
        opcion_c: "Físico y psicológico",
        opcion_d: "Primario y secundario",
        respuesta_correcta: "A"
      },
      {
        pregunta: "Explica la importancia de la evaluación multidimensional en el diagnóstico de adicciones.",
        tipo: "texto_libre",
        respuesta_correcta: null
      },
      {
        pregunta: "¿Qué instrumento se utiliza comúnmente para evaluar la severidad de la adicción?",
        tipo: "seleccion_multiple",
        opcion_a: "MMPI-2",
        opcion_b: "ASI (Addiction Severity Index)",
        opcion_c: "Beck Depression Inventory",
        opcion_d: "WAIS-IV",
        respuesta_correcta: "B"
      },
      {
        pregunta: "Describe los criterios diagnósticos principales para el trastorno por uso de sustancias según el DSM-5.",
        tipo: "texto_libre",
        respuesta_correcta: null
      }
    ]
  },
  6: {
    titulo: "Cuestionario Módulo 6: Modelos de Intervención Psicosocial",
    preguntas: [
      {
        pregunta: "¿Cuál es el objetivo principal del modelo transteórico de cambio?",
        tipo: "seleccion_multiple",
        opcion_a: "Eliminar completamente el consumo",
        opcion_b: "Adaptar la intervención a la etapa de cambio del paciente",
        opcion_c: "Aplicar el mismo tratamiento a todos",
        opcion_d: "Focalizarse solo en la desintoxicación",
        respuesta_correcta: "B"
      },
      {
        pregunta: "La terapia cognitivo-conductual en adicciones se centra en:",
        tipo: "seleccion_multiple",
        opcion_a: "Explorar el inconsciente",
        opcion_b: "Modificar pensamientos y conductas disfuncionales",
        opcion_c: "Analizar la historia familiar",
        opcion_d: "Prescribir medicación",
        respuesta_correcta: "B"
      },
      {
        pregunta: "Compara la efectividad de diferentes modelos de intervención psicosocial en el tratamiento de adicciones.",
        tipo: "texto_libre",
        respuesta_correcta: null
      },
      {
        pregunta: "¿Qué caracteriza al enfoque de reducción de daños?",
        tipo: "seleccion_multiple",
        opcion_a: "Abstinencia total como único objetivo",
        opcion_b: "Minimizar riesgos asociados al consumo",
        opcion_c: "Internamiento obligatorio",
        opcion_d: "Confrontación directa",
        respuesta_correcta: "B"
      },
      {
        pregunta: "Explica los principios fundamentales de la entrevista motivacional en el contexto de las adicciones.",
        tipo: "texto_libre",
        respuesta_correcta: null
      }
    ]
  },
  7: {
    titulo: "Cuestionario Módulo 7: Prevención de Recaídas",
    preguntas: [
      {
        pregunta: "¿Cuál es el concepto clave en el modelo de prevención de recaídas de Marlatt?",
        tipo: "seleccion_multiple",
        opcion_a: "Abstinencia total",
        opcion_b: "Situaciones de alto riesgo",
        opcion_c: "Medicación preventiva",
        opcion_d: "Aislamiento social",
        respuesta_correcta: "B"
      },
      {
        pregunta: "El efecto de violación de la abstinencia se refiere a:",
        tipo: "seleccion_multiple",
        opcion_a: "La primera recaída",
        opcion_b: "La reacción emocional tras un desliz",
        opcion_c: "El síndrome de abstinencia",
        opcion_d: "La negación del problema",
        respuesta_correcta: "B"
      },
      {
        pregunta: "Desarrolla un plan de prevención de recaídas personalizado para un caso específico.",
        tipo: "texto_libre",
        respuesta_correcta: null
      },
      {
        pregunta: "¿Qué estrategias son más efectivas para manejar los craving o deseos intensos de consumo?",
        tipo: "seleccion_multiple",
        opcion_a: "Ignorar las sensaciones",
        opcion_b: "Técnicas de relajación y mindfulness",
        opcion_c: "Consumir sustancias sustitutivas",
        opcion_d: "Evitar pensar en el tema",
        respuesta_correcta: "B"
      },
      {
        pregunta: "Analiza la importancia del apoyo social en la prevención de recaídas.",
        tipo: "texto_libre",
        respuesta_correcta: null
      }
    ]
  }
};

async function obtenerCursoId() {
  const { data, error } = await supabase
    .from('cursos')
    .select('id')
    .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
    .single();

  if (error) {
    console.error('Error obteniendo curso:', error);
    return null;
  }

  return data.id;
}

async function crearCuestionario(cursoId, leccionId, titulo) {
  const { data, error } = await supabase
    .from('cuestionarios')
    .insert({
      titulo: titulo,
      curso_id: cursoId,
      leccion_id: leccionId,
      creado_en: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error creando cuestionario:', error);
    return null;
  }

  return data.id;
}

async function insertarPregunta(cuestionarioId, pregunta, orden) {
  const preguntaData = {
    cuestionario_id: cuestionarioId,
    pregunta: pregunta.pregunta,
    tipo: pregunta.tipo,
    orden: orden
  };

  // Solo agregar opciones si es selección múltiple
  if (pregunta.tipo === 'seleccion_multiple') {
    preguntaData.opcion_a = pregunta.opcion_a;
    preguntaData.opcion_b = pregunta.opcion_b;
    preguntaData.opcion_c = pregunta.opcion_c;
    preguntaData.opcion_d = pregunta.opcion_d;
    preguntaData.respuesta_correcta = pregunta.respuesta_correcta;
  } else {
    preguntaData.respuesta_correcta = null;
  }

  const { data, error } = await supabase
    .from('preguntas')
    .insert(preguntaData)
    .select();

  if (error) {
    console.error('Error insertando pregunta:', error);
    return false;
  }

  return true;
}

async function procesarModulo(modulo, cursoId) {
  const leccionId = moduloLeccionMap[modulo];
  const datosModulo = cuestionariosPorModulo[modulo];

  console.log(`\n--- Procesando Módulo ${modulo} ---`);
  console.log(`Lección ID: ${leccionId}`);
  console.log(`Título: ${datosModulo.titulo}`);

  // Crear cuestionario
  const cuestionarioId = await crearCuestionario(cursoId, leccionId, datosModulo.titulo);
  if (!cuestionarioId) {
    console.error(`Error creando cuestionario para módulo ${modulo}`);
    return false;
  }

  console.log(`Cuestionario creado con ID: ${cuestionarioId}`);

  // Insertar preguntas
  let preguntasInsertadas = 0;
  for (let i = 0; i < datosModulo.preguntas.length; i++) {
    const pregunta = datosModulo.preguntas[i];
    const exito = await insertarPregunta(cuestionarioId, pregunta, i + 1);
    if (exito) {
      preguntasInsertadas++;
      console.log(`  ✓ Pregunta ${i + 1} insertada`);
    } else {
      console.log(`  ✗ Error insertando pregunta ${i + 1}`);
    }
  }

  console.log(`Preguntas insertadas: ${preguntasInsertadas}/${datosModulo.preguntas.length}`);
  return preguntasInsertadas === datosModulo.preguntas.length;
}

async function main() {
  console.log('🚀 Iniciando creación de cuestionarios módulos 3-7...');

  // Obtener ID del curso
  const cursoId = await obtenerCursoId();
  if (!cursoId) {
    console.error('No se pudo obtener el ID del curso');
    return;
  }

  console.log(`Curso ID: ${cursoId}`);

  let modulosProcesados = 0;
  let totalPreguntas = 0;

  // Procesar módulos 3-7
  for (const modulo of [3, 4, 5, 6, 7]) {
    const exito = await procesarModulo(modulo, cursoId);
    if (exito) {
      modulosProcesados++;
      totalPreguntas += cuestionariosPorModulo[modulo].preguntas.length;
    }
  }

  console.log('\n📊 Resumen final:');
  console.log(`Módulos procesados exitosamente: ${modulosProcesados}/5`);
  console.log(`Total de preguntas procesadas: ${totalPreguntas}`);
  console.log('✅ Proceso completado');
}

main().catch(console.error);