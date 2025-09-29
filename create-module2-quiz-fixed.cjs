const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lyojcqiiixkqqtpoejdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM'
);

async function createModule2Questions() {
  try {
    console.log('=== CREANDO PREGUNTAS MÓDULO 2 ===');
    
    // Buscar el cuestionario del Módulo 2
    const { data: quiz, error: quizError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('titulo', 'MÓDULO 2 – Terapia cognitiva de las drogodependencias')
      .single();
    
    if (quizError) {
      console.log('Error encontrando cuestionario:', quizError);
      return;
    }
    
    console.log('Cuestionario encontrado:', quiz.titulo);
    console.log('ID del cuestionario:', quiz.id);
    
    // Definir las preguntas del Módulo 2 con estructura correcta
    const preguntas = [
      // VERDADERO/FALSO
      {
        pregunta: "La Terapia Cognitivo-Conductual (TCC) es un enfoque central en adicciones.",
        tipo: "verdadero_falso",
        opcion_a: "Verdadero",
        opcion_b: "Falso",
        opcion_c: null,
        opcion_d: null,
        respuesta_correcta: "Verdadero",
        explicacion: "La TCC es efectivamente uno de los enfoques más utilizados y respaldados por evidencia en el tratamiento de adicciones.",
        orden: 1
      },
      {
        pregunta: "El modelo transteórico del cambio incluye etapas como contemplación y acción.",
        tipo: "verdadero_falso",
        opcion_a: "Verdadero",
        opcion_b: "Falso",
        opcion_c: null,
        opcion_d: null,
        respuesta_correcta: "Verdadero",
        explicacion: "El modelo de Prochaska y DiClemente incluye las etapas: precontemplación, contemplación, preparación, acción y mantenimiento.",
        orden: 2
      },
      {
        pregunta: "La terapia de aceptación y compromiso (ACT) no se aplica en adicciones.",
        tipo: "verdadero_falso",
        opcion_a: "Verdadero",
        opcion_b: "Falso",
        opcion_c: null,
        opcion_d: null,
        respuesta_correcta: "Falso",
        explicacion: "ACT sí se aplica en adicciones, enfocándose en la aceptación psicológica y el compromiso con valores personales.",
        orden: 3
      },
      
      // PREGUNTAS ABIERTAS
      {
        pregunta: "¿Qué beneficios aporta Mindfulness en el tratamiento de adicciones?",
        tipo: "texto_libre",
        opcion_a: null,
        opcion_b: null,
        opcion_c: null,
        opcion_d: null,
        respuesta_correcta: "Mindfulness aporta: reducción de la impulsividad, mayor conciencia del momento presente, mejor regulación emocional, reducción del estrés y la ansiedad, mayor capacidad de observar pensamientos y emociones sin reaccionar automáticamente, y desarrollo de estrategias de afrontamiento más saludables.",
        explicacion: "Mindfulness ayuda a desarrollar la capacidad de observar pensamientos y emociones sin juzgar, lo que es fundamental para romper patrones automáticos de consumo.",
        orden: 4
      },
      {
        pregunta: "Explica las diferencias principales entre TCC y ACT en adicciones.",
        tipo: "texto_libre",
        opcion_a: null,
        opcion_b: null,
        opcion_c: null,
        opcion_d: null,
        respuesta_correcta: "TCC se enfoca en identificar y cambiar pensamientos disfuncionales y comportamientos problemáticos. ACT se centra en la aceptación de pensamientos y emociones difíciles mientras se compromete con valores personales. TCC busca cambiar el contenido de los pensamientos, mientras ACT busca cambiar la relación con esos pensamientos.",
        explicacion: "Ambos enfoques son efectivos pero difieren en su filosofía: TCC busca el cambio cognitivo, ACT busca la flexibilidad psicológica.",
        orden: 5
      },
      {
        pregunta: "¿Por qué es útil el modelo de Prochaska y DiClemente en el abordaje de pacientes con adicciones?",
        tipo: "texto_libre",
        opcion_a: null,
        opcion_b: null,
        opcion_c: null,
        opcion_d: null,
        respuesta_correcta: "Es útil porque permite adaptar las intervenciones a la etapa específica de cambio del paciente, aumenta la motivación al reconocer el progreso gradual, ayuda a evitar resistencias al no forzar cambios prematuros, y proporciona un marco estructurado para evaluar la disposición al cambio.",
        explicacion: "Este modelo reconoce que el cambio es un proceso gradual y permite personalizar el tratamiento según la etapa del paciente.",
        orden: 6
      },
      {
        pregunta: "Explica los fundamentos de la Terapia Cognitivo-Conductual (TCC) aplicados a las adicciones.",
        tipo: "texto_libre",
        opcion_a: null,
        opcion_b: null,
        opcion_c: null,
        opcion_d: null,
        respuesta_correcta: "Los fundamentos incluyen: identificación de pensamientos automáticos relacionados con el consumo, reconocimiento de distorsiones cognitivas, reestructuración de pensamientos disfuncionales, desarrollo de habilidades de afrontamiento, prevención de recaídas mediante identificación de situaciones de riesgo, y modificación de comportamientos problemáticos a través de técnicas conductuales.",
        explicacion: "La TCC se basa en la premisa de que pensamientos, emociones y comportamientos están interconectados y pueden modificarse.",
        orden: 7
      },
      {
        pregunta: "¿En qué consiste la Terapia de Aceptación y Compromiso (ACT)?",
        tipo: "texto_libre",
        opcion_a: null,
        opcion_b: null,
        opcion_c: null,
        opcion_d: null,
        respuesta_correcta: "ACT consiste en desarrollar flexibilidad psicológica a través de seis procesos: aceptación de experiencias internas difíciles, defusión cognitiva (distanciarse de pensamientos), contacto con el momento presente (mindfulness), yo como contexto (perspectiva del observador), valores clarificados, y acción comprometida hacia esos valores.",
        explicacion: "ACT busca que las personas vivan de acuerdo a sus valores, incluso en presencia de pensamientos y emociones difíciles.",
        orden: 8
      },
      {
        pregunta: "Describe cómo puede aplicarse el Mindfulness como herramienta terapéutica.",
        tipo: "texto_libre",
        opcion_a: null,
        opcion_b: null,
        opcion_c: null,
        opcion_d: null,
        respuesta_correcta: "El Mindfulness se aplica mediante: práctica de meditación de atención plena, ejercicios de respiración consciente, técnicas de escaneo corporal, observación de pensamientos sin juzgar, desarrollo de la conciencia del momento presente, y aplicación de la atención plena en actividades cotidianas para prevenir el consumo automático.",
        explicacion: "Mindfulness desarrolla la capacidad de observar experiencias internas sin reaccionar automáticamente, fundamental en adicciones.",
        orden: 9
      },
      {
        pregunta: "¿Qué es el modelo transteórico del cambio y cómo se aplica en adicciones?",
        tipo: "texto_libre",
        opcion_a: null,
        opcion_b: null,
        opcion_c: null,
        opcion_d: null,
        respuesta_correcta: "Es un modelo que describe el cambio como un proceso que ocurre en etapas: precontemplación (no hay conciencia del problema), contemplación (reconocimiento del problema), preparación (intención de cambiar), acción (modificación activa del comportamiento), y mantenimiento (sostener el cambio). Se aplica adaptando las intervenciones a cada etapa específica del paciente.",
        explicacion: "Este modelo permite personalizar el tratamiento según la disposición al cambio del paciente, mejorando la efectividad.",
        orden: 10
      },
      
      // SELECCIÓN MÚLTIPLE
      {
        pregunta: "El Mindfulness en adicciones puede ayudar a:",
        tipo: "seleccion_multiple",
        opcion_a: "Reducir impulsividad",
        opcion_b: "Aumentar la conciencia del momento presente", 
        opcion_c: "Incrementar el estrés",
        opcion_d: "Favorecer la autorregulación emocional",
        respuesta_correcta: "A,B,D",
        explicacion: "Mindfulness ayuda con la impulsividad, conciencia presente y autorregulación. No incrementa el estrés, sino que lo reduce.",
        orden: 11
      },
      
      // EJERCICIOS
      {
        pregunta: "Redacta un caso práctico en el que un paciente aplique Mindfulness para gestionar la ansiedad.",
        tipo: "texto_libre",
        opcion_a: null,
        opcion_b: null,
        opcion_c: null,
        opcion_d: null,
        respuesta_correcta: "Caso: María, 35 años, experimenta ansiedad intensa que la lleva a consumir alcohol. Aplicación de Mindfulness: 1) Reconoce las sensaciones físicas de ansiedad (tensión, respiración acelerada), 2) Practica respiración consciente durante 5 minutos, 3) Observa sus pensamientos ansiosos sin juzgarlos, 4) Utiliza técnicas de grounding (5 cosas que ve, 4 que escucha, etc.), 5) Aplica autocompasión reconociendo que la ansiedad es temporal. Resultado: Logra gestionar la ansiedad sin recurrir al alcohol.",
        explicacion: "Este ejercicio integra técnicas de mindfulness específicas para el manejo de ansiedad en contexto de adicciones.",
        orden: 12
      },
      {
        pregunta: "Explica las diferencias entre la TCC y la ACT en el tratamiento de adicciones.",
        tipo: "texto_libre",
        opcion_a: null,
        opcion_b: null,
        opcion_c: null,
        opcion_d: null,
        respuesta_correcta: "TCC: Se enfoca en identificar y cambiar pensamientos disfuncionales ('No puedo vivir sin alcohol' → 'Puedo aprender estrategias de afrontamiento'). Utiliza reestructuración cognitiva y técnicas conductuales. ACT: Se enfoca en aceptar pensamientos difíciles sin luchar contra ellos, mientras se actúa según valores personales. Ejemplo: En TCC se cambiaría el pensamiento 'Necesito drogas para ser social', en ACT se aceptaría ese pensamiento pero se actuaría según el valor de conexión auténtica con otros.",
        explicacion: "La diferencia clave es que TCC busca cambiar pensamientos, ACT busca cambiar la relación con los pensamientos.",
        orden: 13
      },
      {
        pregunta: "Haz un cuadro comparativo con las etapas del modelo de Prochaska y DiClemente.",
        tipo: "texto_libre",
        opcion_a: null,
        opcion_b: null,
        opcion_c: null,
        opcion_d: null,
        respuesta_correcta: "ETAPAS DEL CAMBIO: 1) PRECONTEMPLACIÓN: No hay conciencia del problema, resistencia al cambio, intervención: información y concienciación. 2) CONTEMPLACIÓN: Reconoce el problema, ambivalencia, intervención: explorar pros/contras del cambio. 3) PREPARACIÓN: Intención de cambiar pronto, pequeños pasos, intervención: planificación específica. 4) ACCIÓN: Modificación activa del comportamiento, intervención: apoyo y refuerzo. 5) MANTENIMIENTO: Sostener el cambio, prevenir recaídas, intervención: estrategias de mantenimiento a largo plazo.",
        explicacion: "Cada etapa requiere intervenciones específicas adaptadas a la disposición al cambio del paciente.",
        orden: 14
      },
      {
        pregunta: "Aplica uno de los modelos terapéuticos en un caso hipotético de adicción a la nicotina.",
        tipo: "texto_libre",
        opcion_a: null,
        opcion_b: null,
        opcion_c: null,
        opcion_d: null,
        respuesta_correcta: "CASO: Juan, 45 años, fumador de 20 años. APLICACIÓN TCC: 1) Identificación de pensamientos automáticos ('Fumar me relaja', 'No puedo concentrarme sin cigarrillos'), 2) Análisis de situaciones desencadenantes (estrés laboral, café, alcohol), 3) Reestructuración cognitiva ('Puedo relajarme con respiración profunda', 'Mi concentración mejorará sin nicotina'), 4) Técnicas conductuales (reemplazo de rutinas, actividades alternativas), 5) Prevención de recaídas (plan para situaciones de riesgo), 6) Autorregistros de pensamientos y comportamientos.",
        explicacion: "La aplicación sistemática de TCC proporciona herramientas concretas para abordar tanto aspectos cognitivos como conductuales de la adicción.",
        orden: 15
      }
    ];
    
    console.log(`Insertando ${preguntas.length} preguntas...`);
    
    // Insertar las preguntas
    for (const pregunta of preguntas) {
      const { data, error } = await supabase
        .from('preguntas')
        .insert({
          cuestionario_id: quiz.id,
          pregunta: pregunta.pregunta,
          tipo: pregunta.tipo,
          opcion_a: pregunta.opcion_a,
          opcion_b: pregunta.opcion_b,
          opcion_c: pregunta.opcion_c,
          opcion_d: pregunta.opcion_d,
          respuesta_correcta: pregunta.respuesta_correcta,
          explicacion: pregunta.explicacion,
          orden: pregunta.orden,
          leccion_id: quiz.leccion_id
        });
      
      if (error) {
        console.log(`Error insertando pregunta ${pregunta.orden}:`, error);
      } else {
        console.log(`✅ Pregunta ${pregunta.orden} insertada: ${pregunta.pregunta.substring(0, 50)}...`);
      }
    }
    
    // Verificar inserción
    const { data: finalQuestions } = await supabase
      .from('preguntas')
      .select('*')
      .eq('cuestionario_id', quiz.id)
      .order('orden');
    
    console.log(`\n=== RESUMEN FINAL ===`);
    console.log(`Total de preguntas insertadas: ${finalQuestions.length}`);
    console.log('Tipos de preguntas:');
    
    const tiposCuenta = finalQuestions.reduce((acc, p) => {
      acc[p.tipo] = (acc[p.tipo] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(tiposCuenta).forEach(([tipo, cantidad]) => {
      console.log(`- ${tipo}: ${cantidad} preguntas`);
    });
    
    console.log('\n✅ MÓDULO 2 COMPLETADO EXITOSAMENTE');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createModule2Questions();