const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lyojcqiiixkqqtpoejdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM'
);

async function checkPreguntasStructure() {
  try {
    console.log('=== VERIFICANDO ESTRUCTURA DE TABLA PREGUNTAS ===');
    
    // Buscar preguntas existentes del Módulo 1 para ver la estructura
    const { data: existingQuestions, error } = await supabase
      .from('preguntas')
      .select('*')
      .limit(3);
    
    if (error) {
      console.log('Error:', error);
      return;
    }
    
    if (existingQuestions && existingQuestions.length > 0) {
      console.log('Estructura de pregunta existente:');
      console.log('Columnas disponibles:', Object.keys(existingQuestions[0]));
      console.log('\nEjemplo de pregunta:');
      console.log(JSON.stringify(existingQuestions[0], null, 2));
    } else {
      console.log('No se encontraron preguntas existentes');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkPreguntasStructure();