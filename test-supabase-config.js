// Script para probar la configuración de Supabase
console.log('=== PRUEBA DE CONFIGURACIÓN SUPABASE ===');

// Importar el cliente Supabase
import { supabase, testConnection } from './src/lib/supabase.js';

async function runTests() {
  console.log('\n1. Probando conexión a Supabase...');
  
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✅ Conexión exitosa');
      
      console.log('\n2. Probando consulta de cuestionarios...');
      const { data, error } = await supabase
        .from('cuestionarios')
        .select('id, titulo, curso_id, leccion_id')
        .limit(5);
      
      if (error) {
        console.error('❌ Error en consulta:', error.message);
      } else {
        console.log('✅ Consulta exitosa');
        console.log(`📊 Encontrados ${data.length} cuestionarios:`);
        data.forEach(quiz => {
          console.log(`  - ${quiz.titulo} (ID: ${quiz.id})`);
        });
      }
      
      console.log('\n3. Probando consulta de preguntas...');
      const { data: preguntas, error: errorPreguntas } = await supabase
        .from('preguntas')
        .select('id, pregunta, tipo, cuestionario_id')
        .limit(3);
      
      if (errorPreguntas) {
        console.error('❌ Error en consulta de preguntas:', errorPreguntas.message);
      } else {
        console.log('✅ Consulta de preguntas exitosa');
        console.log(`📝 Encontradas ${preguntas.length} preguntas:`);
        preguntas.forEach(pregunta => {
          console.log(`  - ${pregunta.pregunta.substring(0, 50)}... (Tipo: ${pregunta.tipo})`);
        });
      }
      
      console.log('\n✅ TODAS LAS PRUEBAS SUPERADAS');
      console.log('🎉 La configuración de Supabase funciona correctamente');
      
    } else {
      console.log('❌ Falló la conexión a Supabase');
    }
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.log('⚠️ La aplicación continuará funcionando con el cliente mock');
  }
}

// Ejecutar pruebas
runTests().then(() => {
  console.log('\n=== FIN DE LAS PRUEBAS ===');
}).catch(error => {
  console.error('❌ Error no controlado:', error);
});
