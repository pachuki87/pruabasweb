const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Mapeo de módulos del PDF con las lecciones existentes
const modulosMapping = {
  3: { leccionId: 'f86d4f76-90c9-42aa-91c1-7e8fca2dfcb0', titulo: 'FAMILIA Y TRABAJO EQUIPO' },
  4: { leccionId: 'a0d939f6-8774-49b7-9a72-cb126a3afaa3', titulo: 'RECOVERY COACHING' },
  5: { leccionId: 'a2ea5c33-f0bf-4aba-b823-d5dabc825511', titulo: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING' },
  6: { leccionId: '0b2dde26-092c-44a3-8694-875af52d7805', titulo: 'NUEVOS MODELOS TERAPEUTICOS' },
  7: { leccionId: '5d9a7bb3-b059-406e-9940-08c3a81d475c', titulo: 'INTELIGENCIA EMOCIONAL' }
};

// Preguntas para cada módulo basadas en el PDF
const preguntasPorModulo = {
  3: {
    titulo: 'FAMILIA Y TRABAJO EQUIPO',
    preguntas: [
      {
        pregunta: '¿Cuál es el primer paso en la evaluación de adicciones?',
        tipo: 'multiple_choice',
        opciones: ['Evaluación médica', 'Historia clínica completa', 'Pruebas de laboratorio', 'Evaluación psicológica'],
        respuesta_correcta: 'Historia clínica completa'
      },
      {
        pregunta: '¿Cómo se clasifican los trastornos por uso de sustancias según el DSM-5?',
        tipo: 'multiple_choice',
        opciones: ['Leve, moderado, severo', 'Agudo, crónico', 'Primario, secundario', 'Físico, psicológico'],
        respuesta_correcta: 'Leve, moderado, severo'
      },
      {
        pregunta: '¿Qué instrumento se utiliza para evaluar la dependencia alcohólica?',
        tipo: 'multiple_choice',
        opciones: ['CAGE', 'AUDIT', 'MAST', 'Todos los anteriores'],
        respuesta_correcta: 'Todos los anteriores'
      },
      {
        pregunta: 'Describe la importancia de la evaluación familiar en el tratamiento de adicciones.',
        tipo: 'text',
        respuesta_correcta: 'La evaluación familiar es crucial porque permite identificar patrones disfuncionales, recursos de apoyo, factores de riesgo y protección en el entorno familiar que pueden influir en el proceso de recuperación.'
      },
      {
        pregunta: 'Explica el concepto de codependencia y su impacto en el tratamiento.',
        tipo: 'text',
        respuesta_correcta: 'La codependencia es un patrón de comportamiento donde los familiares desarrollan conductas que inadvertidamente mantienen o facilitan el consumo de sustancias, afectando negativamente el proceso de recuperación.'
      },
      {
        pregunta: '¿Cuáles son los principales componentes de un programa de terapia familiar?',
        tipo: 'text',
        respuesta_correcta: 'Los componentes incluyen: psicoeducación sobre adicciones, mejora de la comunicación familiar, establecimiento de límites saludables, manejo de crisis y prevención de recaídas familiares.'
      },
      {
        pregunta: 'Describe las características del trabajo en equipo multidisciplinario.',
        tipo: 'text',
        respuesta_correcta: 'El trabajo multidisciplinario se caracteriza por la colaboración entre diferentes profesionales (médicos, psicólogos, trabajadores sociales, terapeutas), comunicación efectiva, objetivos compartidos y coordinación de intervenciones.'
      },
      {
        pregunta: '¿Qué papel juega el trabajador social en el equipo de tratamiento?',
        tipo: 'text',
        respuesta_correcta: 'El trabajador social facilita la conexión con recursos comunitarios, evalúa el entorno social, coordina servicios de apoyo, trabaja con la familia y aborda factores socioeconómicos que afectan la recuperación.'
      }
    ]
  },
  4: {
    titulo: 'RECOVERY COACHING',
    preguntas: [
      {
        pregunta: '¿Cuál es el objetivo principal del Recovery Coaching?',
        tipo: 'multiple_choice',
        opciones: ['Proporcionar terapia', 'Facilitar el proceso de recuperación', 'Prescribir medicamentos', 'Realizar diagnósticos'],
        respuesta_correcta: 'Facilitar el proceso de recuperación'
      },
      {
        pregunta: '¿Qué diferencia al Recovery Coach de un terapeuta tradicional?',
        tipo: 'multiple_choice',
        opciones: ['No tiene formación', 'Se enfoca en el presente y futuro', 'Solo trabaja con familias', 'No puede trabajar con adicciones'],
        respuesta_correcta: 'Se enfoca en el presente y futuro'
      },
      {
        pregunta: '¿Cuáles son las competencias básicas de un Recovery Coach?',
        tipo: 'multiple_choice',
        opciones: ['Escucha activa y motivación', 'Prescripción médica', 'Diagnóstico psicológico', 'Terapia de grupo únicamente'],
        respuesta_correcta: 'Escucha activa y motivación'
      },
      {
        pregunta: 'Explica el modelo de Recovery Coaching y sus principios fundamentales.',
        tipo: 'text',
        respuesta_correcta: 'El Recovery Coaching se basa en principios de esperanza, autodeterminación, individualización, fortalezas personales y enfoque holístico, facilitando el empoderamiento del cliente en su proceso de recuperación.'
      },
      {
        pregunta: 'Describe las fases del proceso de Recovery Coaching.',
        tipo: 'text',
        respuesta_correcta: 'Las fases incluyen: establecimiento de la relación, evaluación de fortalezas y necesidades, planificación de objetivos, implementación de estrategias, monitoreo del progreso y transición hacia la independencia.'
      },
      {
        pregunta: '¿Cómo se diferencia el Recovery Coaching de otros enfoques terapéuticos?',
        tipo: 'text',
        respuesta_correcta: 'Se diferencia por su enfoque no clínico, orientación hacia fortalezas, perspectiva de esperanza, colaboración igualitaria y énfasis en la autodeterminación del cliente.'
      },
      {
        pregunta: '¿Qué herramientas utiliza un Recovery Coach en su práctica?',
        tipo: 'text',
        respuesta_correcta: 'Utiliza herramientas como entrevista motivacional, planificación de objetivos SMART, mapeo de recursos, técnicas de mindfulness y estrategias de manejo de crisis.'
      },
      {
        pregunta: 'Explica la importancia de la experiencia vivida en el Recovery Coaching.',
        tipo: 'text',
        respuesta_correcta: 'La experiencia vivida proporciona credibilidad, esperanza, comprensión empática y modelado de recuperación, creando una conexión única que facilita el proceso de cambio del cliente.'
      }
    ]
  },
  5: {
    titulo: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
    preguntas: [
      {
        pregunta: '¿Qué es la intervención familiar sistémica?',
        tipo: 'multiple_choice',
        opciones: ['Terapia individual', 'Enfoque que ve a la familia como sistema', 'Medicación familiar', 'Terapia de grupo'],
        respuesta_correcta: 'Enfoque que ve a la familia como sistema'
      },
      {
        pregunta: '¿Cuál es el objetivo del Recovery Mentoring?',
        tipo: 'multiple_choice',
        opciones: ['Proporcionar apoyo entre pares', 'Realizar diagnósticos', 'Prescribir tratamientos', 'Sustituir la terapia'],
        respuesta_correcta: 'Proporcionar apoyo entre pares'
      },
      {
        pregunta: '¿Qué caracteriza a un mentor en recuperación?',
        tipo: 'multiple_choice',
        opciones: ['Experiencia personal en recuperación', 'Título universitario', 'Licencia médica', 'Especialización en farmacología'],
        respuesta_correcta: 'Experiencia personal en recuperación'
      },
      {
        pregunta: 'Describe los principios de la intervención familiar sistémica en adicciones.',
        tipo: 'text',
        respuesta_correcta: 'Los principios incluyen: ver la adicción como síntoma del sistema familiar, identificar patrones disfuncionales, promover cambios en la dinámica familiar, fortalecer recursos familiares y facilitar la comunicación efectiva.'
      },
      {
        pregunta: '¿Cómo se implementa un programa de Recovery Mentoring?',
        tipo: 'text',
        respuesta_correcta: 'Se implementa mediante selección y entrenamiento de mentores, emparejamiento cuidadoso mentor-cliente, establecimiento de objetivos claros, supervisión regular y evaluación continua del proceso.'
      },
      {
        pregunta: 'Explica las diferencias entre Recovery Coaching y Recovery Mentoring.',
        tipo: 'text',
        respuesta_correcta: 'El Coaching es más estructurado y profesional, mientras que el Mentoring es más informal y basado en la experiencia personal. El Coach tiene entrenamiento formal, el mentor comparte experiencia vivida.'
      },
      {
        pregunta: '¿Qué beneficios aporta la intervención familiar en el tratamiento de adicciones?',
        tipo: 'text',
        respuesta_correcta: 'Aporta mayor adherencia al tratamiento, reducción de recaídas, mejora en la comunicación familiar, fortalecimiento del sistema de apoyo y abordaje integral de factores familiares.'
      },
      {
        pregunta: 'Describe el proceso de selección y entrenamiento de mentores en recuperación.',
        tipo: 'text',
        respuesta_correcta: 'El proceso incluye: evaluación de estabilidad en recuperación, habilidades interpersonales, motivación para ayudar, entrenamiento en técnicas de apoyo, ética y límites profesionales.'
      }
    ]
  },
  6: {
    titulo: 'NUEVOS MODELOS TERAPEUTICOS',
    preguntas: [
      {
        pregunta: '¿Qué caracteriza a los nuevos modelos terapéuticos en adicciones?',
        tipo: 'multiple_choice',
        opciones: ['Enfoque integrador', 'Solo medicación', 'Terapia tradicional', 'Hospitalización prolongada'],
        respuesta_correcta: 'Enfoque integrador'
      },
      {
        pregunta: '¿Cuál es un ejemplo de terapia de tercera generación?',
        tipo: 'multiple_choice',
        opciones: ['Terapia de Aceptación y Compromiso (ACT)', 'Psicoanálisis', 'Terapia conductual clásica', 'Terapia humanista'],
        respuesta_correcta: 'Terapia de Aceptación y Compromiso (ACT)'
      },
      {
        pregunta: '¿Qué papel juega la tecnología en los nuevos modelos terapéuticos?',
        tipo: 'multiple_choice',
        opciones: ['Facilita el acceso y seguimiento', 'No tiene relevancia', 'Solo para diagnóstico', 'Sustituye completamente la terapia'],
        respuesta_correcta: 'Facilita el acceso y seguimiento'
      },
      {
        pregunta: 'Explica los principios de la Terapia de Aceptación y Compromiso (ACT) en adicciones.',
        tipo: 'text',
        respuesta_correcta: 'ACT se basa en la flexibilidad psicológica, aceptación de experiencias internas difíciles, clarificación de valores personales, compromiso con acciones valiosas y mindfulness como herramienta central.'
      },
      {
        pregunta: 'Describe el modelo de Terapia Dialéctica Conductual (DBT) para adicciones.',
        tipo: 'text',
        respuesta_correcta: 'DBT combina técnicas cognitivo-conductuales con mindfulness, enfocándose en regulación emocional, tolerancia al malestar, efectividad interpersonal y conciencia plena.'
      },
      {
        pregunta: '¿Cómo se integra la tecnología en los tratamientos modernos de adicciones?',
        tipo: 'text',
        respuesta_correcta: 'Se integra mediante aplicaciones móviles, terapia online, realidad virtual para exposición, monitoreo continuo, gamificación del tratamiento y plataformas de apoyo peer-to-peer.'
      },
      {
        pregunta: 'Explica el concepto de medicina personalizada en el tratamiento de adicciones.',
        tipo: 'text',
        respuesta_correcta: 'La medicina personalizada adapta el tratamiento según características genéticas, biomarcadores, perfil psicológico y factores ambientales específicos de cada paciente para optimizar resultados.'
      },
      {
        pregunta: '¿Qué ventajas ofrecen los modelos terapéuticos integrativos?',
        tipo: 'text',
        respuesta_correcta: 'Ofrecen abordaje holístico, combinación de técnicas efectivas, adaptación a necesidades individuales, mayor flexibilidad terapéutica y mejores resultados a largo plazo.'
      }
    ]
  },
  7: {
    titulo: 'INTELIGENCIA EMOCIONAL',
    preguntas: [
      {
        pregunta: '¿Cuáles son los componentes principales de la inteligencia emocional?',
        tipo: 'multiple_choice',
        opciones: ['Autoconciencia, autorregulación, motivación, empatía, habilidades sociales', 'Solo autocontrol', 'Únicamente empatía', 'Solo habilidades cognitivas'],
        respuesta_correcta: 'Autoconciencia, autorregulación, motivación, empatía, habilidades sociales'
      },
      {
        pregunta: '¿Cómo se relaciona la inteligencia emocional con las adicciones?',
        tipo: 'multiple_choice',
        opciones: ['Déficits emocionales aumentan riesgo de adicción', 'No hay relación', 'Solo afecta la recuperación', 'Es irrelevante en el tratamiento'],
        respuesta_correcta: 'Déficits emocionales aumentan riesgo de adicción'
      },
      {
        pregunta: '¿Qué técnica es fundamental para desarrollar inteligencia emocional?',
        tipo: 'multiple_choice',
        opciones: ['Mindfulness y autoobservación', 'Medicación', 'Evitación emocional', 'Supresión de sentimientos'],
        respuesta_correcta: 'Mindfulness y autoobservación'
      },
      {
        pregunta: 'Explica la relación entre inteligencia emocional y prevención de recaídas.',
        tipo: 'text',
        respuesta_correcta: 'La inteligencia emocional facilita el reconocimiento temprano de estados emocionales de riesgo, mejora las estrategias de afrontamiento, fortalece la autorregulación y reduce la vulnerabilidad a recaídas.'
      },
      {
        pregunta: 'Describe estrategias para desarrollar la autoconciencia emocional en pacientes con adicciones.',
        tipo: 'text',
        respuesta_correcta: 'Las estrategias incluyen: diarios emocionales, técnicas de mindfulness, identificación de triggers emocionales, exploración de patrones emocionales y práctica de autoobservación sin juicio.'
      },
      {
        pregunta: '¿Cómo se puede mejorar la regulación emocional en el tratamiento de adicciones?',
        tipo: 'text',
        respuesta_correcta: 'Se mejora mediante técnicas de respiración, reestructuración cognitiva, tolerancia al malestar, expresión emocional saludable y desarrollo de estrategias de afrontamiento adaptativas.'
      },
      {
        pregunta: 'Explica la importancia de la empatía en el proceso de recuperación.',
        tipo: 'text',
        respuesta_correcta: 'La empatía facilita la conexión terapéutica, mejora las relaciones interpersonales, reduce el aislamiento social, promueve la comprensión de otros y fortalece el apoyo social en recuperación.'
      },
      {
        pregunta: '¿Qué papel juegan las habilidades sociales en la prevención de adicciones?',
        tipo: 'text',
        respuesta_correcta: 'Las habilidades sociales permiten establecer relaciones saludables, comunicarse efectivamente, resolver conflictos, resistir presión social y construir redes de apoyo sólidas.'
      }
    ]
  }
};

async function getCursoId() {
  const { data: curso, error: cursoError } = await supabase
    .from('cursos')
    .select('id')
    .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
    .single();
  
  if (cursoError) {
    console.error('❌ Error obteniendo curso:', cursoError);
    return null;
  }
  
  return curso.id;
}

async function createQuizForModule(moduleNum, cursoId) {
  const moduleData = preguntasPorModulo[moduleNum];
  const leccionId = modulosMapping[moduleNum].leccionId;
  
  console.log(`📚 Creando cuestionario para Módulo ${moduleNum}: ${moduleData.titulo}`);
  
  try {
    // Crear el cuestionario
    const { data: cuestionario, error: cuestionarioError } = await supabase
      .from('cuestionarios')
      .insert({
        titulo: `Cuestionario Módulo ${moduleNum}: ${moduleData.titulo}`,
        curso_id: cursoId,
        leccion_id: leccionId
      })
      .select()
      .single();
    
    if (cuestionarioError) {
      console.error(`❌ Error creando cuestionario del Módulo ${moduleNum}:`, cuestionarioError);
      return false;
    }
    
    console.log(`✅ Cuestionario creado: ${cuestionario.titulo} (ID: ${cuestionario.id})`);
    
    // Insertar las preguntas
    const preguntasParaInsertar = moduleData.preguntas.map((pregunta, index) => ({
      cuestionario_id: cuestionario.id,
      pregunta: pregunta.pregunta,
      tipo: pregunta.tipo,
      opciones: pregunta.tipo === 'multiple_choice' ? pregunta.opciones : null,
      respuesta_correcta: pregunta.respuesta_correcta,
      orden: index + 1
    }));
    
    const { data: preguntasInsertadas, error: preguntasError } = await supabase
      .from('preguntas')
      .insert(preguntasParaInsertar)
      .select();
    
    if (preguntasError) {
      console.error(`❌ Error insertando preguntas del Módulo ${moduleNum}:`, preguntasError);
      return false;
    }
    
    console.log(`✅ ${preguntasInsertadas.length} preguntas insertadas para el Módulo ${moduleNum}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error procesando Módulo ${moduleNum}:`, error);
    return false;
  }
}

async function createAllQuizzes() {
  console.log('🚀 Iniciando creación de cuestionarios para Módulos 3-7...\n');
  
  const cursoId = await getCursoId();
  if (!cursoId) {
    console.log('❌ No se pudo obtener el ID del curso');
    return;
  }
  
  let exitosos = 0;
  let totalPreguntas = 0;
  
  for (let moduleNum = 3; moduleNum <= 7; moduleNum++) {
    const exito = await createQuizForModule(moduleNum, cursoId);
    if (exito) {
      exitosos++;
      totalPreguntas += preguntasPorModulo[moduleNum].preguntas.length;
    }
    console.log(''); // Línea en blanco para separar módulos
  }
  
  console.log('🎉 PROCESO COMPLETADO');
  console.log(`✅ ${exitosos}/5 módulos procesados exitosamente`);
  console.log(`📊 Total de preguntas procesadas: ${totalPreguntas}`);
}

createAllQuizzes();