const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkPreguntasStructure() {
  console.log('🔍 Verificando estructura detallada de la tabla preguntas...\n');
  
  try {
    // Obtener una pregunta existente para ver la estructura
    const { data: preguntas, error } = await supabase
      .from('preguntas')
      .select('*')
      .limit(3);
    
    if (error) {
      console.error('❌ Error obteniendo preguntas:', error);
      return;
    }
    
    if (preguntas && preguntas.length > 0) {
      console.log('📋 Estructura de preguntas existentes:');
      preguntas.forEach((pregunta, index) => {
        console.log(`\n--- Pregunta ${index + 1} ---`);
        console.log('ID:', pregunta.id);
        console.log('Pregunta:', pregunta.pregunta?.substring(0, 100) + '...');
        console.log('Tipo:', pregunta.tipo);
        console.log('Respuesta correcta:', pregunta.respuesta_correcta, '(longitud:', pregunta.respuesta_correcta?.length, ')');
        console.log('Opción A:', pregunta.opcion_a);
        console.log('Opción B:', pregunta.opcion_b);
        console.log('Opción C:', pregunta.opcion_c);
        console.log('Opción D:', pregunta.opcion_d);
        console.log('Explicación:', pregunta.explicacion?.substring(0, 50) + '...');
      });
    }
    
    // Intentar insertar una pregunta de prueba para ver qué campos fallan
    console.log('\n🧪 Probando inserción de pregunta de prueba...');
    
    const preguntaPrueba = {
      cuestionario_id: null, // Lo dejamos null para que falle antes
      leccion_id: 'f86d4f76-90c9-42aa-91c1-7e8fca2dfcb0',
      pregunta: 'Pregunta de prueba',
      tipo: 'seleccion_multiple',
      orden: 1,
      opcion_a: 'Opción A',
      opcion_b: 'Opción B', 
      opcion_c: 'Opción C',
      opcion_d: 'Opción D',
      respuesta_correcta: 'A', // Solo 1 carácter
      explicacion: 'Explicación de prueba'
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('preguntas')
      .insert(preguntaPrueba)
      .select();
    
    if (insertError) {
      console.log('❌ Error esperado en inserción:', insertError);
      console.log('📝 Esto nos ayuda a entender las restricciones de la tabla');
    } else {
      console.log('✅ Inserción exitosa (inesperado):', insertResult);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkPreguntasStructure();