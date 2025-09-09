-- Migración para corregir errores críticos de producción
-- 1. Agregar columna completed_at a user_test_results
-- 2. Crear tabla intentos_cuestionario si es necesaria

-- Error 1: Agregar columna completed_at a user_test_results
ALTER TABLE user_test_results 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Comentario para la nueva columna
COMMENT ON COLUMN user_test_results.completed_at IS 'Fecha y hora cuando se completó el test';

-- Error 3: Crear tabla intentos_cuestionario (si es necesaria)
-- Esta tabla parece ser para tracking de intentos de cuestionarios
CREATE TABLE IF NOT EXISTS intentos_cuestionario (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    cuestionario_id UUID NOT NULL REFERENCES cuestionarios(id) ON DELETE CASCADE,
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    intento_numero INTEGER NOT NULL DEFAULT 1,
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_completado TIMESTAMP WITH TIME ZONE,
    estado VARCHAR(20) DEFAULT 'iniciado' CHECK (estado IN ('iniciado', 'en_progreso', 'completado', 'abandonado')),
    puntuacion INTEGER,
    puntuacion_maxima INTEGER,
    tiempo_transcurrido INTEGER, -- en segundos
    respuestas_guardadas JSONB DEFAULT '{}',
    aprobado BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_intentos_cuestionario_user_id ON intentos_cuestionario(user_id);
CREATE INDEX IF NOT EXISTS idx_intentos_cuestionario_cuestionario_id ON intentos_cuestionario(cuestionario_id);
CREATE INDEX IF NOT EXISTS idx_intentos_cuestionario_curso_id ON intentos_cuestionario(curso_id);
CREATE INDEX IF NOT EXISTS idx_intentos_cuestionario_estado ON intentos_cuestionario(estado);

-- Comentarios para la tabla
COMMENT ON TABLE intentos_cuestionario IS 'Tabla para rastrear intentos de cuestionarios por usuario';
COMMENT ON COLUMN intentos_cuestionario.intento_numero IS 'Número de intento del usuario para este cuestionario';
COMMENT ON COLUMN intentos_cuestionario.estado IS 'Estado del intento: iniciado, en_progreso, completado, abandonado';
COMMENT ON COLUMN intentos_cuestionario.respuestas_guardadas IS 'JSON con las respuestas guardadas durante el intento';

-- Habilitar RLS para la nueva tabla
ALTER TABLE intentos_cuestionario ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para intentos_cuestionario
CREATE POLICY "Users can view their own quiz attempts" ON intentos_cuestionario
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts" ON intentos_cuestionario
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz attempts" ON intentos_cuestionario
    FOR UPDATE USING (auth.uid() = user_id);

-- Permisos para roles anon y authenticated
GRANT SELECT, INSERT, UPDATE ON intentos_cuestionario TO authenticated;
GRANT SELECT ON intentos_cuestionario TO anon;

-- Actualizar timestamps automáticamente
CREATE OR REPLACE FUNCTION update_intentos_cuestionario_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_intentos_cuestionario_updated_at
    BEFORE UPDATE ON intentos_cuestionario
    FOR EACH ROW
    EXECUTE FUNCTION update_intentos_cuestionario_updated_at();