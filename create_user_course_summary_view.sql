-- Script para crear la vista user_course_summary en Supabase
-- Copiar y pegar este contenido en el SQL Editor de Supabase Dashboard

-- Eliminar vista si existe
DROP VIEW IF EXISTS public.user_course_summary;

-- Crear la vista user_course_summary
CREATE OR REPLACE VIEW public.user_course_summary AS
SELECT 
    u.id as user_id,
    u.nombre as user_name,
    u.email as user_email,
    c.id as course_id,
    c.titulo as course_title,
    i.fecha_inscripcion as enrollment_date,
    -- Progreso basado en lecciones completadas
    COALESCE(
        (SELECT COUNT(*) 
         FROM public.user_progress up 
         WHERE up.user_id = u.id 
           AND up.curso_id = c.id 
           AND up.estado = 'completado'
        ), 0
    ) as lessons_completed,
    -- Total de lecciones del curso
    COALESCE(
        (SELECT COUNT(*) 
         FROM public.lecciones l 
         WHERE l.curso_id = c.id
        ), 0
    ) as total_lessons,
    -- Porcentaje de progreso
    CASE 
        WHEN (SELECT COUNT(*) FROM public.lecciones l WHERE l.curso_id = c.id) > 0 THEN
            ROUND(
                (SELECT COUNT(*) FROM public.user_progress up 
                 WHERE up.user_id = u.id AND up.curso_id = c.id AND up.estado = 'completado') * 100.0 /
                (SELECT COUNT(*) FROM public.lecciones l WHERE l.curso_id = c.id), 2
            )
        ELSE 0
    END as overall_progress,
    -- Última actividad
    COALESCE(
        (SELECT MAX(up.ultima_actividad) 
         FROM public.user_progress up 
         WHERE up.user_id = u.id AND up.curso_id = c.id
        ), i.fecha_inscripcion
    ) as last_activity,
    -- Tiempo total estudiado
    COALESCE(
        (SELECT SUM(up.tiempo_estudiado) 
         FROM public.user_progress up 
         WHERE up.user_id = u.id AND up.curso_id = c.id
        ), 0
    ) as total_time_spent,
    -- Resultados de tests
    COALESCE(
        (SELECT AVG(utr.score) 
         FROM public.user_test_results utr 
         WHERE utr.user_id = u.id AND utr.course_id = c.id
        ), 0
    ) as average_test_score,
    COALESCE(
        (SELECT COUNT(*) 
         FROM public.user_test_results utr 
         WHERE utr.user_id = u.id AND utr.course_id = c.id
        ), 0
    ) as total_tests_taken
FROM public.usuarios u
INNER JOIN public.inscripciones i ON u.id = i.user_id
INNER JOIN public.cursos c ON i.curso_id = c.id
WHERE u.rol = 'student';

-- Otorgar permisos a la vista
GRANT SELECT ON public.user_course_summary TO authenticated;
GRANT SELECT ON public.user_course_summary TO anon;

-- Verificar que la vista se creó correctamente
SELECT * FROM public.user_course_summary LIMIT 5;