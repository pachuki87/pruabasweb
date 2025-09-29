-- Insertar al alumno José Luis en el sistema
-- Ejecutar este SQL directamente en el editor SQL de Supabase

-- 1. Insertar el usuario en la tabla usuarios
INSERT INTO usuarios (email, nombre, name, rol, creado_en)
VALUES ('joseluis@drconstructores.com', 'José Luis', 'José Luis', 'student', NOW())
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  name = EXCLUDED.name,
  rol = EXCLUDED.rol,
  creado_en = EXCLUDED.creado_en;

-- 2. Inscribir al usuario en el curso de Máster en Adicciones
INSERT INTO user_courses (user_id, course_id, status, enrolled_at, progress_percentage)
SELECT
    u.id,
    'b5ef8c64-fe26-4f20-8221-80a1bf475b05',
    'active',
    NOW(),
    0
FROM usuarios u
WHERE u.email = 'joseluis@drconstructores.com'
ON CONFLICT (user_id, course_id) DO UPDATE SET
  status = EXCLUDED.status,
  enrolled_at = EXCLUDED.enrolled_at,
  progress_percentage = EXCLUDED.progress_percentage;

-- 3. Verificar los datos insertados
SELECT
    'USUARIO CREADO' as operacion,
    u.id,
    u.email,
    u.nombre,
    u.rol,
    u.creado_en
FROM usuarios u
WHERE u.email = 'joseluis@drconstructores.com'

UNION ALL

SELECT
    'INSCRIPCIÓN CURSO' as operacion,
    uc.id,
    u.email,
    c.titulo as nombre,
    uc.status as rol,
    uc.enrolled_at as creado_en
FROM user_courses uc
JOIN usuarios u ON uc.user_id = u.id
JOIN courses c ON uc.course_id = c.id
WHERE u.email = 'joseluis@drconstructores.com'
AND c.id = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';