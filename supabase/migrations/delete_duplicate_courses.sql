-- Eliminar cursos duplicados de 'Inteligencia Emocional'
-- Mantenemos solo el más reciente: b5ef8c64-fe26-4f20-8221-80a1bf475b05

-- Primero eliminamos las relaciones en otras tablas para evitar errores de foreign key

-- Eliminar lecciones de los cursos duplicados
DELETE FROM lecciones WHERE curso_id IN (
  '95a4d042-6ab3-452f-bd72-71c516bd5709',
  '09c834da-b646-4245-896a-bff5f1563b75', 
  '7257858a-1772-4ec6-9f4e-fc1641644be3'
);

-- Eliminar materiales de los cursos duplicados
DELETE FROM materiales WHERE curso_id IN (
  '95a4d042-6ab3-452f-bd72-71c516bd5709',
  '09c834da-b646-4245-896a-bff5f1563b75',
  '7257858a-1772-4ec6-9f4e-fc1641644be3'
);

-- Eliminar cuestionarios de los cursos duplicados
DELETE FROM cuestionarios WHERE curso_id IN (
  '95a4d042-6ab3-452f-bd72-71c516bd5709',
  '09c834da-b646-4245-896a-bff5f1563b75',
  '7257858a-1772-4ec6-9f4e-fc1641644be3'
);

-- Eliminar inscripciones de los cursos duplicados
DELETE FROM inscripciones WHERE curso_id IN (
  '95a4d042-6ab3-452f-bd72-71c516bd5709',
  '09c834da-b646-4245-896a-bff5f1563b75',
  '7257858a-1772-4ec6-9f4e-fc1641644be3'
);

-- Eliminar relaciones en curso_cuestionarios
DELETE FROM curso_cuestionarios WHERE curso_id IN (
  '95a4d042-6ab3-452f-bd72-71c516bd5709',
  '09c834da-b646-4245-896a-bff5f1563b75',
  '7257858a-1772-4ec6-9f4e-fc1641644be3'
);

-- Finalmente eliminar los cursos duplicados
DELETE FROM cursos WHERE id IN (
  '95a4d042-6ab3-452f-bd72-71c516bd5709',
  '09c834da-b646-4245-896a-bff5f1563b75',
  '7257858a-1772-4ec6-9f4e-fc1641644be3'
);

-- Verificar que solo queden 2 cursos
SELECT COUNT(*) as total_cursos FROM cursos;
SELECT titulo, COUNT(*) as cantidad FROM cursos GROUP BY titulo;