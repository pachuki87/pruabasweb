const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Usar la clave de servicio para evitar RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ID correcto del curso "MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL"
const CURSO_ID = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// Mapeo de módulos del PDF con lecciones de Supabase (UUIDs correctos)
const MODULO_LECCION_MAP = {
  3: 'f86d4f76-90c9-42aa-91c1-7e8fca2dfcb0', // Lección 3: "FAMILIA Y TRABAJO EQUIPO"
  4: 'a0d939f6-8774-49b7-9a72-cb126a3afaa3', // Lección 4: "RECOVERY COACHING"
  5: 'a2ea5c33-f0bf-4aba-b823-d5dabc825511', // Lección 5: "INTERVENCION FAMILIAR Y RECOVERY MENTORING"
  6: '0b2dde26-092c-44a3-8694-875af52d7805', // Lección 6: "NUEVOS MODELOS TERAPEUTICOS"
  7: '5d9a7bb3-b059-406e-9940-08c3a81d475c'  // Lección 7: "INTELIGENCIA EMOCIONAL"
};

// Preguntas para cada módulo
const PREGUNTAS_MODULOS = {
  3: {
    titulo: "Cuestionario Módulo 3: Neurobiología de las Adicciones",
    preguntas: [
      {
        pregunta: "¿Cuál es el principal neurotransmisor involucrado en el sistema de recompensa cerebral?",
        tipo: "multiple_choice",
        opcion_a: "Serotonina",
        opcion_b: "Dopamina", 
        opcion_c: "GABA",
        opcion_d: "Acetilcolina",
        respuesta_correcta: "b",
        explicacion: "La dopamina es el neurotransmisor clave en el sistema de recompensa cerebral y en el desarrollo de adicciones."
      },
      {
        pregunta: "¿Qué estructura cerebral es fundamental en el circuito de recompensa?",
        tipo: "multiple_choice",
        opcion_a: "Hipocampo",
        opcion_b: "Amígdala",
        opcion_c: "Núcleo accumbens",
        opcion_d: "Corteza prefrontal",
        respuesta_correcta: "c",
        explicacion: "El núcleo accumbens es una estructura clave en el circuito de recompensa cerebral."
      },
      {
        pregunta: "Explique cómo la neuroplasticidad contribuye al desarrollo de las adicciones.",
        tipo: "texto_libre",
        explicacion: "La neuroplasticidad permite que el cerebro se adapte a la presencia repetida de sustancias, creando cambios duraderos en los circuitos neuronales."
      }
    ]
  },
  4: {
    titulo: "Cuestionario Módulo 4: Factores de Riesgo y Protección",
    preguntas: [
      {
        pregunta: "¿Cuál de los siguientes es un factor de riesgo individual para el desarrollo de adicciones?",
        tipo: "multiple_choice",
        opcion_a: "Apoyo familiar fuerte",
        opcion_b: "Predisposición genética",
        opcion_c: "Actividades recreativas saludables",
        opcion_d: "Red social positiva",
        respuesta_correcta: "b",
        explicacion: "La predisposición genética es un factor de riesgo individual importante para el desarrollo de adicciones."
      },
      {
        pregunta: "¿Qué porcentaje aproximado de la vulnerabilidad a las adicciones se atribuye a factores genéticos?",
        tipo: "multiple_choice",
        opcion_a: "20-30%",
        opcion_b: "40-60%",
        opcion_c: "70-80%",
        opcion_d: "90-95%",
        respuesta_correcta: "b",
        explicacion: "Los estudios indican que entre el 40-60% de la vulnerabilidad a las adicciones tiene componente genético."
      },
      {
        pregunta: "Describa tres factores de protección que pueden reducir el riesgo de desarrollar una adicción.",
        tipo: "texto_libre",
        explicacion: "Los factores de protección incluyen apoyo familiar, habilidades de afrontamiento, actividades prosociales, entre otros."
      }
    ]
  },
  5: {
    titulo: "Cuestionario Módulo 5: Evaluación y Diagnóstico",
    preguntas: [
      {
        pregunta: "¿Cuál es la herramienta de screening más utilizada para detectar problemas con el alcohol?",
        tipo: "multiple_choice",
        opcion_a: "CAGE",
        opcion_b: "AUDIT",
        opcion_c: "MAST",
        opcion_d: "SASSI",
        respuesta_correcta: "b",
        explicacion: "El AUDIT (Alcohol Use Disorders Identification Test) es la herramienta de screening más ampliamente utilizada."
      },
      {
        pregunta: "¿Cuántos criterios del DSM-5 se necesitan para diagnosticar un trastorno por uso de sustancias leve?",
        tipo: "multiple_choice",
        opcion_a: "1-2 criterios",
        opcion_b: "2-3 criterios",
        opcion_c: "4-5 criterios",
        opcion_d: "6 o más criterios",
        respuesta_correcta: "b",
        explicacion: "El DSM-5 requiere 2-3 criterios para un trastorno leve, 4-5 para moderado, y 6+ para severo."
      },
      {
        pregunta: "Explique la importancia de la evaluación motivacional en el proceso diagnóstico.",
        tipo: "texto_libre",
        explicacion: "La evaluación motivacional ayuda a determinar la disposición al cambio del paciente y guía el plan de tratamiento."
      }
    ]
  },
  6: {
    titulo: "Cuestionario Módulo 6: Intervenciones Psicoterapéuticas",
    preguntas: [
      {
        pregunta: "¿Cuál es el objetivo principal de la Entrevista Motivacional?",
        tipo: "multiple_choice",
        opcion_a: "Confrontar la negación del paciente",
        opcion_b: "Aumentar la motivación intrínseca para el cambio",
        opcion_c: "Proporcionar información sobre los riesgos",
        opcion_d: "Establecer metas de abstinencia",
        respuesta_correcta: "b",
        explicacion: "La Entrevista Motivacional busca aumentar la motivación intrínseca del paciente para el cambio."
      },
      {
        pregunta: "¿Qué técnica de la Terapia Cognitivo-Conductual es más efectiva para prevenir recaídas?",
        tipo: "multiple_choice",
        opcion_a: "Reestructuración cognitiva",
        opcion_b: "Prevención de recaídas",
        opcion_c: "Entrenamiento en habilidades sociales",
        opcion_d: "Todas las anteriores",
        respuesta_correcta: "d",
        explicacion: "La combinación de todas estas técnicas de TCC es lo más efectivo para prevenir recaídas."
      },
      {
        pregunta: "Describa las etapas del modelo transteórico de cambio de Prochaska y DiClemente.",
        tipo: "texto_libre",
        explicacion: "Las etapas son: precontemplación, contemplación, preparación, acción, mantenimiento y recaída."
      }
    ]
  },
  7: {
    titulo: "Cuestionario Módulo 7: Tratamiento Farmacológico",
    preguntas: [
      {
        pregunta: "¿Cuál es el mecanismo de acción de la naltrexona en el tratamiento del alcoholismo?",
        tipo: "multiple_choice",
        opcion_a: "Bloquea los receptores de dopamina",
        opcion_b: "Bloquea los receptores opioides",
        opcion_c: "Aumenta la serotonina",
        opcion_d: "Inhibe la acetilcolinesterasa",
        respuesta_correcta: "b",
        explicacion: "La naltrexona es un antagonista de los receptores opioides que reduce el craving por alcohol."
      },
      {
        pregunta: "¿Qué medicamento se utiliza para el tratamiento de mantenimiento con opioides?",
        tipo: "multiple_choice",
        opcion_a: "Naloxona",
        opcion_b: "Buprenorfina",
        opcion_c: "Metadona",
        opcion_d: "Tanto B como C",
        respuesta_correcta: "d",
        explicacion: "Tanto la buprenorfina como la metadona se utilizan para el tratamiento de mantenimiento con opioides."
      },
      {
        pregunta: "Explique las ventajas y desventajas del tratamiento farmacológico en adicciones.",
        tipo: "texto_libre",
        explicacion: "Las ventajas incluyen reducción del craving y síntomas de abstinencia. Las desventajas pueden incluir efectos secundarios y dependencia del medicamento."
      }
    ]
  }
};

