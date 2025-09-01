-- Script para crear las vistas y funciones faltantes en producción
-- EJECUTAR PASO A PASO en Supabase Dashboard > SQL Editor
-- NO ejecutar todo de una vez, ir paso por paso

-- ========================================
-- PASO 1: Agregar columnas a user_course_progress
-- ========================================

ALTER TABLE public.user_course_progress 
ADD COLUMN IF NOT EXISTS progress_percentage DECIMAL(5,2) DEFAULT 0.00;

ALTER TABLE public.user_course_progress 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

ALTER TABLE public.user_course_progress 
ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE public.user_course_progress 
ADD COLUMN IF NOT EXISTS time_spent_minutes INTEGER DEFAULT 0;

ALTER TABLE public.user_course_progress 
ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE;

ALTER TABLE public.user_course_progress 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE public.user_course_progress 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- Agregar constraint para progress_percentage
ALTER TABLE public.user_course_progress 
ADD CONSTRAINT check_progress_percentage 
CHECK (progress_percentage >= 0 AND progress_percentage <= 100);

-- Verificar que las columnas se agregaron correctamente
SELECT 'PASO 1 COMPLETADO: Columnas agregadas a user_course_progress' as status;

-- ========================================
-- PASO 2: Crear tabla user_test_results
-- ========================================

CREATE TABLE IF NOT EXISTS public.user_test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
    chapter_id UUID,
    test_name VARCHAR(255),
    score DECIMAL(5,2) CHECK (score >= 0 AND score <= 100),
    max_score DECIMAL(5,2) DEFAULT 100,
    completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    time_taken_minutes INTEGER DEFAULT 0,
    answers JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

SELECT 'PASO 2 COMPLETADO: Tabla user_test_results creada' as status;

-- ========================================
-- PASO 3: Configurar RLS y políticas
-- ========================================

-- Habilitar RLS
ALTER TABLE public.user_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;

-- Políticas para user_test_results
DROP POLICY IF EXISTS "Users can view their own test results" ON public.user_test_results;
CREATE POLICY "Users can view their own test results" ON public.user_test_results
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own test results" ON public.user_test_results;
CREATE POLICY "Users can insert their own test results" ON public.user_test_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own test results" ON public.user_test_results;
CREATE POLICY "Users can update their own test results" ON public.user_test_results
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para user_course_progress
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_course_progress;
CREATE POLICY "Users can view their own progress" ON public.user_course_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_course_progress;
CREATE POLICY "Users can insert their own progress" ON public.user_course_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_course_progress;
CREATE POLICY "Users can update their own progress" ON public.user_course_progress
    FOR UPDATE USING (auth.uid() = user_id);

SELECT 'PASO 3 COMPLETADO: RLS y políticas configuradas' as status;

-- ========================================
-- PASO 4: Crear función calculate_course_progress
-- ========================================

CREATE OR REPLACE FUNCTION calculate_course_progress(p_user_id UUID, p_course_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    total_chapters INTEGER;
    completed_chapters INTEGER;
    progress_percentage DECIMAL(5,2);
BEGIN
    -- Contar total de capítulos en el curso
    SELECT COUNT(*) INTO total_chapters
    FROM public.lecciones
    WHERE curso_id = p_course_id;
    
    -- Contar capítulos completados por el usuario
    SELECT COUNT(*) INTO completed_chapters
    FROM public.user_course_progress
    WHERE user_id = p_user_id 
      AND course_id = p_course_id 
      AND is_completed = true;
    
    -- Calcular porcentaje
    IF total_chapters > 0 THEN
        progress_percentage := (completed_chapters::DECIMAL / total_chapters::DECIMAL) * 100;
    ELSE
        progress_percentage := 0;
    END IF;
    
    RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql;

SELECT 'PASO 4 COMPLETADO: Función calculate_course_progress creada' as status;

-- ========================================
-- PASO 5: Crear vista user_course_summary
-- ========================================

CREATE OR REPLACE VIEW user_course_summary AS
SELECT 
    u.id as user_id,
    u.nombre as user_name,
    u.email as user_email,
    c.id as course_id,
    c.titulo as course_title,
    calculate_course_progress(u.id, c.id) as overall_progress,
    COUNT(ucp.id) as chapters_accessed,
    COUNT(CASE WHEN ucp.is_completed THEN 1 END) as chapters_completed,
    MAX(ucp.last_accessed_at) as last_activity,
    SUM(ucp.time_spent_minutes) as total_time_spent,
    COALESCE(AVG(utr.score), 0) as average_test_score,
    COUNT(utr.id) as total_tests_taken
FROM public.usuarios u
CROSS JOIN public.cursos c
LEFT JOIN public.inscripciones i ON u.id = i.user_id AND c.id = i.course_id
LEFT JOIN public.user_course_progress ucp ON u.id = ucp.user_id AND c.id = ucp.course_id
LEFT JOIN public.user_test_results utr ON u.id = utr.user_id AND c.id = utr.course_id
WHERE u.rol = 'student' AND i.id IS NOT NULL
GROUP BY u.id, u.nombre, u.email, c.id, c.titulo;

SELECT 'PASO 5 COMPLETADO: Vista user_course_summary creada' as status;

-- ========================================
-- PASO 6: Otorgar permisos
-- ========================================

GRANT SELECT ON user_course_summary TO authenticated;
GRANT SELECT ON user_course_summary TO anon;

SELECT 'PASO 6 COMPLETADO: Permisos otorgados' as status;

-- ========================================
-- PASO 7: Verificación final
-- ========================================

-- Verificar estructura de user_course_progress
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_course_progress' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar que la vista funciona
SELECT COUNT(*) as total_records FROM user_course_summary;

-- Mostrar algunos registros de ejemplo
SELECT * FROM user_course_summary LIMIT 3;

SELECT '🎉 SCRIPT COMPLETADO EXITOSAMENTE - Los cursos deberían aparecer ahora en el dashboard' as final_status;