-- Crear tabla para el progreso del usuario en los cursos
CREATE TABLE IF NOT EXISTS public.user_course_progress (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    time_spent_minutes INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Índice único para evitar duplicados por usuario, curso y capítulo
    UNIQUE(user_id, course_id, chapter_id)
);

-- Crear tabla para los resultados de exámenes/cuestionarios del usuario
CREATE TABLE IF NOT EXISTS public.user_test_results (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    incorrect_answers INTEGER NOT NULL,
    time_taken_minutes INTEGER,
    passed BOOLEAN DEFAULT FALSE,
    attempt_number INTEGER DEFAULT 1,
    answers_data JSONB, -- Para almacenar las respuestas detalladas
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Validaciones
    CHECK (correct_answers + incorrect_answers = total_questions),
    CHECK (attempt_number > 0)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_test_results ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para user_course_progress
CREATE POLICY "Users can view their own progress" ON public.user_course_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_course_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_course_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view all progress" ON public.user_course_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'teacher'
        )
    );

-- Políticas de seguridad para user_test_results
CREATE POLICY "Users can view their own test results" ON public.user_test_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results" ON public.user_test_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can view all test results" ON public.user_test_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'teacher'
        )
    );

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_user_course_progress_user_id ON public.user_course_progress(user_id);
CREATE INDEX idx_user_course_progress_course_id ON public.user_course_progress(course_id);
CREATE INDEX idx_user_course_progress_chapter_id ON public.user_course_progress(chapter_id);
CREATE INDEX idx_user_course_progress_completed ON public.user_course_progress(is_completed);
CREATE INDEX idx_user_course_progress_last_accessed ON public.user_course_progress(last_accessed_at);

CREATE INDEX idx_user_test_results_user_id ON public.user_test_results(user_id);
CREATE INDEX idx_user_test_results_quiz_id ON public.user_test_results(quiz_id);
CREATE INDEX idx_user_test_results_course_id ON public.user_test_results(course_id);
CREATE INDEX idx_user_test_results_passed ON public.user_test_results(passed);
CREATE INDEX idx_user_test_results_completed_at ON public.user_test_results(completed_at);

-- Otorgar permisos
GRANT ALL PRIVILEGES ON public.user_course_progress TO authenticated;
GRANT SELECT ON public.user_course_progress TO anon;

GRANT ALL PRIVILEGES ON public.user_test_results TO authenticated;
GRANT SELECT ON public.user_test_results TO anon;

-- Función para actualizar el timestamp updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en user_course_progress
CREATE TRIGGER update_user_course_progress_updated_at
    BEFORE UPDATE ON public.user_course_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para calcular automáticamente el progreso del curso
CREATE OR REPLACE FUNCTION calculate_course_progress(p_user_id UUID, p_course_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    total_chapters INTEGER;
    completed_chapters INTEGER;
    progress_percentage DECIMAL(5,2);
BEGIN
    -- Contar total de capítulos en el curso
    SELECT COUNT(*) INTO total_chapters
    FROM public.chapters
    WHERE course_id = p_course_id;
    
    -- Contar capítulos completados por el usuario
    SELECT COUNT(*) INTO completed_chapters
    FROM public.user_course_progress
    WHERE user_id = p_user_id 
      AND course_id = p_course_id 
      AND is_completed = true;
    
    -- Calcular porcentaje
    IF total_chapters > 0 THEN
        progress_percentage := (completed_chapters::DECIMAL / total_chapters::DECIMAL) * 100;
    ELSE
        progress_percentage := 0;
    END IF;
    
    RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql;

-- Vista para obtener el progreso general de cada usuario por curso
CREATE OR REPLACE VIEW user_course_summary AS
SELECT 
    u.id as user_id,
    u.name as user_name,
    u.email as user_email,
    c.id as course_id,
    c.title as course_title,
    calculate_course_progress(u.id, c.id) as overall_progress,
    COUNT(ucp.id) as chapters_accessed,
    COUNT(CASE WHEN ucp.is_completed THEN 1 END) as chapters_completed,
    MAX(ucp.last_accessed_at) as last_activity,
    SUM(ucp.time_spent_minutes) as total_time_spent,
    AVG(utr.score) as average_test_score,
    COUNT(utr.id) as total_tests_taken
FROM public.users u
CROSS JOIN public.courses c
LEFT JOIN public.user_course_progress ucp ON u.id = ucp.user_id AND c.id = ucp.course_id
LEFT JOIN public.user_test_results utr ON u.id = utr.user_id AND c.id = utr.course_id
WHERE u.role = 'student'
GROUP BY u.id, u.name, u.email, c.id, c.title;

-- Otorgar permisos a la vista
GRANT SELECT ON user_course_summary TO authenticated;
GRANT SELECT ON user_course_summary TO anon;