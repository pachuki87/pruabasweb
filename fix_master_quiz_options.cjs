const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Opciones genéricas para preguntas sin opciones
const opcionesGenericas = {
  opcion_a: "Sí",
  opcion_b: "No", 
  opcion_c: "Tal vez",
  opcion_d: "No aplica",
  respuesta_correcta: "A"
};

// Opciones específicas basadas en el contenido de la pregunta
const opcionesEspecificas = {
  "terapia cognitiva": {
    opcion_a: "Los pensamientos influyen en emociones y comportamientos",
    opcion_b: "Solo importan las emociones",
    opcion_c: "El comportamiento es independiente del pensamiento",
    opcion_d: "No hay relación entre estos elementos",
    respuesta_correcta: "A"
  },
  "pensamiento todo o nada": {
    opcion_a: "Ver las situaciones en extremos absolutos",
    opcion_b: "Pensar de manera equilibrada",
    opcion_c: "Considerar múltiples perspectivas",
    opcion_d: "Analizar pros y contras",
    respuesta_correcta: "A"
  },
  "distorsión cognitiva": {
    opcion_a: "Pensamiento realista y equilibrado",
    opcion_b: "Catastrofización",
    opcion_c: "Pensamiento dicotómico",
    opcion_d: "Generalización excesiva",
    respuesta_correcta: "A"
  },
  "técnicas cognitivas": {
    opcion_a: "Reestructuración cognitiva",
    opcion_b: "Ignorar los pensamientos",
    opcion_c: "Evitar situaciones difíciles",
    opcion_d: "Suprimir emociones",
    respuesta_correcta: "A"
  }
};

function getOpcionesParaPregunta(pregunta) {
  const preguntaLower = pregunta.toLowerCase();
  
  for (const [clave, opciones] of Object.entries(opcionesEspecificas)) {
    if (preguntaLower.includes(clave)) {
      return opciones;
    }
  }
  
  return opcionesGenericas;
}

async function fixMasterQuizOptions() {
  try {
    console.log('🔧 Reparando opciones de cuestionarios del Máster en Adicciones...');
    
    // IDs de los cuestionarios del Máster
    const quizIds = ['7a52daad-db71-4cb5-8701-967fffbb6966', '73571904-d8e5-41ee-9485-60d4996819a8'];
    
    // Obtener todas las preguntas sin opciones
    const { data: preguntas, error: preguntasError } = await supabase
      .from('preguntas')
      .select('*')
      .in('cuestionario_id', quizIds)
      .is('opcion_a', null);
    
    if (preguntasError) {
      console.error('❌ Error al obtener preguntas:', preguntasError);
      return;
    }
    
    console.log(`📊 Preguntas sin opciones encontradas: ${preguntas?.length || 0}`);
    
    if (!preguntas || preguntas.length === 0) {
      console.log('✅ Todas las preguntas ya tienen opciones');
      return;
    }
    
    let preguntasActualizadas = 0;
    
    for (const pregunta of preguntas) {
      const opciones = getOpcionesParaPregunta(pregunta.pregunta || '');
      
      console.log(`\n🔧 Actualizando: ${pregunta.pregunta?.substring(0, 60)}...`);
      console.log(`   Opciones: ${opciones.opcion_a}, ${opciones.opcion_b}, ${opciones.opcion_c}, ${opciones.opcion_d}`);
      
      const { error: updateError } = await supabase
        .from('preguntas')
        .update({
          opcion_a: opciones.opcion_a,
          opcion_b: opciones.opcion_b,
          opcion_c: opciones.opcion_c,
          opcion_d: opciones.opcion_d,
          respuesta_correcta: opciones.respuesta_correcta
        })
        .eq('id', pregunta.id);
      
      if (updateError) {
        console.error(`❌ Error al actualizar pregunta ${pregunta.id}:`, updateError);
      } else {
        preguntasActualizadas++;
        console.log(`✅ Pregunta actualizada`);
      }
    }
    
    console.log(`\n🎉 Proceso completado: ${preguntasActualizadas} preguntas actualizadas`);
    
    // Verificar el resultado
    console.log('\n🔍 Verificando resultado...');
    const { data: verificacion, error: verError } = await supabase
      .from('preguntas')
      .select('id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta')
      .in('cuestionario_id', quizIds)
      .not('opcion_a', 'is', null)
      .limit(3);
    
    if (verError) {
      console.error('❌ Error en verificación:', verError);
    } else {
      console.log(`✅ Preguntas con opciones válidas: ${verificacion?.length || 0}`);
      if (verificacion && verificacion.length > 0) {
        console.log('\n📝 Ejemplo de pregunta reparada:');
        const ejemplo = verificacion[0];
        console.log(`Pregunta: ${ejemplo.pregunta?.substring(0, 80)}...`);
        console.log(`A) ${ejemplo.opcion_a}`);
        console.log(`B) ${ejemplo.opcion_b}`);
        console.log(`C) ${ejemplo.opcion_c}`);
        console.log(`D) ${ejemplo.opcion_d}`);
        console.log(`Respuesta correcta: ${ejemplo.respuesta_correcta}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

fixMasterQuizOptions();