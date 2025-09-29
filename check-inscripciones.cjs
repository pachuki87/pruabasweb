const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkInscripciones() {
  try {
    // Obtener usuario actual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('❌ No hay usuario autenticado');
      return;
    }
    
    console.log('👤 Usuario actual:', user.email);
    console.log('🆔 User ID:', user.id);
    
    // Verificar inscripciones
    const { data: inscripciones, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('*')
      .eq('user_id', user.id);
    
    if (inscripcionesError) {
      console.error('❌ Error al consultar inscripciones:', inscripcionesError);
      return;
    }
    
    console.log('\n📚 Inscripciones encontradas:', inscripciones?.length || 0);
    
    if (inscripciones && inscripciones.length > 0) {
      console.log('\n📋 Detalles de inscripciones:');
      inscripciones.forEach((ins, i) => {
        console.log(`${i + 1}. Course ID: ${ins.course_id}`);
        console.log(`   Inscrito en: ${ins.created_at || 'N/A'}`);
      });
    } else {
      console.log('⚠️ El usuario no tiene inscripciones en ningún curso');
    }
    
    // Mostrar cursos disponibles
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .limit(5);
    
    if (cursosError) {
      console.error('❌ Error al consultar cursos:', cursosError);
      return;
    }
    
    console.log('\n📖 Cursos disponibles (primeros 5):');
    cursos?.forEach((curso, i) => {
      console.log(`${i + 1}. ${curso.titulo}`);
      console.log(`   ID: ${curso.id}`);
    });
    
    // Verificar vista user_course_summary
    console.log('\n🔍 Verificando vista user_course_summary...');
    const { data: summary, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('*')
      .eq('user_id', user.id);
    
    if (summaryError) {
      console.error('❌ Error en user_course_summary:', summaryError);
    } else {
      console.log('✅ Registros en user_course_summary:', summary?.length || 0);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkInscripciones();