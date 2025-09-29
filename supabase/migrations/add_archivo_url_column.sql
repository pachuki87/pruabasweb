-- Agregar columna archivo_url a la tabla lecciones
-- Esta columna almacenará la URL del archivo HTML de cada lección

ALTER TABLE lecciones 
ADD COLUMN archivo_url TEXT;

-- Agregar comentario para documentar el propósito de la columna
COMMENT ON COLUMN lecciones.archivo_url IS 'URL del archivo HTML que contiene el contenido de la lección';

-- Crear índice para mejorar el rendimiento de consultas por archivo_url
CREATE INDEX idx_lecciones_archivo_url ON lecciones(archivo_url);