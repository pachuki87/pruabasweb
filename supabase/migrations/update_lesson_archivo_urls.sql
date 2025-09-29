-- Actualizar las URLs de archivos HTML para las lecciones del Máster en Adicciones
-- Esta migración establece las rutas correctas a los archivos HTML actualizados

-- Actualizar lección 1: Fundamentos Terapéuticos
UPDATE lecciones
SET archivo_url = '/lessons/leccion-1-fundamentos-terapeuticos.html',
    actualizado_en = CURRENT_TIMESTAMP
WHERE titulo LIKE '%FUNDAMENTOS P TERAPEUTICO%' AND orden = 1;

-- Actualizar lección 2: Terapia Cognitiva
UPDATE lecciones
SET archivo_url = '/lessons/leccion-2-terapia-cognitiva-drogodependencia.html',
    actualizado_en = CURRENT_TIMESTAMP
WHERE titulo LIKE '%TERAPIA COGNITIVA DROGODEPENDENCIA%' AND orden = 2;

-- Actualizar lección 3: Familia y Trabajo en Equipo
UPDATE lecciones
SET archivo_url = '/lessons/leccion-3-familia-trabajo-equipo.html',
    actualizado_en = CURRENT_TIMESTAMP
WHERE titulo LIKE '%FAMILIA Y TRABAJO EQUIPO%' AND orden = 3;

-- Actualizar lección 4: Recovery Coaching
UPDATE lecciones
SET archivo_url = '/lessons/leccion-4-recovery-coaching.html',
    actualizado_en = CURRENT_TIMESTAMP
WHERE titulo LIKE '%RECOVERY COACHING%' AND orden = 4;

-- Actualizar lección 5: Psicología de las Adicciones
UPDATE lecciones
SET archivo_url = '/lessons/leccion-5-psicologia-adicciones.html',
    actualizado_en = CURRENT_TIMESTAMP
WHERE titulo LIKE '%PSICOLOGIA ADICCIONES%' AND orden = 5;

-- Actualizar lección 6: Intervención Familiar y Recovery Mentoring
UPDATE lecciones
SET archivo_url = '/lessons/leccion-6-intervencion-familiar-recovery-mentoring.html',
    actualizado_en = CURRENT_TIMESTAMP
WHERE titulo LIKE '%INTERVENCION FAMILIAR Y RECOVERY MENTO%' AND orden = 6;

-- Actualizar lección 7: Nuevos Modelos Terapéuticos
UPDATE lecciones
SET archivo_url = '/lessons/leccion-7-nuevos-modelos-terapeuticos.html',
    actualizado_en = CURRENT_TIMESTAMP
WHERE titulo LIKE '%NUEVOS MODELOS TERAPEUTICOS%' AND orden = 7;

-- Actualizar lección 8: Gestión de las Adicciones desde la Perspectiva de Género
UPDATE lecciones
SET archivo_url = '/lessons/leccion-8-gestion-adicciones-perspectiva-genero.html',
    actualizado_en = CURRENT_TIMESTAMP
WHERE titulo LIKE '%GESTIÓN DE LAS ADICCIONES DESDE LA PERSPECTIVA DE GÉNERO%' AND orden = 8;

-- Actualizar lección 9: Inteligencia Emocional
UPDATE lecciones
SET archivo_url = '/lessons/leccion-9-inteligencia-emocional.html',
    actualizado_en = CURRENT_TIMESTAMP
WHERE titulo LIKE '%INTELIGENCIA EMOCIONAL%' AND orden = 9;

-- Actualizar lección 10: Trabajo Final de Máster
UPDATE lecciones
SET archivo_url = '/lessons/leccion-10-trabajo-final-master.html',
    actualizado_en = CURRENT_TIMESTAMP
WHERE titulo LIKE '%TRABAJO FINAL DE MÁSTER%' AND orden = 10;

-- Verificar las actualizaciones
SELECT
    id,
    titulo,
    orden,
    archivo_url,
    actualizado_en
FROM lecciones
WHERE curso_id = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'
ORDER BY orden;