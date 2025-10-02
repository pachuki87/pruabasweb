-- Migración: Agregar columna contenido_url a la tabla lecciones
-- Fecha: 2024-01-20
-- Descripción: Agrega la columna contenido_url (text) a la tabla lecciones para almacenar la URL del contenido HTML

-- Agregar columna contenido_url a la tabla lecciones
ALTER TABLE public.lecciones 
ADD COLUMN IF NOT EXISTS contenido_url TEXT;

-- Agregar comentario a la columna
COMMENT ON COLUMN public.lecciones.contenido_url IS 'URL del archivo HTML que contiene el contenido de la lección';

-- Crear índice para optimizar consultas por contenido_url
CREATE INDEX IF NOT EXISTS idx_lecciones_contenido_url ON public.lecciones(contenido_url);