-- Eliminar cursos duplicados manteniendo solo el curso real 'Experto en Conductas Adictivas'
-- que fue subido recientemente con contenido completo

-- Primero eliminar registros relacionados en otras tablas para evitar errores de foreign key

-- Eliminar inscripciones de cursos duplicados
DELETE FROM inscripciones 
WHERE curso_id IN (
  '6b8f4e2a-3c1d-4a5b-9e7f-2d8c6a4b1e9f',
  'c563c497-5583-451a-a625-a3c07d6cb6b4',
  '394c30ca-2b2e-4ec5-bd56-a67dc0e3aa92',
  'ea12c8bf-91a9-4614-91de-ca650654fe11'
);

-- Eliminar materiales de cursos duplicados
DELETE FROM materiales 
WHERE curso_id IN (
  '6b8f4e2a-3c1d-4a5b-9e7f-2d8c6a4b1e9f',
  'c563c497-5583-451a-a625-a3c07d6cb6b4',
  '394c30ca-2b2e-4ec5-bd56-a67dc0e3aa92',
  'ea12c8bf-91a9-4614-91de-ca650654fe11'
);

-- Eliminar lecciones de cursos duplicados
DELETE FROM lecciones 
WHERE curso_id IN (
  '6b8f4e2a-3c1d-4a5b-9e7f-2d8c6a4b1e9f',
  'c563c497-5583-451a-a625-a3c07d6cb6b4',
  '394c30ca-2b2e-4ec5-bd56-a67dc0e3aa92',
  'ea12c8bf-91a9-4614-91de-ca650654fe11'
);

-- Eliminar cuestionarios de cursos duplicados
DELETE FROM cuestionarios 
WHERE curso_id IN (
  '6b8f4e2a-3c1d-4a5b-9e7f-2d8c6a4b1e9f',
  'c563c497-5583-451a-a625-a3c07d6cb6b4',
  '394c30ca-2b2e-4ec5-bd56-a67dc0e3aa92',
  'ea12c8bf-91a9-4614-91de-ca650654fe11'
);

-- Eliminar relaciones curso_cuestionarios de cursos duplicados
DELETE FROM curso_cuestionarios 
WHERE curso_id IN (
  '6b8f4e2a-3c1d-4a5b-9e7f-2d8c6a4b1e9f',
  'c563c497-5583-451a-a625-a3c07d6cb6b4',
  '394c30ca-2b2e-4ec5-bd56-a67dc0e3aa92',
  'ea12c8bf-91a9-4614-91de-ca650654fe11'
);

-- Finalmente eliminar los cursos duplicados
-- Mantenemos solo el curso con ID: d7c3e503-ed61-4d7a-9e5f-aedc407d4836
DELETE FROM cursos 
WHERE id IN (
  '6b8f4e2a-3c1d-4a5b-9e7f-2d8c6a4b1e9f',  -- MASTER EN ADICCIONES E...
  'c563c497-5583-451a-a625-a3c07d6cb6b4',  -- Master en Adicciones
  '394c30ca-2b2e-4ec5-bd56-a67dc0e3aa92',  -- EXPERTO EN CONDUCTAS ADICTIVAS (sin contenido)
  'ea12c8bf-91a9-4614-91de-ca650654fe11'   -- MASTER EN ADICCIONES E INTERVENCION PSICOSOCIAL
);

-- Verificar que solo queda un curso
SELECT id, titulo, descripcion, creado_en FROM cursos ORDER BY creado_en DESC;