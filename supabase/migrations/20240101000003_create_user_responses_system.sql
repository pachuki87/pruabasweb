-- Migración: Sistema de registro de respuestas de usuarios
-- Fecha: 2024-01-01
-- Descripción: Crea tablas para registrar respuestas de usuarios y tracking de intentos

-- Crear tabla respuestas_usuario
CREATE TABLE IF NOT EXISTS public.respuestas_usuario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cuestionario_id UUID NOT NULL REFERENCES public.cuestionarios(id) ON DELETE CASCADE,
  pregunta_id UUID NOT NULL REFERENCES public.preguntas(id) ON DELETE CASCADE,
  opcion_seleccionada_id UUID NOT NULL REFERENCES public.opciones_respuesta(id) ON DELETE CASCADE,
  es_correcta BOOLEAN NOT NULL,
  tiempo_respuesta_segundos INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraint para evitar respuestas duplicadas
  UNIQUE(user_id, pregunta_id)
);

-- Crear tabla intentos_cuestionario
CREATE TABLE IF NOT EXISTS public.intentos_cuestionario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cuestionario_id UUID NOT NULL REFERENCES public.cuestionarios(id) ON DELETE CASCADE,
  leccion_id UUID NOT NULL REFERENCES public.lecciones(id) ON DELETE CASCADE,
  puntuacion_obtenida INTEGER NOT NULL DEFAULT 0,
  puntuacion_maxima INTEGER NOT NULL DEFAULT 0,
  porcentaje_acierto DECIMAL(5,2) NOT NULL DEFAULT 0,
  tiempo_total_segundos INTEGER DEFAULT 0,
  completado BOOLEAN DEFAULT FALSE,
  aprobado BOOLEAN DEFAULT FALSE,
  numero_intento INTEGER DEFAULT 1,
  started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints de validación
  CHECK (puntuacion_obtenida >= 0),
  CHECK (puntuacion_maxima >= 0),
  CHECK (porcentaje_acierto >= 0 AND porcentaje_acierto <= 100),
  CHECK (numero_intento > 0)
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_respuestas_usuario_user_id ON public.respuestas_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_usuario_cuestionario_id ON public.respuestas_usuario(cuestionario_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_usuario_pregunta_id ON public.respuestas_usuario(pregunta_id);
CREATE INDEX IF NOT EXISTS idx_intentos_cuestionario_user_id ON public.intentos_cuestionario(user_id);
CREATE INDEX IF NOT EXISTS idx_intentos_cuestionario_leccion_id ON public.intentos_cuestionario(leccion_id);
CREATE INDEX IF NOT EXISTS idx_intentos_cuestionario_cuestionario_id ON public.intentos_cuestionario(cuestionario_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.respuestas_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intentos_cuestionario ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para respuestas_usuario
DROP POLICY IF EXISTS "Users can view their own responses" ON public.respuestas_usuario;
CREATE POLICY "Users can view their own responses" ON public.respuestas_usuario
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own responses" ON public.respuestas_usuario;
CREATE POLICY "Users can insert their own responses" ON public.respuestas_usuario
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own responses" ON public.respuestas_usuario;
CREATE POLICY "Users can update their own responses" ON public.respuestas_usuario
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own responses" ON public.respuestas_usuario;
CREATE POLICY "Users can delete their own responses" ON public.respuestas_usuario
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para intentos_cuestionario
DROP POLICY IF EXISTS "Users can view their own attempts" ON public.intentos_cuestionario;
CREATE POLICY "Users can view their own attempts" ON public.intentos_cuestionario
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own attempts" ON public.intentos_cuestionario;
CREATE POLICY "Users can insert their own attempts" ON public.intentos_cuestionario
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own attempts" ON public.intentos_cuestionario;
CREATE POLICY "Users can update their own attempts" ON public.intentos_cuestionario
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own attempts" ON public.intentos_cuestionario;
CREATE POLICY "Users can delete their own attempts" ON public.intentos_cuestionario
  FOR DELETE USING (auth.uid() = user_id);

-- Otorgar permisos a roles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.respuestas_usuario TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.intentos_cuestionario TO authenticated;
GRANT SELECT ON public.respuestas_usuario TO anon;
GRANT SELECT ON public.intentos_cuestionario TO anon;

-- Comentarios para documentación
COMMENT ON TABLE public.respuestas_usuario IS 'Registra las respuestas individuales de los usuarios a las preguntas de los cuestionarios';
COMMENT ON TABLE public.intentos_cuestionario IS 'Registra los intentos completos de cuestionarios con puntuaciones y estadísticas';

COMMENT ON COLUMN public.respuestas_usuario.es_correcta IS 'Indica si la respuesta seleccionada es correcta';
COMMENT ON COLUMN public.respuestas_usuario.tiempo_respuesta_segundos IS 'Tiempo en segundos que tardó el usuario en responder';
COMMENT ON COLUMN public.intentos_cuestionario.porcentaje_acierto IS 'Porcentaje de acierto calculado (0-100)';
COMMENT ON COLUMN public.intentos_cuestionario.aprobado IS 'Indica si el intento fue aprobatorio (generalmente >= 70%)';
COMMENT ON COLUMN public.intentos_cuestionario.numero_intento IS 'Número de intento para el mismo cuestionario por el usuario';