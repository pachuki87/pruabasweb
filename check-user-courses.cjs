const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUserCourses() {
  const testEmail = 'teststudent@gmail.com';
  const userId = '108d9416-f784-47d7-ba25-0ed2eb282519'; // ID obtenido del script anterior
  
  console.log('📚 Verificando acceso a cursos del usuario de prueba...');
  console.log('Usuario ID:', userId);
  
  try {
    // Buscar inscripciones del usuario
    const { data: inscripciones, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('*')
      .eq('usuario_id', userId);
    
    if (inscripcionesError) {
      console.error('❌ Error al buscar inscripciones:', inscripcionesError.message);
      return;
    }
    
    console.log('\n📋 Inscripciones encontradas:', inscripciones?.length || 0);
    
    if (inscripciones && inscripciones.length > 0) {
      for (const inscripcion of inscripciones) {
        console.log('\n📖 Inscripción:');
        console.log('  - ID:', inscripcion.id);
        console.log('  - Curso ID:', inscripcion.curso_id);
        console.log('  - Estado:', inscripcion.estado);
        console.log('  - Progreso:', inscripcion.progreso || 0, '%');
        console.log('  - Fecha inscripción:', inscripcion.fecha_inscripcion);
        
        // Buscar información del curso
        const { data: curso, error: cursoError } = await supabase
          .from('cursos')
          .select('*')
          .eq('id', inscripcion.curso_id)
          .single();
        
        if (cursoError) {
          console.log('  - ❌ Error al obtener curso:', cursoError.message);
        } else {
          console.log('  - Curso:', curso?.nombre || 'Sin nombre');
          console.log('  - Descripción:', curso?.descripcion || 'Sin descripción');
        }
      }
    } else {
      console.log('❌ No se encontraron inscripciones para este usuario');
      
      // Buscar cursos disponibles
      console.log('\n🔍 Buscando cursos disponibles...');
      const { data: cursosDisponibles, error: cursosError } = await supabase
        .from('cursos')
        .select('*');
      
      if (cursosError) {
        console.error('❌ Error al buscar cursos:', cursosError.message);
      } else {
        console.log('📚 Cursos disponibles:');
        cursosDisponibles?.forEach(curso => {
          console.log(`  - ${curso.nombre} (ID: ${curso.id})`);
        });
        
        // Inscribir al usuario en el Master en Adicciones si existe
        const masterAdicciones = cursosDisponibles?.find(curso => 
          curso.nombre?.toLowerCase().includes('master') && 
          curso.nombre?.toLowerCase().includes('adicciones')
        );
        
        if (masterAdicciones) {
          console.log('\n🎯 Inscribiendo usuario en Master en Adicciones...');
          
          const { data: nuevaInscripcion, error: inscripcionError } = await supabase
            .from('inscripciones')
            .insert({
              usuario_id: userId,
              curso_id: masterAdicciones.id,
              estado: 'activo',
              progreso: 0,
              fecha_inscripcion: new Date().toISOString()
            })
            .select()
            .single();
          
          if (inscripcionError) {
            console.error('❌ Error al crear inscripción:', inscripcionError.message);
          } else {
            console.log('✅ Usuario inscrito exitosamente en:', masterAdicciones.nombre);
            console.log('   ID inscripción:', nuevaInscripcion.id);
          }
        } else {
          console.log('❌ No se encontró el curso "Master en Adicciones"');
        }
      }
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

checkUserCourses();