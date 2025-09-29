-- Script para añadir columna 'id' faltante a la tabla inscripciones
-- Ejecutar en Supabase SQL Editor

BEGIN;

-- Verificar estructura actual
SELECT 'Estructura actual de inscripciones:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'inscripciones' 
ORDER BY ordinal_position;

-- Añadir columna id como primary key
ALTER TABLE inscripciones 
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Añadir columna created_at si no existe
ALTER TABLE inscripciones 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Verificar estructura después de los cambios
SELECT 'Estructura después de añadir id:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'inscripciones' 
ORDER BY ordinal_position;

-- Mostrar datos actuales
SELECT 'Datos actuales en inscripciones:' as info;
SELECT * FROM inscripciones LIMIT 10;

COMMIT;

SELECT '✅ Columna id añadida exitosamente a la tabla inscripciones' as resultado;