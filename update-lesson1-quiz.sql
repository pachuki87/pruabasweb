-- Actualizar la lección 1 del Máster en Adicciones para habilitar el cuestionario
UPDATE lecciones 
SET tiene_cuestionario = true, 
    actualizado_en = NOW()
WHERE id = '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44' 
  AND curso_id = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'
  AND titulo = 'FUNDAMENTOS P TERAPEUTICO';

-- Verificar el cambio
SELECT id, titulo, tiene_cuestionario, actualizado_en 
FROM lecciones 
WHERE id = '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44';