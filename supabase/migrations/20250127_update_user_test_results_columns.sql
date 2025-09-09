-- Cambiar nombres de columnas en inglés a español en user_test_results

-- Cambiar user_id a usuario_id
ALTER TABLE public.user_test_results RENAME COLUMN user_id TO usuario_id;

-- Cambiar course_id a curso_id
ALTER TABLE public.user_test_results RENAME COLUMN course_id TO curso_id;

-- Cambiar quiz_id a cuestionario_id
ALTER TABLE public.user_test_results RENAME COLUMN quiz_id TO cuestionario_id;

-- Actualizar comentarios para reflejar los nuevos nombres
COMMENT ON COLUMN public.user_test_results.usuario_id IS 'ID del usuario que realizó el test';
COMMENT ON COLUMN public.user_test_results.curso_id IS 'ID del curso al que pertenece el test';
COMMENT ON COLUMN public.user_test_results.cuestionario_id IS 'ID del cuestionario/test realizado';