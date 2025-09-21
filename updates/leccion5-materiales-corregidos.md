# Corrección de Materiales - Lección 5

## Fecha
2025-09-21

## Cambio Realizado
Se corrigieron los materiales de la lección 5 (INTERVENCION FAMILIAR Y RECOVERY MENTORING) utilizando el MCP de Supabase. Los materiales originales tenían rutas incorrectas que causaban errores 404.

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
- **Ruta Correcta**: master en adicciones/5) PSICOLOGIA ADICCIONES/La entrevista v.pdf
- **Descripción**: Guía sobre técnicas de entrevista en el contexto de las adicciones
- **ID en BD**: 5997cce9-02a3-4700-96d8-84a9d35c9177

#### 2. "Cuadernillo de Terapia de Aceptación y Compromiso"
- **Tipo**: PDF
- **Archivo**: PGTP_Cuadernillo para Personas en Terapia de Aceptación y Compromiso_Individual o grupal.pdf
- **Ruta Correcta**: master en adicciones/5) PSICOLOGIA ADICCIONES/PGTP_Cuadernillo para Personas en Terapia de Aceptación y Compromiso_Individual o grupal.pdf
- **Descripción**: Cuadernillo práctico para terapia de aceptación y compromiso individual o grupal
- **ID en BD**: cc71fcd5-3828-4dfa-8e94-63b91c926ec0

#### 3. "Wilson - Terapia de Aceptación y Compromiso"
- **Tipo**: Documento (.pages)
- **Archivo**: WILSON TERAPIA ACEPTACION Y COMPROMISO.pages
- **Ruta Correcta**: master en adicciones/5) PSICOLOGIA ADICCIONES/WILSON TERAPIA ACEPTACION Y COMPROMISO.pages
- **Descripción**: Fundamentos teóricos de la Terapia de Aceptación y Compromiso según Wilson
- **ID en BD**: 30e20f84-1842-420c-ae6e-719146277786

### Proceso Realizado
1. **Identificación del problema**: La lección 5 tenía materiales con rutas incorrectas en el directorio `public/pdfs/master-adicciones/` en lugar del directorio correcto `master en adicciones/5) PSICOLOGIA ADICCIONES/`

2. **Eliminación de materiales incorrectos**: Se eliminaron los materiales que tenían rutas equivocadas y que no correspondían a los archivos físicos reales.

3. **Agregar materiales correctos**: Se insertaron los 3 materiales correctos con las rutas precisas al directorio adecuado:
   - La entrevista v.pdf
   - PGTP_Cuadernillo para Personas en Terapia de Aceptación y Compromiso_Individual o grupal.pdf
   - WILSON TERAPIA ACEPTACION Y COMPROMISO.pages

4. **Verificación final**: Se confirmó que los 3 materiales estén correctamente asignados a la lección 5 con las rutas correctas.

### Archivos Utilizados
Los archivos físicos ya existían en el directorio `master en adicciones/5) PSICOLOGIA ADICCIONES/`:
- La entrevista v.pdf
- PGTP_Cuadernillo para Personas en Terapia de Aceptación y Compromiso_Individual o grupal.pdf
- WILSON TERAPIA ACEPTACION Y COMPROMISO.pages

## Impacto
- **Solución de errores 404**: Los materiales ahora son accesibles correctamente porque las rutas en la base de datos coinciden con la ubicación real de los archivos.
- **Contenido correcto**: Los estudiantes ahora tienen acceso a los 3 materiales correctos para la lección 5 sobre psicología de adicciones.
- **Consistencia**: Todas las capas del sistema (base de datos, sistema de archivos, frontend) ahora son consistentes.

## Herramientas Utilizadas
- **Supabase MCP**: Para ejecutar consultas SQL y gestionar la base de datos
- **Sequential Thinking MCP**: Para analizar el problema y planificar la solución
- **Git**: Para documentar y versionar los cambios
