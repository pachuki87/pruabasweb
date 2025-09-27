-- Migración para añadir columnas de opciones a la tabla preguntas
-- Ejecutar en: https://supabase.com/dashboard/project/lyojcqiiixkqqtpoejdo/sql

-- Añadir columnas para las opciones múltiples
ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS opcion_a TEXT;
ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS opcion_b TEXT;
ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS opcion_c TEXT;
ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS opcion_d TEXT;

-- Añadir columna para la respuesta correcta
ALTER TABLE preguntas ADD COLUMN IF NOT EXISTS respuesta_correcta VARCHAR(1);

-- Añadir constraint para validar respuesta correcta (opcional)
-- ALTER TABLE preguntas ADD CONSTRAINT check_respuesta_correcta 
--   CHECK (respuesta_correcta IN ('a', 'b', 'c', 'd') OR respuesta_correcta IS NULL);

-- Verificar la estructura actualizada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'preguntas' 
ORDER BY ordinal_position;