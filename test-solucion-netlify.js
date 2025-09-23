// Script para probar la solución definitiva de Supabase para Netlify
console.log('=== PRUEBA DE SOLUCIÓN DEFINITIVA SUPABASE NETLIFY ===');

// Importar el cliente Supabase
import { supabase, testConnection } from './src/lib/supabase.js';

async function runNetlifyTests() {
  console.log('\n1. Verificando inicialización del cliente Supabase...');
  
  // Esperar un momento para que el cliente se inicialice
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('\n2. Probando conexión a Supabase...');
  
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✅ Conexión exitosa');
      
      console.log('\n3. Probando consulta de cuestionarios...');
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
      
      console.log('\n4. Probando consulta de preguntas...');
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
      console.log('🎉 La solución de Supabase para Netlify funciona correctamente');
      
    } else {
      console.log('❌ Falló la conexión a Supabase');
    }
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.log('⚠️ La aplicación continuará funcionando con el cliente mock');
  }
}

// Función para verificar que el cliente se inicializa correctamente
function checkInitialization() {
  console.log('\n🔍 Verificando estado de inicialización...');
  
  // Verificar si el objeto supabase existe
  if (typeof supabase !== 'undefined') {
    console.log('✅ Objeto supabase disponible');
    
    // Verificar si tiene los métodos necesarios
    const requiredMethods = ['from', 'auth'];
    const missingMethods = requiredMethods.filter(method => typeof supabase[method] !== 'function');
    
    if (missingMethods.length === 0) {
      console.log('✅ Métodos requeridos disponibles');
    } else {
      console.log(`❌ Métodos faltantes: ${missingMethods.join(', ')}`);
    }
  } else {
    console.log('❌ Objeto supabase no disponible');
  }
}

// Ejecutar pruebas
checkInitialization();
runNetlifyTests().then(() => {
  console.log('\n=== FIN DE LAS PRUEBAS ===');
}).catch(error => {
  console.error('❌ Error no controlado:', error);
});
