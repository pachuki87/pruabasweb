-- Crear usuario para Bayane Zhirir
INSERT INTO auth.users (
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_sso_user,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'dayanzhiri1@gmail.com',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Bayane Zhirir"}',
  false,
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Obtener el ID del usuario recién creado
WITH user_id AS (
  SELECT id FROM auth.users WHERE email = 'dayanzhiri1@gmail.com' LIMIT 1
)

-- Insertar en la tabla de perfiles
INSERT INTO public.perfiles (
  id,
  nombre_completo,
  email,
  creado_en,
  actualizado_en
)
SELECT
  id,
  'Bayane Zhirir',
  'dayanzhiri1@gmail.com',
  now(),
  now()
FROM user_id
ON CONFLICT (id) DO UPDATE SET
  nombre_completo = 'Bayane Zhirir',
  email = 'dayanzhiri1@gmail.com',
  actualizado_en = now();

-- Insertar en la tabla de usuarios si existe
INSERT INTO public.usuarios (
  id,
  nombre,
  email,
  creado_en,
  actualizado_en
)
SELECT
  id,
  'Bayane Zhirir',
  'dayanzhiri1@gmail.com',
  now(),
  now()
FROM user_id
ON CONFLICT (id) DO UPDATE SET
  nombre = 'Bayane Zhirir',
  email = 'dayanzhiri1@gmail.com',
  actualizado_en = now();

-- Inscribir al usuario en el curso de Master en Adicciones
INSERT INTO public.inscripciones (
  usuario_id,
  curso_id,
  fecha_inscripcion,
  estado,
  progreso
)
SELECT
  u.id,
  c.id,
  now(),
  'activo',
  0
FROM user_id u
JOIN public.cursos c ON c.nombre ILIKE '%master en adicciones%' OR c.nombre ILIKE '%master%adicciones%'
LIMIT 1
ON CONFLICT (usuario_id, curso_id) DO UPDATE SET
  fecha_inscripcion = now(),
  estado = 'activo',
  progreso = 0;

-- Crear registro en user_course_summary si existe la tabla
INSERT INTO public.user_course_summary (
  user_id,
  course_id,
  enrolled_at,
  status,
  total_progress,
  completed_lessons,
  total_lessons
)
SELECT
  u.id,
  c.id,
  now(),
  'enrolled',
  0,
  0,
  (SELECT COUNT(*) FROM public.lecciones WHERE curso_id = c.id)
FROM user_id u
JOIN public.cursos c ON c.nombre ILIKE '%master en adicciones%' OR c.nombre ILIKE '%master%adicciones%'
LIMIT 1
ON CONFLICT (user_id, course_id) DO UPDATE SET
  enrolled_at = now(),
  status = 'enrolled';

-- Confirmar la creación del usuario y la inscripción
SELECT
  'Usuario Bayane Zhirir creado y inscrito exitosamente en el curso de Master en Adicciones' as resultado,
  (SELECT id FROM auth.users WHERE email = 'dayanzhiri1@gmail.com') as user_id,
  (SELECT id FROM public.cursos WHERE nombre ILIKE '%master en adicciones%' OR c.nombre ILIKE '%master%adicciones%' LIMIT 1) as curso_id;