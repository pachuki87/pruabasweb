require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndCreateTables() {
  console.log('🔍 Verificando tablas existentes...');
  
  try {
    // Verificar tablas existentes
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['user_course_progress', 'user_course_summary', 'user_test_results']);
    
    if (tablesError) {
      console.error('❌ Error verificando tablas:', tablesError);
      return;
    }
    
    const existingTables = tables.map(t => t.table_name);
    console.log('✅ Tablas existentes:', existingTables);
    
    // Verificar si user_course_summary existe
    if (!existingTables.includes('user_course_summary')) {
      console.log('⚠️ Tabla user_course_summary no existe. Creándola...');
      
      // Crear la tabla user_course_summary
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public.user_course_summary (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          course_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
          total_lessons INTEGER DEFAULT 0,
          completed_lessons INTEGER DEFAULT 0,
          progress_percentage DECIMAL(5,2) DEFAULT 0.00,
          total_time_spent INTEGER DEFAULT 0, -- en minutos
          last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          completed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, course_id)
        );
        
        -- Crear índices
        CREATE INDEX IF NOT EXISTS idx_user_course_summary_user_id ON public.user_course_summary(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_course_summary_course_id ON public.user_course_summary(course_id);
        CREATE INDEX IF NOT EXISTS idx_user_course_summary_progress ON public.user_course_summary(progress_percentage);
        
        -- Habilitar RLS
        ALTER TABLE public.user_course_summary ENABLE ROW LEVEL SECURITY;
        
        -- Política RLS para que los usuarios solo vean sus propios datos
        CREATE POLICY "Users can view own course summary" ON public.user_course_summary
          FOR SELECT USING (auth.uid() = user_id);
          
        CREATE POLICY "Users can insert own course summary" ON public.user_course_summary
          FOR INSERT WITH CHECK (auth.uid() = user_id);
          
        CREATE POLICY "Users can update own course summary" ON public.user_course_summary
          FOR UPDATE USING (auth.uid() = user_id);
      `;
      
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: createTableSQL
      });
      
      if (createError) {
        console.error('❌ Error creando tabla user_course_summary:', createError);
        
        // Intentar método alternativo usando una migración
        console.log('🔄 Intentando crear tabla con método alternativo...');
        
        const { error: altError } = await supabase
          .from('user_course_summary')
          .select('*')
          .limit(1);
          
        if (altError && altError.code === 'PGRST116') {
          console.log('⚠️ Necesitas crear la tabla manualmente en Supabase Dashboard');
          console.log('📋 SQL para crear la tabla:');
          console.log(createTableSQL);
        }
      } else {
        console.log('✅ Tabla user_course_summary creada exitosamente');
      }
    } else {
      console.log('✅ Tabla user_course_summary ya existe');
    }
    
    // Verificar estructura de user_course_progress
    console.log('\n🔍 Verificando estructura de user_course_progress...');
    const { data: progressData, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .limit(1);
      
    if (progressError) {
      console.error('❌ Error verificando user_course_progress:', progressError);
    } else {
      console.log('✅ Tabla user_course_progress accesible');
    }
    
    // Verificar relaciones
    console.log('\n🔍 Verificando relaciones de tablas...');
    const { data: relations, error: relError } = await supabase
      .from('information_schema.table_constraints')
      .select('*')
      .eq('table_schema', 'public')
      .eq('constraint_type', 'FOREIGN KEY');
      
    if (relError) {
      console.error('❌ Error verificando relaciones:', relError);
    } else {
      console.log('✅ Relaciones encontradas:', relations?.length || 0);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkAndCreateTables();