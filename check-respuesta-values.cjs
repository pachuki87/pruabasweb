const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lyojcqiiixkqqtpoejdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM'
);

async function checkRespuestaValues() {
  try {
    console.log('=== VERIFICANDO TODAS LAS PREGUNTAS EXISTENTES ===');
    
    // Buscar todas las preguntas existentes
    const { data: questions, error } = await supabase
      .from('preguntas')
      .select('*')
      .order('id');
    
    if (error) {
      console.log('Error:', error);
      return;
    }
    
    console.log(`Total de preguntas encontradas: ${questions.length}`);
    
    questions.forEach((q, index) => {
      console.log(`\n--- Pregunta ${index + 1} ---`);
      console.log(`ID: ${q.id}`);
      console.log(`Pregunta: ${q.pregunta}`);
      console.log(`Tipo: "${q.tipo}"`);
      console.log(`Respuesta correcta: "${q.respuesta_correcta}" (${q.respuesta_correcta ? typeof q.respuesta_correcta : 'null'})`);
      console.log(`Opción A: "${q.opcion_a}"`);
      console.log(`Opción B: "${q.opcion_b}"`);
      console.log(`Opción C: "${q.opcion_c}"`);
      console.log(`Opción D: "${q.opcion_d}"`);
    });
    
    // Probar con valores específicos que podrían funcionar
    const testValues = ['1', '2', '3', '4', 'V', 'F', 'a', 'b', 'c', 'd'];
    
    console.log('\n=== PROBANDO VALORES ESPECÍFICOS ===');
    
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

checkRespuestaValues();