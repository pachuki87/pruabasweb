require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUserCourseSummaryView() {
  console.log('🚀 Creando vista user_course_summary...');
  
  try {
    // Primero verificar si ya existe
    console.log('🔍 Verificando si la vista ya existe...');
    const { data: existingView, error: checkError } = await supabase
      .from('user_course_summary')
      .select('*')
      .limit(1);
    
    if (!checkError) {
      console.log('✅ La vista user_course_summary ya existe y funciona');
      console.log('📊 Verificando datos...');
      
      const { data: viewData, error: dataError } = await supabase
        .from('user_course_summary')
        .select('*')
        .limit(5);
      
      if (dataError) {
        console.error('❌ Error al obtener datos:', dataError.message);
      } else {
        console.log(`📋 Registros encontrados: ${viewData?.length || 0}`);
        if (viewData && viewData.length > 0) {
          console.log('📄 Ejemplo de registro:', JSON.stringify(viewData[0], null, 2));
        }
      }
      return;
    }
    
    console.log('⚠️ La vista no existe, necesita ser creada manualmente en Supabase Dashboard');
    console.log('\n📝 SQL para crear la vista:');
    console.log('\n-- Copiar y pegar en Supabase SQL Editor:');
    console.log(`
DROP VIEW IF EXISTS public.user_course_summary;

CREATE OR REPLACE VIEW public.user_course_summary AS
SELECT 
    u.id as user_id,
    u.nombre as user_name,
    u.email as user_email,
    c.id as course_id,
    c.titulo as course_title,
    i.fecha_inscripcion as enrollment_date,
    -- Progreso basado en lecciones completadas
    COALESCE(
        (SELECT COUNT(*) 
         FROM public.user_progress up 
         WHERE up.user_id = u.id 
           AND up.curso_id = c.id 
           AND up.estado = 'completado'
        ), 0
    ) as lessons_completed,
    -- Total de lecciones del curso
    COALESCE(
        (SELECT COUNT(*) 
         FROM public.lecciones l 
         WHERE l.curso_id = c.id
        ), 0
    ) as total_lessons,
    -- Porcentaje de progreso
    CASE 
        WHEN (SELECT COUNT(*) FROM public.lecciones l WHERE l.curso_id = c.id) > 0 THEN
            ROUND(
                (SELECT COUNT(*) FROM public.user_progress up 
                 WHERE up.user_id = u.id AND up.curso_id = c.id AND up.estado = 'completado') * 100.0 /
                (SELECT COUNT(*) FROM public.lecciones l WHERE l.curso_id = c.id), 2
            )
        ELSE 0
    END as overall_progress,
    -- Última actividad
    COALESCE(
        (SELECT MAX(up.ultima_actividad) 
         FROM public.user_progress up 
         WHERE up.user_id = u.id AND up.curso_id = c.id
        ), i.fecha_inscripcion
    ) as last_activity,
    -- Tiempo total estudiado
    COALESCE(
        (SELECT SUM(up.tiempo_estudiado) 
         FROM public.user_progress up 
         WHERE up.user_id = u.id AND up.curso_id = c.id
        ), 0
    ) as total_time_spent,
    -- Resultados de tests
    COALESCE(
        (SELECT AVG(utr.score) 
         FROM public.user_test_results utr 
         WHERE utr.user_id = u.id AND utr.course_id = c.id
        ), 0
    ) as average_test_score,
    COALESCE(
        (SELECT COUNT(*) 
         FROM public.user_test_results utr 
         WHERE utr.user_id = u.id AND utr.course_id = c.id
        ), 0
    ) as total_tests_taken
FROM public.usuarios u
INNER JOIN public.inscripciones i ON u.id = i.user_id
INNER JOIN public.cursos c ON i.curso_id = c.id
WHERE u.rol = 'student';

-- Otorgar permisos a la vista
GRANT SELECT ON public.user_course_summary TO authenticated;
GRANT SELECT ON public.user_course_summary TO anon;`);
    
    console.log('\n🔗 Pasos para crear la vista:');
    console.log('1. Ir a Supabase Dashboard');
    console.log('2. Abrir SQL Editor');
    console.log('3. Copiar y pegar el SQL de arriba');
    console.log('4. Ejecutar la consulta');
    console.log('5. Volver a ejecutar este script para verificar');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createUserCourseSummaryView()
  .then(() => {
    console.log('\n✅ Proceso completado');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });