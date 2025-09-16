const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function verifyQuizFix() {
  console.log('🔍 Verificando el estado final de los cuestionarios...');
  
  try {
    // Verificar cuestionarios
    const { data: cuestionarios, error: quizError } = await supabase
      .from('cuestionarios')
      .select('id, titulo, curso_id');

    if (quizError) {
      console.error('❌ Error al obtener cuestionarios:', quizError);
      return;
    }

    console.log(`📊 Total de cuestionarios: ${cuestionarios.length}`);

    // Verificar preguntas por tipo
    const { data: preguntas, error: pregError } = await supabase
      .from('preguntas')
      .select('id, tipo, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, cuestionario_id');

    if (pregError) {
      console.error('❌ Error al obtener preguntas:', pregError);
      return;
    }

    console.log(`📊 Total de preguntas: ${preguntas.length}`);

    // Analizar por tipo
    const tiposPreguntas = {};
    const preguntasValidas = [];
    const preguntasInvalidas = [];

    preguntas.forEach(pregunta => {
      tiposPreguntas[pregunta.tipo] = (tiposPreguntas[pregunta.tipo] || 0) + 1;
      
      if (pregunta.tipo === 'multiple_choice') {
        // Verificar que tenga opciones válidas
        if (pregunta.opcion_a && pregunta.opcion_b && pregunta.opcion_c && pregunta.opcion_d && pregunta.respuesta_correcta) {
          preguntasValidas.push(pregunta);
        } else {
          preguntasInvalidas.push(pregunta);
        }
      } else if (pregunta.tipo === 'texto_libre') {
        // Las preguntas de texto libre son válidas por defecto
        preguntasValidas.push(pregunta);
      }
    });

    console.log('\n📈 Distribución por tipo de pregunta:');
    Object.entries(tiposPreguntas).forEach(([tipo, cantidad]) => {
      console.log(`  ${tipo}: ${cantidad} preguntas`);
    });

    console.log(`\n✅ Preguntas válidas: ${preguntasValidas.length}`);
    console.log(`❌ Preguntas inválidas: ${preguntasInvalidas.length}`);

    if (preguntasInvalidas.length > 0) {
      console.log('\n⚠️  Preguntas inválidas encontradas:');
      preguntasInvalidas.forEach(p => {
        console.log(`  - ID: ${p.id} | Tipo: ${p.tipo} | Pregunta: "${p.pregunta.substring(0, 50)}..."`);
      });
    }

    // Verificar cuestionarios con preguntas válidas
    const cuestionariosConPreguntas = {};
    preguntasValidas.forEach(pregunta => {
      if (!cuestionariosConPreguntas[pregunta.cuestionario_id]) {
        cuestionariosConPreguntas[pregunta.cuestionario_id] = 0;
      }
      cuestionariosConPreguntas[pregunta.cuestionario_id]++;
    });

    console.log('\n📋 Cuestionarios con preguntas válidas:');
    cuestionarios.forEach(cuestionario => {
      const numPreguntas = cuestionariosConPreguntas[cuestionario.id] || 0;
      const estado = numPreguntas > 0 ? '✅' : '❌';
      console.log(`  ${estado} ${cuestionario.titulo}: ${numPreguntas} preguntas válidas`);
    });

    // Resumen final
    const cuestionariosFuncionales = Object.keys(cuestionariosConPreguntas).length;
    const porcentajeExito = ((preguntasValidas.length / preguntas.length) * 100).toFixed(1);
    
    console.log('\n🎉 RESUMEN FINAL:');
    console.log(`📊 ${cuestionarios.length} cuestionarios totales`);
    console.log(`✅ ${cuestionariosFuncionales} cuestionarios funcionales`);
    console.log(`📝 ${preguntas.length} preguntas totales`);
    console.log(`✅ ${preguntasValidas.length} preguntas válidas (${porcentajeExito}%)`);
    console.log(`❌ ${preguntasInvalidas.length} preguntas inválidas`);

    if (preguntasValidas.length > 0) {
      console.log('\n🎊 ¡Los cuestionarios ahora deberían funcionar correctamente!');
      console.log('💡 Puedes probar los cuestionarios en la interfaz web.');
    } else {
      console.log('\n⚠️  Aún hay problemas que resolver.');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verifyQuizFix().catch(console.error);