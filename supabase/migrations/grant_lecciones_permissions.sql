-- Otorgar permisos a la tabla lecciones para los roles anon y authenticated

-- Permisos para el rol anon (usuarios no autenticados)
GRANT SELECT ON lecciones TO anon;

-- Permisos para el rol authenticated (usuarios autenticados)
GRANT ALL PRIVILEGES ON lecciones TO authenticated;

-- Verificar los permisos otorgados
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name = 'lecciones'
AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;