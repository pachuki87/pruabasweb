-- Script para verificar que el curso fue actualizado correctamente
-- Fecha: 2024-12-20

-- Consultar todos los cursos para verificar el cambio
SELECT id, titulo, descripcion, creado_en
FROM cursos 
ORDER BY creado_en DESC;

-- Buscar específicamente el curso actualizado
SELECT id, titulo, descripcion, creado_en
FROM cursos 
WHERE titulo = 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL';