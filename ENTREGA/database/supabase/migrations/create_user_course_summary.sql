-- Crear tabla user_course_summary
CREATE TABLE IF NOT EXISTS public.user_course_summary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    curso_id UUID NOT NULL REFERENCES public.cursos(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed_lessons INTEGER DEFAULT 0 CHECK (completed_lessons >= 0),
    total_lessons INTEGER DEFAULT 0 CHECK (total_lessons >= 0),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, curso_id)
);

-- Habilitar RLS
ALTER TABLE public.user_course_summary ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo puedan ver sus propios resúmenes
CREATE POLICY "Users can view their own course summary" ON public.user_course_summary
    FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios puedan insertar sus propios resúmenes
CREATE POLICY "Users can insert their own course summary" ON public.user_course_summary
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios puedan actualizar sus propios resúmenes
CREATE POLICY "Users can update their own course summary" ON public.user_course_summary
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios puedan eliminar sus propios resúmenes
CREATE POLICY "Users can delete their own course summary" ON public.user_course_summary
    FOR DELETE USING (auth.uid() = user_id);

-- Conceder permisos a los roles
GRANT ALL PRIVILEGES ON public.user_course_summary TO authenticated;
GRANT SELECT ON public.user_course_summary TO anon;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_user_course_summary_user_id ON public.user_course_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_summary_curso_id ON public.user_course_summary(curso_id);
CREATE INDEX IF NOT EXISTS idx_user_course_summary_last_accessed ON public.user_course_summary(last_accessed);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_user_course_summary_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER trigger_update_user_course_summary_updated_at
    BEFORE UPDATE ON public.user_course_summary
    FOR EACH ROW
    EXECUTE FUNCTION update_user_course_summary_updated_at();