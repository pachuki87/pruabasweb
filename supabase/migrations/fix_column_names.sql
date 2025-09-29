-- Migración para corregir nombres de columnas de inglés a español
-- Fecha: 2024-01-15

-- 1. Actualizar tabla inscripciones: user_id -> usuario_id
ALTER TABLE inscripciones RENAME COLUMN user_id TO usuario_id;

-- 2. Actualizar tabla user_course_progress: user_id -> usuario_id
ALTER TABLE user_course_progress RENAME COLUMN user_id TO usuario_id;

-- 3. Actualizar tabla user_test_results: user_id -> usuario_id
ALTER TABLE user_test_results RENAME COLUMN user_id TO usuario_id;

-- 4. Actualizar tabla user_course_summary: user_id -> usuario_id
ALTER TABLE user_course_summary RENAME COLUMN user_id TO usuario_id;

-- 5. Actualizar tabla respuestas_texto_libre: user_id -> usuario_id (manejar valores 'anonymous')
-- Primero, eliminar la restricción NOT NULL temporalmente
ALTER TABLE respuestas_texto_libre ALTER COLUMN user_id DROP NOT NULL;
-- Actualizar valores 'anonymous' a NULL
UPDATE respuestas_texto_libre SET user_id = NULL WHERE user_id = 'anonymous';
-- Cambiar el tipo de columna
ALTER TABLE respuestas_texto_libre ALTER COLUMN user_id TYPE uuid USING 
  CASE 
    WHEN user_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN user_id::uuid
    ELSE NULL
  END;
-- Renombrar la columna
ALTER TABLE respuestas_texto_libre RENAME COLUMN user_id TO usuario_id;

-- 6. Verificar que no hay más referencias a quiz_id (ya debería estar como cuestionario_id)
-- Las foreign keys se actualizarán automáticamente con el RENAME COLUMN

-- 7. Otorgar permisos a los roles anon y authenticated
GRANT SELECT ON inscripciones TO anon;
GRANT ALL PRIVILEGES ON inscripciones TO authenticated;

GRANT SELECT ON user_course_progress TO anon;
GRANT ALL PRIVILEGES ON user_course_progress TO authenticated;

GRANT SELECT ON user_test_results TO anon;
GRANT ALL PRIVILEGES ON user_test_results TO authenticated;

GRANT SELECT ON user_course_summary TO anon;
GRANT ALL PRIVILEGES ON user_course_summary TO authenticated;

GRANT SELECT ON respuestas_texto_libre TO anon;
GRANT ALL PRIVILEGES ON respuestas_texto_libre TO authenticated;