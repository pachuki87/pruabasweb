-- Deshabilitar RLS temporalmente para configurar políticas
ALTER TABLE cuestionarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE preguntas DISABLE ROW LEVEL SECURITY;
ALTER TABLE opciones DISABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Allow read access to cuestionarios" ON cuestionarios;
DROP POLICY IF EXISTS "Allow read access to preguntas" ON preguntas;
DROP POLICY IF EXISTS "Allow read access to opciones" ON opciones;

-- Habilitar RLS nuevamente
ALTER TABLE cuestionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE opciones ENABLE ROW LEVEL SECURITY;

-- Crear políticas que permitan acceso de lectura a todos los usuarios
CREATE POLICY "Enable read access for all users" ON cuestionarios
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON preguntas
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON opciones
    FOR SELECT USING (true);

-- Otorgar permisos explícitos
GRANT SELECT ON cuestionarios TO anon, authenticated;
GRANT SELECT ON preguntas TO anon, authenticated;
GRANT SELECT ON opciones TO anon, authenticated;