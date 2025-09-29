const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lyojcqiiixkqqtpoejdo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM'
);

async function checkTipoColumn() {
  try {
    console.log('=== VERIFICANDO VALORES DE TIPO EN PREGUNTAS ===');
    
    // Buscar todos los tipos únicos existentes
    const { data: questions, error } = await supabase
      .from('preguntas')
      .select('tipo')
      .not('tipo', 'is', null);
    
    if (error) {
      console.log('Error:', error);
      return;
    }
    
    const tiposUnicos = [...new Set(questions.map(q => q.tipo))];
    console.log('Tipos existentes en la base de datos:');
    tiposUnicos.forEach(tipo => {
      console.log(`- "${tipo}" (longitud: ${tipo.length})`);
    });
    
    console.log('\nProbando inserción con tipo corto...');
    
    // Probar insertar una pregunta simple para ver qué funciona
    const testQuestion = {
      cuestionario_id: '8cae572b-b3e8-4ba4-90e3-b45a4f7c428a', // ID del cuestionario del módulo 1
      pregunta: 'Pregunta de prueba',
      tipo: 'T', // Tipo de 1 carácter
      orden: 999,
      explicacion: 'Prueba',
      leccion_id: '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44'
    };
    
    const { data, error: insertError } = await supabase
      .from('preguntas')
      .insert(testQuestion);
    
    if (insertError) {
      console.log('Error en inserción de prueba:', insertError);
    } else {
      console.log('✅ Inserción de prueba exitosa');
      
      // Eliminar la pregunta de prueba
      await supabase
        .from('preguntas')
        .delete()
        .eq('pregunta', 'Pregunta de prueba');
      console.log('Pregunta de prueba eliminada');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTipoColumn();