const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson2Materials() {
  try {
    console.log('🔍 Buscando materiales para la lección 2...');

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

    // Find lesson 2
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', cursoId)
      .eq('orden', 2);

    if (leccionesError) {
      console.error('❌ Error al buscar lección 2:', leccionesError);
      return;
    }

    if (!lecciones || lecciones.length === 0) {
      console.error('❌ No se encontró la lección 2');
      return;
    }

    const leccion2 = lecciones[0];
    console.log('📖 Lección 2:', leccion2.titulo);

    // Get materials
    const { data: materiales, error: materialesError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', leccion2.id)
      .order('titulo');

    if (materialesError) {
      console.error('❌ Error al buscar materiales:', materialesError);
      return;
    }

    console.log(`\n📚 Materiales actuales de la lección 2 (${materiales.length} materiales):`);
    materiales.forEach((material, index) => {
      console.log(`\n${index + 1}. ${material.titulo}`);
      console.log(`   Tipo: ${material.tipo_material}`);
      console.log(`   URL: ${material.url_archivo}`);
      if (material.creado_en) {
        const fecha = new Date(material.creado_en);
        console.log(`   Creado: ${fecha.toLocaleDateString('es-ES')} ${fecha.toLocaleTimeString('es-ES')}`);
      }
      if (material.descripcion) {
        console.log(`   Descripción: ${material.descripcion}`);
      }
    });

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

checkLesson2Materials().catch(console.error);