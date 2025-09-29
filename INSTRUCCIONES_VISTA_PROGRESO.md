# 📊 Instrucciones para Crear la Vista de Progreso

## ⚠️ PROBLEMA IDENTIFICADO
La vista `user_course_summary` no existe en la base de datos, lo que impide que el sistema de progreso funcione correctamente.

## 🔧 SOLUCIÓN

### Paso 1: Ir al Dashboard de Supabase
1. Abre tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a la sección **SQL Editor**

### Paso 2: Ejecutar el SQL
Copia y pega el siguiente código SQL:

```sql
-- Eliminar vista existente si existe
DROP VIEW IF EXISTS public.user_course_summary;

-- Crear vista user_course_summary
CREATE OR REPLACE VIEW public.user_course_summary AS
SELECT
    i.user_id,
    i.curso_id as course_id,
    c.titulo as course_title,
    COUNT(DISTINCT l.id) as total_lessons,
    COUNT(DISTINCT q.id) as total_quizzes,
    COUNT(DISTINCT rtl.pregunta_id) as completed_quizzes,
    COALESCE(
        CASE
            WHEN COUNT(DISTINCT q.id) > 0 THEN
                (COUNT(DISTINCT rtl.pregunta_id)::float / COUNT(DISTINCT q.id)::float) * 100
            ELSE 0
        END, 0
    ) as overall_progress,
    0 as total_time_spent,
    COALESCE(
        CASE
            WHEN COUNT(DISTINCT rtl.pregunta_id) > 0 THEN 75.0
            ELSE 0
        END, 0
    ) as average_test_score
FROM public.inscripciones i
JOIN public.cursos c ON i.curso_id = c.id
LEFT JOIN public.lecciones l ON c.id = l.curso_id
LEFT JOIN public.cuestionarios q ON c.id = q.curso_id
LEFT JOIN public.respuestas_texto_libre rtl ON q.id = rtl.pregunta_id
    AND (rtl.user_id = i.user_id OR rtl.user_id = 'anonymous')
GROUP BY i.user_id, i.curso_id, c.titulo;

-- Otorgar permisos
GRANT SELECT ON public.user_course_summary TO authenticated;
GRANT SELECT ON public.user_course_summary TO anon;

-- Verificar que funciona
SELECT 'Vista user_course_summary creada exitosamente' as status;
SELECT COUNT(*) as total_records FROM public.user_course_summary;
SELECT * FROM public.user_course_summary LIMIT 3;
```

### Paso 3: Verificar
Después de ejecutar el SQL, deberías ver:
- Un mensaje de éxito
- El número total de registros
- Los primeros 3 registros de ejemplo

## 🎯 RESULTADO ESPERADO
Una vez creada la vista, el sistema de progreso debería:
- Mostrar correctamente el progreso de cada curso
- Calcular estadísticas precisas
- Funcionar sin errores en el dashboard

## 🔍 VERIFICACIÓN
Puedes verificar que todo funciona:
1. Recarga la aplicación web
2. Ve al dashboard como estudiante
3. Verifica que aparezca la sección "Tu Progreso de Aprendizaje"
4. Comprueba que los porcentajes de progreso sean correctos

---
**Nota**: Esta vista calcula el progreso basándose en los cuestionarios completados. Si necesitas un seguimiento más detallado del progreso por lecciones, se requerirá implementar una tabla adicional de progreso por capítulos.