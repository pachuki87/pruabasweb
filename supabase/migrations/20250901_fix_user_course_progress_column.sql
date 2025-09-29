-- Migración para corregir los nombres de columnas en user_course_progress

-- Verificamos si la tabla existe
DO $$
BEGIN
    -- Verificamos si la columna chapter_id no existe
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_course_progress' 
        AND column_name = 'chapter_id'
    ) THEN
        -- Añadimos la columna chapter_id si no existe
        ALTER TABLE public.user_course_progress ADD COLUMN chapter_id UUID;
        RAISE NOTICE 'Columna chapter_id añadida';
    END IF;
    
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
END
$$;