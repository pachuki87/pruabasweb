require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

(async () => {
  try {
    console.log('=== ANÁLISIS DE TIPOS DE PREGUNTAS ===\n');
    
    // 1. Verificar estructura de tabla preguntas
    console.log('1. ESTRUCTURA DE TABLA PREGUNTAS:');
    const { data: preguntasData, error: preguntasError } = await supabase
      .from('preguntas')
      .select('*')
      .limit(1);
    
    if (preguntasError) {
      console.log('❌ Error:', preguntasError.message);
    } else if (preguntasData.length > 0) {
      console.log('✅ Columnas en tabla preguntas:');
      Object.keys(preguntasData[0]).forEach(col => {
        console.log(`   - ${col}`);
      });
    }
    
    // 2. Verificar estructura de respuestas_texto_libre
    console.log('\n2. ESTRUCTURA DE RESPUESTAS_TEXTO_LIBRE:');
    const { data: respuestasData, error: respuestasError } = await supabase
      .from('respuestas_texto_libre')
      .select('*')
      .limit(1);
    
    if (respuestasError) {
      console.log('❌ Error:', respuestasError.message);
    } else if (respuestasData.length > 0) {
      console.log('✅ Columnas en tabla respuestas_texto_libre:');
      Object.keys(respuestasData[0]).forEach(col => {
        console.log(`   - ${col}`);
      });
    }
    
    // 3. Verificar tipos de preguntas existentes
    console.log('\n3. TIPOS DE PREGUNTAS EXISTENTES:');
    const { data: tiposData, error: tiposError } = await supabase
      .from('preguntas')
      .select('tipo')
      .not('tipo', 'is', null);
    
    if (tiposError) {
      console.log('❌ Error:', tiposError.message);
    } else {
      const tipos = [...new Set(tiposData.map(p => p.tipo))];
      console.log('✅ Tipos encontrados:', tipos);
    }
    
    // 4. Contar preguntas por tipo
    console.log('\n4. CONTEO POR TIPO:');
    const { data: conteoData, error: conteoError } = await supabase
      .from('preguntas')
      .select('tipo');
    
    if (conteoError) {
      console.log('❌ Error:', conteoError.message);
    } else {
      const conteo = {};
      conteoData.forEach(p => {
        conteo[p.tipo] = (conteo[p.tipo] || 0) + 1;
      });
      
      Object.entries(conteo).forEach(([tipo, count]) => {
        console.log(`   ${tipo}: ${count} preguntas`);
      });
    }
    
    // 5. Verificar opciones_respuesta para preguntas multiple_choice
    console.log('\n5. OPCIONES DE RESPUESTA:');
    const { data: opcionesData, error: opcionesError } = await supabase
      .from('opciones_respuesta')
      .select('*')
      .limit(1);
    
    if (opcionesError) {
      console.log('❌ Error:', opcionesError.message);
    } else if (opcionesData.length > 0) {
      console.log('✅ Columnas en tabla opciones_respuesta:');
      Object.keys(opcionesData[0]).forEach(col => {
        console.log(`   - ${col}`);
      });
    }
    
    console.log('\n=== RESUMEN ===');
    console.log('📝 TIPOS DE PREGUNTAS IDENTIFICADOS:');
    console.log('   • multiple_choice: Preguntas con opciones predefinidas');
    console.log('     - Se almacenan en tabla "opciones_respuesta"');
    console.log('     - Tienen campo "es_correcta" para validación');
    console.log('   • texto_libre: Preguntas de respuesta abierta');
    console.log('     - Se almacenan en tabla "respuestas_texto_libre"');
    console.log('     - No tienen validación automática');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
})();