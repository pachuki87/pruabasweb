require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const MASTER_COURSE_ID = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

(async () => {
  try {
    console.log('=== VERIFICACIÓN FINAL DEL MÁSTER EN ADICCIONES ===');
    console.log('');

    // Verificar el curso
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id, titulo, descripcion')
      .eq('id', MASTER_COURSE_ID)
      .single();

    if (cursoError) {
      console.log('❌ Error al buscar curso:', cursoError);
      return;
    }

    console.log('✅ CURSO ENCONTRADO:');
    console.log(`   ID: ${curso.id}`);
    console.log(`   Título: ${curso.titulo}`);
    console.log('');

    // Verificar las lecciones
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, descripcion, orden, archivo_url, duracion_estimada')
      .eq('curso_id', MASTER_COURSE_ID)
      .order('orden');

    if (leccionesError) {
      console.log('❌ Error al buscar lecciones:', leccionesError);
      return;
    }

    console.log('✅ LECCIONES DEL MÁSTER EN ADICCIONES:');
    console.log('=====================================');
    
    if (lecciones.length === 0) {
      console.log('❌ NO SE ENCONTRARON LECCIONES');
      return;
    }

    // Verificar que tenemos exactamente 7 lecciones
    if (lecciones.length !== 7) {
      console.log(`⚠️ ADVERTENCIA: Se esperaban 7 lecciones, pero se encontraron ${lecciones.length}`);
    }

    // Mostrar cada lección
    lecciones.forEach((leccion, index) => {
      console.log(`${leccion.orden}. ${leccion.titulo}`);
      console.log(`   📝 Descripción: ${leccion.descripcion}`);
      console.log(`   📄 Archivo: ${leccion.archivo_url || 'NO ASIGNADO'}`);
      console.log(`   ⏱️ Duración: ${leccion.duracion_estimada || 'No definida'} minutos`);
      console.log('');
    });

    // Verificar orden correcto
    const ordenEsperado = [
      'FUNDAMENTOS P TERAPEUTICO',
      'TERAPIA COGNITIVA DROGODEPENDENENCIAS', 
      'FAMILIA Y TRABAJO EQUIPO',
      'RECOVERY COACHING',
      'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
      'NUEVOS MODELOS TERAPEUTICOS',
      'INTELIGENCIA EMOCIONAL'
    ];

    console.log('🔍 VERIFICACIÓN DE ORDEN:');
    let ordenCorrecto = true;
    
    for (let i = 0; i < Math.min(lecciones.length, ordenEsperado.length); i++) {
      const leccionActual = lecciones[i];
      const tituloEsperado = ordenEsperado[i];
      
      if (leccionActual.titulo === tituloEsperado && leccionActual.orden === i + 1) {
        console.log(`✅ Lección ${i + 1}: ${leccionActual.titulo} - CORRECTO`);
      } else {
        console.log(`❌ Lección ${i + 1}: Esperado "${tituloEsperado}" (orden ${i + 1}), encontrado "${leccionActual.titulo}" (orden ${leccionActual.orden})`);
        ordenCorrecto = false;
      }
    }

    console.log('');
    console.log('=== RESUMEN FINAL ===');
    console.log(`📊 Total de lecciones: ${lecciones.length}/7`);
    console.log(`🎯 Orden correcto: ${ordenCorrecto ? '✅ SÍ' : '❌ NO'}`);
    
    const leccionesSinArchivo = lecciones.filter(l => !l.archivo_url);
    console.log(`📄 Lecciones con archivo: ${lecciones.length - leccionesSinArchivo.length}/${lecciones.length}`);
    
    if (leccionesSinArchivo.length > 0) {
      console.log('⚠️ Lecciones sin archivo:');
      leccionesSinArchivo.forEach(l => console.log(`   - ${l.titulo}`));
    }

    console.log('');
    if (lecciones.length === 7 && ordenCorrecto && leccionesSinArchivo.length === 0) {
      console.log('🎉 ¡PERFECTO! El máster en adicciones está configurado correctamente.');
      console.log('🌐 La web debería mostrar las 7 lecciones en el orden correcto.');
    } else {
      console.log('⚠️ Hay algunos problemas que necesitan atención.');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
})();