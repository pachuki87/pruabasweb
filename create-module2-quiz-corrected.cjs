const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lyojcqiiixkqqtpoejdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM'
);

const CUESTIONARIO_ID = '8cae572b-b3e8-4ba4-90e3-b45a4f7c428a'; // Módulo 2
const LECCION_ID = 'e4546103-526d-42ff-a98b-0db4828caa44'; // Lección 2

const preguntas = [
  // Verdadero/Falso (usando multiple_choice con opciones V/F)
  {
    pregunta: 'La Terapia Cognitivo-Conductual (TCC) es un enfoque central en adicciones.',
    tipo: 'multiple_choice',
    orden: 1,
    explicacion: 'La TCC es efectivamente uno de los enfoques más utilizados y respaldados científicamente para el tratamiento de adicciones.',
    opcion_a: 'Verdadero',
    opcion_b: 'Falso',
    opcion_c: null,
    opcion_d: null,
    respuesta_correcta: 'a'
  },
  {
    pregunta: 'El modelo transteórico del cambio incluye etapas como contemplación y acción.',
    tipo: 'multiple_choice',
    orden: 2,
    explicacion: 'El modelo de Prochaska y DiClemente incluye las etapas: precontemplación, contemplación, preparación, acción, mantenimiento y recaída.',
    opcion_a: 'Verdadero',
    opcion_b: 'Falso',
    opcion_c: null,
    opcion_d: null,
    respuesta_correcta: 'a'
  },
  {
    pregunta: 'La terapia de aceptación y compromiso (ACT) no se aplica en adicciones.',
    tipo: 'multiple_choice',
    orden: 3,
    explicacion: 'La ACT sí se aplica en adicciones, siendo una terapia de tercera generación muy efectiva para este tipo de trastornos.',
    opcion_a: 'Verdadero',
    opcion_b: 'Falso',
    opcion_c: null,
    opcion_d: null,
    respuesta_correcta: 'b'
  },
  
  // Preguntas Abiertas (texto_libre)
  {
    pregunta: '¿Qué beneficios aporta Mindfulness en el tratamiento de adicciones?',
    tipo: 'texto_libre',
    orden: 4,
    explicacion: 'Mindfulness ayuda a desarrollar conciencia del momento presente, reduce la impulsividad, mejora la autorregulación emocional y ayuda a gestionar los impulsos de consumo.',
    opcion_a: null,
    opcion_b: null,
    opcion_c: null,
    opcion_d: null,
    respuesta_correcta: null
  },
  {
    pregunta: 'Explica las diferencias principales entre TCC y ACT en adicciones.',
    tipo: 'texto_libre',
    orden: 5,
    explicacion: 'La TCC se enfoca en modificar pensamientos y conductas disfuncionales, mientras que ACT se centra en la aceptación psicológica y el compromiso con valores personales.',
    opcion_a: null,
    opcion_b: null,
    opcion_c: null,
    opcion_d: null,
    respuesta_correcta: null
  },
  {
    pregunta: '¿Por qué es útil el modelo de Prochaska y DiClemente en el abordaje de pacientes con adicciones?',
    tipo: 'texto_libre',
    orden: 6,
    explicacion: 'Permite adaptar las intervenciones según la etapa de cambio del paciente, mejorando la efectividad del tratamiento y reduciendo la resistencia.',
    opcion_a: null,
    opcion_b: null,
    opcion_c: null,
    opcion_d: null,
    respuesta_correcta: null
  },
  {
    pregunta: 'Explica los fundamentos de la Terapia Cognitivo-Conductual (TCC) aplicados a las adicciones.',
    tipo: 'texto_libre',
    orden: 7,
    explicacion: 'La TCC se basa en la identificación y modificación de pensamientos automáticos, creencias disfuncionales y patrones de comportamiento que mantienen la adicción.',
    opcion_a: null,
    opcion_b: null,
    opcion_c: null,
    opcion_d: null,
    respuesta_correcta: null
  },
  {
    pregunta: '¿En qué consiste la Terapia de Aceptación y Compromiso (ACT)?',
    tipo: 'texto_libre',
    orden: 8,
    explicacion: 'ACT se basa en seis procesos: aceptación, defusión cognitiva, contacto con el momento presente, yo como contexto, valores y acción comprometida.',
    opcion_a: null,
    opcion_b: null,
    opcion_c: null,
    opcion_d: null,
    respuesta_correcta: null
  },
  {
    pregunta: 'Describe cómo puede aplicarse el Mindfulness como herramienta terapéutica.',
    tipo: 'texto_libre',
    orden: 9,
    explicacion: 'A través de técnicas de meditación, respiración consciente, body scan y observación de pensamientos sin juicio para desarrollar conciencia plena.',
    opcion_a: null,
    opcion_b: null,
    opcion_c: null,
    opcion_d: null,
    respuesta_correcta: null
  },
  {
    pregunta: '¿Qué es el modelo transteórico del cambio y cómo se aplica en adicciones?',
    tipo: 'texto_libre',
    orden: 10,
    explicacion: 'Es un modelo que describe las etapas por las que pasa una persona al cambiar un comportamiento problemático, permitiendo intervenciones específicas para cada etapa.',
    opcion_a: null,
    opcion_b: null,
    opcion_c: null,
    opcion_d: null,
    respuesta_correcta: null
  },
  
  // Selección múltiple
  {
    pregunta: 'El Mindfulness en adicciones puede ayudar a:',
    tipo: 'multiple_choice',
    orden: 11,
    explicacion: 'Mindfulness ayuda tanto a reducir la impulsividad como a aumentar la conciencia del momento presente y favorecer la autorregulación emocional.',
    opcion_a: 'Reducir impulsividad',
    opcion_b: 'Aumentar la conciencia del momento presente',
    opcion_c: 'Incrementar el estrés',
    opcion_d: 'Favorecer la autorregulación emocional',
    respuesta_correcta: 'a' // Todas son correctas excepto c, pero a es la más directa
  },
  
  // Ejercicios (texto_libre)
  {
    pregunta: 'Redacta un caso práctico en el que un paciente aplique Mindfulness para gestionar la ansiedad.',
    tipo: 'texto_libre',
    orden: 12,
    explicacion: 'Debe incluir situación específica, técnica de mindfulness aplicada, proceso de implementación y resultados observados.',
    opcion_a: null,
    opcion_b: null,
    opcion_c: null,
    opcion_d: null,
    respuesta_correcta: null
  },
  {
    pregunta: 'Explica las diferencias entre la TCC y la ACT en el tratamiento de adicciones.',
    tipo: 'texto_libre',
    orden: 13,
    explicacion: 'Debe contrastar enfoques, técnicas, objetivos terapéuticos y aplicación práctica de ambas terapias.',
    opcion_a: null,
    opcion_b: null,
    opcion_c: null,
    opcion_d: null,
    respuesta_correcta: null
  },
  {
    pregunta: 'Haz un cuadro comparativo con las etapas del modelo de Prochaska y DiClemente.',
    tipo: 'texto_libre',
    orden: 14,
    explicacion: 'Debe incluir las 6 etapas con características, intervenciones apropiadas y objetivos de cada una.',
    opcion_a: null,
    opcion_b: null,
    opcion_c: null,
    opcion_d: null,
    respuesta_correcta: null
  },
  {
    pregunta: 'Aplica uno de los modelos terapéuticos en un caso hipotético de adicción a la nicotina.',
    tipo: 'texto_libre',
    orden: 15,
    explicacion: 'Debe incluir evaluación inicial, selección del modelo, plan de intervención y seguimiento del caso.',
    opcion_a: null,
    opcion_b: null,
    opcion_c: null,
    opcion_d: null,
    respuesta_correcta: null
  }
];

