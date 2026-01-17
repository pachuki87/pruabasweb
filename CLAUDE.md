# Instituto Lidera - Documentación Técnica

**Proyecto Netlify:** `institutolidera` (ID: `abddc12c-aa1d-4552-9264-9d96932dfd00`)  
**URL Producción:** https://institutolidera.netlify.app  
**Base de Datos:** Supabase (PostgreSQL 17.4.1)  
**Supabase Project ID:** `lyojcqiiixkqqtpoejdo`  
**Última actualización:** 16 de enero de 2026

---

## 📋 Índice

1. [Resumen del Sistema](#resumen-del-sistema)
2. [Arquitectura](#arquitectura)
3. [Análisis de Coherencia](#análisis-de-coherencia)
4. [Problemas Críticos Identificados](#problemas-críticos-identificados)
5. [Inconsistencias de Nomenclatura](#inconsistencias-de-nomenclatura)
6. [Recomendaciones](#recomendaciones)
7. [Esquema de Base de Datos](#esquema-de-base-de-datos)

---

## Resumen del Sistema

Plataforma e-learning desarrollada con:

| Componente | Tecnología |
|------------|------------|
| Frontend | React + TypeScript + Vite |
| Backend | Supabase (PostgreSQL) |
| Functions | Netlify Functions (JavaScript) |
| Autenticación | Supabase Auth |
| Hosting | Netlify |

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                  (React + TypeScript)                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ DashboardPage   │  │ progressService │  │ database.types  │ │
│  │ StudentProgress │  │ useProgress     │  │ (TypeScript)    │ │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘ │
└───────────┼─────────────────────┼─────────────────────┼─────────┘
            │                     │                     │
            ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SUPABASE CLIENT                            │
│         Tablas: intentos_cuestionario, user_test_results        │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NETLIFY FUNCTIONS                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ send-corrections.js (línea 376)                              ││
│  │ → Guarda en: student_quiz_results (¡TABLA EN INGLÉS!)       ││
│  │ → Envía a: n8n webhook                                       ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SUPABASE                                 │
│                    (PostgreSQL 17.4.1)                          │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐│
│  │ user_test_results│ │intentos_         │ │student_quiz_     ││
│  │ (ESPAÑOL)        │ │cuestionario      │ │results (INGLÉS)  ││
│  │ 0 filas ❌       │ │(ESPAÑOL)         │ │0 filas ❌        ││
│  │                  │ │0 filas ❌        │ │                  ││
│  └──────────────────┘ └──────────────────┘ └──────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Análisis de Coherencia

### Estado Actual (16 enero 2026)

| Componente | Coherencia con BD | Estado |
|------------|-------------------|--------|
| Frontend → Supabase (nombres de tablas) | ✅ Correcto | Usa nombres en español |
| Frontend → Supabase (tipos TypeScript) | ❌ Incorrecto | Columnas con nombres erróneos |
| Netlify Functions → Supabase | ⚠️ Parcial | Guarda en tabla diferente |
| Base de Datos (internamente) | ❌ Inconsistente | Mezcla de español e inglés |

### Flujo de Datos del Quiz - PROBLEMA IDENTIFICADO

```
Usuario completa quiz
        │
        ├──► Frontend (progressService.ts)
        │    └──► Intenta insertar en: user_test_results
        │         └──► FALLA (tipos incorrectos) ❌
        │
        └──► Netlify Function (send-corrections.js)
             └──► Inserta en: student_quiz_results ✅
                  └──► Pero frontend lee de user_test_results
                       └──► NUNCA ENCUENTRA LOS DATOS ❌
```

---

## Problemas Críticos Identificados

### 🔴 CRÍTICO #1: Tres Tablas para Resultados de Quiz

Existen tres tablas que almacenan resultados de cuestionarios:

| Tabla | Idioma | ¿Quién escribe? | ¿Quién lee? | Filas |
|-------|--------|-----------------|-------------|-------|
| `user_test_results` | Español | Frontend | Frontend | **0** |
| `intentos_cuestionario` | Español | Frontend | Frontend | **0** |
| `student_quiz_results` | **Inglés** | Netlify Function | **Nadie** | **0** |

**Impacto:** Los resultados de quiz nunca se muestran porque el frontend lee de una tabla y la Netlify Function escribe en otra.

### 🔴 CRÍTICO #2: Tipos TypeScript Incorrectos

#### Tabla `intentos_cuestionario` - Archivo: `src/lib/database.types.ts` (líneas 325-383)

| Campo en TypeScript | Campo Real en BD | ¿Coincide? |
|--------------------|------------------|------------|
| `numero_intento` | `intento_numero` | ❌ |
| `completado` (boolean) | `estado` (varchar enum) | ❌ |
| `tiempo_completado` | `tiempo_transcurrido` | ❌ |
| `respuestas_detalle` | `respuestas_guardadas` | ❌ |
| *(no existe)* | `porcentaje` | ❌ Falta |
| *(no existe)* | `aprobado` | ❌ Falta |

**Impacto:** Cualquier inserción/actualización a esta tabla fallará silenciosamente.

#### Tabla `inscripciones` - Archivo: `src/lib/database.types.ts` (líneas 138-157)

| Campo en TypeScript | ¿Existe en BD? |
|--------------------|----------------|
| `created_at` | **NO** ❌ |

### ⚠️ ALTO: Columnas Duplicadas

En `user_test_results`:
- `fecha_completado` (español)
- `completed_at` (inglés)

Ambas columnas almacenan el mismo dato. Una debe eliminarse.

---

## Inconsistencias de Nomenclatura

### Análisis de Idiomas en el Proyecto

| Componente | Idioma Predominante | Ejemplos |
|------------|---------------------|----------|
| Nombres de tablas | Español (90%) | `cuestionarios`, `lecciones`, `cursos` |
| Columnas principales | Español (80%) | `puntuacion`, `aprobado`, `creado_en` |
| Tabla `student_quiz_results` | **Inglés (100%)** | `score`, `passed`, `completion_date` |
| Variables en Netlify Functions | Inglés | `webhookPayload`, `quizData` |
| Tipos TypeScript | Español (85%) | Siguiendo nombres de BD |

### Problema de la Mezcla de Idiomas

1. **Duplicación innecesaria** - Columnas como `fecha_completado` y `completed_at` coexisten
2. **Confusión para desarrolladores** - ¿Es `puntuacion` o `score`?
3. **Errores silenciosos** - Si usas el nombre incorrecto, no hay error de compilación
4. **Mantenimiento difícil** - Cada nuevo desarrollador debe adivinar el idioma

### Comparación de Esfuerzo de Migración

| Criterio | Migrar a Español | Migrar a Inglés |
|----------|------------------|-----------------|
| Tablas a modificar | 1-2 | 10+ |
| Columnas a renombrar | ~5 | ~50+ |
| Archivos frontend a actualizar | ~3 | ~50+ |
| Riesgo de introducir bugs | Bajo | **Alto** |
| Tiempo estimado | 1-2 días | 1-2 semanas |

**Recomendación: Mantener ESPAÑOL como estándar.**

---

## Recomendaciones

### Prioridad 1: Unificar Tablas de Resultados de Quiz

**Decisión requerida:** Elegir UNA tabla para resultados de quiz.

**Opción A (Recomendada):** Usar `user_test_results`
- Ya tiene la estructura correcta en español
- El frontend ya está configurado para usarla
- Solo hay que modificar la Netlify Function `send-corrections.js`

**Opción B:** Usar `student_quiz_results`
- Requiere modificar todo el frontend
- Mayor esfuerzo de migración

### Prioridad 2: Corregir Tipos TypeScript

**Archivo:** `src/lib/database.types.ts`

Corregir `intentos_cuestionario` (líneas 325-383):

```typescript
// INCORRECTO (actual)          →  CORRECTO (debe ser)
numero_intento: number          →  intento_numero: number
completado: boolean             →  estado: string  // 'iniciado'|'en_progreso'|'completado'|'abandonado'
tiempo_completado: number       →  tiempo_transcurrido: number
respuestas_detalle: Json        →  respuestas_guardadas: Json
// AGREGAR:
porcentaje: number | null
aprobado: boolean
```

Corregir `inscripciones` (líneas 138-157):
```typescript
// ELIMINAR esta línea (la columna NO existe en BD):
created_at: string
```

### Prioridad 3: Modificar Netlify Function

**Archivo:** `netlify/functions/send-corrections.js`

Cambiar línea 376 de:
```javascript
`${SUPABASE_URL}/rest/v1/student_quiz_results`
```

A:
```javascript
`${SUPABASE_URL}/rest/v1/user_test_results`
```

Y actualizar el payload para usar nombres en español.

### Prioridad 4: Eliminar Columnas Duplicadas

```sql
-- En Supabase SQL Editor:
ALTER TABLE user_test_results DROP COLUMN IF EXISTS completed_at;
```

---

## Esquema de Base de Datos

### Tablas con Datos

| Tabla | Filas | Estado |
|-------|-------|--------|
| `usuarios` | 14 | ✅ Activa |
| `inscripciones` | 12 | ✅ Activa |
| `user_course_progress` | 10,654 | ✅ Activa |

### Tablas Vacías (Requieren Atención)

| Tabla | Propósito | Razón Probable de 0 Filas |
|-------|-----------|---------------------------|
| `user_test_results` | Resultados de quiz | Tipos TS incorrectos |
| `intentos_cuestionario` | Intentos de quiz | Tipos TS incorrectos |
| `student_quiz_results` | Resultados (inglés) | Frontend no la lee |
| `cuestionarios` | Definición de quizzes | No se usan (datos en JSON) |
| `preguntas` | Preguntas de quiz | No se usan (datos en JSON) |

### Columnas Críticas por Tabla

#### `intentos_cuestionario` (BD Real vs TypeScript)

```
COLUMNA BD REAL              COLUMNA TYPESCRIPT (INCORRECTA)
─────────────────────────────────────────────────────────────
intento_numero        ←→     numero_intento ❌
estado (varchar)      ←→     completado (boolean) ❌
tiempo_transcurrido   ←→     tiempo_completado ❌
respuestas_guardadas  ←→     respuestas_detalle ❌
porcentaje            ←→     (NO EXISTE) ❌
aprobado              ←→     (NO EXISTE) ❌
```

#### `student_quiz_results` (Tabla en INGLÉS - Netlify Function)

```sql
id                  UUID PRIMARY KEY
student_id          UUID → auth.users(id)
quiz_title          VARCHAR
score               INTEGER    -- En español sería: puntuacion
max_score           INTEGER    -- En español sería: puntuacion_maxima
percentage          NUMERIC    -- En español sería: porcentaje
passed              BOOLEAN    -- En español sería: aprobado
completion_date     TIMESTAMPTZ -- En español sería: fecha_completado
time_spent_seconds  INTEGER
total_questions     INTEGER
correct_answers     INTEGER
incorrect_answers   INTEGER
questions_data      JSONB
student_name        VARCHAR
student_email       VARCHAR
course_id           VARCHAR
lesson_id           VARCHAR
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

---

## Archivos Clave

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `src/lib/database.types.ts` | Tipos TypeScript para Supabase | **🔴 REQUIERE CORRECCIÓN** |
| `src/lib/services/progressService.ts` | Servicio de progreso | Usa `user_test_results` |
| `src/pages/dashboard/DashboardPage.tsx` | Dashboard principal | Usa `intentos_cuestionario` |
| `netlify/functions/send-corrections.js` | Envío de resultados a n8n | **🔴 USA TABLA INCORRECTA** |

---

## Checklist de Correcciones

- [ ] Decidir qué tabla usar para resultados de quiz
- [ ] Corregir tipos TypeScript en `database.types.ts`
- [ ] Modificar `send-corrections.js` para usar tabla correcta
- [ ] Eliminar columna duplicada `completed_at`
- [ ] Probar flujo completo de quiz
- [ ] Verificar que resultados se guardan y muestran

---

## Historial de Cambios

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2026-01-16 | Documentación inicial con análisis de coherencia | Análisis MCP |

---

**Documento generado mediante análisis automatizado de Supabase MCP, Netlify MCP y código fuente.**

### 2026-01-17: Resolución de Problemas de Guardado de Quiz
- **Situación:** Los resultados de los cuestionarios no se guardaban en `user_test_results` ni `intentos_cuestionario`, o se guardaban incompletos.
- **Causa Raíz:** 
  1. `QuizAttemptPage.tsx` guardaba en una tabla incorrecta (`respuestas_texto_libre`).
  2. `LessonViewer.tsx` intentaba insertar campos generados (`aprobado`, `porcentaje`) bloqueando la inserción.
  3. Triggers de base de datos (`notify_quiz_completion`) fallaban por permisos RLS y columnas obsoletas (`completed_at`).
- **Solución Implementada:**
  - ✅ Corregido `QuizAttemptPage.tsx` para guardar en `intentos_cuestionario` Y `user_test_results`.
  - ✅ Eliminadas columnas generadas de los inserts en el frontend.
  - ✅ Modificado trigger `notify_quiz_completion` a `SECURITY DEFINER` y corregido nombre de columna a `fecha_completado`.
  - ✅ `database.types.ts` verificado como correcto.
- **Resultado:** Guardado correcto y completo de intentos y respuestas verificado en producción.

