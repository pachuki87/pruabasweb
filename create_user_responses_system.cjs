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
    
    // Verificar si las tablas ya existen
    console.log('\n🔍 Verificando tablas existentes...');
    
    // Crear tabla respuestas_usuario si no existe
    const createUserResponsesTable = `
      CREATE TABLE IF NOT EXISTS public.respuestas_usuario (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        cuestionario_id UUID NOT NULL REFERENCES public.cuestionarios(id) ON DELETE CASCADE,
        pregunta_id UUID NOT NULL REFERENCES public.preguntas(id) ON DELETE CASCADE,
        opcion_seleccionada_id UUID NOT NULL REFERENCES public.opciones_respuesta(id) ON DELETE CASCADE,
        es_correcta BOOLEAN NOT NULL,
        tiempo_respuesta_segundos INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        
        -- Constraint para evitar respuestas duplicadas
        UNIQUE(user_id, pregunta_id)
      );
    `;
    
    console.log('📝 Creando tabla respuestas_usuario...');
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: createUserResponsesTable
    });
    
    if (tableError && !tableError.message.includes('already exists')) {
      console.log('❌ Error al crear tabla respuestas_usuario:', tableError.message);
    } else {
      console.log('✅ Tabla respuestas_usuario creada/verificada');
    }
    
    // Crear tabla intentos_cuestionario para tracking de intentos
    const createQuizAttemptsTable = `
      CREATE TABLE IF NOT EXISTS public.intentos_cuestionario (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        cuestionario_id UUID NOT NULL REFERENCES public.cuestionarios(id) ON DELETE CASCADE,
        leccion_id UUID NOT NULL REFERENCES public.lecciones(id) ON DELETE CASCADE,
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
        
        -- Constraints
        CHECK (puntuacion_obtenida >= 0),
        CHECK (puntuacion_maxima >= 0),
        CHECK (porcentaje_acierto >= 0 AND porcentaje_acierto <= 100),
        CHECK (numero_intento > 0)
      );
    `;
    
    console.log('📝 Creando tabla intentos_cuestionario...');
    const { error: attemptsError } = await supabase.rpc('exec_sql', {
      sql: createQuizAttemptsTable
    });
    
    if (attemptsError && !attemptsError.message.includes('already exists')) {
      console.log('❌ Error al crear tabla intentos_cuestionario:', attemptsError.message);
    } else {
      console.log('✅ Tabla intentos_cuestionario creada/verificada');
    }
    
    // Crear índices para mejor performance
    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_respuestas_usuario_user_id ON public.respuestas_usuario(user_id);
      CREATE INDEX IF NOT EXISTS idx_respuestas_usuario_cuestionario_id ON public.respuestas_usuario(cuestionario_id);
      CREATE INDEX IF NOT EXISTS idx_intentos_cuestionario_user_id ON public.intentos_cuestionario(user_id);
      CREATE INDEX IF NOT EXISTS idx_intentos_cuestionario_leccion_id ON public.intentos_cuestionario(leccion_id);
    `;
    
    console.log('📝 Creando índices...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: createIndexes
    });
    
    if (indexError) {
      console.log('❌ Error al crear índices:', indexError.message);
    } else {
      console.log('✅ Índices creados correctamente');
    }
    
    // Configurar RLS (Row Level Security)
    const setupRLS = `
      -- Habilitar RLS
      ALTER TABLE public.respuestas_usuario ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.intentos_cuestionario ENABLE ROW LEVEL SECURITY;
      
      -- Políticas para respuestas_usuario
      DROP POLICY IF EXISTS "Users can view their own responses" ON public.respuestas_usuario;
      CREATE POLICY "Users can view their own responses" ON public.respuestas_usuario
        FOR SELECT USING (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can insert their own responses" ON public.respuestas_usuario;
      CREATE POLICY "Users can insert their own responses" ON public.respuestas_usuario
        FOR INSERT WITH CHECK (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can update their own responses" ON public.respuestas_usuario;
      CREATE POLICY "Users can update their own responses" ON public.respuestas_usuario
        FOR UPDATE USING (auth.uid() = user_id);
      
      -- Políticas para intentos_cuestionario
      DROP POLICY IF EXISTS "Users can view their own attempts" ON public.intentos_cuestionario;
      CREATE POLICY "Users can view their own attempts" ON public.intentos_cuestionario
        FOR SELECT USING (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can insert their own attempts" ON public.intentos_cuestionario;
      CREATE POLICY "Users can insert their own attempts" ON public.intentos_cuestionario
        FOR INSERT WITH CHECK (auth.uid() = user_id);
      
      DROP POLICY IF EXISTS "Users can update their own attempts" ON public.intentos_cuestionario;
      CREATE POLICY "Users can update their own attempts" ON public.intentos_cuestionario
        FOR UPDATE USING (auth.uid() = user_id);
    `;
    
    console.log('📝 Configurando políticas RLS...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: setupRLS
    });
    
    if (rlsError) {
      console.log('❌ Error al configurar RLS:', rlsError.message);
    } else {
      console.log('✅ Políticas RLS configuradas correctamente');
    }
    
    // Otorgar permisos
    const grantPermissions = `
      GRANT SELECT, INSERT, UPDATE ON public.respuestas_usuario TO authenticated;
      GRANT SELECT, INSERT, UPDATE ON public.intentos_cuestionario TO authenticated;
      GRANT SELECT ON public.respuestas_usuario TO anon;
      GRANT SELECT ON public.intentos_cuestionario TO anon;
    `;
    
    console.log('📝 Otorgando permisos...');
    const { error: permError } = await supabase.rpc('exec_sql', {
      sql: grantPermissions
    });
    
    if (permError) {
      console.log('❌ Error al otorgar permisos:', permError.message);
    } else {
      console.log('✅ Permisos otorgados correctamente');
    }
    
    console.log('\n🎉 Sistema de registro de respuestas creado exitosamente!');
    console.log('\n📊 Tablas creadas:');
    console.log('   • respuestas_usuario - Para registrar respuestas individuales');
    console.log('   • intentos_cuestionario - Para tracking de intentos y puntuaciones');
    
  } catch (error) {
    console.log('💥 Error general:', error.message);
  }
}

// Ejecutar la función
createUserResponsesSystem().then(() => {
  console.log('\n✨ Proceso completado');
  process.exit(0);
});