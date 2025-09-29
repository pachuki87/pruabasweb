-- =====================================================
-- SCRIPT PARA SOLUCIONAR ERRORES DE BASE DE DATOS
-- =====================================================
-- Ejecutar este script en el SQL Editor de Supabase Dashboard

-- 1. CREAR TABLA user_course_summary FALTANTE
-- =====================================================
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

-- 2. CREAR ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_course_summary_user_id ON public.user_course_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_summary_course_id ON public.user_course_summary(course_id);
CREATE INDEX IF NOT EXISTS idx_user_course_summary_progress ON public.user_course_summary(progress_percentage);

-- 3. HABILITAR ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.user_course_summary ENABLE ROW LEVEL SECURITY;

-- 4. CREAR POLÍTICAS RLS
-- =====================================================
DROP POLICY IF EXISTS "Users can view own course summary" ON public.user_course_summary;
CREATE POLICY "Users can view own course summary" ON public.user_course_summary
  FOR SELECT USING (auth.uid() = user_id);
  
DROP POLICY IF EXISTS "Users can insert own course summary" ON public.user_course_summary;
CREATE POLICY "Users can insert own course summary" ON public.user_course_summary
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
DROP POLICY IF EXISTS "Users can update own course summary" ON public.user_course_summary;
CREATE POLICY "Users can update own course summary" ON public.user_course_summary
  FOR UPDATE USING (auth.uid() = user_id);

-- 5. VERIFICAR Y CORREGIR RELACIONES EN user_course_progress
-- =====================================================
-- Verificar si existe la columna leccion_id en user_course_progress
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_course_progress' 
                   AND column_name = 'leccion_id') THEN
        ALTER TABLE public.user_course_progress 
        ADD COLUMN leccion_id UUID REFERENCES public.lecciones(id) ON DELETE CASCADE;
        
        CREATE INDEX IF NOT EXISTS idx_user_course_progress_leccion_id 
        ON public.user_course_progress(leccion_id);
    END IF;
END $$;

-- 6. CREAR FUNCIÓN PARA ACTUALIZAR user_course_summary AUTOMÁTICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION update_user_course_summary()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar o insertar resumen del curso
    INSERT INTO public.user_course_summary (
        user_id, 
        course_id, 
        total_lessons, 
        completed_lessons, 
        progress_percentage,
        total_time_spent,
        last_accessed_at,
        updated_at
    )
    SELECT 
        NEW.user_id,
        NEW.course_id,
        (SELECT COUNT(*) FROM public.lecciones WHERE curso_id = NEW.course_id),
        COUNT(CASE WHEN ucp.percentage_completed >= 100 THEN 1 END),
        COALESCE(AVG(ucp.percentage_completed), 0),
        COALESCE(SUM(ucp.time_spent_minutes), 0),
        NOW(),
        NOW()
    FROM public.user_course_progress ucp
    WHERE ucp.user_id = NEW.user_id AND ucp.course_id = NEW.course_id
    GROUP BY NEW.user_id, NEW.course_id
    ON CONFLICT (user_id, course_id) 
    DO UPDATE SET
        completed_lessons = EXCLUDED.completed_lessons,
        progress_percentage = EXCLUDED.progress_percentage,
        total_time_spent = EXCLUDED.total_time_spent,
        last_accessed_at = EXCLUDED.last_accessed_at,
        updated_at = EXCLUDED.updated_at;
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. CREAR TRIGGER PARA ACTUALIZACIÓN AUTOMÁTICA
-- =====================================================
DROP TRIGGER IF EXISTS trigger_update_course_summary ON public.user_course_progress;
CREATE TRIGGER trigger_update_course_summary
    AFTER INSERT OR UPDATE ON public.user_course_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_user_course_summary();

-- 8. POBLAR DATOS INICIALES EN user_course_summary
-- =====================================================
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

-- 9. COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================
COMMENT ON TABLE public.user_course_summary IS 'Resumen del progreso de usuarios por curso - soluciona error PGRST205';
COMMENT ON COLUMN public.user_course_summary.progress_percentage IS 'Porcentaje de progreso del curso (0-100)';
COMMENT ON COLUMN public.user_course_summary.total_time_spent IS 'Tiempo total gastado en minutos';

-- 10. VERIFICACIÓN FINAL
-- =====================================================
SELECT 
    'user_course_summary' as tabla,
    COUNT(*) as registros
FROM public.user_course_summary
UNION ALL
SELECT 
    'user_course_progress' as tabla,
    COUNT(*) as registros
FROM public.user_course_progress;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
-- Después de ejecutar este script:
-- 1. La tabla user_course_summary estará creada
-- 2. Las relaciones estarán corregidas
-- 3. Los triggers mantendrán los datos sincronizados
-- 4. Los errores PGRST205 deberían desaparecer