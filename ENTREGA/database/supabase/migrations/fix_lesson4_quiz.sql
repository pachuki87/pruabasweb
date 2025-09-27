-- Verificar y actualizar la lección 4 para mostrar el cuestionario

-- Primero, verificar el estado actual de la lección 4
SELECT id, titulo, orden, tiene_cuestionario 
FROM lecciones 
WHERE orden = 4;

-- Verificar si existe el cuestionario para la lección 4
SELECT c.id, c.titulo, c.leccion_id, l.titulo as lesson_title
FROM cuestionarios c
JOIN lecciones l ON c.leccion_id = l.id
WHERE l.orden = 4;

-- Actualizar la lección 4 para que tenga_cuestionario sea true
UPDATE lecciones 
SET tiene_cuestionario = true 
WHERE orden = 4 AND id IN (
  SELECT DISTINCT l.id 
  FROM lecciones l 
  JOIN cuestionarios c ON c.leccion_id = l.id 
  WHERE l.orden = 4
);

-- Verificar el resultado
SELECT id, titulo, orden, tiene_cuestionario 
FROM lecciones 
WHERE orden = 4;