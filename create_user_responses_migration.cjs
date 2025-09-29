require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createUserResponsesSystem() {
  try {
    console.log('🗄️ Creando sistema de registro de respuestas de usuarios...');
    
    // Crear tabla respuestas_usuario
    console.log('\n📝 Creando tabla respuestas_usuario...');
    const { data: responseTable, error: responseTableError } = await supabase
      .from('respuestas_usuario')
      .select('id')
      .limit(1);
    
    if (responseTableError && responseTableError.code === 'PGRST116') {
      console.log('❌ Tabla respuestas_usuario no existe, necesita ser creada via migración');
    } else {
      console.log('✅ Tabla respuestas_usuario ya existe');
    }
    
    // Crear tabla intentos_cuestionario
    console.log('\n📝 Verificando tabla intentos_cuestionario...');
    const { data: attemptsTable, error: attemptsTableError } = await supabase
      .from('intentos_cuestionario')
      .select('id')
      .limit(1);
    
    if (attemptsTableError && attemptsTableError.code === 'PGRST116') {
      console.log('❌ Tabla intentos_cuestionario no existe, necesita ser creada via migración');
    } else {
      console.log('✅ Tabla intentos_cuestionario ya existe');
    }
    
    // Crear las tablas usando queries directas
    console.log('\n🔧 Intentando crear tablas directamente...');
    
    // Crear respuestas_usuario
    try {
      const { error: createError1 } = await supabase.rpc('create_respuestas_usuario_table');
      if (createError1) {
        console.log('⚠️ Error con función personalizada:', createError1.message);
        
        // Intentar crear usando query raw
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS respuestas_usuario (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            cuestionario_id UUID NOT NULL,
            pregunta_id UUID NOT NULL,
            opcion_seleccionada_id UUID NOT NULL,
            es_correcta BOOLEAN NOT NULL,
            tiempo_respuesta_segundos INTEGER DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, pregunta_id)
          );
        `;
        
        console.log('📝 SQL para crear respuestas_usuario:');
        console.log(createTableQuery);
      }
    } catch (err) {
      console.log('⚠️ No se pudo crear tabla con función:', err.message);
    }
    
    // Crear intentos_cuestionario
    try {
      const createAttemptsQuery = `
        CREATE TABLE IF NOT EXISTS intentos_cuestionario (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL,
          cuestionario_id UUID NOT NULL,
          leccion_id UUID NOT NULL,
          puntuacion_obtenida INTEGER NOT NULL DEFAULT 0,
          puntuacion_maxima INTEGER NOT NULL DEFAULT 0,
          porcentaje_acierto DECIMAL(5,2) NOT NULL DEFAULT 0,
          tiempo_total_segundos INTEGER DEFAULT 0,
          completado BOOLEAN DEFAULT FALSE,
          aprobado BOOLEAN DEFAULT FALSE,
          numero_intento INTEGER DEFAULT 1,
          started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          completed_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          CHECK (puntuacion_obtenida >= 0),
          CHECK (puntuacion_maxima >= 0),
          CHECK (porcentaje_acierto >= 0 AND porcentaje_acierto <= 100),
          CHECK (numero_intento > 0)
        );
      `;
      
      console.log('📝 SQL para crear intentos_cuestionario:');
      console.log(createAttemptsQuery);
    } catch (err) {
      console.log('⚠️ Error:', err.message);
    }
    
    // Mostrar SQL para índices
    const indexesSQL = `
      -- Índices para mejor performance
      CREATE INDEX IF NOT EXISTS idx_respuestas_usuario_user_id ON respuestas_usuario(user_id);
      CREATE INDEX IF NOT EXISTS idx_respuestas_usuario_cuestionario_id ON respuestas_usuario(cuestionario_id);
      CREATE INDEX IF NOT EXISTS idx_intentos_cuestionario_user_id ON intentos_cuestionario(user_id);
      CREATE INDEX IF NOT EXISTS idx_intentos_cuestionario_leccion_id ON intentos_cuestionario(leccion_id);
    `;
    
    console.log('\n📝 SQL para crear índices:');
    console.log(indexesSQL);
    
    // Mostrar SQL para RLS
    const rlsSQL = `
      -- Habilitar RLS
      ALTER TABLE respuestas_usuario ENABLE ROW LEVEL SECURITY;
      ALTER TABLE intentos_cuestionario ENABLE ROW LEVEL SECURITY;
      
      -- Políticas para respuestas_usuario
      CREATE POLICY "Users can view their own responses" ON respuestas_usuario
        FOR SELECT USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can insert their own responses" ON respuestas_usuario
        FOR INSERT WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "Users can update their own responses" ON respuestas_usuario
        FOR UPDATE USING (auth.uid() = user_id);
      
      -- Políticas para intentos_cuestionario
      CREATE POLICY "Users can view their own attempts" ON intentos_cuestionario
        FOR SELECT USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can insert their own attempts" ON intentos_cuestionario
        FOR INSERT WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "Users can update their own attempts" ON intentos_cuestionario
        FOR UPDATE USING (auth.uid() = user_id);
      
      -- Permisos
      GRANT SELECT, INSERT, UPDATE ON respuestas_usuario TO authenticated;
      GRANT SELECT, INSERT, UPDATE ON intentos_cuestionario TO authenticated;
      GRANT SELECT ON respuestas_usuario TO anon;
      GRANT SELECT ON intentos_cuestionario TO anon;
    `;
    
    console.log('\n📝 SQL para configurar RLS y permisos:');
    console.log(rlsSQL);
    
    console.log('\n🎯 Para crear las tablas, ejecuta estos comandos SQL en Supabase:');
    console.log('\n1️⃣ Crear tablas:');
    console.log('   - respuestas_usuario');
    console.log('   - intentos_cuestionario');
    console.log('\n2️⃣ Crear índices para performance');
    console.log('\n3️⃣ Configurar RLS y permisos');
    
  } catch (error) {
    console.log('💥 Error general:', error.message);
  }
}

// Ejecutar la función
createUserResponsesSystem().then(() => {
  console.log('\n✨ Análisis completado - Usar MCP de Supabase para aplicar migración');
  process.exit(0);
});