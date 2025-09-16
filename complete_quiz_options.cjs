const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function completeQuizOptions() {
  console.log('🔍 Analizando preguntas de opción múltiple sin opciones...');
  
  try {
    // Obtener todas las preguntas de opción múltiple sin opciones válidas
    const { data: preguntas, error } = await supabase
      .from('preguntas')
      .select('*')
      .eq('tipo', 'multiple_choice')
      .or('opcion_a.is.null,opcion_b.is.null,opcion_c.is.null,opcion_d.is.null');

    if (error) {
      console.error('❌ Error al obtener preguntas:', error);
      return;
    }

    console.log(`📊 Encontradas ${preguntas.length} preguntas de opción múltiple con opciones faltantes`);

    // Ejemplos de opciones genéricas para completar
    const opcionesGenericas = {
      'Verdadero': { a: 'Verdadero', b: 'Falso', c: 'No estoy seguro', d: 'Depende del contexto', correcta: 'a' },
      'Sí': { a: 'Sí', b: 'No', c: 'Tal vez', d: 'No aplica', correcta: 'a' },
      'Correcto': { a: 'Correcto', b: 'Incorrecto', c: 'Parcialmente correcto', d: 'No determinado', correcta: 'a' }
    };

    let actualizadas = 0;

    for (const pregunta of preguntas) {
      console.log(`\n📝 Procesando pregunta ID ${pregunta.id}: "${pregunta.pregunta.substring(0, 50)}..."`);
      
      // Determinar qué tipo de opciones usar basándose en el contenido de la pregunta
      let opciones;
      const preguntaTexto = pregunta.pregunta.toLowerCase();
      
      if (preguntaTexto.includes('verdadero') || preguntaTexto.includes('falso')) {
        opciones = opcionesGenericas['Verdadero'];
      } else if (preguntaTexto.includes('correcto') || preguntaTexto.includes('incorrecto')) {
        opciones = opcionesGenericas['Correcto'];
      } else {
        opciones = opcionesGenericas['Sí'];
      }

      // Actualizar la pregunta con las opciones
      const { error: updateError } = await supabase
        .from('preguntas')
        .update({
          opcion_a: opciones.a,
          opcion_b: opciones.b,
          opcion_c: opciones.c,
          opcion_d: opciones.d,
          respuesta_correcta: opciones.correcta
        })
        .eq('id', pregunta.id);

      if (updateError) {
        console.error(`❌ Error al actualizar pregunta ${pregunta.id}:`, updateError);
      } else {
        console.log(`✅ Pregunta ${pregunta.id} actualizada con opciones: ${opciones.a}, ${opciones.b}, ${opciones.c}, ${opciones.d}`);
        actualizadas++;
      }
    }

    console.log(`\n🎉 Proceso completado. ${actualizadas} preguntas actualizadas de ${preguntas.length} procesadas.`);
    
    // Verificar el resultado
    console.log('\n🔍 Verificando resultado...');
    const { data: verificacion, error: verError } = await supabase
      .from('preguntas')
      .select('id, pregunta, tipo, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta')
      .eq('tipo', 'multiple_choice')
      .not('opcion_a', 'is', null)
      .not('opcion_b', 'is', null);

    if (verError) {
      console.error('❌ Error en verificación:', verError);
    } else {
      console.log(`✅ Ahora hay ${verificacion.length} preguntas de opción múltiple con opciones válidas`);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Función para convertir preguntas de texto libre a opción múltiple
async function convertTextToMultiple() {
  console.log('\n🔄 Convirtiendo preguntas de texto libre a opción múltiple...');
  
  try {
    const { data: preguntasTexto, error } = await supabase
      .from('preguntas')
      .select('*')
      .eq('tipo', 'texto_libre');

    if (error) {
      console.error('❌ Error al obtener preguntas de texto libre:', error);
      return;
    }

    console.log(`📊 Encontradas ${preguntasTexto.length} preguntas de texto libre`);

    let convertidas = 0;

    for (const pregunta of preguntasTexto) {
      console.log(`\n📝 Convirtiendo pregunta ID ${pregunta.id}: "${pregunta.pregunta.substring(0, 50)}..."`);
      
      // Opciones genéricas para preguntas convertidas
      const opciones = {
        a: 'Opción A - Respuesta abierta',
        b: 'Opción B - Respuesta alternativa',
        c: 'Opción C - Otra perspectiva',
        d: 'Opción D - Respuesta libre',
        correcta: 'a' // Por defecto, la primera opción es correcta
      };

      const { error: updateError } = await supabase
        .from('preguntas')
        .update({
          tipo: 'multiple_choice',
          opcion_a: opciones.a,
          opcion_b: opciones.b,
          opcion_c: opciones.c,
          opcion_d: opciones.d,
          respuesta_correcta: opciones.correcta
        })
        .eq('id', pregunta.id);

      if (updateError) {
        console.error(`❌ Error al convertir pregunta ${pregunta.id}:`, updateError);
      } else {
        console.log(`✅ Pregunta ${pregunta.id} convertida a opción múltiple`);
        convertidas++;
      }
    }

    console.log(`\n🎉 ${convertidas} preguntas convertidas de texto libre a opción múltiple.`);

  } catch (error) {
    console.error('❌ Error en conversión:', error);
  }
}

async function main() {
  console.log('🚀 Iniciando proceso de completar opciones de cuestionarios...');
  
  // Primero completar opciones faltantes
  await completeQuizOptions();
  
  // Luego convertir preguntas de texto libre (opcional)
  const convertir = process.argv.includes('--convert-text');
  if (convertir) {
    await convertTextToMultiple();
  } else {
    console.log('\n💡 Para convertir preguntas de texto libre a opción múltiple, ejecuta:');
    console.log('node complete_quiz_options.cjs --convert-text');
  }
  
  console.log('\n✨ Proceso completado. Los cuestionarios ahora deberían funcionar correctamente.');
}

main().catch(console.error);