# 📊 RESUMEN DE NOMBRES DE COLUMNAS POR TABLA

## ✅ Tablas Verificadas

### 1. **user_course_progress** (Español)
- ✅ `user_id`
- ✅ `curso_id` (español)
- ✅ `leccion_id` (español)
- ✅ `progreso_porcentaje` (español)
- ✅ `fecha_completado` (español)
- ✅ `creado_en` (español)
- ✅ `actualizado_en` (español)

### 2. **user_test_results** (Mixto: Inglés + Español) ✅ CONFIRMADO
- ✅ `id`
- ✅ `user_id`
- ✅ `quiz_id`
- ✅ `course_id` (inglés)
- ✅ `leccion_id` (español)
- ✅ `puntuacion` (español)
- ✅ `puntuacion_maxima` (español)
- ✅ `porcentaje` (español)
- ✅ `tiempo_completado` (español)
- ✅ `respuestas_detalle` (español)
- ✅ `aprobado` (español)
- ✅ `fecha_completado` (español)
- ✅ `creado_en` (español)
- ✅ `actualizado_en` (español)

### 3. **Otras tablas mencionadas**
- **inscripciones**: `user_id`, `curso_id`
- **cursos**: `id`, `titulo`, `descripcion`, `teacher_id`, `creado_en`, `imagen_url`
- **lecciones**: `id`, `curso_id`, `titulo`, `descripcion`, `orden`, `duracion_estimada`, `imagen_url`, `video_url`, `tiene_cuestionario`, `creado_en`, `actualizado_en`, `leccion_anterior_id`, `leccion_siguiente_id`, `archivo_url`
- **materiales**: `id`, `titulo`, `curso_id`, `url_archivo`, `creado_en`, `leccion_id`, `tipo_material`, `descripcion`, `tamaño_archivo`
- **cuestionarios**: `id`, `titulo`, `curso_id`, `creado_en`, `leccion_id`

## 🔍 Patrón Observado

1. **user_course_progress**: Completamente en español
2. **user_test_results**: Mixto (IDs en inglés, campos descriptivos en español)
3. **Otras tablas**: Principalmente en español con algunos campos en inglés

## ⚠️ Problema Actual

Los tipos TypeScript en `database.types.ts` están usando nombres en inglés para `user_test_results`, pero la tabla real usa nombres en español para muchos campos.

## 🛠️ Acción Requerida

Actualizar `database.types.ts` para reflejar los nombres reales de las columnas en español.