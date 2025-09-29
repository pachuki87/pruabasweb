-- Script para eliminar todas las lecciones y sus dependencias
-- Fecha: 2024-12-27
-- Propósito: Limpiar completamente la tabla lecciones y todas sus relaciones

-- IMPORTANTE: Este script eliminará TODOS los datos relacionados con lecciones
-- Ejecutar con precaución ya que esta acción no se puede deshacer

BEGIN;

-- Mostrar conteo inicial de registros
SELECT 'CONTEO INICIAL DE REGISTROS:' as info;
SELECT 'opciones_respuesta' as tabla, COUNT(*) as registros FROM opciones_respuesta;
SELECT 'preguntas' as tabla, COUNT(*) as registros FROM preguntas;
SELECT 'cuestionarios' as tabla, COUNT(*) as registros FROM cuestionarios;
SELECT 'materiales' as tabla, COUNT(*) as registros FROM materiales WHERE leccion_id IS NOT NULL;
SELECT 'lecciones' as tabla, COUNT(*) as registros FROM lecciones;

-- PASO 1: Eliminar opciones_respuesta
-- (depende de preguntas)
SELECT 'PASO 1: Eliminando opciones_respuesta...' as info;
DELETE FROM opciones_respuesta 
WHERE pregunta_id IN (
    SELECT p.id 
    FROM preguntas p 
    INNER JOIN cuestionarios c ON p.cuestionario_id = c.id 
    WHERE c.leccion_id IS NOT NULL
);

-- PASO 2: Eliminar preguntas
-- (depende de cuestionarios que tienen leccion_id)
SELECT 'PASO 2: Eliminando preguntas...' as info;
DELETE FROM preguntas 
WHERE cuestionario_id IN (
    SELECT id 
    FROM cuestionarios 
    WHERE leccion_id IS NOT NULL
);

-- PASO 3: Eliminar cuestionarios
-- (depende de lecciones via leccion_id)
SELECT 'PASO 3: Eliminando cuestionarios...' as info;
DELETE FROM cuestionarios 
WHERE leccion_id IS NOT NULL;

-- PASO 4: Eliminar materiales
-- (depende de lecciones via leccion_id)
SELECT 'PASO 4: Eliminando materiales...' as info;
DELETE FROM materiales 
WHERE leccion_id IS NOT NULL;

-- PASO 5: Eliminar referencias de navegación en lecciones
-- (eliminar referencias a leccion_anterior_id y leccion_siguiente_id)
SELECT 'PASO 5: Eliminando referencias de navegación...' as info;
UPDATE lecciones 
SET leccion_anterior_id = NULL, leccion_siguiente_id = NULL;

-- PASO 6: Finalmente eliminar todas las lecciones
SELECT 'PASO 6: Eliminando lecciones...' as info;
DELETE FROM lecciones;

-- Verificar que todas las tablas están vacías
SELECT 'VERIFICACIÓN FINAL - CONTEO DE REGISTROS:' as info;
SELECT 'opciones_respuesta' as tabla, COUNT(*) as registros_restantes FROM opciones_respuesta;
SELECT 'preguntas' as tabla, COUNT(*) as registros_restantes FROM preguntas;
SELECT 'cuestionarios' as tabla, COUNT(*) as registros_restantes FROM cuestionarios;
SELECT 'materiales con leccion_id' as tabla, COUNT(*) as registros_restantes FROM materiales WHERE leccion_id IS NOT NULL;
SELECT 'lecciones' as tabla, COUNT(*) as registros_restantes FROM lecciones;

-- Mostrar mensaje de confirmación
SELECT 'ELIMINACIÓN COMPLETADA EXITOSAMENTE' as resultado;
SELECT 'Todas las lecciones y sus dependencias han sido eliminadas' as mensaje;

COMMIT;

-- Consultas adicionales para verificación manual (opcional)
-- Descomentar si se desea ejecutar verificaciones adicionales

/*
-- Verificar que no hay registros huérfanos
SELECT 'Verificando registros huérfanos...' as info;

-- Verificar opciones_respuesta sin preguntas
SELECT COUNT(*) as opciones_huerfanas 
FROM opciones_respuesta o 
LEFT JOIN preguntas p ON o.pregunta_id = p.id 
WHERE p.id IS NULL;

-- Verificar preguntas sin cuestionarios
SELECT COUNT(*) as preguntas_huerfanas 
FROM preguntas p 
LEFT JOIN cuestionarios c ON p.cuestionario_id = c.id 
WHERE c.id IS NULL;

-- Verificar cuestionarios sin lecciones
SELECT COUNT(*) as cuestionarios_huerfanos 
FROM cuestionarios c 
LEFT JOIN lecciones l ON c.leccion_id = l.id 
WHERE c.leccion_id IS NOT NULL AND l.id IS NULL;

-- Verificar materiales sin lecciones
SELECT COUNT(*) as materiales_huerfanos 
FROM materiales m 
LEFT JOIN lecciones l ON m.leccion_id = l.id 
WHERE m.leccion_id IS NOT NULL AND l.id IS NULL;
*/