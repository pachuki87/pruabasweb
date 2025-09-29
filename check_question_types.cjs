require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

(async () => {
  try {
    console.log('=== VERIFICACIÓN DE TIPOS DE PREGUNTAS ===\n');
    
    // Obtener ejemplos de preguntas
    const { data: preguntas, error } = await supabase
      .from('preguntas')
      .select('id, pregunta, tipo, cuestionario_id')
      .limit(10);
    
    if (error) {
      console.log('Error al obtener preguntas:', error.message);
      return;
    }
    
    console.log('Ejemplos de preguntas:');
    preguntas.forEach(p => {
      console.log(`ID: ${p.id}`);
      console.log(`Tipo: ${p.tipo}`);
      console.log(`Pregunta: ${p.pregunta.substring(0, 100)}...`);
      console.log('---');
    });
    
    // Contar tipos de preguntas
    console.log('\n=== CONTEO POR TIPO ===');
    const tipos = {};
    preguntas.forEach(p => {
      tipos[p.tipo] = (tipos[p.tipo] || 0) + 1;
    });
    
    Object.entries(tipos).forEach(([tipo, count]) => {
      console.log(`${tipo}: ${count} preguntas`);
    });
    
    // Verificar respuestas de texto libre
    console.log('\n=== RESPUESTAS DE TEXTO LIBRE ===');
    const { data: respuestasLibre, error: errorLibre } = await supabase
      .from('respuestas_texto_libre')
      .select('id, pregunta_id, respuesta, user_id')
      .limit(5);
    
    if (errorLibre) {
      console.log('Error al obtener respuestas libres:', errorLibre.message);
    } else {
      console.log(`Total de respuestas de texto libre encontradas: ${respuestasLibre.length}`);
      respuestasLibre.forEach(r => {
        console.log(`Pregunta ID: ${r.pregunta_id}, Usuario: ${r.user_id}`);
        console.log(`Respuesta: ${r.respuesta.substring(0, 80)}...`);
        console.log('---');
      });
    }
    
  } catch (error) {
    console.error('Error general:', error);
  }
})();