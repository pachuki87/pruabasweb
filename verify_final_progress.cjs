const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarProgresoFinal() {
  try {
    console.log('=== VERIFICACIÓN FINAL DEL PROGRESO DE PABLO ===\n');

    // 1. Buscar usuario Pablo
    console.log('1. Buscando usuario Pablo...');
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', 'pablocardonafeliu@gmail.com')
      .single();

    if (userError || !usuario) {
      console.log('❌ Error al buscar usuario:', userError);
      return;
    }

    console.log(`✅ Usuario encontrado: ${usuario.nombre} (${usuario.email})`);
    console.log(`   ID: ${usuario.id}\n`);

    // 2. Verificar progreso en user_course_summary
    console.log('2. Consultando progreso actualizado en user_course_summary...');
    const { data: progreso, error: progressError } = await supabase
      .from('user_course_summary')
      .select(`
        *,
        cursos:curso_id (
          titulo,
          descripcion
        )
      `)
      .eq('user_id', usuario.id);

    if (progressError) {
      console.log('❌ Error al consultar progreso:', progressError);
      return;
    }

    if (!progreso || progreso.length === 0) {
      console.log('❌ NO HAY REGISTROS DE PROGRESO PARA PABLO');
      console.log('   El frontend seguirá mostrando 0%\n');
    } else {
      console.log(`✅ Registros encontrados: ${progreso.length}\n`);
      
      progreso.forEach((curso, index) => {
        console.log(`📚 CURSO ${index + 1}: ${curso.cursos?.titulo || 'Sin título'}`);
        console.log(`   📊 Progreso: ${curso.porcentaje_progreso || 0}%`);
        console.log(`   📖 Lecciones: ${curso.lecciones_completadas || 0}/${curso.total_lecciones || 0}`);
        console.log(`   ⏱️  Tiempo: ${curso.tiempo_total_gastado || 0} minutos`);
        console.log(`   📅 Último acceso: ${curso.ultimo_acceso_en || 'N/A'}\n`);
      });
    }

    // 3. Verificar datos detallados de progreso
    console.log('3. Verificando datos detallados en user_course_progress...');
    const { data: detalles, error: detailsError } = await supabase
      .from('user_course_progress')
      .select(`
        *,
        lecciones:leccion_id (
          titulo,
          orden
        )
      `)
      .eq('user_id', usuario.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (detailsError) {
      console.log('❌ Error al consultar detalles:', detailsError);
    } else if (!detalles || detalles.length === 0) {
      console.log('ℹ️  No hay registros detallados de progreso');
    } else {
      console.log(`✅ Registros detallados encontrados: ${detalles.length}`);
      console.log('   Últimas 5 actividades:');
      detalles.forEach((detalle, index) => {
        console.log(`   ${index + 1}. ${detalle.lecciones?.titulo || 'Lección sin título'}`);
        console.log(`      Progreso: ${detalle.progreso || 0}% | Completado: ${detalle.completado ? '✅' : '❌'}`);
      });
    }

    console.log('\n=== RESUMEN FINAL ===');
    if (progreso && progreso.length > 0) {
      const progresoTotal = progreso[0]?.porcentaje_progreso || 0;
      console.log(`🎯 PROGRESO ACTUAL DE PABLO: ${progresoTotal}%`);
      console.log('✅ Los datos están ahora disponibles en user_course_summary');
      console.log('🔄 El frontend debería mostrar el progreso actualizado');
      
      if (progresoTotal > 0) {
        console.log('\n🎉 ¡ÉXITO! Pablo ahora tiene progreso registrado en la base de datos');
      } else {
        console.log('\n⚠️  ATENCIÓN: El progreso está en 0% - puede necesitar datos reales de lecciones completadas');
      }
    } else {
      console.log('❌ PROBLEMA: Aún no hay datos de progreso para Pablo');
      console.log('💡 SOLUCIÓN: Ejecutar nuevamente populate_pablo_summary.cjs');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar verificación
verificarProgresoFinal();