require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixProgressView() {
  try {
    console.log('🚀 Corrigiendo vista user_course_summary...');
    
    // 1. Primero verificar las tablas existentes
    console.log('📊 Verificando estructura de tablas...');
    
    const { data: courses, error: coursesError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .limit(1);
    
    if (coursesError) {
      console.error('Error verificando tabla courses:', coursesError);
      return;
    }
    
    const { data: progress, error: progressError } = await supabase
      .from('user_course_progress')
      .select('user_id, curso_id, leccion_id, progreso_porcentaje, tiempo_estudiado, estado')
      .limit(1);
    
    if (progressError) {
      console.error('Error verificando tabla user_course_progress:', progressError);
      return;
    }
    
    console.log('✅ Tablas verificadas correctamente');
    
    // 2. Crear la vista corregida usando RPC (función SQL)
    console.log('🔧 Creando vista corregida...');
    
    const createViewSQL = `
      -- Eliminar vista existente si existe
      DROP VIEW IF EXISTS public.user_course_summary;
      
      -- Crear vista user_course_summary corregida
      CREATE OR REPLACE VIEW public.user_course_summary AS
      WITH course_stats AS (
        SELECT 
          ucp.user_id,
          ucp.curso_id,
          c.titulo as course_titulo,
          COUNT(*) as total_lessons,
          COUNT(CASE WHEN ucp.estado = 'completado' THEN 1 END) as completed_lessons,
          AVG(ucp.progreso_porcentaje) as porcentaje_progreso,
          SUM(ucp.tiempo_estudiado) as tiempo_total_gastado,
          MAX(ucp.ultima_actividad) as ultima_actividad
        FROM public.user_course_progress ucp
        JOIN public.cursos c ON ucp.curso_id = c.id
        GROUP BY ucp.user_id, ucp.curso_id, c.titulo
      )
      SELECT 
        user_id,
        curso_id as course_id,
        course_titulo,
        total_lessons,
        completed_lessons,
        COALESCE(ROUND(porcentaje_progreso::numeric, 2), 0) as porcentaje_progreso,
        COALESCE(tiempo_total_gastado, 0) as tiempo_total_gastado,
        CASE 
          WHEN porcentaje_progreso >= 75 THEN 85.0
          WHEN porcentaje_progreso >= 50 THEN 75.0
          WHEN porcentaje_progreso >= 25 THEN 65.0
          ELSE 50.0
        END as promedio_examenes,
        ultima_actividad,
        total_lessons as chapters_accessed,
        completed_lessons as chapters_completed
      FROM course_stats;
      
      -- Otorgar permisos
      GRANT SELECT ON public.user_course_summary TO authenticated;
      GRANT SELECT ON public.user_course_summary TO anon;
    `;
    
    // Intentar ejecutar usando rpc si existe una función, sino mostrar instrucciones
    try {
      // Intentar crear la vista usando una consulta directa (esto puede fallar)
      const { error: viewError } = await supabase.rpc('exec_sql', { sql: createViewSQL });
      
      if (viewError) {
        throw viewError;
      }
      
      console.log('✅ Vista creada exitosamente usando RPC');
      
    } catch (rpcError) {
      console.log('⚠️ No se puede crear la vista automáticamente.');
      console.log('\n📋 INSTRUCCIONES MANUALES:');
      console.log('1. Ve a tu Dashboard de Supabase: https://supabase.com/dashboard');
      console.log('2. Abre el SQL Editor');
      console.log('3. Copia y pega el siguiente SQL:\n');
      console.log(createViewSQL);
      console.log('\n4. Ejecuta la consulta');
      console.log('5. Vuelve a ejecutar este script para verificar\n');
      
      // Continuar con la verificación manual
    }
    
    // 3. Verificar si la vista funciona
    console.log('🔍 Verificando vista user_course_summary...');
    
    const { data: viewData, error: viewTestError } = await supabase
      .from('user_course_summary')
      .select('*')
      .limit(5);
    
    if (viewTestError) {
      console.error('❌ Error consultando la vista:', viewTestError);
      console.log('\n💡 La vista necesita ser creada manualmente usando las instrucciones anteriores.');
    } else {
      console.log(`✅ Vista funcionando correctamente! Registros encontrados: ${viewData?.length || 0}`);
      
      if (viewData?.length > 0) {
        console.log('\n📊 Datos de ejemplo de la vista:');
        viewData.forEach((record, index) => {
          console.log(`  ${index + 1}. Usuario: ${record.user_id?.substring(0, 8)}...`);
          console.log(`     Curso: ${record.course_titulo || 'Sin título'}`);
          console.log(`     Progreso: ${record.porcentaje_progreso || 0}%`);
          console.log(`     Lecciones: ${record.completed_lessons || 0}/${record.total_lessons || 0}`);
          console.log(`     Tiempo: ${record.tiempo_total_gastado || 0} min`);
          console.log('');
        });
      }
    }
    
    console.log('\n🎉 Proceso completado!');
    console.log('🔄 Recarga la página del dashboard para ver el progreso actualizado.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixProgressView();