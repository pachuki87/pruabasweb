const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Usar service role para operaciones admin
);

async function createTestInscription() {
  try {
    console.log('🔍 Buscando usuarios y cursos disponibles...');
    
    // Obtener un usuario de prueba (el primero disponible)
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, email, nombre')
      .eq('rol', 'student')
      .limit(1);
    
    if (usuariosError) {
      console.error('❌ Error al obtener usuarios:', usuariosError);
      return;
    }
    
    if (!usuarios || usuarios.length === 0) {
      console.log('❌ No se encontraron usuarios estudiantes');
      return;
    }
    
    const usuario = usuarios[0];
    console.log('👤 Usuario encontrado:', usuario.email, '(ID:', usuario.id + ')');
    
    // Obtener cursos disponibles
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .limit(3);
    
    if (cursosError) {
      console.error('❌ Error al obtener cursos:', cursosError);
      return;
    }
    
    if (!cursos || cursos.length === 0) {
      console.log('❌ No se encontraron cursos disponibles');
      return;
    }
    
    console.log('📚 Cursos disponibles:');
    cursos.forEach((curso, i) => {
      console.log(`${i + 1}. ${curso.titulo} (ID: ${curso.id})`);
    });
    
    // Verificar inscripciones existentes
    const { data: inscripcionesExistentes, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('*')
      .eq('user_id', usuario.id);
    
    if (inscripcionesError) {
      console.error('❌ Error al verificar inscripciones:', inscripcionesError);
      return;
    }
    
    console.log('\n📋 Inscripciones existentes:', inscripcionesExistentes?.length || 0);
    
    if (inscripcionesExistentes && inscripcionesExistentes.length > 0) {
      console.log('✅ El usuario ya tiene inscripciones:');
      inscripcionesExistentes.forEach((ins, i) => {
        console.log(`${i + 1}. Course ID: ${ins.course_id}`);
      });
      return;
    }
    
    // Crear inscripción de prueba
    console.log('\n🔧 Creando inscripción de prueba...');
    const { data: nuevaInscripcion, error: inscripcionError } = await supabase
      .from('inscripciones')
      .insert({
        user_id: usuario.id,
        course_id: cursos[0].id,
        created_at: new Date().toISOString()
      })
      .select();
    
    if (inscripcionError) {
      console.error('❌ Error al crear inscripción:', inscripcionError);
      return;
    }
    
    console.log('✅ Inscripción creada exitosamente:');
    console.log('   Usuario:', usuario.email);
    console.log('   Curso:', cursos[0].titulo);
    console.log('   ID Inscripción:', nuevaInscripcion[0].id);
    
    // Verificar que la vista user_course_summary funcione
    console.log('\n🔍 Verificando vista user_course_summary...');
    const { data: summary, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('*')
      .eq('user_id', usuario.id);
    
    if (summaryError) {
      console.error('❌ Error en user_course_summary:', summaryError);
    } else {
      console.log('✅ Registros en user_course_summary:', summary?.length || 0);
      if (summary && summary.length > 0) {
        summary.forEach((record, i) => {
          console.log(`${i + 1}. ${record.course_title} - Progreso: ${record.overall_progress || 0}%`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createTestInscription();