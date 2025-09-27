-- Script SQL para corregir la asignación de preguntas al curso Master
-- ID del curso Master: b5ef8c64-fe26-4f20-8221-80a1bf475b05

-- 1. Verificar el estado actual
SELECT 
    'Cuestionarios del Master' as tipo,
    COUNT(*) as cantidad
FROM cuestionarios 
WHERE curso_id = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'

UNION ALL

SELECT 
    'Preguntas sin curso_id de cuestionarios del Master' as tipo,
    COUNT(*) as cantidad
FROM preguntas p
INNER JOIN cuestionarios c ON p.cuestionario_id = c.id
WHERE c.curso_id = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'
  AND p.curso_id IS NULL;

-- 2. Mostrar detalles de preguntas problemáticas
SELECT 
    p.id as pregunta_id,
    p.texto,
    p.cuestionario_id,
    c.titulo as cuestionario_titulo
FROM preguntas p
INNER JOIN cuestionarios c ON p.cuestionario_id = c.id
WHERE c.curso_id = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'
  AND p.curso_id IS NULL
LIMIT 10;

-- 3. CORRECCIÓN: Actualizar preguntas sin curso_id
-- IMPORTANTE: Ejecutar solo después de verificar los datos anteriores

/*
UPDATE preguntas 
SET curso_id = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'
WHERE id IN (
    SELECT p.id
    FROM preguntas p
    INNER JOIN cuestionarios c ON p.cuestionario_id = c.id
    WHERE c.curso_id = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'
      AND p.curso_id IS NULL
);
*/

-- 4. Verificación después de la corrección
/*
SELECT 
    'Preguntas corregidas' as resultado,
    COUNT(*) as cantidad
FROM preguntas p
INNER JOIN cuestionarios c ON p.cuestionario_id = c.id
WHERE c.curso_id = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'
  AND p.curso_id = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

SELECT 
    'Preguntas aún sin corregir' as resultado,
    COUNT(*) as cantidad
FROM preguntas p
INNER JOIN cuestionarios c ON p.cuestionario_id = c.id
WHERE c.curso_id = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'
  AND p.curso_id IS NULL;
*/

-- 5. Script completo de corrección (descomenta para ejecutar)
/*
-- Paso 1: Verificar datos antes de la corrección
DO $$
DECLARE
    cuestionarios_count INTEGER;
    preguntas_sin_curso_count INTEGER;
BEGIN
    -- Contar cuestionarios del Master
    SELECT COUNT(*) INTO cuestionarios_count
    FROM cuestionarios 
    WHERE curso_id = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
    
    -- Contar preguntas sin curso_id
    SELECT COUNT(*) INTO preguntas_sin_curso_count
    FROM preguntas p
    INNER JOIN cuestionarios c ON p.cuestionario_id = c.id
    WHERE c.curso_id = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'
      AND p.curso_id IS NULL;
    
    RAISE NOTICE 'Cuestionarios del Master: %', cuestionarios_count;
    RAISE NOTICE 'Preguntas sin curso_id: %', preguntas_sin_curso_count;
    
    -- Solo proceder si hay preguntas que corregir
    IF preguntas_sin_curso_count > 0 THEN
        RAISE NOTICE 'Iniciando corrección de % preguntas...', preguntas_sin_curso_count;
        
        -- Actualizar preguntas
        UPDATE preguntas 
        SET curso_id = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'
        WHERE id IN (
            SELECT p.id
            FROM preguntas p
            INNER JOIN cuestionarios c ON p.cuestionario_id = c.id
            WHERE c.curso_id = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'
              AND p.curso_id IS NULL
        );
        
        RAISE NOTICE 'Corrección completada. Preguntas actualizadas: %', ROW_COUNT;
    ELSE
        RAISE NOTICE 'No hay preguntas que corregir.';
    END IF;
END $$;
*/