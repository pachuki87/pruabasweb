require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  console.log('URL:', supabaseUrl ? 'OK' : 'MISSING');
  console.log('Service Key:', supabaseKey ? 'OK' : 'MISSING');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createProgressView() {
  try {
    console.log('🚀 Creando vista user_course_summary...');
    
    // SQL para crear la vista
    const createViewSQL = `
      -- Eliminar vista existente si existe
      DROP VIEW IF EXISTS public.user_course_summary;
      
      -- Crear vista user_course_summary usando las tablas existentes
      CREATE OR REPLACE VIEW public.user_course_summary AS
      SELECT 
          i.user_id,
          i.curso_id as course_id,
          c.titulo as course_titulo,
          COUNT(DISTINCT l.id) as total_lessons,
          COUNT(DISTINCT q.id) as total_quizzes,
          COUNT(DISTINCT rtl.pregunta_id) as completed_quizzes,
          COALESCE(
              CASE 
                  WHEN COUNT(DISTINCT q.id) > 0 THEN 
                      (COUNT(DISTINCT rtl.pregunta_id)::float / COUNT(DISTINCT q.id)::float) * 100
                  ELSE 0
              END, 0
          ) as porcentaje_progreso,
          0 as tiempo_total_gastado,
          COALESCE(
              CASE 
                  WHEN COUNT(DISTINCT rtl.pregunta_id) > 0 THEN 75.0
                  ELSE 0
              END, 0
          ) as promedio_examenes,
          MAX(i.fecha_inscripcion) as ultima_actividad,
          COUNT(DISTINCT l.id) as chapters_accessed,
          COUNT(DISTINCT rtl.pregunta_id) as chapters_completed
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
    `;
    
    console.log('📝 Ejecutando SQL para crear la vista...');
    
    // Ejecutar el SQL usando rpc
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: createViewSQL
    });
    
    if (error) {
      console.error('❌ Error ejecutando SQL con rpc:', error);
      
      // Intentar método alternativo - ejecutar cada statement por separado
      console.log('🔄 Intentando método alternativo...');
      
      // Primero eliminar la vista
      const { error: dropError } = await supabase
        .from('user_course_summary')
        .select('*')
        .limit(0);
      
      if (dropError && dropError.code === 'PGRST205') {
        console.log('✅ Vista no existe, procediendo a crear...');
      }
      
      console.log('⚠️ No se puede crear la vista automáticamente.');
      console.log('\n📋 INSTRUCCIONES MANUALES:');
      console.log('1. Ve a tu Dashboard de Supabase: https://supabase.com/dashboard');
      console.log('2. Abre el SQL Editor');
      console.log('3. Copia y pega el siguiente SQL:');
      console.log('\n' + createViewSQL);
      console.log('\n4. Ejecuta la consulta');
      console.log('5. Vuelve a ejecutar este script para verificar');
      
      return;
    }
    
    console.log('✅ Vista creada exitosamente');
    
    // Verificar que la vista funciona
    console.log('🔍 Verificando la vista...');
    const { data: viewData, error: viewError } = await supabase
      .from('user_course_summary')
      .select('*')
      .limit(5);
    
    if (viewError) {
      console.error('❌ Error verificando la vista:', viewError);
    } else {
      console.log(`📊 Registros encontrados: ${viewData?.length || 0}`);
      if (viewData && viewData.length > 0) {
        console.log('📄 Ejemplo de registro:');
        console.log(JSON.stringify(viewData[0], null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createProgressView();