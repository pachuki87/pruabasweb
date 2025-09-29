-- Otorgar permisos para la tabla user_test_results
-- Solo otorgar permisos, sin crear políticas que ya existen

-- Otorgar permisos básicos de lectura al rol anon (usuarios no autenticados)
GRANT SELECT ON user_test_results TO anon;

-- Otorgar permisos completos al rol authenticated (usuarios autenticados)
GRANT ALL PRIVILEGES ON user_test_results TO authenticated;

-- Verificar permisos actuales
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name = 'user_test_results'
  AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;