-- Eliminar el curso duplicado restante
-- Solo mantener el curso 'Experto en Conductas Adictivas' con contenido completo

-- Eliminar inscripciones del curso duplicado restante
DELETE FROM inscripciones 
WHERE curso_id = 'ea12c8bf-91a9-4614-91de-ca650654fe11';

-- Eliminar materiales del curso duplicado restante
DELETE FROM materiales 
WHERE curso_id = 'ea12c8bf-91a9-4614-91de-ca650654fe11';

-- Eliminar lecciones del curso duplicado restante
DELETE FROM lecciones 
WHERE curso_id = 'ea12c8bf-91a9-4614-91de-ca650654fe11';

-- Eliminar cuestionarios del curso duplicado restante
DELETE FROM cuestionarios 
WHERE curso_id = 'ea12c8bf-91a9-4614-91de-ca650654fe11';

-- Eliminar relaciones curso_cuestionarios del curso duplicado restante
DELETE FROM curso_cuestionarios 
WHERE curso_id = 'ea12c8bf-91a9-4614-91de-ca650654fe11';

-- Eliminar el curso duplicado restante
DELETE FROM cursos 
WHERE id = 'ea12c8bf-91a9-4614-91de-ca650654fe11';

-- Verificar que solo queda un curso
SELECT id, titulo, descripcion, creado_en FROM cursos ORDER BY creado_en DESC;