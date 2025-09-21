# Corrección de Materiales - Lección 5

## Fecha
2025-09-21

## Cambio Realizado
Se corrigieron los materiales de la lección 5 (INTERVENCION FAMILIAR Y RECOVERY MENTORING) utilizando el MCP de Supabase. Los materiales originales tenían rutas incorrectas que causaban errores 404 y se descargaban como archivos .htm en lugar de PDF.

## Detalles de la Corrección

### Lección Afectada
- **ID**: a2ea5c33-f0bf-4aba-b823-d5dabc825511
- **Título**: INTERVENCION FAMILIAR Y RECOVERY MENTORING
- **Orden**: 5
- **Curso**: MASTER EN ADICCIONES

### Materiales Corregidos

#### 1. "La Entrevista en Psicología de Adicciones"
- **Tipo**: PDF
- **Archivo**: La entrevista v.pdf
- **Ruta Original en BD**: master en adicciones/5) PSICOLOGIA ADICCIONES/La entrevista v.pdf
- **Ruta Final en BD**: La entrevista v.pdf
- **Ruta Física**: public/pdfs/master-adicciones/5) PSICOLOGIA ADICCIONES/La entrevista v.pdf
- **Descripción**: Guía sobre técnicas de entrevista en el contexto de las adicciones
- **ID en BD**: 5997cce9-02a3-4700-96d8-84a9d35c9177

#### 2. "Cuadernillo de Terapia de Aceptación y Compromiso"
- **Tipo**: PDF
- **Archivo**: PGTP_Cuadernillo para Personas en Terapia de Aceptación y Compromiso_Individual o grupal.pdf
- **Ruta Original en BD**: master en adicciones/5) PSICOLOGIA ADICCIONES/PGTP_Cuadernillo para Personas en Terapia de Aceptación y Compromiso_Individual o grupal.pdf
- **Ruta Final en BD**: PGTP_Cuadernillo para Personas en Terapia de Aceptación y Compromiso_Individual o grupal.pdf
- **Ruta Física**: public/pdfs/master-adicciones/5) PSICOLOGIA ADICCIONES/PGTP_Cuadernillo para Personas en Terapia de Aceptación y Compromiso_Individual o grupal.pdf
- **Descripción**: Cuadernillo práctico para terapia de aceptación y compromiso individual o grupal
- **ID en BD**: cc71fcd5-3828-4dfa-8e94-63b91c926ec0

#### 3. "Wilson - Terapia de Aceptación y Compromiso"
- **Tipo**: Documento (.pages)
- **Archivo**: WILSON TERAPIA ACEPTACION Y COMPROMISO.pages
- **Ruta Original en BD**: master en adicciones/5) PSICOLOGIA ADICCIONES/WILSON TERAPIA ACEPTACION Y COMPROMISO.pages
- **Ruta Final en BD**: WILSON TERAPIA ACEPTACION Y COMPROMISO.pages
- **Ruta Física**: public/pdfs/master-adicciones/5) PSICOLOGIA ADICCIONES/WILSON TERAPIA ACEPTACION Y COMPROMISO.pages
- **Descripción**: Fundamentos teóricos de la Terapia de Aceptación y Compromiso según Wilson
- **ID en BD**: 30e20f84-1842-420c-ae6e-719146277786

### Proceso Realizado

#### Fase 1: Corrección Inicial (2025-09-21)
1. **Identificación del problema**: La lección 5 tenía materiales con rutas incorrectas en el directorio `public/pdfs/master-adicciones/` en lugar del directorio correcto `master en adicciones/5) PSICOLOGIA ADICCIONES/`

2. **Eliminación de materiales incorrectos**: Se eliminaron los materiales que tenían rutas equivocadas y que no correspondían a los archivos físicos reales.

3. **Agregar materiales correctos**: Se insertaron los 3 materiales correctos con las rutas precisas al directorio adecuado.

#### Fase 2: Solución Definitiva de Errores 404 y .htm (2025-09-22)
1. **Análisis del componente LessonViewer**: Se descubrió que el componente añade automáticamente el prefijo `/pdfs/master-adicciones/5) PSICOLOGIA ADICCIONES/` a los nombres de los archivos.

2. **Problema de rutas**: Las rutas en la base de datos contenían la ruta completa, lo que causaba que el componente construyera rutas duplicadas y incorrectas.

3. **Copia de archivos físicos**: Se copiaron los archivos desde su ubicación original al directorio que el componente LessonViewer espera:
   - **Origen**: `master en adicciones/5) PSICOLOGIA ADICCIONES/`
   - **Destino**: `public/pdfs/master-adicciones/5) PSICOLOGIA ADICCIONES/`

4. **Actualización de rutas en la base de datos**: Se modificaron las URLs para que solo contengan los nombres de los archivos (sin rutas completas), permitiendo que el componente LessonViewer construya las rutas correctamente.

### Archivos Utilizados
Los archivos físicos originales existían en el directorio `master en adicciones/5) PSICOLOGIA ADICCIONES/`:
- La entrevista v.pdf
- PGTP_Cuadernillo para Personas en Terapia de Aceptación y Compromiso_Individual o grupal.pdf
- WILSON TERAPIA ACEPTACION Y COMPROMISO.pages

Se crearon copias en `public/pdfs/master-adicciones/5) PSICOLOGIA ADICCIONES/` para compatibilidad con el componente LessonViewer.

## Problemas Resueltos

### 1. Errores 404
- **Causa**: Rutas incorrectas en la base de datos que no coincidían con la estructura de directorios.
- **Solución**: Copia de archivos al directorio correcto y actualización de rutas en la base de datos.

### 2. Descargas como archivos .htm
- **Causa**: El componente LessonViewer construía rutas incorrectas debido a la duplicación de prefijos.
- **Solución**: Actualización de las URLs en la base de datos para que solo contengan nombres de archivos, permitiendo que el componente construya las rutas correctamente.

### 3. Inconsistencia entre base de datos y sistema de archivos
- **Causa**: Las rutas en la base de datos no coincidían con la ubicación física de los archivos.
- **Solución**: Alineación completa entre las rutas en la base de datos, los archivos físicos y el comportamiento del componente LessonViewer.

## Impacto
- **✅ Solución de errores 404**: Los materiales ahora son accesibles correctamente.
- **✅ Descargas correctas**: Los archivos PDF se descargan correctamente (no como .htm).
- **✅ Vista previa funcional**: Los PDF se abren correctamente en el navegador.
- **✅ Contenido correcto**: Los estudiantes ahora tienen acceso a los 3 materiales correctos para la lección 5 sobre psicología de adicciones.
- **✅ Consistencia**: Todas las capas del sistema (base de datos, sistema de archivos, frontend) ahora son consistentes.

## Herramientas Utilizadas
- **Supabase MCP**: Para ejecutar consultas SQL y gestionar la base de datos
- **Sequential Thinking MCP**: Para analizar el problema y planificar la solución
- **Git**: Para documentar y versionar los cambios
- **Comandos del sistema**: Para copiar archivos y gestionar directorios
