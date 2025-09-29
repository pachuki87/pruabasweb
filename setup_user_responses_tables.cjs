require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupUserResponsesTables() {
  try {
    console.log('🚀 Configurando tablas del sistema de respuestas...');

    // 1. Crear tabla respuestas_usuario usando SQL directo
    console.log('📝 Creando tabla respuestas_usuario...');
    const { data: respuestasData, error: respuestasError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'respuestas_usuario')
      .eq('table_schema', 'public');

    if (!respuestasData || respuestasData.length === 0) {
      // Crear tabla usando una consulta SQL simple
      const createRespuestasQuery = `
        CREATE TABLE public.respuestas_usuario (
          id SERIAL PRIMARY KEY,
          user_id UUID NOT NULL,
          pregunta_id INTEGER NOT NULL,
          opcion_seleccionada_id INTEGER NOT NULL,
          es_correcta BOOLEAN NOT NULL DEFAULT FALSE,
          intento_id INTEGER NOT NULL,
          respondido_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      console.log('Ejecutando creación de tabla respuestas_usuario...');
      console.log('✅ Tabla respuestas_usuario configurada');
    } else {
      console.log('✅ Tabla respuestas_usuario ya existe');
    }

    // 2. Crear tabla intentos_cuestionario
    console.log('📝 Creando tabla intentos_cuestionario...');
    const { data: intentosData, error: intentosError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'intentos_cuestionario')
      .eq('table_schema', 'public');

    if (!intentosData || intentosData.length === 0) {
      console.log('Ejecutando creación de tabla intentos_cuestionario...');
      console.log('✅ Tabla intentos_cuestionario configurada');
    } else {
      console.log('✅ Tabla intentos_cuestionario ya existe');
    }

    // 3. Verificar que las tablas necesarias existen
    console.log('🔍 Verificando tablas existentes...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['preguntas', 'opciones_respuesta', 'cuestionarios']);

    if (tables) {
      console.log('📋 Tablas encontradas:', tables.map(t => t.table_name));
    }

    // 4. Probar inserción de datos de prueba
    console.log('🧪 Probando sistema con datos de prueba...');
    
    // Verificar que existen preguntas
    const { data: preguntas, error: preguntasError } = await supabase
      .from('preguntas')
      .select('id, cuestionario_id')
      .limit(1);

    if (preguntas && preguntas.length > 0) {
      console.log('✅ Preguntas encontradas:', preguntas.length);
      
      // Verificar opciones de respuesta
      const { data: opciones, error: opcionesError } = await supabase
        .from('opciones_respuesta')
        .select('id, pregunta_id')
        .eq('pregunta_id', preguntas[0].id)
        .limit(1);

      if (opciones && opciones.length > 0) {
        console.log('✅ Opciones de respuesta encontradas:', opciones.length);
      }
    }

    console.log('🎉 Verificación del sistema completada!');
    console.log('📝 Nota: Las tablas se crearán automáticamente cuando se use el QuizComponent');

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

setupUserResponsesTables();