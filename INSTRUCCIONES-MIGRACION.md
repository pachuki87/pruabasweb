# 🚀 Instrucciones para Aplicar Migración de Base de Datos

## Problema Actual
El script `apply-database-migration.js` está dando errores porque Supabase JS no tiene funciones nativas para ejecutar SQL DDL (como `ALTER TABLE`, `CREATE TABLE`) directamente.

## ✅ Solución Simple

### Paso 1: Crear la función execute_sql en Supabase

1. **Ve al Dashboard de Supabase**: https://supabase.com/dashboard
2. **Selecciona tu proyecto**
3. **Ve a SQL Editor** (en el menú lateral)
4. **Copia y pega** todo el contenido del archivo `create-execute-sql-function.sql`:

```sql
-- Función para ejecutar SQL dinámico desde JavaScript
-- Ejecuta este SQL primero en el Dashboard de Supabase > SQL Editor

CREATE OR REPLACE FUNCTION execute_sql(sql_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_text;
  RETURN 'SUCCESS';
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'ERROR: ' || SQLERRM;
END;
$$;

-- Dar permisos para usar la función
GRANT EXECUTE ON FUNCTION execute_sql(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION execute_sql(TEXT) TO service_role;
```

5. **Haz clic en "Run"** para ejecutar el SQL
6. **Verifica** que aparezca "Success. No rows returned" o similar

### Paso 2: Ejecutar la migración

1. **Vuelve a la terminal**
2. **Ejecuta el comando**:
   ```bash
   node apply-database-migration.js
   ```

### Paso 3: Verificar que funciona

- El script debería mostrar:
  - ✅ Función execute_sql disponible
  - ✅ Pasos de migración completándose uno por uno
  - ✅ Migración completada exitosamente

## 🔧 Archivos Creados

- `create-execute-sql-function.sql` - Función PostgreSQL para ejecutar SQL dinámico
- `apply-database-migration.js` - Script de migración actualizado
- `INSTRUCCIONES-MIGRACION.md` - Este archivo de instrucciones

## ❓ Si Algo Sale Mal

1. **Verifica las variables de entorno** en `.env`:
   - `VITE_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **Verifica que tengas permisos** de administrador en Supabase

3. **Si la función ya existe**, simplemente ejecuta el paso 2

## 🎯 Resultado Esperado

Después de completar estos pasos:
- Las tablas `user_course_progress` y `user_test_results` estarán actualizadas
- Las vistas y funciones necesarias estarán creadas
- El sistema debería funcionar correctamente

---

**¡Listo!** Una vez completados estos pasos, tu migración estará aplicada y el sistema funcionará correctamente.