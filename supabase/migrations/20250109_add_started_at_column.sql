-- Agregar columna started_at a la tabla intentos_cuestionario
-- Esta columna es requerida por el sistema de respuestas

ALTER TABLE public.intentos_cuestionario 
ADD COLUMN started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Actualizar registros existentes para que tengan un valor en started_at
-- Usar fecha_inicio si existe, sino usar creado_en
UPDATE public.intentos_cuestionario 
SET started_at = COALESCE(fecha_inicio, creado_en, NOW())
WHERE started_at IS NULL;

-- Agregar comentario a la columna
COMMENT ON COLUMN public.intentos_cuestionario.started_at IS 'Timestamp cuando se inició el intento del cuestionario';