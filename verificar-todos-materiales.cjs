const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarTodosLosMateriales() {
  try {
    console.log('🔍 Verificando todos los materiales del Máster en Adicciones...');

    // Find master-addictions course
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id, titulo');

    if (cursosError) {
      console.error('❌ Error al buscar cursos:', cursosError);
      return;
    }

    const masterCurso = cursos.find(curso =>
      curso.titulo.toLowerCase().includes('máster') &&
      curso.titulo.toLowerCase().includes('adicciones')
    );

    if (!masterCurso) {
      console.error('❌ No se encontró el curso MÁSTER EN ADICCIONES');
      return;
    }

    const cursoId = masterCurso.id;
    console.log('🎯 Curso encontrado:', masterCurso.titulo);

    // Get all lessons
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', cursoId)
      .order('orden');

    if (leccionesError) {
      console.error('❌ Error al buscar lecciones:', leccionesError);
      return;
    }

    console.log(`\n📖 Encontradas ${lecciones.length} lecciones:`);

    // Check materials for each lesson
    for (const leccion of lecciones) {
      console.log(`\n--- Lección ${leccion.orden}: ${leccion.titulo} ---`);

      const { data: materiales, error: materialesError } = await supabase
        .from('materiales')
        .select('titulo, tipo_material, url_archivo, creado_en')
        .eq('leccion_id', leccion.id)
        .order('titulo');

      if (materialesError) {
        console.error(`❌ Error en lección ${leccion.orden}:`, materialesError);
        continue;
      }

      if (!materiales || materiales.length === 0) {
        console.log('   📂 Sin materiales');
        continue;
      }

      console.log(`   📚 ${materiales.length} materiales:`);
      materiales.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.titulo}`);
        console.log(`      Tipo: ${material.tipo_material || 'No especificado'}`);
        console.log(`      URL: ${material.url_archivo || 'No especificada'}`);
        if (material.creado_en) {
          const fecha = new Date(material.creado_en);
          console.log(`      Creado: ${fecha.toLocaleDateString('es-ES')} ${fecha.toLocaleTimeString('es-ES')}`);
        }
        console.log('');
      });
    }

    // Check specifically for today's additions
    console.log('\n🔍 Verificando materiales añadidos hoy...');

    const hoy = new Date().toISOString().split('T')[0];

    for (const leccion of lecciones) {
      const { data: materialesHoy, error: hoyError } = await supabase
        .from('materiales')
        .select('titulo, leccion_id')
        .eq('leccion_id', leccion.id)
        .gte('creado_en', hoy);

      if (hoyError || !materialesHoy || materialesHoy.length === 0) continue;

      console.log(`\n📅 Lección ${leccion.orden} - materiales añadidos hoy:`);
      materialesHoy.forEach(material => {
        console.log(`   ✅ ${material.titulo}`);
      });
    }

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

verificarTodosLosMateriales().catch(console.error);