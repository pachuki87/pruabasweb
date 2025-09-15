-- Migración para agregar columna leccion_id a la tabla preguntas
-- y establecer las relaciones correctas

-- Paso 1: Agregar la columna leccion_id
ALTER TABLE preguntas 
ADD COLUMN IF NOT EXISTS leccion_id UUID REFERENCES lecciones(id);

-- Paso 2: Crear índice para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_preguntas_leccion_id ON preguntas(leccion_id);

-- Paso 3: Actualizar preguntas existentes con leccion_id basado en cuestionarios
UPDATE preguntas 
SET leccion_id = c.leccion_id
FROM cuestionarios c
WHERE preguntas.cuestionario_id = c.id
AND preguntas.leccion_id IS NULL
AND c.leccion_id IS NOT NULL;

-- Verificar el resultado
SELECT 
    'Preguntas con leccion_id' as tipo,
    COUNT(*) as cantidad
FROM preguntas 
WHERE leccion_id IS NOT NULL

UNION ALL

SELECT 
    'Preguntas sin leccion_id' as tipo,
    COUNT(*) as cantidad
FROM preguntas 
WHERE leccion_id IS NULL;

-- Mostrar algunas preguntas actualizadas
SELECT 
    p.id,
    p.pregunta,
    p.cuestionario_id,
    p.leccion_id,
    c.titulo as cuestionario_titulo,
    l.titulo as leccion_titulo
FROM preguntas p
JOIN cuestionarios c ON p.cuestionario_id = c.id
LEFT JOIN lecciones l ON p.leccion_id = l.id
LIMIT 10;