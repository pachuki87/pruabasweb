-- Crear función para obtener cuestionarios sin restricciones RLS
CREATE OR REPLACE FUNCTION get_quiz_with_questions(quiz_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'quiz', row_to_json(c.*),
        'questions', (
            SELECT json_agg(
                json_build_object(
                    'id', p.id,
                    'pregunta', p.pregunta,
                    'tipo', p.tipo,
                    'opciones', (
                        SELECT json_agg(
                            json_build_object(
                                'id', o.id,
                                'texto', o.texto,
                                'es_correcta', o.es_correcta,
                                'explicacion', o.explicacion
                            )
                        )
                        FROM opciones o
                        WHERE o.pregunta_id = p.id
                        ORDER BY o.id
                    )
                )
            )
            FROM preguntas p
            WHERE p.cuestionario_id = c.id
            ORDER BY p.id
        )
    )
    INTO result
    FROM cuestionarios c
    WHERE c.id = quiz_id;
    
    RETURN result;
END;
$$;

-- Otorgar permisos de ejecución
GRANT EXECUTE ON FUNCTION get_quiz_with_questions(UUID) TO anon, authenticated;

-- Crear función simple para obtener solo el cuestionario
CREATE OR REPLACE FUNCTION get_quiz_by_id(quiz_id UUID)
RETURNS TABLE(
    id UUID,
    titulo TEXT,
    descripcion TEXT,
    leccion_id UUID,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.titulo, c.descripcion, c.leccion_id, c.created_at
    FROM cuestionarios c
    WHERE c.id = quiz_id;
END;
$$;

-- Otorgar permisos de ejecución
GRANT EXECUTE ON FUNCTION get_quiz_by_id(UUID) TO anon, authenticated;