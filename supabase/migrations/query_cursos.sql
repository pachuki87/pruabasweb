-- Consultar todos los cursos existentes
SELECT id, titulo, descripcion, creado_en 
FROM cursos 
ORDER BY titulo, creado_en;

-- Contar cursos por título para identificar duplicados
SELECT titulo, COUNT(*) as cantidad
FROM cursos 
GROUP BY titulo 
HAVING COUNT(*) > 1;