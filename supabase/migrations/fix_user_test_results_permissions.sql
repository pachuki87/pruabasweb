-- Otorgar permisos para la tabla user_test_results
-- Esto permite que los usuarios autenticados puedan insertar y consultar sus propios resultados de tests

-- Otorgar permisos básicos de lectura al rol anon (usuarios no autenticados)
GRANT SELECT ON user_test_results TO anon;

-- Otorgar permisos completos al rol authenticated (usuarios autenticados)
GRANT ALL PRIVILEGES ON user_test_results TO authenticated;

-- Crear política RLS para que los usuarios solo puedan ver sus propios resultados
CREATE POLICY "Users can view own test results" ON user_test_results
    FOR SELECT USING (auth.uid() = user_id);

-- Crear política RLS para que los usuarios puedan insertar sus propios resultados
CREATE POLICY "Users can insert own test results" ON user_test_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Crear política RLS para que los usuarios puedan actualizar sus propios resultados
CREATE POLICY "Users can update own test results" ON user_test_results
    FOR UPDATE USING (auth.uid() = user_id);

-- Verificar permisos actuales
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name = 'user_test_results'
  AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;