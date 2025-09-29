const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function addTrueFalseOptions() {
  console.log('=== AGREGANDO OPCIONES VERDADERO/FALSO ===\n');
  
  // IDs de las preguntas encontradas
  const questions = [
    {
      id: '16265787-85d2-40e9-9b70-956be12cacbc',
      text: 'La dopamina está implicada en los circuitos de recompensa cerebrales relacionados con las adicciones.',
      correctAnswer: true // Verdadero
    },
    {
      id: '8b925c4f-b8d0-4ddd-9a0c-547fb57f0066', 
      text: 'Las adicciones no afectan a las emociones de las personas.',
      correctAnswer: false // Falso
    },
    {
      id: '1a47411c-601a-421b-b5e2-6379f05501ae',
      text: 'La gestión de emociones disfuncionales es clave en el proceso de recuperación de adicciones.',
      correctAnswer: true // Verdadero
    }
  ];
  
  try {
    // Primero, verificar qué tabla de opciones existe
    console.log('🔍 VERIFICANDO ESTRUCTURA DE TABLAS...');
    
    // Intentar con 'opciones_respuesta'
    const { data: testOptions, error: testError } = await supabase
      .from('opciones_respuesta')
      .select('*')
      .limit(1);
    
    let optionsTable = 'opciones_respuesta';
    if (testError) {
      console.log('⚠️ Tabla opciones_respuesta no encontrada, probando con opciones...');
      
      const { data: testOptions2, error: testError2 } = await supabase
        .from('opciones')
        .select('*')
        .limit(1);
      
      if (testError2) {
        console.error('❌ No se encontró ninguna tabla de opciones válida');
        return;
      }
      optionsTable = 'opciones';
    }
    
    console.log(`✅ Usando tabla: ${optionsTable}\n`);
    
    // Procesar cada pregunta
    for (const question of questions) {
      console.log(`📝 PROCESANDO: "${question.text.substring(0, 50)}..."`);
      console.log(`   ID: ${question.id}`);
      
      // Verificar opciones existentes
      const { data: existingOptions, error: checkError } = await supabase
        .from(optionsTable)
        .select('*')
        .eq('pregunta_id', question.id);
      
      if (checkError) {
        console.error(`   ❌ Error verificando opciones existentes:`, checkError);
        continue;
      }
      
      if (existingOptions && existingOptions.length > 0) {
        console.log(`   ⚠️ Ya tiene ${existingOptions.length} opciones, saltando...`);
        continue;
      }
      
      // Agregar opciones Verdadero y Falso
      const optionsToAdd = [
        {
          pregunta_id: question.id,
          opcion: 'Verdadero',
          es_correcta: question.correctAnswer === true,
          orden: 1
        },
        {
          pregunta_id: question.id,
          opcion: 'Falso', 
          es_correcta: question.correctAnswer === false,
          orden: 2
        }
      ];
      
      console.log(`   ➕ Agregando opciones Verdadero/Falso...`);
      
      const { data: insertedOptions, error: insertError } = await supabase
        .from(optionsTable)
        .insert(optionsToAdd)
        .select();
      
      if (insertError) {
        console.error(`   ❌ Error insertando opciones:`, insertError);
      } else {
        console.log(`   ✅ Opciones agregadas exitosamente:`);
        insertedOptions.forEach(opt => {
          console.log(`      - ${opt.opcion} (${opt.es_correcta ? 'Correcta' : 'Incorrecta'})`);
        });
      }
      
      // También actualizar el tipo de pregunta a verdadero_falso si es necesario
      const { error: updateError } = await supabase
        .from('preguntas')
        .update({ tipo: 'verdadero_falso' })
        .eq('id', question.id);
      
      if (updateError) {
        console.log(`   ⚠️ No se pudo actualizar el tipo de pregunta:`, updateError);
      } else {
        console.log(`   ✅ Tipo de pregunta actualizado a 'verdadero_falso'`);
      }
      
      console.log();
    }
    
    console.log('🎉 PROCESO COMPLETADO');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la función
addTrueFalseOptions().then(() => {
  console.log('\n=== FINALIZADO ===');
}).catch(error => {
  console.error('Error ejecutando script:', error);
});