require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabaseStatus() {
  try {
    console.log('🔍 Verificando estado actual de la base de datos...');
    
    // 1. Verificar estructura de user_course_progress
    console.log('\n📋 1. Verificando columnas de user_course_progress...');
    const { data: columns, error: columnsError } = await supabase
      .rpc('exec_sql', { 
        sql: `SELECT column_name, data_type 
              FROM information_schema.columns 
              WHERE table_name = 'user_course_progress' 
              AND table_schema = 'public'
              ORDER BY ordinal_position;`
      });
    
    if (columnsError) {
      console.log('⚠️ No se puede verificar columnas (función exec_sql no disponible)');
      
      // Intentar verificar insertando un registro de prueba
      console.log('\n🧪 Probando inserción para verificar columnas...');
      const testUserId = '98c473d9-011e-4a6b-a646-9c41b007d3ae';
      const testCourseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';
      const testChapterId = '12345678-1234-1234-1234-123456789012';
      
      const { data: testInsert, error: testError } = await supabase
        .from('user_course_progress')
        .insert({
          user_id: testUserId,
          course_id: testCourseId,
          chapter_id: testChapterId,
          progress_percentage: 50,
          is_completed: true,
          time_spent_minutes: 30
        })
        .select();
      
      if (testError) {
        console.error('❌ Error en inserción de prueba:', testError.message);
        if (testError.message.includes('is_completed')) {
          console.log('🔥 CONFIRMADO: Falta la columna is_completed');
        }
        if (testError.message.includes('progress_percentage')) {
          console.log('🔥 CONFIRMADO: Falta la columna progress_percentage');
        }
      } else {
        console.log('✅ Inserción exitosa - las columnas existen');
        console.log('📋 Datos insertados:', testInsert);
      }
    } else {
      console.log('✅ Columnas encontradas:', columns);
    }
    
    // 2. Verificar si existe la vista user_course_summary
    console.log('\n📋 2. Verificando vista user_course_summary...');
    const { data: viewData, error: viewError } = await supabase
      .from('user_course_summary')
      .select('*')
      .limit(1);
    
    if (viewError) {
      console.error('❌ Vista user_course_summary NO existe:', viewError.message);
    } else {
      console.log('✅ Vista user_course_summary existe');
      console.log('📊 Registros en la vista:', viewData?.length || 0);
    }
    
    // 3. Verificar inscripciones del usuario de prueba
    console.log('\n📋 3. Verificando inscripciones...');
    const { data: inscripciones, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('*')
      .eq('usuario_id', '98c473d9-011e-4a6b-a646-9c41b007d3ae');
    
    if (inscripcionesError) {
      console.error('❌ Error verificando inscripciones:', inscripcionesError);
    } else {
      console.log('✅ Inscripciones encontradas:', inscripciones?.length || 0);
      if (inscripciones && inscripciones.length > 0) {
        console.log('📋 Cursos inscritos:', inscripciones.map(i => i.curso_id));
      }
    }
    
    // 4. Verificar cursos disponibles
    console.log('\n📋 4. Verificando cursos disponibles...');
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .limit(5);
    
    if (cursosError) {
      console.error('❌ Error verificando cursos:', cursosError);
    } else {
      console.log('✅ Cursos encontrados:', cursos?.length || 0);
      if (cursos && cursos.length > 0) {
        console.log('📋 Cursos disponibles:');
        cursos.forEach(c => console.log(`   - ${c.titulo} (${c.id})`));
      }
    }
    
    // 5. Resumen del estado
    console.log('\n📋 RESUMEN DEL ESTADO:');
    console.log('=' .repeat(50));
    
    if (viewError) {
      console.log('🔥 PROBLEMA PRINCIPAL: Vista user_course_summary NO existe');
      console.log('📝 SOLUCIÓN: Ejecutar create-missing-views.sql en Supabase Dashboard');
    } else {
      console.log('✅ Vista user_course_summary existe');
      console.log('🔍 Verificar por qué no aparecen cursos en el frontend');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verifyDatabaseStatus();