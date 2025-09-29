const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCaballoManualURL() {
  try {
    console.log('🔍 Actualizando URL del Manual de Caballo...');

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

    // Find the Caballo manual
    const { data: materiales, error: materialesError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', leccion2.id);

    if (materialesError) {
      console.error('❌ Error al buscar materiales:', materialesError);
      return;
    }

    const caballoManual = materiales.find(material =>
      material.titulo.toLowerCase().includes('caballo') ||
      material.titulo.toLowerCase().includes('cognitivo conductual')
    );

    if (!caballoManual) {
      console.error('❌ No se encontró el Manual de Caballo');
      return;
    }

    console.log('📄 Manual encontrado:');
    console.log(`   ID: ${caballoManual.id}`);
    console.log(`   Título actual: ${caballoManual.titulo}`);
    console.log(`   URL actual: ${caballoManual.url_archivo}`);

    // Update the URL and title
    const newURL = '/pdfs/master-adicciones/Manual-para-el-tratamiento-cognitivo-conductual-de-los-trastornos-psicologicos-Vicente-Caballo.pdf';
    const newTitle = 'Manual para el tratamiento cognitivo-conductual de los trastornos psicológicos - Vicente Caballo';

    const { data: actualizado, error: updateError } = await supabase
      .from('materiales')
      .update({
        url_archivo: newURL,
        titulo: newTitle,
        descripcion: 'Manual completo de Vicente Caballo sobre terapia cognitivo-conductual para el tratamiento de diversos trastornos psicológicos. Obra fundamental para profesionales de la psicología clínica.'
      })
      .eq('id', caballoManual.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error al actualizar el manual:', updateError);
      return;
    }

    console.log('\n✅ Manual actualizado exitosamente:');
    console.log(`   📝 Nuevo título: ${actualizado.titulo}`);
    console.log(`   🔗 Nueva URL: ${actualizado.url_archivo}`);
    console.log(`   📋 Nueva descripción: ${actualizado.descripcion}`);

    // Show final materials
    console.log('\n📚 Materiales finales de la lección 2:');
    const { data: materialesFinales, error: finalesError } = await supabase
      .from('materiales')
      .select('titulo, url_archivo')
      .eq('leccion_id', leccion2.id)
      .order('titulo');

    if (finalesError) {
      console.error('❌ Error al obtener materiales finales:', finalesError);
    } else {
      materialesFinales.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.titulo}`);
        console.log(`      ${material.url_archivo}`);
      });
    }

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

updateCaballoManualURL().catch(console.error);