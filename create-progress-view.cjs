const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Usar la service_role key para operaciones administrativas
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function createProgressView() {
  console.log('🚀 Creando vista user_course_summary...');
  
  try {
    // Primero verificar si ya existe la vista
    console.log('🔍 Verificando vista existente...');
    const { data: existingData, error: existingError } = await supabase
      .from('user_course_summary')
      .select('*')
      .limit(1);
    
    if (!existingError) {
      console.log('✅ La vista user_course_summary ya existe y funciona!');
      console.log('📊 Registros encontrados:', existingData?.length || 0);
      return;
    }
    
    console.log('⚠️ La vista no existe o no funciona:', existingError.message);
    console.log('📝 INSTRUCCIONES MANUALES:');
    console.log('1. Ve al Dashboard de Supabase');
    console.log('2. Abre SQL Editor');
    console.log('3. Ejecuta el siguiente SQL:');
    console.log('\n--- COPIAR Y PEGAR EN SUPABASE ---');
    
    const sqlScript = `
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
`;
    
    console.log(sqlScript);
    console.log('--- FIN DEL SQL ---\n');
    
    console.log('4. Después de ejecutar el SQL, vuelve a ejecutar este script para verificar');
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

createProgressView();