-- Verificar permisos actuales para las tablas
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;

-- Otorgar permisos necesarios para las tablas críticas
GRANT SELECT ON cuestionarios TO anon, authenticated;
GRANT SELECT ON preguntas TO anon, authenticated;
GRANT SELECT ON opciones_respuesta TO anon, authenticated;
GRANT SELECT ON lecciones TO anon, authenticated;
GRANT SELECT ON inscripciones TO anon, authenticated;
GRANT SELECT ON respuestas_texto_libre TO anon, authenticated;
GRANT INSERT, UPDATE ON respuestas_texto_libre TO authenticated;
GRANT INSERT, UPDATE ON user_test_results TO authenticated;
GRANT INSERT, UPDATE ON intentos_cuestionario TO authenticated;

-- Verificar permisos después de otorgarlos
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND grantee IN ('anon', 'authenticated') 
AND table_name IN ('cuestionarios', 'preguntas', 'opciones_respuesta', 'lecciones', 'inscripciones', 'respuestas_texto_libre', 'user_test_results', 'intentos_cuestionario')
ORDER BY table_name, grantee;