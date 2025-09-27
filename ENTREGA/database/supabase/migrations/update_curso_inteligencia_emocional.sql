-- Script para cambiar el nombre del curso 'Inteligencia Emocional' a 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL'
-- Fecha: 2024-12-20

-- Primero verificamos si existe el curso con título relacionado a 'Inteligencia Emocional'
SELECT id, titulo, descripcion 
FROM cursos 
WHERE titulo ILIKE '%inteligencia%emocional%' 
   OR titulo ILIKE '%nuevo%inteligencia%emocional%';

-- Actualizamos el título del curso
UPDATE cursos 
SET titulo = 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL',
    descripcion = COALESCE(descripcion, 'Máster especializado en adicciones e intervención psicosocial')
WHERE titulo ILIKE '%inteligencia%emocional%' 
   OR titulo ILIKE '%nuevo%inteligencia%emocional%';

-- Verificamos que el cambio se aplicó correctamente
SELECT id, titulo, descripcion, creado_en
FROM cursos 
WHERE titulo = 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL';

-- Mostramos un mensaje de confirmación
SELECT 'Curso actualizado exitosamente' as mensaje;