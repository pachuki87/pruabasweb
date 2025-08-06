-- Otorgar permisos completos para todas las tablas relacionadas

-- Permisos para tabla cursos
GRANT SELECT ON cursos TO anon;
GRANT ALL PRIVILEGES ON cursos TO authenticated;

-- Permisos para tabla lecciones
GRANT SELECT ON lecciones TO anon;
GRANT ALL PRIVILEGES ON lecciones TO authenticated;

-- Permisos para tabla materiales
GRANT SELECT ON materiales TO anon;
GRANT ALL PRIVILEGES ON materiales TO authenticated;

-- Crear políticas RLS para permitir acceso público de lectura

-- Política para cursos
DROP POLICY IF EXISTS "Allow public read access" ON cursos;
CREATE POLICY "Allow public read access" ON cursos
    FOR SELECT USING (true);

-- Política para lecciones
DROP POLICY IF EXISTS "Allow public read access" ON lecciones;
CREATE POLICY "Allow public read access" ON lecciones
    FOR SELECT USING (true);

-- Política para materiales
DROP POLICY IF EXISTS "Allow public read access" ON materiales;
CREATE POLICY "Allow public read access" ON materiales
    FOR SELECT USING (true);

-- Verificar permisos
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name IN ('cursos', 'lecciones', 'materiales')
  AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;