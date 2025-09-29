const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Usar la clave de servicio para evitar RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarConstraints() {
  console.log('🔍 Verificando constraints de la tabla preguntas...');

  // Obtener información sobre las constraints de la tabla preguntas
  const { data, error } = await supabase
    .rpc('get_table_constraints', { table_name: 'preguntas' })
    .select();

  if (error) {
    console.error('Error obteniendo constraints:', error);
    
    // Intentar obtener preguntas existentes para ver el patrón
    console.log('\n📋 Obteniendo preguntas existentes para analizar el patrón...');
    
    const { data: preguntas, error: errorPreguntas } = await supabase
      .from('preguntas')
      .select('*')
      .limit(10);

    if (errorPreguntas) {
      console.error('Error obteniendo preguntas:', errorPreguntas);
    } else {
      console.log(`\n📊 Preguntas encontradas: ${preguntas.length}`);
      preguntas.forEach((pregunta, index) => {
        console.log(`\n--- Pregunta ${index + 1} ---`);
        console.log(`ID: ${pregunta.id}`);
        console.log(`Tipo: ${pregunta.tipo}`);
        console.log(`Respuesta correcta: "${pregunta.respuesta_correcta}"`);
        console.log(`Longitud respuesta: ${pregunta.respuesta_correcta ? pregunta.respuesta_correcta.length : 'null'}`);
        console.log(`Opciones: A="${pregunta.opcion_a}", B="${pregunta.opcion_b}", C="${pregunta.opcion_c}", D="${pregunta.opcion_d}"`);
      });
    }
  } else {
    console.log('Constraints obtenidas:', data);
  }

  // Probar diferentes valores para respuesta_correcta
  console.log('\n🧪 Probando diferentes valores para respuesta_correcta...');
  
  const valoresPrueba = ['A', 'B', 'C', 'D', 'a', 'b', 'c', 'd', '1', '2', '3', '4'];
  
  for (const valor of valoresPrueba) {
    try {
      const { data, error } = await supabase
        .from('preguntas')
        .insert({
          cuestionario_id: '00000000-0000-0000-0000-000000000000', // UUID dummy
          pregunta: 'Pregunta de prueba',
          tipo: 'seleccion_multiple',
          orden: 1,
          opcion_a: 'Opción A',
          opcion_b: 'Opción B',
          opcion_c: 'Opción C',
          opcion_d: 'Opción D',
          respuesta_correcta: valor
        })
        .select();

      if (error) {
        console.log(`❌ Valor "${valor}": ${error.message}`);
      } else {
        console.log(`✅ Valor "${valor}": VÁLIDO`);
        // Eliminar la pregunta de prueba
        await supabase.from('preguntas').delete().eq('id', data[0].id);
      }
    } catch (err) {
      console.log(`❌ Valor "${valor}": ${err.message}`);
    }
  }
}

async function main() {
  await verificarConstraints();
}

main().catch(console.error);