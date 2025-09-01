# 🚀 Instrucciones de Migración de Base de Datos de Producción

## 📋 Resumen del Problema

La aplicación local usa nombres de columnas en inglés (`user_id`, `course_id`, `chapter_id`), pero la base de datos de producción aún tiene nombres en español (`usuario_id`, `curso_id`, `leccion_id`). Esto causa errores cuando los usuarios se autentican con Google y la app se conecta a producción.

## 🔍 Columnas que Necesitan Migración

### ✅ Confirmado por verificación:
- `user_course_progress`:
  - `usuario_id` → `user_id`
  - `curso_id` → `course_id`
  - `leccion_id` → `chapter_id`

- `user_test_results`:
  - `usuario_id` → `user_id`
  - `curso_id` → `course_id`
  - `cuestionario_id` → `quiz_id`

- `inscripciones` (si existe):
  - `usuario_id` → `user_id`
  - `curso_id` → `course_id`

- `cursos` (si existe `profesor_id`):
  - `profesor_id` → `teacher_id`

## 🛠️ Archivos Creados para la Migración

1. **`migrate-production-columns.sql`** - Script SQL principal de migración
2. **`backup-production-db.cjs`** - Script para crear backup antes de migrar
3. **`verify-production-migration.cjs`** - Script para verificar que la migración fue exitosa
4. **`check-production-db.cjs`** - Script existente para verificar estado actual

## 📝 Pasos para Ejecutar la Migración

### ⚠️ IMPORTANTE: Hacer Backup Primero

```bash
# 1. Crear backup de la base de datos
node backup-production-db.cjs
```

Esto creará una carpeta en `backups/backup-[timestamp]` con:
- Archivos JSON de todas las tablas
- Archivos CSV para fácil visualización
- Información del backup
- Instrucciones de restauración

### 🔧 Aplicar la Migración

1. **Abrir Supabase Dashboard**
   - Ve a tu proyecto en https://supabase.com
   - Navega a "SQL Editor"

2. **Ejecutar el Script de Migración**
   - Abre el archivo `migrate-production-columns.sql`
   - Copia todo el contenido
   - Pégalo en el SQL Editor de Supabase
   - **Revisa el script antes de ejecutar**
   - Haz clic en "Run"

### ✅ Verificar la Migración

```bash
# 3. Verificar que la migración fue exitosa
node verify-production-migration.cjs
```

Este script verificará:
- ✅ Nuevas columnas existen y son accesibles
- ✅ Columnas antiguas fueron eliminadas
- ✅ Relaciones de foreign keys funcionan
- ✅ Consultas de la aplicación funcionan

### 🧪 Probar la Aplicación

1. **Probar Login con Google**
   - Ve a tu aplicación online
   - Inicia sesión con Google
   - Verifica que no aparezcan errores de columnas

2. **Probar Funcionalidades Clave**
   - Navegación de cursos
   - Progreso de lecciones
   - Realización de quizzes
   - Dashboard de usuario

## 🚨 Plan de Contingencia

Si algo sale mal durante la migración:

### Opción 1: Rollback Inmediato
Si detectas errores inmediatamente después de la migración:

```sql
-- Revertir cambios (ejecutar en Supabase SQL Editor)
BEGIN;

ALTER TABLE user_course_progress 
  RENAME COLUMN user_id TO usuario_id;
ALTER TABLE user_course_progress 
  RENAME COLUMN course_id TO curso_id;
ALTER TABLE user_course_progress 
  RENAME COLUMN chapter_id TO leccion_id;

-- Repetir para otras tablas...

COMMIT;
```

### Opción 2: Restaurar desde Backup
Si necesitas restaurar completamente:
1. Los archivos JSON del backup contienen todos los datos
2. Contacta al administrador de base de datos
3. Usa los archivos de backup para restaurar

## 📊 Verificación Post-Migración

### Errores que Deberían Desaparecer:
- ❌ `column user_course_progress.user_id does not exist`
- ❌ `column user_test_results.course_id does not exist`
- ❌ `Could not find a relationship between tables`
- ❌ UUID 'undefined' errors

### Funcionalidades que Deberían Funcionar:
- ✅ Login con Google sin errores
- ✅ Carga de cursos y lecciones
- ✅ Seguimiento de progreso
- ✅ Realización de quizzes
- ✅ Dashboard de usuario

## 🔧 Comandos de Verificación Rápida

```bash
# Verificar estado actual (antes de migrar)
node check-production-db.cjs

# Crear backup
node backup-production-db.cjs

# Verificar migración (después de aplicar SQL)
node verify-production-migration.cjs
```

## 📞 Contacto de Emergencia

Si encuentras problemas durante la migración:
1. **NO ENTRES EN PÁNICO**
2. Documenta el error exacto
3. Verifica si el backup se creó correctamente
4. Considera hacer rollback si es necesario

---

**⚠️ RECORDATORIO FINAL:**
- Siempre hacer backup antes de migrar
- Probar en horarios de bajo tráfico
- Tener plan de rollback listo
- Verificar completamente después de migrar