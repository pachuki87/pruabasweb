-- Crear tabla para preguntas de cuestionarios
CREATE TABLE IF NOT EXISTS preguntas (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    cuestionario_id UUID REFERENCES cuestionarios(id) ON DELETE CASCADE,
    pregunta TEXT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'multiple_choice',
    orden INTEGER NOT NULL,
    explicacion TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla para opciones de respuesta
CREATE TABLE IF NOT EXISTS opciones_respuesta (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    pregunta_id UUID REFERENCES preguntas(id) ON DELETE CASCADE,
    opcion TEXT NOT NULL,
    es_correcta BOOLEAN DEFAULT FALSE,
    orden INTEGER NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Añadir campo leccion_id a la tabla cuestionarios para vincular con lecciones
ALTER TABLE cuestionarios ADD COLUMN IF NOT EXISTS leccion_id UUID REFERENCES lecciones(id) ON DELETE CASCADE;

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_preguntas_cuestionario_id ON preguntas(cuestionario_id);
CREATE INDEX IF NOT EXISTS idx_opciones_pregunta_id ON opciones_respuesta(pregunta_id);
CREATE INDEX IF NOT EXISTS idx_cuestionarios_leccion_id ON cuestionarios(leccion_id);

-- Habilitar RLS en las nuevas tablas
ALTER TABLE preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE opciones_respuesta ENABLE ROW LEVEL SECURITY;

-- Otorgar permisos a los roles anon y authenticated
GRANT ALL PRIVILEGES ON preguntas TO authenticated;
GRANT ALL PRIVILEGES ON opciones_respuesta TO authenticated;
GRANT SELECT ON preguntas TO anon;
GRANT SELECT ON opciones_respuesta TO anon;

-- Crear políticas RLS básicas
CREATE POLICY "Usuarios autenticados pueden ver preguntas" ON preguntas
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuarios anónimos pueden ver preguntas" ON preguntas
    FOR SELECT TO anon USING (true);

CREATE POLICY "Usuarios autenticados pueden ver opciones" ON opciones_respuesta
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuarios anónimos pueden ver opciones" ON opciones_respuesta
    FOR SELECT TO anon USING (true);