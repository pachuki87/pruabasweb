# 📝 Documentación de Tipos de Preguntas

## Resumen Ejecutivo

El sistema de cuestionarios maneja **dos tipos principales de preguntas**:

1. **`multiple_choice`** - Preguntas de opción múltiple
2. **`texto_libre`** - Preguntas de respuesta abierta

---

## 🔍 Estructura de Base de Datos

### Tabla Principal: `preguntas`

```sql
CREATE TABLE preguntas (
    id UUID PRIMARY KEY,
    cuestionario_id UUID REFERENCES cuestionarios(id),
    pregunta TEXT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'multiple_choice',  -- ⭐ Campo clave
    orden INTEGER NOT NULL,
    explicacion TEXT,
    creado_en TIMESTAMP WITH TIME ZONE
);
```

**Columnas identificadas:**
- `id` - Identificador único
- `cuestionario_id` - Referencia al cuestionario
- `pregunta` - Texto de la pregunta
- `tipo` - **CAMPO CLAVE** que determina el comportamiento
- `orden` - Orden de presentación
- `explicacion` - Explicación opcional
- `creado_en` - Timestamp de creación

---

## 📊 Tipos de Preguntas Detallados

### 1. Preguntas de Opción Múltiple (`multiple_choice`)

#### Características:
- ✅ Tienen opciones predefinidas
- ✅ Una o más opciones pueden ser correctas
- ✅ Validación automática de respuestas
- ✅ Puntuación automática

#### Tabla de Opciones: `opciones_respuesta`

```sql
CREATE TABLE opciones_respuesta (
    id UUID PRIMARY KEY,
    pregunta_id UUID REFERENCES preguntas(id),
    opcion TEXT NOT NULL,
    es_correcta BOOLEAN DEFAULT FALSE,  -- ⭐ Campo de validación
    orden INTEGER NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE
);
```

**Columnas:**
- `pregunta_id` - Referencia a la pregunta
- `opcion` - Texto de la opción
- `es_correcta` - **CAMPO CLAVE** para validación
- `orden` - Orden de presentación

#### Ejemplo de Uso:
```javascript
// Obtener pregunta con opciones
const { data } = await supabase
  .from('preguntas')
  .select(`
    *,
    opciones_respuesta(*)
  `)
  .eq('tipo', 'multiple_choice');
```

---

### 2. Preguntas de Texto Libre (`texto_libre`)

#### Características:
- ✅ Respuesta abierta del usuario
- ❌ Sin validación automática
- ❌ Sin puntuación automática
- ✅ Requiere revisión manual (opcional)

#### Tabla de Respuestas: `respuestas_texto_libre`

```sql
CREATE TABLE respuestas_texto_libre (
    id UUID PRIMARY KEY,
    pregunta_id UUID REFERENCES preguntas(id),
    respuesta TEXT,  -- ⭐ Respuesta del usuario
    user_id TEXT,    -- ⭐ Usuario que respondió
    creado_en TIMESTAMP WITH TIME ZONE
);
```

**Columnas:**
- `pregunta_id` - Referencia a la pregunta
- `respuesta` - **CAMPO CLAVE** con la respuesta del usuario
- `user_id` - Identificador del usuario
- `creado_en` - Timestamp de respuesta

#### Ejemplo de Uso:
```javascript
// Guardar respuesta de texto libre
const { data } = await supabase
  .from('respuestas_texto_libre')
  .insert({
    pregunta_id: preguntaId,
    respuesta: textoRespuesta,
    user_id: userId
  });
```

---

## 📈 Estadísticas Actuales

**Distribución de preguntas en la base de datos:**
- `multiple_choice`: **2 preguntas** (50%)
- `texto_libre`: **2 preguntas** (50%)

**Total de respuestas de texto libre:** 3 respuestas registradas

---

## 🔧 Implementación en el Frontend

### Componentes Identificados:

1. **`QuizAttemptPage.tsx`** - Página principal de cuestionarios
2. **`LessonPage.tsx`** - Integración con lecciones
3. **`NewLessonPage.tsx`** - Creación de nuevas lecciones
4. **`DashboardPage.tsx`** - Dashboard con estadísticas
5. **`StudentProgress.tsx`** - Seguimiento de progreso

### Lógica de Renderizado:

```javascript
// Ejemplo de lógica condicional por tipo
if (pregunta.tipo === 'multiple_choice') {
  // Renderizar opciones de respuesta
  return <MultipleChoiceQuestion pregunta={pregunta} />;
} else if (pregunta.tipo === 'texto_libre') {
  // Renderizar campo de texto libre
  return <FreeTextQuestion pregunta={pregunta} />;
}
```

---

## 🎯 Casos de Uso Específicos

### Lección 2 - Cuestionario de Texto Libre

Se identificó código específico que busca cuestionarios de texto libre en la **lección 2**:

```javascript
// Si es la lección 2, buscar específicamente el cuestionario de texto libre
if (lessonOrder === 2) {
  // Lógica específica para texto libre
}
```

---

## ⚠️ Consideraciones Importantes

### Diferencias Clave:

| Aspecto | `multiple_choice` | `texto_libre` |
|---------|-------------------|---------------|
| **Validación** | ✅ Automática | ❌ Manual/Ninguna |
| **Puntuación** | ✅ Automática | ❌ Manual/Ninguna |
| **Opciones** | ✅ Predefinidas | ❌ N/A |
| **Almacenamiento** | `opciones_respuesta` | `respuestas_texto_libre` |
| **Complejidad** | Media | Baja |

### Recomendaciones:

1. **Consistencia**: Mantener el campo `tipo` siempre actualizado
2. **Validación**: Implementar validación en frontend para ambos tipos
3. **UX**: Proporcionar feedback claro sobre el tipo de pregunta
4. **Progreso**: Considerar ambos tipos en el cálculo de progreso

---

## 🔄 Sistema de Progreso

Ambos tipos de preguntas se consideran en el sistema de progreso:

```sql
-- Vista user_course_summary incluye ambos tipos
LEFT JOIN public.respuestas_texto_libre rtl ON q.id = rtl.pregunta_id
```

---

## ✅ Estado de Verificación

- [x] Estructura de base de datos documentada
- [x] Tipos de preguntas identificados
- [x] Diferencias clave documentadas
- [x] Implementación frontend analizada
- [x] Casos de uso específicos identificados
- [x] Recomendaciones proporcionadas

**Fecha de análisis:** $(date)
**Versión:** 1.0
**Estado:** ✅ Completado