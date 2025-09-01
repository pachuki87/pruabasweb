# 🚨 Inconsistencias en Nombres de Columnas - Supabase

## ❌ Problemas Identificados

### 1. **PRIORIDAD ALTA: Inconsistencia en URLs de Archivos**

**Problema:**
- `materiales.url_archivo` ⚠️
- `lecciones.archivo_url` ⚠️

**Impacto:**
- Misma información, diferente orden de palabras
- Puede causar errores de tipeo en consultas
- Dificulta la memorización del esquema
- Inconsistencia en el código frontend

**Solución Recomendada:**
```sql
-- Opción 1: Estandarizar a 'archivo_url'
ALTER TABLE materiales RENAME COLUMN url_archivo TO archivo_url;

-- Opción 2: Estandarizar a 'url_archivo' 
ALTER TABLE lecciones RENAME COLUMN archivo_url TO url_archivo;
```

### 2. **PRIORIDAD MEDIA: Ambigüedad en teacher_id**

**Problema:**
- `cursos.teacher_id` vs `inscripciones.user_id`
- No está claro si `teacher_id` referencia a tabla `users` o `teachers`

**Impacto:**
- Confusión al hacer JOINs
- Inconsistente con el patrón `user_id`

**Solución Recomendada:**
```sql
-- Opción 1: Renombrar para mayor claridad
ALTER TABLE cursos RENAME COLUMN teacher_id TO teacher_user_id;

-- Opción 2: Documentar que teacher_id referencia users
-- (Agregar comentario en la tabla)
```

### 3. **PRIORIDAD MEDIA: Timestamps Inconsistentes**

**Problema:**
- Solo `lecciones` tiene `actualizado_en`
- `cursos`, `materiales`, `cuestionarios` no tienen timestamp de actualización

**Impacto:**
- Dificulta el tracking de cambios
- Inconsistencia en auditoría

**Solución Recomendada:**
```sql
-- Agregar columna actualizado_en a tablas faltantes
ALTER TABLE cursos ADD COLUMN actualizado_en TIMESTAMP DEFAULT NOW();
ALTER TABLE materiales ADD COLUMN actualizado_en TIMESTAMP DEFAULT NOW();
ALTER TABLE cuestionarios ADD COLUMN actualizado_en TIMESTAMP DEFAULT NOW();

-- Crear triggers para auto-actualizar
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

### 4. **PRIORIDAD BAJA: Caracteres Especiales**

**Problema:**
- `materiales.tamaño_archivo` usa ñ

**Impacto Potencial:**
- Posibles problemas de encoding
- Inconsistencia con convenciones ASCII

**Solución Recomendada:**
```sql
-- Si hay problemas de encoding
ALTER TABLE materiales RENAME COLUMN tamaño_archivo TO tamano_archivo;
```

## ✅ Columnas Consistentes

### IDs de Referencia:
- `inscripciones.user_id` ✅
- `lecciones.curso_id` ✅
- `materiales.curso_id` ✅
- `cuestionarios.curso_id` ✅
- `materiales.leccion_id` ✅
- `cuestionarios.leccion_id` ✅

### Timestamps Básicos:
- Todas las tablas tienen `creado_en` ✅

## 🎯 Plan de Acción Recomendado

### Fase 1 (Inmediata):
1. **Estandarizar URLs de archivos** - Elegir entre `archivo_url` o `url_archivo`
2. **Actualizar código frontend** para usar el nombre consistente

### Fase 2 (Corto plazo):
1. **Clarificar teacher_id** - Documentar o renombrar
2. **Agregar timestamps faltantes**

### Fase 3 (Largo plazo):
1. **Revisar caracteres especiales** si hay problemas
2. **Crear guía de convenciones** para futuras tablas

## 🔍 Verificación Post-Cambios

Después de implementar cambios:
1. Actualizar todas las consultas en el frontend
2. Verificar que no hay referencias hardcodeadas
3. Actualizar documentación de API
4. Ejecutar tests de integración

---

**Nota:** Estos cambios requieren coordinación entre base de datos y frontend para evitar errores en producción.