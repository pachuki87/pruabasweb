const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function verifyMasterUpdates() {
  try {
    console.log('🔍 Verificando actualizaciones en cuestionarios del Máster...');
    
    // IDs de los cuestionarios del Máster
    const quizIds = ['7a52daad-db71-4cb5-8701-967fffbb6966', '73571904-d8e5-41ee-9485-60d4996819a8'];
    
    // Obtener todas las preguntas del Máster
    const { data: preguntas, error } = await supabase
      .from('preguntas')
      .select('id, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, cuestionario_id')
      .in('cuestionario_id', quizIds)
      .order('cuestionario_id');
    
    if (error) {
      console.error('❌ Error al obtener preguntas:', error);
      return;
    }
    
    console.log(`📊 Total de preguntas encontradas: ${preguntas?.length || 0}`);
    
    if (!preguntas || preguntas.length === 0) {
      console.log('❌ No se encontraron preguntas');
      return;
    }
    
    let preguntasConOpciones = 0;
    let preguntasSinOpciones = 0;
    
    console.log('\n📝 Estado de las preguntas:');
    
    preguntas.forEach((pregunta, index) => {
      const tieneOpciones = pregunta.opcion_a && pregunta.opcion_b && pregunta.opcion_c && pregunta.opcion_d;
      
      console.log(`\n${index + 1}. ${pregunta.pregunta?.substring(0, 60)}...`);
      console.log(`   - ID: ${pregunta.id}`);
      console.log(`   - Cuestionario: ${pregunta.cuestionario_id}`);
      console.log(`   - Tiene opciones: ${tieneOpciones ? '✅ SÍ' : '❌ NO'}`);
      
      if (tieneOpciones) {
        preguntasConOpciones++;
        console.log(`   - A) ${pregunta.opcion_a}`);
        console.log(`   - B) ${pregunta.opcion_b}`);
        console.log(`   - C) ${pregunta.opcion_c}`);
        console.log(`   - D) ${pregunta.opcion_d}`);
        console.log(`   - Respuesta correcta: ${pregunta.respuesta_correcta}`);
      } else {
        preguntasSinOpciones++;
        console.log(`   - opcion_a: ${pregunta.opcion_a || 'null'}`);
        console.log(`   - opcion_b: ${pregunta.opcion_b || 'null'}`);
        console.log(`   - opcion_c: ${pregunta.opcion_c || 'null'}`);
        console.log(`   - opcion_d: ${pregunta.opcion_d || 'null'}`);
        console.log(`   - respuesta_correcta: ${pregunta.respuesta_correcta || 'null'}`);
      }
    });
    
    console.log(`\n📊 Resumen:`);
    console.log(`✅ Preguntas con opciones: ${preguntasConOpciones}`);
    console.log(`❌ Preguntas sin opciones: ${preguntasSinOpciones}`);
    
    if (preguntasConOpciones > 0) {
      console.log('\n🎉 ¡Los cuestionarios del Máster en Adicciones están funcionando!');
    } else {
      console.log('\n⚠️  Los cuestionarios aún necesitan reparación');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verifyMasterUpdates();