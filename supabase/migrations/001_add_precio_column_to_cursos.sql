-- Migración: Agregar columna precio a la tabla cursos
-- Fecha: 2024-01-20
-- Descripción: Agrega la columna precio (decimal) a la tabla cursos para almacenar el precio de cada curso

-- Agregar columna precio a la tabla cursos
ALTER TABLE public.cursos 
ADD COLUMN IF NOT EXISTS precio DECIMAL(10,2) DEFAULT 0.00;

-- Agregar comentario a la columna
COMMENT ON COLUMN public.cursos.precio IS 'Precio del curso en euros (formato decimal)';

-- Actualizar cursos existentes con precio por defecto
UPDATE public.cursos 
SET precio = 1990.00 
WHERE precio IS NULL OR precio = 0.00;

-- Crear índice para optimizar consultas por precio
CREATE INDEX IF NOT EXISTS idx_cursos_precio ON public.cursos(precio);