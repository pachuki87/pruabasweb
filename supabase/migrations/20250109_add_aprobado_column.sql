-- Agregar columna aprobado a la tabla intentos_cuestionario
-- Esta columna es necesaria para el sistema de cuestionarios

ALTER TABLE public.intentos_cuestionario 
ADD COLUMN IF NOT EXISTS aprobado BOOLEAN DEFAULT FALSE;

-- Agregar comentario para documentar la columna
COMMENT ON COLUMN public.intentos_cuestionario.aprobado IS 'Indica si el intento fue aprobatorio (generalmente >= 70%)';

-- Actualizar registros existentes basándose en el porcentaje de acierto
-- Si existe la columna porcentaje, usar ese valor para determinar si está aprobado
UPDATE public.intentos_cuestionario 
SET aprobado = CASE 
    WHEN porcentaje >= 70 THEN TRUE 
    ELSE FALSE 
END
WHERE aprobado IS NULL;