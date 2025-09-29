-- Migración para resolver inconsistencia entre course_id y curso_id
-- Problema: inscripciones usa course_id, lecciones usa curso_id
-- Solución: Estandarizar todo a course_id

BEGIN;

-- 1. Verificar estructura actual de las tablas
SELECT 'Columnas actuales en inscripciones:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'inscripciones' 
AND column_name IN ('course_id', 'curso_id')
ORDER BY column_name;

SELECT 'Columnas actuales en lecciones:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'lecciones' 
AND column_name IN ('course_id', 'curso_id')
ORDER BY column_name;

-- 2. Actualizar tabla lecciones: curso_id -> course_id
-- Solo si la columna curso_id existe
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'lecciones' AND column_name = 'curso_id') THEN
        
        -- Primero eliminar constraints que puedan existir
        ALTER TABLE lecciones DROP CONSTRAINT IF EXISTS lecciones_curso_id_fkey;
        
        -- Renombrar la columna
        ALTER TABLE lecciones RENAME COLUMN curso_id TO course_id;
        
        -- Recrear foreign key constraint si la tabla cursos existe
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cursos') THEN
            ALTER TABLE lecciones 
            ADD CONSTRAINT lecciones_course_id_fkey 
            FOREIGN KEY (course_id) REFERENCES cursos(id) ON DELETE CASCADE;
        END IF;
        
        -- Recrear índices
        DROP INDEX IF EXISTS idx_lecciones_curso_id;
        CREATE INDEX idx_lecciones_course_id ON lecciones(course_id);
        CREATE INDEX idx_lecciones_course_orden ON lecciones(course_id, orden);
        
        RAISE NOTICE 'Actualizada tabla lecciones: curso_id -> course_id';
    ELSE
        RAISE NOTICE 'La columna curso_id no existe en lecciones, omitiendo';
    END IF;
END
$$;

-- 3. Actualizar tabla materiales si tiene curso_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'materiales' AND column_name = 'curso_id') THEN
        
        ALTER TABLE materiales DROP CONSTRAINT IF EXISTS materiales_curso_id_fkey;
        ALTER TABLE materiales RENAME COLUMN curso_id TO course_id;
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cursos') THEN
            ALTER TABLE materiales 
            ADD CONSTRAINT materiales_course_id_fkey 
            FOREIGN KEY (course_id) REFERENCES cursos(id) ON DELETE CASCADE;
        END IF;
        
        RAISE NOTICE 'Actualizada tabla materiales: curso_id -> course_id';
    ELSE
        RAISE NOTICE 'La columna curso_id no existe en materiales, omitiendo';
    END IF;
END
$$;

-- 4. Actualizar tabla cuestionarios si tiene curso_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'cuestionarios' AND column_name = 'curso_id') THEN
        
        ALTER TABLE cuestionarios DROP CONSTRAINT IF EXISTS cuestionarios_curso_id_fkey;
        ALTER TABLE cuestionarios RENAME COLUMN curso_id TO course_id;
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cursos') THEN
            ALTER TABLE cuestionarios 
            ADD CONSTRAINT cuestionarios_course_id_fkey 
            FOREIGN KEY (course_id) REFERENCES cursos(id) ON DELETE CASCADE;
        END IF;
        
        RAISE NOTICE 'Actualizada tabla cuestionarios: curso_id -> course_id';
    ELSE
        RAISE NOTICE 'La columna curso_id no existe en cuestionarios, omitiendo';
    END IF;
END
$$;

-- 5. Verificar que inscripciones ya tenga course_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'inscripciones' AND column_name = 'course_id') THEN
        
        -- Si inscripciones tiene curso_id, renombrarlo
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'inscripciones' AND column_name = 'curso_id') THEN
            
            ALTER TABLE inscripciones DROP CONSTRAINT IF EXISTS inscripciones_curso_id_fkey;
            ALTER TABLE inscripciones RENAME COLUMN curso_id TO course_id;
            
            IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cursos') THEN
                ALTER TABLE inscripciones 
                ADD CONSTRAINT inscripciones_course_id_fkey 
                FOREIGN KEY (course_id) REFERENCES cursos(id) ON DELETE CASCADE;
            END IF;
            
            RAISE NOTICE 'Actualizada tabla inscripciones: curso_id -> course_id';
        END IF;
    ELSE
        RAISE NOTICE 'La tabla inscripciones ya tiene course_id';
    END IF;
END
$$;

-- 6. Verificación final
SELECT 'VERIFICACIÓN FINAL - Columnas después de la migración:' as info;

SELECT 'inscripciones' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'inscripciones' 
AND column_name IN ('course_id', 'curso_id')
UNION ALL
SELECT 'lecciones' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'lecciones' 
AND column_name IN ('course_id', 'curso_id')
UNION ALL
SELECT 'materiales' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'materiales' 
AND column_name IN ('course_id', 'curso_id')
UNION ALL
SELECT 'cuestionarios' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cuestionarios' 
AND column_name IN ('course_id', 'curso_id')
ORDER BY tabla, column_name;

COMMIT;

-- Mensaje final
SELECT '✅ Migración completada. Todas las tablas ahora usan course_id de forma consistente.' as resultado;