async function crearCuestionario(moduloNum, leccionId, titulo) {
  console.log(`\n📝 Creando cuestionario para Módulo ${moduloNum}...`);
  
  const { data: cuestionario, error } = await supabase
    .from('cuestionarios')
    .insert({
      titulo: titulo,
      curso_id: CURSO_ID,
      leccion_id: leccionId,
      creado_en: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error(`❌ Error creando cuestionario Módulo ${moduloNum}:`, error);
    return null;
  }

  console.log(`✅ Cuestionario Módulo ${moduloNum} creado con ID: ${cuestionario.id}`);
  return cuestionario;
}

async function insertarPreguntas(cuestionarioId, leccionId, preguntas, moduloNum) {
  console.log(`\n📋 Insertando ${preguntas.length} preguntas para Módulo ${moduloNum}...`);
  
  let preguntasInsertadas = 0;
  
  for (let i = 0; i < preguntas.length; i++) {
    const pregunta = preguntas[i];
    
    const preguntaData = {
      cuestionario_id: cuestionarioId,
      leccion_id: leccionId,
      pregunta: pregunta.pregunta,
      tipo: pregunta.tipo,
      orden: i + 1,
      explicacion: pregunta.explicacion
    };

    // Solo agregar campos de opciones y respuesta para multiple_choice
    if (pregunta.tipo === 'multiple_choice') {
      preguntaData.opcion_a = pregunta.opcion_a;
      preguntaData.opcion_b = pregunta.opcion_b;
      preguntaData.opcion_c = pregunta.opcion_c;
      preguntaData.opcion_d = pregunta.opcion_d;
      preguntaData.respuesta_correcta = pregunta.respuesta_correcta;
    }

    const { data, error } = await supabase
      .from('preguntas')
      .insert(preguntaData);

    if (error) {
      console.error(`❌ Error insertando pregunta ${i + 1}:`, error);
    } else {
      console.log(`✅ Pregunta ${i + 1} insertada correctamente`);
      preguntasInsertadas++;
    }
  }
  
  return preguntasInsertadas;
}

async function procesarModulos() {
  console.log('🚀 Iniciando creación de cuestionarios para Módulos 3-7...\n');
  console.log(`📚 Usando curso: ${CURSO_ID}`);
  
  let modulosProcesados = 0;
  let preguntasTotales = 0;

  for (const [moduloNum, leccionId] of Object.entries(MODULO_LECCION_MAP)) {
    const moduloData = PREGUNTAS_MODULOS[moduloNum];
    
    if (!moduloData) {
      console.log(`⚠️ No hay datos para Módulo ${moduloNum}, saltando...`);
      continue;
    }

    console.log(`\n🎯 Procesando Módulo ${moduloNum} (Lección: ${leccionId})`);

    // Crear cuestionario
    const cuestionario = await crearCuestionario(moduloNum, leccionId, moduloData.titulo);
    
    if (!cuestionario) {
      console.log(`❌ No se pudo crear cuestionario para Módulo ${moduloNum}`);
      continue;
    }

    // Insertar preguntas
    const preguntasInsertadas = await insertarPreguntas(
      cuestionario.id, 
      leccionId, 
      moduloData.preguntas, 
      moduloNum
    );

    if (preguntasInsertadas === moduloData.preguntas.length) {
      console.log(`✅ Módulo ${moduloNum} completado exitosamente`);
      modulosProcesados++;
    } else {
      console.log(`⚠️ Módulo ${moduloNum} completado parcialmente (${preguntasInsertadas}/${moduloData.preguntas.length} preguntas)`);
    }

    preguntasTotales += preguntasInsertadas;
  }

  console.log('\n📊 RESUMEN FINAL:');
  console.log(`✅ Módulos procesados exitosamente: ${modulosProcesados}/5`);
  console.log(`📝 Total de preguntas insertadas: ${preguntasTotales}`);
  console.log('\n🎉 ¡Proceso completado!');
}

procesarModulos().catch(console.error);