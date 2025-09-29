-- Verificar el orden de cuestionarios para la lección 2

-- Primero, encontrar la lección 2
SELECT id, titulo, orden 
FROM lecciones 
WHERE orden = 2 OR titulo ILIKE '%¿Qué es una adicción%'
ORDER BY orden;

-- Obtener todos los cuestionarios de la lección 2
SELECT c.id, c.titulo, l.titulo as leccion_titulo
FROM cuestionarios c
JOIN lecciones l ON c.leccion_id = l.id
WHERE (l.orden = 2 OR l.titulo ILIKE '%¿Qué es una adicción%')
ORDER BY c.id;

-- Verificar qué cuestionario se obtendría con LIMIT 1 (sin ORDER BY)
SELECT c.id, c.titulo
FROM cuestionarios c
JOIN lecciones l ON c.leccion_id = l.id
WHERE (l.orden = 2 OR l.titulo ILIKE '%¿Qué es una adicción%')
LIMIT 1;

-- Buscar específicamente el cuestionario de texto libre
SELECT c.id, c.titulo
FROM cuestionarios c
JOIN lecciones l ON c.leccion_id = l.id
WHERE (l.orden = 2 OR l.titulo ILIKE '%¿Qué es una adicción%')
AND c.titulo = 'Definición conducta adictiva';