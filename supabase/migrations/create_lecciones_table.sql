-- Crear tabla lecciones para almacenar el contenido detallado de cada lección
CREATE TABLE IF NOT EXISTS public.lecciones (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    curso_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE,
    titulo VARCHAR NOT NULL,
    descripcion TEXT,
    contenido_html TEXT,
    orden INTEGER NOT NULL,
    duracion_estimada INTEGER, -- en minutos
    imagen_url TEXT,
    video_url TEXT,
    tiene_cuestionario BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS
ALTER TABLE public.lecciones ENABLE ROW LEVEL SECURITY;

-- Crear políticas de acceso
CREATE POLICY "Usuarios autenticados pueden ver lecciones" ON public.lecciones
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Solo administradores pueden insertar lecciones" ON public.lecciones
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Solo administradores pueden actualizar lecciones" ON public.lecciones
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Solo administradores pueden eliminar lecciones" ON public.lecciones
    FOR DELETE USING (auth.role() = 'authenticated');

-- Otorgar permisos
GRANT ALL PRIVILEGES ON public.lecciones TO authenticated;
GRANT SELECT ON public.lecciones TO anon;

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_lecciones_curso_id ON public.lecciones(curso_id);
CREATE INDEX idx_lecciones_orden ON public.lecciones(curso_id, orden);

-- Agregar columnas adicionales a la tabla materiales para mejor organización
ALTER TABLE public.materiales ADD COLUMN IF NOT EXISTS leccion_id UUID REFERENCES public.lecciones(id) ON DELETE CASCADE;
ALTER TABLE public.materiales ADD COLUMN IF NOT EXISTS tipo_material VARCHAR(50) DEFAULT 'pdf'; -- pdf, video, imagen, documento
ALTER TABLE public.materiales ADD COLUMN IF NOT EXISTS descripcion TEXT;
ALTER TABLE public.materiales ADD COLUMN IF NOT EXISTS tamaño_archivo BIGINT; -- en bytes

-- Crear índice para materiales por lección
CREATE INDEX IF NOT EXISTS idx_materiales_leccion_id ON public.materiales(leccion_id);