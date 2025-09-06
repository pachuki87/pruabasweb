-- Migración para corregir los nombres de columnas en user_course_progress

-- Primero, verificamos si la tabla existe
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_course_progress'
    ) THEN
        -- Verificamos si la columna course_id existe
        IF EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_course_progress' 
            AND column_name = 'course_id'
        ) THEN
            -- Renombramos course_id a curso_id si existe
            ALTER TABLE public.user_course_progress RENAME COLUMN course_id TO curso_id;
            RAISE NOTICE 'Columna course_id renombrada a curso_id';
        END IF;
        
        -- Verificamos si la columna chapter_id no existe
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_course_progress' 
            AND column_name = 'chapter_id'
        ) THEN
            -- Añadimos la columna chapter_id si no existe
            ALTER TABLE public.user_course_progress ADD COLUMN chapter_id UUID REFERENCES public.lecciones(id) ON DELETE CASCADE;
            RAISE NOTICE 'Columna chapter_id añadida';
        END IF;
        
        -- Actualizamos las funciones que usan course_id
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
              AND curso_id = p_course_id 
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
        
        -- Actualizamos la vista user_course_summary si existe
        IF EXISTS (
            SELECT FROM information_schema.views 
            WHERE table_schema = 'public' 
            AND table_name = 'user_course_summary'
        ) THEN
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
            LEFT JOIN public.inscripciones i ON u.id = i.user_id AND c.id = i.curso_id
            LEFT JOIN public.user_course_progress ucp ON u.id = ucp.user_id AND c.id = ucp.curso_id
            LEFT JOIN public.user_test_results utr ON u.id = utr.user_id AND c.id = utr.course_id
            WHERE u.rol = 'student'
            GROUP BY u.id, u.nombre, u.email, c.id, c.titulo;
            
            RAISE NOTICE 'Vista user_course_summary actualizada';
        END IF;
    ELSE
        RAISE NOTICE 'La tabla user_course_progress no existe';
    END IF;
END
$$;