const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function debugCoursesAccess() {
  console.log('🔍 Diagnosticando acceso a cursos...');
  
  try {
    // 1. Verificar tablas existentes
    console.log('\n📋 Verificando estructura de tablas:');
    
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol')
      .limit(5);
    
    if (usuariosError) {
      console.error('❌ Error en tabla usuarios:', usuariosError);
    } else {
      console.log('✅ Tabla usuarios:', usuarios?.length || 0, 'registros');
      console.log('Usuarios encontrados:', usuarios);
    }
    
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id, title, teacher_id')
      .limit(5);
    
    if (cursosError) {
      console.error('❌ Error en tabla cursos:', cursosError);
    } else {
      console.log('✅ Tabla cursos:', cursos?.length || 0, 'registros');
      console.log('Cursos encontrados:', cursos);
    }
    
    const { data: inscripciones, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('id, usuario_id, curso_id')
      .limit(5);
    
    if (inscripcionesError) {
      console.error('❌ Error en tabla inscripciones:', inscripcionesError);
    } else {
      console.log('✅ Tabla inscripciones:', inscripciones?.length || 0, 'registros');
      console.log('Inscripciones encontradas:', inscripciones);
    }
    
    // 2. Verificar usuario autenticado (simulando)
    console.log('\n👤 Verificando usuarios disponibles:');
    if (usuarios && usuarios.length > 0) {
      const testUser = usuarios[0];
      console.log('Usuario de prueba:', testUser);
      
      // Simular consulta de estudiante
      if (testUser.rol === 'student') {
        console.log('\n🎓 Simulando consulta de estudiante:');
        const { data: studentEnrollments, error: enrollError } = await supabase
          .from('inscripciones')
          .select('curso_id')
          .eq('usuario_id', testUser.id);
        
        if (enrollError) {
          console.error('❌ Error obteniendo inscripciones:', enrollError);
        } else {
          console.log('Inscripciones del estudiante:', studentEnrollments);
          
          if (studentEnrollments && studentEnrollments.length > 0) {
            const courseIds = studentEnrollments.map(e => e.curso_id);
            const { data: studentCourses, error: coursesError } = await supabase
              .from('cursos')
              .select('id, title, teacher_id')
              .in('id', courseIds);
            
            if (coursesError) {
              console.error('❌ Error obteniendo cursos del estudiante:', coursesError);
            } else {
              console.log('Cursos del estudiante:', studentCourses);
            }
          } else {
            console.log('⚠️ El estudiante no tiene inscripciones');
          }
        }
      }
      
      // Simular consulta de profesor
      if (testUser.rol === 'teacher') {
        console.log('\n👨‍🏫 Simulando consulta de profesor:');
        const { data: teacherCourses, error: teacherError } = await supabase
          .from('cursos')
          .select('id, title, teacher_id')
          .eq('teacher_id', testUser.id);
        
        if (teacherError) {
          console.error('❌ Error obteniendo cursos del profesor:', teacherError);
        } else {
          console.log('Cursos del profesor:', teacherCourses);
        }
      }
    }
    
    // 3. Verificar datos de prueba
    console.log('\n🔧 Creando datos de prueba si es necesario...');
    
    // Verificar si existe al menos un curso
    if (!cursos || cursos.length === 0) {
      console.log('⚠️ No hay cursos en la base de datos');
      console.log('💡 Sugerencia: Crear cursos de prueba');
    }
    
    // Verificar si existe al menos una inscripción
    if (!inscripciones || inscripciones.length === 0) {
      console.log('⚠️ No hay inscripciones en la base de datos');
      console.log('💡 Sugerencia: Crear inscripciones de prueba');
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

debugCoursesAccess();