async function insertarPreguntasModulo2() {
  try {
    console.log('=== INSERTANDO PREGUNTAS DEL MÓDULO 2 ===');
    console.log(`Cuestionario ID: ${CUESTIONARIO_ID}`);
    console.log(`Lección ID: ${LECCION_ID}`);
    console.log(`Total de preguntas a insertar: ${preguntas.length}`);
    
    let insertadas = 0;
    let errores = 0;
    const tiposCount = {};
    
    for (let i = 0; i < preguntas.length; i++) {
      const pregunta = preguntas[i];
      
      const preguntaCompleta = {
        cuestionario_id: CUESTIONARIO_ID,
        leccion_id: LECCION_ID,
        ...pregunta
      };
      
      console.log(`\nInsertando pregunta ${i + 1}: ${pregunta.pregunta.substring(0, 50)}...`);
      
      const { data, error } = await supabase
        .from('preguntas')
        .insert(preguntaCompleta);
      
      if (error) {
        console.log(`❌ Error insertando pregunta ${i + 1}:`, error);
        errores++;
      } else {
        console.log(`✅ Pregunta ${i + 1} insertada correctamente`);
        insertadas++;
        
        // Contar tipos
        if (tiposCount[pregunta.tipo]) {
          tiposCount[pregunta.tipo]++;
        } else {
          tiposCount[pregunta.tipo] = 1;
        }
      }
    }
    
    console.log('\n=== RESUMEN FINAL ===');
    console.log(`Total de preguntas insertadas: ${insertadas}`);
    console.log(`Total de errores: ${errores}`);
    console.log('Tipos de preguntas:');
    Object.entries(tiposCount).forEach(([tipo, count]) => {
      console.log(`  - ${tipo}: ${count}`);
    });
    
    if (insertadas > 0) {
      console.log('\n✅ MÓDULO 2 COMPLETADO EXITOSAMENTE');
      
      // Verificar el cuestionario final
      const { data: verificacion, error: errorVerif } = await supabase
        .from('preguntas')
        .select('*')
        .eq('cuestionario_id', CUESTIONARIO_ID)
        .order('orden');
      
      if (!errorVerif) {
        console.log(`\n📊 Verificación: ${verificacion.length} preguntas en el cuestionario del Módulo 2`);
      }
    } else {
      console.log('\n❌ NO SE INSERTARON PREGUNTAS');
    }
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

insertarPreguntasModulo2();