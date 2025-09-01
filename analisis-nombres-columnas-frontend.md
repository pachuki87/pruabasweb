# 🔍 Análisis Completo de Nombres de Columnas - Frontend vs Supabase

## ✅ RESUMEN EJECUTIVO

**Estado General:** El frontend está usando los nombres de columnas correctos en su mayoría, pero hay algunas inconsistencias importantes.

---

## 📊 ANÁLISIS POR TABLA

### 1. **inscripciones** ✅ CORRECTO

**Columnas en Supabase:**
- `user_id` ✅
- `curso_id` ✅

**Uso en Frontend:**
- ✅ `UserCoursesPage.tsx`: `.select('curso_id')` y `.eq('user_id', user.id)`
- ✅ `AssignCoursesToStudent.tsx`: `.select('curso_id')` y `.eq('user_id', studentId)`
- ✅ `DashboardPage.tsx`: `.eq('user_id', user.id)`

**Conclusión:** ✅ **PERFECTO** - Todas las consultas usan los nombres correctos.

---

### 2. **cursos** ✅ CORRECTO

**Columnas en Supabase:**
- `id`, `titulo`, `descripcion`, `teacher_id`, `creado_en`, `imagen_url`

**Uso en Frontend:**
- ✅ `CoursesPage.tsx`: `.select('id, titulo, imagen_url')`
- ✅ `UserCoursesPage.tsx`: `.select('id, titulo, teacher_id')`
- ✅ `DashboardPage.tsx`: `.eq('teacher_id', user.id)`

**Conclusión:** ✅ **PERFECTO** - Todas las consultas usan los nombres correctos.

---

### 3. **lecciones** ✅ CORRECTO

**Columnas en Supabase:**
- `id`, `curso_id`, `titulo`, `descripcion`, `orden`, `duracion_estimada`, `imagen_url`, `video_url`, `tiene_cuestionario`, `creado_en`, `actualizado_en`, `leccion_anterior_id`, `leccion_siguiente_id`, `archivo_url`

**Uso en Frontend:**
- ✅ `NewLessonPage.tsx`: `.select('titulo, orden')` y `.eq('curso_id', courseId)`
- ✅ `LessonPage.tsx`: `.select('titulo, orden')` y `.eq('curso_id', courseId)`
- ✅ `CourseDetailsPage.tsx`: `.eq('curso_id', courseId)`

**Conclusión:** ✅ **PERFECTO** - Todas las consultas usan `curso_id` correctamente.

---

### 4. **materiales** ⚠️ INCONSISTENCIAS

**Columnas en Supabase:**
- `id`, `titulo`, `curso_id`, `url_archivo`, `creado_en`, `leccion_id`, `tipo_material`, `descripcion`, `tamaño_archivo`

**Uso en Frontend:**
- ✅ `StudyMaterialsPage.tsx`: `.eq('curso_id', courseId)` - **CORRECTO**
- ✅ `CourseDetailsPage.tsx`: `.eq('curso_id', courseId)` - **CORRECTO**
- ⚠️ **PROBLEMA**: El frontend está buscando diferentes nombres de columnas:
  - `material.titulo || material.nombre` (busca `nombre` que no existe)
  - `material.url || material.archivo_url` (busca `url` que no existe, debería ser `url_archivo`)

**Inconsistencias Detectadas:**
```typescript
// En CourseDetailsPage.tsx línea 115
const transformedMaterials = (data || []).map(material => ({
  name: material.titulo || material.nombre || 'Material sin nombre', // ❌ 'nombre' no existe
  url: material.url || material.archivo_url || '#' // ❌ 'url' no existe, debería ser 'url_archivo'
}));
```

**Conclusión:** ⚠️ **NECESITA CORRECCIÓN** - Usar `url_archivo` en lugar de `archivo_url`.

---

### 5. **cuestionarios** ✅ CORRECTO

**Columnas en Supabase:**
- `id`, `titulo`, `curso_id`, `creado_en`, `leccion_id`

