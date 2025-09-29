-- Otorgar permisos para las tablas de cuestionarios

-- Permisos para la tabla preguntas
GRANT ALL PRIVILEGES ON preguntas TO authenticated;
GRANT SELECT ON preguntas TO anon;

-- Permisos para la tabla opciones_respuesta
GRANT ALL PRIVILEGES ON opciones_respuesta TO authenticated;
GRANT SELECT ON opciones_respuesta TO anon;

-- Permisos para la tabla cuestionarios (por si acaso)
GRANT ALL PRIVILEGES ON cuestionarios TO authenticated;
GRANT SELECT ON cuestionarios TO anon;

-- Verificar permisos actuales
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND grantee IN ('anon', 'authenticated') 
AND table_name IN ('cuestionarios', 'preguntas', 'opciones_respuesta')
ORDER BY table_name, grantee;