-- Otorgar permisos para la tabla lecciones
-- Permitir acceso de lectura a usuarios anónimos y autenticados

-- Otorgar permisos SELECT a usuarios anónimos
GRANT SELECT ON lecciones TO anon;

-- Otorgar todos los permisos a usuarios autenticados
GRANT ALL PRIVILEGES ON lecciones TO authenticated;

-- Verificar los permisos otorgados
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name = 'lecciones'
  AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;