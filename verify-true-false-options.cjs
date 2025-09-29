const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTrueFalseOptions() {
  console.log('=== VERIFICANDO OPCIONES VERDADERO/FALSO ===\n');
  
  // IDs de las preguntas que se procesaron
  const questions = [
    {
      id: '16265787-85d2-40e9-9b70-956be12cacbc',
      text: 'La dopamina está implicada en los circuitos de recompensa cerebrales relacionados con las adicciones.',
      expectedCorrect: 'Verdadero'
    },
    {
      id: '8b925c4f-b8d0-4ddd-9a0c-547fb57f0066', 
      text: 'Las adicciones no afectan a las emociones de las personas.',
      expectedCorrect: 'Falso'
    },
    {
      id: '1a47411c-601a-421b-b5e2-6379f05501ae',
      text: 'La gestión de emociones disfuncionales es clave en el proceso de recuperación de adicciones.',
      expectedCorrect: 'Verdadero'
    }
  ];
  
  try {
    for (const question of questions) {
      console.log(`🔍 VERIFICANDO: "${question.text.substring(0, 60)}..."`);
      console.log(`   ID: ${question.id}`);
      
      // Obtener información de la pregunta
      const { data: questionData, error: questionError } = await supabase
        .from('preguntas')
        .select('*')
        .eq('id', question.id)
        .single();
      
      if (questionError) {
        console.error(`   ❌ Error obteniendo pregunta:`, questionError);
        continue;
      }
      
      console.log(`   📝 Tipo: ${questionData.tipo}`);
      
      // Obtener opciones
      const { data: options, error: optionsError } = await supabase
        .from('opciones_respuesta')
        .select('*')
        .eq('pregunta_id', question.id)
        .order('orden');
      
      if (optionsError) {
        console.error(`   ❌ Error obteniendo opciones:`, optionsError);
        continue;
      }
      
      if (!options || options.length === 0) {
        console.log(`   ❌ NO HAY OPCIONES`);
        continue;
      }
      
      console.log(`   ✅ Opciones encontradas (${options.length}):`);
      
      let hasVerdadero = false;
      let hasFalso = false;
      let correctOption = null;
      
      options.forEach(opt => {
        const status = opt.es_correcta ? '✓ CORRECTA' : '✗ Incorrecta';
        console.log(`      ${opt.orden}. ${opt.opcion} - ${status}`);
        
        if (opt.opcion.toLowerCase() === 'verdadero') hasVerdadero = true;
        if (opt.opcion.toLowerCase() === 'falso') hasFalso = true;
        if (opt.es_correcta) correctOption = opt.opcion;
      });
      
      // Verificar que tiene ambas opciones
      if (hasVerdadero && hasFalso) {
        console.log(`   ✅ Tiene ambas opciones: Verdadero y Falso`);
      } else {
        console.log(`   ⚠️ Faltan opciones: Verdadero=${hasVerdadero}, Falso=${hasFalso}`);
      }
      
      // Verificar respuesta correcta
      if (correctOption === question.expectedCorrect) {
        console.log(`   ✅ Respuesta correcta configurada: ${correctOption}`);
      } else {
        console.log(`   ⚠️ Respuesta incorrecta. Esperada: ${question.expectedCorrect}, Actual: ${correctOption}`);
      }
      
      console.log();
    }
    
    console.log('🎉 VERIFICACIÓN COMPLETADA');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la función
verifyTrueFalseOptions().then(() => {
  console.log('\n=== VERIFICACIÓN FINALIZADA ===');
}).catch(error => {
  console.error('Error ejecutando script:', error);
});