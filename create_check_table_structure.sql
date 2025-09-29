-- Función para verificar la estructura de una tabla
CREATE OR REPLACE FUNCTION public.check_table_structure(table_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'column_name', column_name,
      'data_type', data_type,
      'is_nullable', is_nullable
    )
  )
  INTO result
  FROM information_schema.columns
  WHERE table_schema = 'public'
  AND table_name = check_table_structure.table_name
  ORDER BY ordinal_position;
  
  RETURN result;
END;
$$;