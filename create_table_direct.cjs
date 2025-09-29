require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function createTableDirect() {
  console.log('🔄 Conectando a Supabase...');
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Variables de entorno de Supabase no encontradas');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔍 Verificando conexión y tablas existentes...');
    
    // Verificar conexión listando cursos
    const { data: courses, error: coursesError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .limit(3);
    
    if (coursesError) {
      console.error('❌ Error conectando a Supabase:', coursesError.message);
      return;
    }
    
    console.log('✅ Conexión exitosa a Supabase');
    console.log(`📚 Cursos encontrados: ${courses?.length || 0}`);
    
    // Verificar si user_course_summary existe
    const { data: summaryTest, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('id')
      .limit(1);
    
    if (!summaryError) {
      console.log('✅ La tabla user_course_summary ya existe');
      
      const { count } = await supabase
        .from('user_course_summary')
        .select('*', { count: 'exact', head: true });
      
      console.log(`📊 Registros en user_course_summary: ${count}`);
      return;
    }
    
    console.log('⚠️ La tabla user_course_summary no existe');
    console.log('📝 Error específico:', summaryError.message);
    
    // Verificar user_course_progress
    const { data: progressData, error: progressError } = await supabase
      .from('user_course_progress')
      .select('user_id, course_id, percentage_completed, time_spent_minutes')
      .limit(5);
    
    if (progressError) {
      console.error('❌ Error accediendo a user_course_progress:', progressError.message);
    } else {
      console.log(`📊 Registros en user_course_progress: ${progressData?.length || 0}`);
    }
    
    // Verificar inscripciones
    const { data: inscripciones, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('user_id, curso_id')
      .limit(5);
    
    if (inscripcionesError) {
      console.error('❌ Error accediendo a inscripciones:', inscripcionesError.message);
    } else {
      console.log(`📊 Registros en inscripciones: ${inscripciones?.length || 0}`);
    }
    
    console.log('\n🔧 INSTRUCCIONES PARA CREAR LA TABLA MANUALMENTE:');
    console.log('\n1. Ve al Dashboard de Supabase');
    console.log('2. Abre el SQL Editor');
    console.log('3. Ejecuta el siguiente SQL:');
    console.log('\n' + '='.repeat(50));
    console.log(`
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
CREATE INDEX IF NOT EXISTS idx_user_course_summary_progress ON public.user_course_summary(progress_percentage);

-- Habilitar RLS
ALTER TABLE public.user_course_summary ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS
CREATE POLICY "Users can view their own course summary" ON public.user_course_summary
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own course summary" ON public.user_course_summary
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course summary" ON public.user_course_summary
    FOR UPDATE USING (auth.uid() = user_id);

-- Poblar datos iniciales (si existen datos en user_course_progress)
INSERT INTO public.user_course_summary (
    user_id,
    course_id,
    total_lessons,
    completed_lessons,
    progress_percentage,
    total_time_spent,
    started_at,
    last_accessed_at
)
SELECT DISTINCT
    ucp.user_id,
    ucp.course_id,
    (SELECT COUNT(*) FROM public.lecciones WHERE curso_id = ucp.course_id),
    COUNT(CASE WHEN ucp.percentage_completed >= 100 THEN 1 END),
    COALESCE(AVG(ucp.percentage_completed), 0),
    COALESCE(SUM(ucp.time_spent_minutes), 0),
    MIN(ucp.created_at),
    MAX(ucp.updated_at)
FROM public.user_course_progress ucp
GROUP BY ucp.user_id, ucp.course_id
ON CONFLICT (user_id, course_id) DO NOTHING;
`);
    console.log('='.repeat(50));
    
    console.log('\n4. Después de ejecutar el SQL, ejecuta este script nuevamente para verificar');
    
  } catch (err) {
    console.error('❌ Error general:', err.message);
    console.log('\n📋 Información de debug:');
    console.log('- URL:', supabaseUrl);
    console.log('- Key presente:', !!supabaseKey);
  }
}

// Ejecutar la función
createTableDirect()
  .then(() => {
    console.log('\n🏁 Diagnóstico completado');
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 Error fatal:', err);
    process.exit(1);
  });