require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function createUserCourseSummaryTable() {
  console.log('🔄 Conectando a Supabase...');
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Variables de entorno de Supabase no encontradas');
    console.log('Verifica que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén en .env');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔍 Verificando si la tabla user_course_summary existe...');
    
    // Verificar si la tabla existe
    const { data: existingTable, error: checkError } = await supabase
      .from('user_course_summary')
      .select('id')
      .limit(1);
    
    if (!checkError) {
      console.log('✅ La tabla user_course_summary ya existe');
      
      // Contar registros existentes
      const { count } = await supabase
        .from('user_course_summary')
        .select('*', { count: 'exact', head: true });
      
      console.log(`📊 Registros en user_course_summary: ${count}`);
      return;
    }
    
    console.log('⚠️ La tabla user_course_summary no existe. Creándola...');
    
    // Crear la tabla usando SQL directo
    const createTableSQL = `
      -- Crear tabla user_course_summary
      CREATE TABLE IF NOT EXISTS public.user_course_summary (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          course_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
          total_lessons INTEGER DEFAULT 0,
          completed_lessons INTEGER DEFAULT 0,
          progress_percentage DECIMAL(5,2) DEFAULT 0.00,
          total_time_spent INTEGER DEFAULT 0,
          started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, course_id)
      );
      
      -- Crear índices
      CREATE INDEX IF NOT EXISTS idx_user_course_summary_user_id ON public.user_course_summary(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_course_summary_course_id ON public.user_course_summary(course_id);
      
      -- Habilitar RLS
      ALTER TABLE public.user_course_summary ENABLE ROW LEVEL SECURITY;
      
      -- Crear políticas RLS
      CREATE POLICY IF NOT EXISTS "Users can view their own course summary" ON public.user_course_summary
          FOR SELECT USING (auth.uid() = user_id);
      
      CREATE POLICY IF NOT EXISTS "Users can insert their own course summary" ON public.user_course_summary
          FOR INSERT WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY IF NOT EXISTS "Users can update their own course summary" ON public.user_course_summary
          FOR UPDATE USING (auth.uid() = user_id);
    `;
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) {
      console.error('❌ Error creando la tabla:', error.message);
      
      // Intentar método alternativo usando el cliente de administración
      console.log('🔄 Intentando método alternativo...');
      
      // Verificar tablas existentes
      const { data: tables } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      console.log('📋 Tablas existentes:', tables?.map(t => t.table_name) || 'No se pudieron obtener');
      
      return;
    }
    
    console.log('✅ Tabla user_course_summary creada exitosamente');
    
    // Poblar datos iniciales si existen datos en user_course_progress
    console.log('🔄 Poblando datos iniciales...');
    
    const { data: progressData } = await supabase
      .from('user_course_progress')
      .select('user_id, course_id, percentage_completed, time_spent_minutes, created_at, updated_at');
    
    if (progressData && progressData.length > 0) {
      console.log(`📊 Encontrados ${progressData.length} registros de progreso`);
      
      // Agrupar por usuario y curso
      const summaryData = {};
      
      for (const progress of progressData) {
        const key = `${progress.user_id}-${progress.course_id}`;
        
        if (!summaryData[key]) {
          summaryData[key] = {
            user_id: progress.user_id,
            course_id: progress.course_id,
            completed_lessons: 0,
            total_time_spent: 0,
            progress_percentage: 0,
            started_at: progress.created_at,
            last_accessed_at: progress.updated_at
          };
        }
        
        if (progress.percentage_completed >= 100) {
          summaryData[key].completed_lessons++;
        }
        
        summaryData[key].total_time_spent += progress.time_spent_minutes || 0;
        summaryData[key].progress_percentage = Math.max(
          summaryData[key].progress_percentage,
          progress.percentage_completed || 0
        );
        
        if (new Date(progress.updated_at) > new Date(summaryData[key].last_accessed_at)) {
          summaryData[key].last_accessed_at = progress.updated_at;
        }
      }
      
      // Insertar datos de resumen
      const summaryArray = Object.values(summaryData);
      
      for (const summary of summaryArray) {
        const { error: insertError } = await supabase
          .from('user_course_summary')
          .insert(summary);
        
        if (insertError) {
          console.error('⚠️ Error insertando resumen:', insertError.message);
        }
      }
      
      console.log(`✅ Insertados ${summaryArray.length} registros de resumen`);
    }
    
    // Verificación final
    const { count: finalCount } = await supabase
      .from('user_course_summary')
      .select('*', { count: 'exact', head: true });
    
    console.log(`🎉 Tabla creada exitosamente con ${finalCount} registros`);
    
  } catch (err) {
    console.error('❌ Error general:', err.message);
    console.log('\n📋 Información de debug:');
    console.log('- URL:', supabaseUrl);
    console.log('- Key presente:', !!supabaseKey);
    console.log('- Error completo:', err);
  }
}

// Ejecutar la función
createUserCourseSummaryTable()
  .then(() => {
    console.log('\n🏁 Proceso completado');
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 Error fatal:', err);
    process.exit(1);
  });