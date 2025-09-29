const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  console.log('🔍 Verificando estructura de las tablas...');
  
  // Verificar tabla preguntas
  console.log('\n📋 Tabla PREGUNTAS:');
  const { data: preguntas, error: preguntasError } = await supabase
    .from('preguntas')
    .select('*')
    .limit(1);
    
  if (preguntasError) {
    console.error('❌ Error consultando preguntas:', preguntasError);
  } else if (preguntas && preguntas.length > 0) {
    console.log('✅ Columnas encontradas:', Object.keys(preguntas[0]));
    console.log('📄 Ejemplo:', preguntas[0]);
  } else {
    console.log('⚠️ No hay datos en la tabla preguntas');
  }
  
  // Verificar tabla opciones_respuesta
  console.log('\n🎯 Tabla OPCIONES_RESPUESTA:');
  const { data: opciones, error: opcionesError } = await supabase
    .from('opciones_respuesta')
    .select('*')
    .limit(1);
    
  if (opcionesError) {
    console.error('❌ Error consultando opciones:', opcionesError);
  } else if (opciones && opciones.length > 0) {
    console.log('✅ Columnas encontradas:', Object.keys(opciones[0]));
    console.log('📄 Ejemplo:', opciones[0]);
  } else {
    console.log('⚠️ No hay datos en la tabla opciones_respuesta');
  }
  
  // Verificar tabla cuestionarios
  console.log('\n📝 Tabla CUESTIONARIOS:');
  const { data: cuestionarios, error: cuestionariosError } = await supabase
    .from('cuestionarios')
    .select('*')
    .limit(1);
    
  if (cuestionariosError) {
    console.error('❌ Error consultando cuestionarios:', cuestionariosError);
  } else if (cuestionarios && cuestionarios.length > 0) {
    console.log('✅ Columnas encontradas:', Object.keys(cuestionarios[0]));
    console.log('📄 Ejemplo:', cuestionarios[0]);
  } else {
    console.log('⚠️ No hay datos en la tabla cuestionarios');
  }
}

checkTableStructure().catch(console.error);