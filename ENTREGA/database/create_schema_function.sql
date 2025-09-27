-- Crear función para obtener columnas de una tabla
CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
RETURNS TABLE(
  column_name text,
  data_type text,
  is_nullable text,
  column_default text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text,
    c.column_default::text
  FROM information_schema.columns c
  WHERE c.table_schema = 'public' 
    AND c.table_name = $1
  ORDER BY c.ordinal_position;
$$;

-- Dar permisos para usar la función
GRANT EXECUTE ON FUNCTION get_table_columns(text) TO anon;
GRANT EXECUTE ON FUNCTION get_table_columns(text) TO authenticated;

-- Verificar estructura de user_test_results
SELECT * FROM get_table_columns('user_test_results');