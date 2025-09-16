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
        tipo: 'seleccion_multiple',
        opcion_a: 'Evaluación médica',
        opcion_b: 'Historia clínica completa',
        opcion_c: 'Pruebas de laboratorio',
        opcion_d: 'Evaluación psicológica',
        respuesta_correcta: 'B'
      },
      {
        pregunta: '¿Cómo se clasifican los trastornos por uso de sustancias según el DSM-5?',
        tipo: 'seleccion_multiple',
        opcion_a: 'Leve, moderado, severo',
        opcion_b: 'Agudo, crónico',
        opcion_c: 'Primario, secundario',
        opcion_d: 'Físico, psicológico',
        respuesta_correcta: 'A'
      },
      {
        pregunta: '¿Qué instrumento se utiliza para evaluar la dependencia alcohólica?',
        tipo: 'seleccion_multiple',
        opcion_a: 'CAGE',
        opcion_b: 'AUDIT',
        opcion_c: 'MAST',
        opcion_d: 'Todos los anteriores',
        respuesta_correcta: 'D'
      },
      {
        pregunta: 'Describe la importancia de la evaluación familiar en el tratamiento de adicciones.',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: 'Explica el concepto de codependencia y su impacto en el tratamiento.',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: '¿Cuáles son los principales componentes de un programa de terapia familiar?',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: 'Describe las características del trabajo en equipo multidisciplinario.',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: '¿Qué papel juega el trabajador social en el equipo de tratamiento?',
        tipo: 'texto_libre',
        respuesta_correcta: null
      }
    ]
  },
  4: {
    titulo: 'RECOVERY COACHING',
    preguntas: [
      {
        pregunta: '¿Cuál es el objetivo principal del Recovery Coaching?',
        tipo: 'seleccion_multiple',
        opcion_a: 'Proporcionar terapia',
        opcion_b: 'Facilitar el proceso de recuperación',
        opcion_c: 'Prescribir medicamentos',
        opcion_d: 'Realizar diagnósticos',
        respuesta_correcta: 'B'
      },
      {
        pregunta: '¿Qué diferencia al Recovery Coach de un terapeuta tradicional?',
        tipo: 'seleccion_multiple',
        opcion_a: 'No tiene formación',
        opcion_b: 'Se enfoca en el presente y futuro',
        opcion_c: 'Solo trabaja con familias',
        opcion_d: 'No puede trabajar con adicciones',
        respuesta_correcta: 'B'
      },
      {
        pregunta: '¿Cuáles son las competencias básicas de un Recovery Coach?',
        tipo: 'seleccion_multiple',
        opcion_a: 'Escucha activa y motivación',
        opcion_b: 'Prescripción médica',
        opcion_c: 'Diagnóstico psicológico',
        opcion_d: 'Terapia de grupo únicamente',
        respuesta_correcta: 'A'
      },
      {
        pregunta: 'Explica el modelo de Recovery Coaching y sus principios fundamentales.',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: 'Describe las fases del proceso de Recovery Coaching.',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: '¿Cómo se diferencia el Recovery Coaching de otros enfoques terapéuticos?',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: '¿Qué herramientas utiliza un Recovery Coach en su práctica?',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: 'Explica la importancia de la experiencia vivida en el Recovery Coaching.',
        tipo: 'texto_libre',
        respuesta_correcta: null
      }
    ]
  },
  5: {
    titulo: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
    preguntas: [
      {
        pregunta: '¿Qué es la intervención familiar sistémica?',
        tipo: 'seleccion_multiple',
        opcion_a: 'Terapia individual',
        opcion_b: 'Enfoque que ve a la familia como sistema',
        opcion_c: 'Medicación familiar',
        opcion_d: 'Terapia de grupo',
        respuesta_correcta: 'B'
      },
      {
        pregunta: '¿Cuál es el objetivo del Recovery Mentoring?',
        tipo: 'seleccion_multiple',
        opcion_a: 'Proporcionar apoyo entre pares',
        opcion_b: 'Realizar diagnósticos',
        opcion_c: 'Prescribir tratamientos',
        opcion_d: 'Sustituir la terapia',
        respuesta_correcta: 'A'
      },
      {
        pregunta: '¿Qué caracteriza a un mentor en recuperación?',
        tipo: 'seleccion_multiple',
        opcion_a: 'Experiencia personal en recuperación',
        opcion_b: 'Título universitario',
        opcion_c: 'Licencia médica',
        opcion_d: 'Especialización en farmacología',
        respuesta_correcta: 'A'
      },
      {
        pregunta: 'Describe los principios de la intervención familiar sistémica en adicciones.',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: '¿Cómo se implementa un programa de Recovery Mentoring?',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: 'Explica las diferencias entre Recovery Coaching y Recovery Mentoring.',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: '¿Qué beneficios aporta la intervención familiar en el tratamiento de adicciones?',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: 'Describe el proceso de selección y entrenamiento de mentores en recuperación.',
        tipo: 'texto_libre',
        respuesta_correcta: null
      }
    ]
  },
  6: {
    titulo: 'NUEVOS MODELOS TERAPEUTICOS',
    preguntas: [
      {
        pregunta: '¿Qué caracteriza a los nuevos modelos terapéuticos en adicciones?',
        tipo: 'seleccion_multiple',
        opcion_a: 'Enfoque integrador',
        opcion_b: 'Solo medicación',
        opcion_c: 'Terapia tradicional',
        opcion_d: 'Hospitalización prolongada',
        respuesta_correcta: 'A'
      },
      {
        pregunta: '¿Cuál es un ejemplo de terapia de tercera generación?',
        tipo: 'seleccion_multiple',
        opcion_a: 'Terapia de Aceptación y Compromiso (ACT)',
        opcion_b: 'Psicoanálisis',
        opcion_c: 'Terapia conductual clásica',
        opcion_d: 'Terapia humanista',
        respuesta_correcta: 'A'
      },
      {
        pregunta: '¿Qué papel juega la tecnología en los nuevos modelos terapéuticos?',
        tipo: 'seleccion_multiple',
        opcion_a: 'Facilita el acceso y seguimiento',
        opcion_b: 'No tiene relevancia',
        opcion_c: 'Solo para diagnóstico',
        opcion_d: 'Sustituye completamente la terapia',
        respuesta_correcta: 'A'
      },
      {
        pregunta: 'Explica los principios de la Terapia de Aceptación y Compromiso (ACT) en adicciones.',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: 'Describe el modelo de Terapia Dialéctica Conductual (DBT) para adicciones.',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: '¿Cómo se integra la tecnología en los tratamientos modernos de adicciones?',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: 'Explica el concepto de medicina personalizada en el tratamiento de adicciones.',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: '¿Qué ventajas ofrecen los modelos terapéuticos integrativos?',
        tipo: 'texto_libre',
        respuesta_correcta: null
      }
    ]
  },
  7: {
    titulo: 'INTELIGENCIA EMOCIONAL',
    preguntas: [
      {
        pregunta: '¿Cuáles son los componentes principales de la inteligencia emocional?',
        tipo: 'seleccion_multiple',
        opcion_a: 'Autoconciencia, autorregulación, motivación, empatía, habilidades sociales',
        opcion_b: 'Solo autocontrol',
        opcion_c: 'Únicamente empatía',
        opcion_d: 'Solo habilidades cognitivas',
        respuesta_correcta: 'A'
      },
      {
        pregunta: '¿Cómo se relaciona la inteligencia emocional con las adicciones?',
        tipo: 'seleccion_multiple',
        opcion_a: 'Déficits emocionales aumentan riesgo de adicción',
        opcion_b: 'No hay relación',
        opcion_c: 'Solo afecta la recuperación',
        opcion_d: 'Es irrelevante en el tratamiento',
        respuesta_correcta: 'A'
      },
      {
        pregunta: '¿Qué técnica es fundamental para desarrollar inteligencia emocional?',
        tipo: 'seleccion_multiple',
        opcion_a: 'Mindfulness y autoobservación',
        opcion_b: 'Medicación',
        opcion_c: 'Evitación emocional',
        opcion_d: 'Supresión de sentimientos',
        respuesta_correcta: 'A'
      },
      {
        pregunta: 'Explica la relación entre inteligencia emocional y prevención de recaídas.',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: 'Describe estrategias para desarrollar la autoconciencia emocional en pacientes con adicciones.',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: '¿Cómo se puede mejorar la regulación emocional en el tratamiento de adicciones?',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: 'Explica la importancia de la empatía en el proceso de recuperación.',
        tipo: 'texto_libre',
        respuesta_correcta: null
      },
      {
        pregunta: '¿Qué papel juegan las habilidades sociales en la prevención de adicciones?',
        tipo: 'texto_libre',
        respuesta_correcta: null
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
    
    // Insertar las preguntas una por una para mejor control de errores
    let preguntasExitosas = 0;
    
    for (let i = 0; i < moduleData.preguntas.length; i++) {
      const pregunta = moduleData.preguntas[i];
      
      const preguntaData = {
        cuestionario_id: cuestionario.id,
        leccion_id: leccionId,
        pregunta: pregunta.pregunta,
        tipo: pregunta.tipo,
        orden: i + 1,
        explicacion: `Pregunta ${i + 1} del módulo ${moduleNum}`
      };
      
      // Agregar opciones y respuesta correcta según el tipo
      if (pregunta.tipo === 'seleccion_multiple') {
        preguntaData.opcion_a = pregunta.opcion_a;
        preguntaData.opcion_b = pregunta.opcion_b;
        preguntaData.opcion_c = pregunta.opcion_c;
        preguntaData.opcion_d = pregunta.opcion_d;
        preguntaData.respuesta_correcta = pregunta.respuesta_correcta;
      } else if (pregunta.tipo === 'texto_libre') {
        preguntaData.respuesta_correcta = null; // Para preguntas de texto libre
      }
      
      const { data: preguntaInsertada, error: preguntaError } = await supabase
        .from('preguntas')
        .insert(preguntaData)
        .select();
      
      if (preguntaError) {
        console.error(`❌ Error insertando pregunta ${i + 1}:`, preguntaError);
      } else {
        preguntasExitosas++;
        console.log(`✅ Pregunta ${i + 1} insertada exitosamente`);
      }
    }
    
    console.log(`📊 ${preguntasExitosas}/${moduleData.preguntas.length} preguntas insertadas para el Módulo ${moduleNum}`);
    return preguntasExitosas > 0;
    
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
    }
    console.log(''); // Línea en blanco para separar módulos
  }
  
  console.log('🎉 PROCESO COMPLETADO');
  console.log(`✅ ${exitosos}/5 módulos procesados exitosamente`);
}

createAllQuizzes();