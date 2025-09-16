const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lyojcqiiixkqqtpoejdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM'
);

async function checkRespuestaCorrectaConstraint() {
  try {
    console.log('=== VERIFICANDO RESTRICCIONES DE RESPUESTA_CORRECTA ===');
    
    // Buscar todas las respuestas correctas existentes
    const { data: questions, error } = await supabase
      .from('preguntas')
      .select('respuesta_correcta, tipo')
      .not('respuesta_correcta', 'is', null);
    
    if (error) {
      console.log('Error:', error);
      return;
    }
    
    console.log('Respuestas correctas existentes:');
    questions.forEach((q, index) => {
      console.log(`${index + 1}. Tipo: "${q.tipo}", Respuesta: "${q.respuesta_correcta}" (longitud: ${q.respuesta_correcta ? q.respuesta_correcta.length : 0})`);
    });
    
    // Probar diferentes valores para respuesta_correcta
    const testValues = ['A', 'B', 'C', 'D', 'AB', 'ABC', 'ABCD'];
    
    console.log('\n=== PROBANDO VALORES PARA RESPUESTA_CORRECTA ===');
    
    for (const testValue of testValues) {
      console.log(`\nProbando valor: "${testValue}"`);
      
      const testQuestion = {
        cuestionario_id: '8cae572b-b3e8-4ba4-90e3-b45a4f7c428a',
        pregunta: `Pregunta de prueba ${testValue}`,
        tipo: 'multiple_choice',
        orden: 999,
        explicacion: 'Prueba',
        leccion_id: '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44',
        opcion_a: 'Opción A',
        opcion_b: 'Opción B',
        opcion_c: 'Opción C',
        opcion_d: 'Opción D',
        respuesta_correcta: testValue
      };
      
      const { data, error: insertError } = await supabase
        .from('preguntas')
        .insert(testQuestion);
      
      if (insertError) {
        console.log(`❌ Error con "${testValue}":`, insertError.message);
      } else {
        console.log(`✅ "${testValue}" funciona`);
        
        // Eliminar la pregunta de prueba
        await supabase
          .from('preguntas')
          .delete()
          .eq('pregunta', `Pregunta de prueba ${testValue}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkRespuestaCorrectaConstraint();