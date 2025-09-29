# Plan de Mejoras para Módulos del Curso

## Resumen Ejecutivo
Plan detallado para resolver los problemas reportados por Lena en los módulos del curso, incluyendo corrección de PDFs, implementación de descripciones, acceso a videos y sistema de preguntas de reflexión.

## Problemas Identificados

### 1. Módulo Final - PDFs Incorrectos
**Problema:** Aparecen otros PDFs cuando solo debería estar "Guía práctica TFM"
**Prioridad:** Alta
**Impacto:** Confusión del usuario final

### 2. Módulo 9 - PDFs Sin Descripción
**Problema:** Solo aparecen dos PDFs sin descripción
**Prioridad:** Media
**Impacto:** Falta de contexto para el usuario

### 3. Acceso a Videos
**Problema:** Usuario no sabe dónde acceder a los videos
**Prioridad:** Alta
**Impacto:** Contenido inaccesible

### 4. Sistema de Preguntas de Reflexión
**Problema:** Solo aparece en módulo 5, necesario en todos los módulos
**Prioridad:** Media-Alta
**Impacto:** Inconsistencia en la experiencia de aprendizaje

## Plan de Implementación

### Fase 1: Análisis y Diagnóstico (Prioridad Inmediata)

#### 1.1 Auditoría de Contenido
- **Acción:** Revisar base de datos de materiales por módulo
- **Archivos a revisar:**
  - `src/pages/dashboard/LessonPage.tsx`
  - Base de datos Supabase (tabla `materiales`)
  - Carpeta `public/pdfs/`
- **Tiempo estimado:** 2 horas
- **Entregable:** Inventario completo de PDFs por módulo

#### 1.2 Mapeo de Videos
- **Acción:** Identificar ubicación actual de videos en la aplicación
- **Archivos a revisar:**
  - Componentes de lecciones
  - Base de datos (tabla `lecciones`)
  - Estructura de navegación
- **Tiempo estimado:** 1 hora
- **Entregable:** Mapa de acceso a videos

### Fase 2: Corrección de PDFs (Prioridad Alta)

#### 2.1 Módulo Final - Limpieza de PDFs
- **Acción:** Eliminar PDFs no deseados, mantener solo "Guía práctica TFM"
- **Pasos específicos:**
  1. Consultar base de datos para módulo final
  2. Identificar PDFs incorrectos
  3. Actualizar registros en tabla `materiales`
  4. Verificar archivos físicos en `public/pdfs/`
- **Script necesario:** `fix_final_module_pdfs.js`
- **Tiempo estimado:** 1 hora

#### 2.2 Módulo 9 - Agregar Descripciones
- **Acción:** Añadir descripciones a los dos PDFs existentes
- **Pasos específicos:**
  1. Identificar PDFs del módulo 9
  2. Crear descripciones apropiadas
  3. Actualizar campo `descripcion` en base de datos
- **Tiempo estimado:** 30 minutos

### Fase 3: Mejora de Acceso a Videos (Prioridad Alta)

#### 3.1 Análisis de UX para Videos
- **Acción:** Evaluar la navegación actual hacia videos
- **Consideraciones:**
  - ¿Están integrados en las lecciones?
  - ¿Hay una sección dedicada?
  - ¿Es intuitiva la navegación?

#### 3.2 Implementación de Mejoras
- **Opciones de solución:**
  1. **Opción A:** Agregar sección "Videos" en menú principal
  2. **Opción B:** Integrar videos directamente en cada lección
  3. **Opción C:** Crear página dedicada de recursos multimedia
- **Archivos a modificar:**
  - `src/components/layout/Sidebar.tsx`
  - `src/pages/dashboard/LessonPage.tsx`
  - Posible nueva página `VideoLibraryPage.tsx`
- **Tiempo estimado:** 3-4 horas

### Fase 4: Sistema de Preguntas de Reflexión (Prioridad Media-Alta)

#### 4.1 Análisis del Sistema Actual
- **Acción:** Revisar implementación en módulo 5
- **Archivos a analizar:**
  - Componente de preguntas de reflexión
  - Sistema de subida de archivos
  - Base de datos relacionada

#### 4.2 Diseño del Sistema Unificado
- **Características requeridas:**
  - Preguntas personalizables por módulo
  - Sistema de subida de archivos
  - Almacenamiento seguro
  - Interfaz consistente

#### 4.3 Implementación Técnica
- **Componentes a crear/modificar:**
  - `ReflectionQuestionsComponent.tsx`
  - `FileUploadComponent.tsx`
  - Sistema de gestión de archivos
- **Base de datos:**
  - Tabla `preguntas_reflexion`
  - Tabla `respuestas_estudiantes`
  - Tabla `archivos_subidos`
- **Tiempo estimado:** 6-8 horas

## Consideraciones Técnicas

### Base de Datos
- **Tablas afectadas:**
  - `materiales` (PDFs y descripciones)
  - `lecciones` (integración de videos)
  - `preguntas_reflexion` (nueva)
  - `respuestas_estudiantes` (nueva)

### Seguridad
- **Subida de archivos:**
  - Validación de tipos de archivo
  - Límites de tamaño
  - Escaneo de malware
  - Almacenamiento seguro en Supabase Storage

### Performance
- **Consideraciones:**
  - Carga lazy de videos
  - Compresión de PDFs
  - Optimización de consultas de base de datos

## Testing Requerido

### Testing Funcional
1. **Módulo Final:**
   - Verificar que solo aparece "Guía práctica TFM"
   - Confirmar descarga correcta del PDF

2. **Módulo 9:**
   - Verificar descripciones de PDFs
   - Confirmar legibilidad y relevancia

3. **Acceso a Videos:**
   - Navegación intuitiva
   - Reproducción correcta
   - Responsive design

4. **Preguntas de Reflexión:**
   - Funcionalidad en todos los módulos
   - Subida de archivos exitosa
   - Almacenamiento seguro

### Testing de Usuario
- **Usuarios de prueba:** Estudiantes reales
- **Escenarios:** Navegación completa por módulos
- **Métricas:** Tiempo de localización de contenido, satisfacción

## Cronograma de Implementación

### Semana 1
- **Días 1-2:** Fase 1 (Análisis y Diagnóstico)
- **Días 3-4:** Fase 2 (Corrección de PDFs)
- **Día 5:** Testing inicial

### Semana 2
- **Días 1-3:** Fase 3 (Mejora de Acceso a Videos)
- **Días 4-5:** Testing y ajustes

### Semana 3
- **Días 1-4:** Fase 4 (Sistema de Preguntas de Reflexión)
- **Día 5:** Testing integral

### Semana 4
- **Días 1-2:** Testing de usuario
- **Días 3-4:** Correcciones finales
- **Día 5:** Despliegue a producción

## Recursos Necesarios

### Técnicos
- Desarrollador frontend (React/TypeScript)
- Desarrollador backend (Supabase)
- Tester/QA

### Herramientas
- Acceso a base de datos Supabase
- Entorno de desarrollo local
- Herramientas de testing

## Riesgos y Mitigaciones

### Riesgo 1: Pérdida de Datos
- **Mitigación:** Backup completo antes de modificaciones
- **Plan B:** Scripts de rollback

### Riesgo 2: Impacto en Usuarios Activos
- **Mitigación:** Implementación en horarios de baja actividad
- **Plan B:** Despliegue gradual por módulos

### Riesgo 3: Problemas de Performance
- **Mitigación:** Testing de carga antes del despliegue
- **Plan B:** Optimizaciones adicionales

## Métricas de Éxito

### Cuantitativas
- 100% de módulos con PDFs correctos
- 0 PDFs sin descripción
- Reducción del 80% en consultas sobre acceso a videos
- 100% de módulos con preguntas de reflexión

### Cualitativas
- Mejora en satisfacción del usuario
- Navegación más intuitiva
- Experiencia de aprendizaje consistente

## Conclusión

Este plan aborda sistemáticamente todos los problemas reportados por Lena, priorizando las correcciones críticas y estableciendo un cronograma realista para la implementación completa. La ejecución exitosa resultará en una experiencia de usuario significativamente mejorada y un sistema de aprendizaje más coherente y funcional.