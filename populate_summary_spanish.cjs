require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function populateUserCourseSummary() {
  try {
    console.log('🚀 Poblando user_course_summary con datos reales en español\n');
    
    // 1. Obtener todas las inscripciones
    console.log('📋 Obteniendo inscripciones...');
    const { data: inscripciones, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('user_id, curso_id');
    
    if (inscripcionesError) {
      console.log('❌ Error obteniendo inscripciones:', inscripcionesError.message);
      return;
    }
    
    console.log(`✅ Encontradas ${inscripciones.length} inscripciones`);
    
    // 2. Obtener información de cursos
    console.log('\n📚 Obteniendo información de cursos...');
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id, titulo');
    
    if (cursosError) {
      console.log('❌ Error obteniendo cursos:', cursosError.message);
      return;
    }
    
    console.log(`✅ Encontrados ${cursos.length} cursos`);
    
    // 3. Obtener lecciones por curso
    console.log('\n📖 Obteniendo lecciones por curso...');
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('curso_id')
      .order('curso_id');
    
    if (leccionesError) {
      console.log('❌ Error obteniendo lecciones:', leccionesError.message);
      return;
    }
    
    // Contar lecciones por curso
    const leccionesPorCurso = {};
    lecciones.forEach(leccion => {
      leccionesPorCurso[leccion.curso_id] = (leccionesPorCurso[leccion.curso_id] || 0) + 1;
    });
    
    console.log('📊 Lecciones por curso:', leccionesPorCurso);
    
    // 4. Crear registros para user_course_summary
    console.log('\n🔄 Creando registros en user_course_summary...');
    
    let exitosos = 0;
    let errores = 0;
    
    for (const inscripcion of inscripciones) {
      const totalLecciones = leccionesPorCurso[inscripcion.curso_id] || 0;
      const curso = cursos.find(c => c.id === inscripcion.curso_id);
      
      // Crear registro con nombres en español
      const registro = {
        user_id: inscripcion.user_id,
        curso_id: inscripcion.curso_id,
        total_lecciones: totalLecciones,
        lecciones_completadas: 0,
        progreso_porcentaje: 0.0,
        tiempo_total_estudiado: 0,
        fecha_inicio: new Date().toISOString(),
        ultima_actividad: new Date().toISOString()
      };
      
      console.log(`\n📝 Insertando para usuario ${inscripcion.user_id} en curso "${curso?.titulo || inscripcion.curso_id}"`);
      console.log(`   Total lecciones: ${totalLecciones}`);
      
      const { error: insertError } = await supabase
        .from('user_course_summary')
        .upsert(registro, { 
          onConflict: 'user_id,curso_id',
          ignoreDuplicates: false 
        });
      
      if (insertError) {
        console.log(`❌ Error insertando:`, insertError.message);
        errores++;
      } else {
        console.log(`✅ Registro creado exitosamente`);
        exitosos++;
      }
    }
    
    console.log(`\n📊 RESUMEN FINAL:`);
    console.log(`✅ Registros exitosos: ${exitosos}`);
    console.log(`❌ Errores: ${errores}`);
    
    // 5. Verificar resultado final
    console.log('\n🔍 Verificando tabla user_course_summary...');
    const { data: finalData, error: finalError } = await supabase
      .from('user_course_summary')
      .select('*');
    
    if (finalError) {
      console.log('❌ Error verificando:', finalError.message);
    } else {
      console.log(`✅ Total registros en user_course_summary: ${finalData.length}`);
      if (finalData.length > 0) {
        console.log('\n📋 Primeros registros:');
        finalData.slice(0, 3).forEach((registro, index) => {
          console.log(`${index + 1}. Usuario: ${registro.user_id}, Curso: ${registro.curso_id}, Progreso: ${registro.progreso_porcentaje}%`);
        });
      }
    }
    
    if (exitosos > 0) {
      console.log('\n🎉 ¡ÉXITO! La tabla user_course_summary ahora tiene datos.');
      console.log('   Los errores PGRST205 deberían resolverse.');
    } else {
      console.log('\n⚠️  No se pudieron insertar registros. Revisar errores.');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

populateUserCourseSummary();