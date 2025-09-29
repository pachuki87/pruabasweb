-- Agregar columna aprobado a la tabla intentos_cuestionario
-- Esta columna es necesaria para el sistema de cuestionarios

ALTER TABLE public.intentos_cuestionario 
ADD COLUMN IF NOT EXISTS aprobado BOOLEAN DEFAULT FALSE;

-- Agregar comentario para documentar la columna
COMMENT ON COLUMN public.intentos_cuestionario.aprobado IS 'Indica si el intento fue aprobatorio (generalmente >= 70%)';

-- Actualizar registros existentes basándose en la puntuación obtenida vs máxima
-- Calcular el porcentaje usando puntuacion y puntuacion_maxima
UPDATE public.intentos_cuestionario 
SET aprobado = CASE 
    WHEN puntuacion_maxima > 0 AND (puntuacion::FLOAT / puntuacion_maxima::FLOAT) >= 0.7 THEN TRUE 
    ELSE FALSE 
END
WHERE aprobado IS NULL;