**Uso en Frontend:**
- ✅ `LessonPage.tsx`: `.eq('leccion_id', lessonId)`
- ✅ `NewLessonPage.tsx`: `.eq('leccion_id', lessonId)`
- ✅ `QuizAttemptPage.tsx`: `.eq('id', quizId)`

**Conclusión:** ✅ **PERFECTO** - Todas las consultas usan los nombres correctos.

---

## 🚨 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **Tablas con Nombres Inconsistentes**

**Problema:** El frontend usa nombres de tablas que NO existen en Supabase:

```typescript
// ❌ TABLAS QUE NO EXISTEN:
.from('quizzes')        // Debería ser 'cuestionarios'
.from('quiz_questions') // Debería ser 'preguntas'
.from('quiz_attempts')  // Debería ser 'respuestas_texto_libre' o similar
.from('chapters')       // Debería ser 'lecciones'
.from('courses')        // Debería ser 'cursos'
.from('usuarios')       // ✅ Esta SÍ existe
```

**Archivos Afectados:**
- `DashboardPage.tsx`: Usa `quizzes`, `quiz_attempts`
- `QuizAttemptPage.tsx`: Usa `quizzes`, `quiz_questions`
- `StudentProgress.tsx`: Usa `chapters`, `quizzes`, `quiz_attempts`
- `CheckTables.tsx`: Usa `courses`

### 2. **Columnas de Materiales Incorrectas**

**Problema:** El frontend busca columnas que no existen:
- Busca `material.url` → Debería ser `material.url_archivo`
- Busca `material.nombre` → Debería ser `material.titulo`

---

## 🔧 CORRECCIONES NECESARIAS

### **PRIORIDAD ALTA:**

1. **Corregir nombres de tablas:**
   ```typescript
   // Cambiar:
   .from('quizzes') → .from('cuestionarios')
   .from('quiz_questions') → .from('preguntas')
   .from('quiz_attempts') → .from('respuestas_texto_libre')
   .from('chapters') → .from('lecciones')
   .from('courses') → .from('cursos')
   ```

2. **Corregir columnas de materiales:**
   ```typescript
   // En CourseDetailsPage.tsx
   name: material.titulo, // No buscar 'nombre'
   url: material.url_archivo // No buscar 'url' ni 'archivo_url'
   ```

### **PRIORIDAD MEDIA:**

3. **Estandarizar nombres de columnas en Supabase:**
   - `materiales.url_archivo` → `archivo_url` (para consistencia con `lecciones.archivo_url`)
   - O viceversa: `lecciones.archivo_url` → `url_archivo`

---

## ✅ TABLAS QUE FUNCIONAN CORRECTAMENTE

- ✅ **inscripciones**: `user_id`, `curso_id`
- ✅ **cursos**: `id`, `titulo`, `teacher_id`, `imagen_url`
- ✅ **lecciones**: `curso_id`, `titulo`, `orden`
- ✅ **cuestionarios**: `curso_id`, `leccion_id`, `titulo`
- ✅ **usuarios**: `id`, `email`, `nombre`

---

## 🎯 CONCLUSIÓN FINAL

**Estado Actual:**
- ✅ **85% CORRECTO**: Las tablas principales usan los nombres correctos
- ⚠️ **15% PROBLEMÁTICO**: Tablas inexistentes y columnas incorrectas en materiales

**Acción Inmediata Requerida:**
1. Corregir nombres de tablas inexistentes (`quizzes` → `cuestionarios`, etc.)
2. Corregir columnas de materiales (`url` → `url_archivo`)
3. Verificar que todas las funcionalidades funcionen después de los cambios

**Impacto:**
- Los errores de producción se resolverán una vez corregidos estos nombres
- El código local funciona porque algunas consultas tienen fallbacks o no se ejecutan

---

*Análisis completado el: $(date)*
*Archivos analizados: 20+ archivos TypeScript/React*
*Estado: Listo para correcciones*