const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addNinoInteriorPDFs() {
  try {
    console.log('🔍 Buscando lección 7 del Máster en Adicciones...');

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

    // Find lesson 7
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', cursoId)
      .eq('orden', 7);

    if (leccionesError) {
      console.error('❌ Error al buscar lección 7:', leccionesError);
      return;
    }

    if (!lecciones || lecciones.length === 0) {
      console.error('❌ No se encontró la lección 7');
      return;
    }

    const leccion7 = lecciones[0];
    console.log('📖 Lección 7 encontrada:', leccion7.titulo);

    // Check current materials
    console.log('\n📚 Materiales actuales de la lección 7:');
    const { data: materialesActuales, error: materialesError } = await supabase
      .from('materiales')
      .select('titulo, tipo_material, url_archivo')
      .eq('leccion_id', leccion7.id);

    if (materialesError) {
      console.error('❌ Error al buscar materiales actuales:', materialesError);
    } else {
      materialesActuales.forEach(material => {
        console.log(`   - ${material.titulo}`);
      });
    }

    // Add the two niño interior PDFs
    const nuevosMateriales = [
      {
        leccion_id: leccion7.id,
        curso_id: cursoId,
        titulo: 'Abraza a tu Niño Interior',
        tipo_material: 'pdf',
        url_archivo: '/master en adicciones/7) INTELIGENCIA EMOCIONAL/ABRAZA-A-TU-NIÑO-INTERIOR.pdf',
        descripcion: 'Guía completa para trabajar con el niño interior y sanar heridas emocionales desde la infancia.',
        creado_en: new Date().toISOString(),
        tamaño_archivo: '1818487'
      },
      {
        leccion_id: leccion7.id,
        curso_id: cursoId,
        titulo: 'Niño Interior - Guía de Sanación',
        tipo_material: 'pdf',
        url_archivo: '/master en adicciones/7) INTELIGENCIA EMOCIONAL/NIÑO INTERIOR .pdf',
        descripcion: 'Guía práctica para conectar con tu niño interior y promover la sanación emocional.',
        creado_en: new Date().toISOString(),
        tamaño_archivo: '113854'
      }
    ];

    console.log('\n➕ Añadiendo PDFs sobre Niño Interior...');

    for (const material of nuevosMateriales) {
      // Check if material already exists
      const { data: existente } = await supabase
        .from('materiales')
        .select('id')
        .eq('leccion_id', leccion7.id)
        .eq('titulo', material.titulo);

      if (existente && existente.length > 0) {
        console.log(`⚠️ "${material.titulo}" ya existe, omitiendo...`);
        continue;
      }

      const { data: insertado, error: insertError } = await supabase
        .from('materiales')
        .insert([material])
        .select()
        .single();

      if (insertError) {
        console.error(`❌ Error al añadir "${material.titulo}":`, insertError);
      } else {
        console.log(`✅ "${material.titulo}" añadido exitosamente`);
        console.log(`   ID: ${insertado.id}`);
      }
    }

    // Show final materials list
    console.log('\n📚 Materiales finales de la lección 7:');
    const { data: materialesFinales, error: finalesError } = await supabase
      .from('materiales')
      .select('titulo, tipo_material, url_archivo')
      .eq('leccion_id', leccion7.id)
      .order('titulo');

    if (finalesError) {
      console.error('❌ Error al obtener materiales finales:', finalesError);
    } else {
      materialesFinales.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.titulo}`);
        console.log(`      Tipo: ${material.tipo_material}`);
        console.log(`      URL: ${material.url_archivo}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

addNinoInteriorPDFs().catch(console.error);