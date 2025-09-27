-- Agregar columna leccion_id a la tabla intentos_cuestionario
-- Esta columna es necesaria para relacionar los intentos con las lecciones específicas

ALTER TABLE public.intentos_cuestionario 
ADD COLUMN leccion_id UUID;

-- Agregar foreign key constraint hacia la tabla lecciones
ALTER TABLE public.intentos_cuestionario 
ADD CONSTRAINT intentos_cuestionario_leccion_id_fkey 
FOREIGN KEY (leccion_id) REFERENCES public.lecciones(id) ON DELETE CASCADE;

-- Agregar comentario para documentar la columna
COMMENT ON COLUMN public.intentos_cuestionario.leccion_id IS 'ID de la lección asociada al cuestionario';

-- Crear índice para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_intentos_cuestionario_leccion_id 
ON public.intentos_cuestionario(leccion_id);

-- Actualizar la política RLS existente para incluir leccion_id si es necesario
-- (Las políticas existentes deberían seguir funcionando correctamente)