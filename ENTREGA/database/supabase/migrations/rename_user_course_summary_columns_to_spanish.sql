-- Cambiar nombres de columnas de inglés a español en user_course_summary
ALTER TABLE public.user_course_summary 
  RENAME COLUMN total_lessons TO total_lecciones;

ALTER TABLE public.user_course_summary 
  RENAME COLUMN completed_lessons TO lecciones_completadas;

ALTER TABLE public.user_course_summary 
  RENAME COLUMN progress_percentage TO porcentaje_progreso;

ALTER TABLE public.user_course_summary 
  RENAME COLUMN total_time_spent TO tiempo_total_gastado;

ALTER TABLE public.user_course_summary 
  RENAME COLUMN started_at TO iniciado_en;

ALTER TABLE public.user_course_summary 
  RENAME COLUMN last_accessed_at TO ultimo_acceso_en;

ALTER TABLE public.user_course_summary 
  RENAME COLUMN created_at TO creado_en;

ALTER TABLE public.user_course_summary 
  RENAME COLUMN updated_at TO actualizado_en;