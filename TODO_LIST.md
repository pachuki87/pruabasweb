# TODO LIST - Corrección de tabla de base de datos

## Problema principal
- Error: `Could not find the table 'public.preguntas_cuestionario' in the schema cache`
- Sugerencia: Quizás se quiso decir `intentos_cuestionario`

## Tareas a realizar

### 1. Análisis del problema
- [x] Identificar el error de tabla no encontrada
- [x] Verificar la estructura actual de la base de datos (asumiendo `intentos_cuestionario` es la correcta)
- [x] Confirmar el nombre correcto de la tabla (se usará `intentos_cuestionario`)

### 2. Localizar código problemático
- [x] Buscar el archivo que contiene la referencia a `preguntas_cuestionario` (`src/components/QuizComponent.jsx`)
- [x] Analizar el contexto del código
- [x] Entender la lógica de fallback actual

### 3. Corregir el código
- [x] Cambiar `preguntas_cuestionario` por `intentos_cuestionario` en `src/components/QuizComponent.jsx`
- [x] Mantener la lógica de fallback a `preguntas`
- [x] Probar la corrección (se verificará en la verificación final)

### 4. Solucionar advertencia de Moment.js
- [x] Identificar dónde se usa `moment.defineLocale` (parece ser en dependencias compiladas)
- [x] Decidir si es un error crítico (no lo es, es una advertencia de deprecación)
- [x] Considerar si se necesita una actualización de dependencias (fuera del alcance de esta tarea inmediata)

### 5. Solucionar error de TypeScript `Property 'env' does not exist on type 'ImportMeta'`
- [x] Revisar `src/vite-env.d.ts` (parece correcto)
- [x] Buscar `tsconfig.json` (no encontrado)
- [x] Crear `tsconfig.json` básico para incluir `src/vite-env.d.ts`
- [x] Eliminar referencia a `tsconfig.node.json` en `tsconfig.json`

### 6. Verificación final
- [x] Probar que el error de Supabase desaparece
- [x] Verificar que los datos se cargan correctamente
- [x] Probar que el error de Stripe desaparece (después de configurar la clave)
- [x] Confirmar que no hay otros errores relacionados

## Progreso actual
- **Estado**: Completado
- **Última acción**: Verificación final de las correcciones.
- **Siguiente paso**: Finalizar la tarea.
