# 📋 Instrucciones para Aplicar la Migración leccion_id

## 🎯 Objetivo
Agregar la columna `leccion_id` a la tabla `preguntas` para establecer la relación directa entre preguntas y lecciones.

## 📊 Estado Actual
- ✅ **48 preguntas** encontradas en la base de datos
- ✅ **5 cuestionarios** tienen lección asignada
- ⚠️ **Columna leccion_id** no existe en la tabla preguntas

## 🔧 SQL a Ejecutar

### Paso 1: Ir al Editor SQL de Supabase
🔗 **URL:** https://supabase.com/dashboard/project/lyojcqiiixkqqtpoejdo/sql

### Paso 2: Ejecutar el siguiente SQL

```sql
-- 1. Agregar la columna leccion_id a la tabla preguntas
ALTER TABLE preguntas 
ADD COLUMN leccion_id UUID REFERENCES lecciones(id);

-- 2. Crear índice para mejorar rendimiento
CREATE INDEX idx_preguntas_leccion_id ON preguntas(leccion_id);

-- 3. Actualizar preguntas existentes con leccion_id
UPDATE preguntas 
SET leccion_id = c.leccion_id
FROM cuestionarios c
WHERE preguntas.cuestionario_id = c.id
AND c.leccion_id IS NOT NULL;

-- 4. Verificar el resultado
SELECT 
    COUNT(CASE WHEN leccion_id IS NOT NULL THEN 1 END) as con_leccion_id,
    COUNT(CASE WHEN leccion_id IS NULL THEN 1 END) as sin_leccion_id,
    COUNT(*) as total
FROM preguntas;
```

## 📈 Resultado Esperado
Después de ejecutar la migración:
- ✅ **10 preguntas** tendrán `leccion_id` asignado (de los 5 cuestionarios con lección)
- ⚠️ **38 preguntas** permanecerán sin `leccion_id` (de cuestionarios sin lección asignada)

## 🔍 Cuestionarios que se Actualizarán

1. **Definición conducta adictiva** → 1 pregunta
2. **Criterio de diagnóstico DSM V** → 1 pregunta  
3. **Cuestionario 1: Fundamentos de Terapia Cognitiva** → 3 preguntas
4. **Cuestionario 2: Técnicas de Intervención Cognitiva** → 3 preguntas
5. **Otro cuestionario** → 2 preguntas

## ✅ Verificación Post-Migración

Después de ejecutar el SQL, puedes verificar con:

```sql
-- Ver ejemplos de preguntas actualizadas
SELECT 
    p.id,
    LEFT(p.pregunta, 50) as pregunta_corta,
    c.titulo as cuestionario,
    l.titulo as leccion
FROM preguntas p
JOIN cuestionarios c ON p.cuestionario_id = c.id
LEFT JOIN lecciones l ON p.leccion_id = l.id
WHERE p.leccion_id IS NOT NULL
LIMIT 10;
```

## 🚨 Importante
- Esta migración es **segura** y **reversible**
- No afecta datos existentes, solo agrega la nueva relación
- Las preguntas sin lección asignada mantendrán `leccion_id = NULL`

## 🔄 Próximos Pasos
Una vez aplicada la migración:
1. ✅ Verificar que el frontend muestre las preguntas correctamente
2. ✅ Actualizar flags `tiene_cuestionario` en lecciones
3. ✅ Probar la funcionalidad completa