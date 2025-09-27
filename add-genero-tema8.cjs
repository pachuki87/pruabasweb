const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addGeneroToTema8() {
  try {
    console.log('🔍 Buscando lección 8 del Máster en Adicciones...');

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

    // Find lesson 8
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', cursoId)
      .eq('orden', 8);

    if (leccionesError) {
      console.error('❌ Error al buscar lección 8:', leccionesError);
      return;
    }

    if (!lecciones || lecciones.length === 0) {
      console.error('❌ No se encontró la lección 8');
      return;
    }

    const leccion8 = lecciones[0];
    console.log('📖 Lección 8 encontrada:', leccion8.titulo);
    console.log('📝 Descripción:', leccion8.descripcion);

    // Check current materials
    console.log('\n📚 Materiales actuales de la lección 8:');
    const { data: materialesActuales, error: materialesError } = await supabase
      .from('materiales')
      .select('titulo, tipo_material, url_archivo')
      .eq('leccion_id', leccion8.id);

    if (materialesError) {
      console.error('❌ Error al buscar materiales actuales:', materialesError);
    } else {
      materialesActuales.forEach(material => {
        console.log(`   - ${material.titulo}`);
      });
    }

    // Add the 4 género and adicciones PDFs
    const nuevosMateriales = [
      {
        leccion_id: leccion8.id,
        curso_id: cursoId,
        titulo: 'Encuentro Género y Drogas - Nuria Romo',
        tipo_material: 'pdf',
        url_archivo: '/master en adicciones/8) GENERO Y ADICCIONES/VIEncuentroGeneroDrogas_NuriaRomo.pdf',
        descripcion: 'Análisis exhaustivo sobre la relación entre género y consumo de drogas, con perspectiva feminista y datos actualizados.',
        creado_en: new Date().toISOString(),
        tamaño_archivo: '1136731'
      },
      {
        leccion_id: leccion8.id,
        curso_id: cursoId,
        titulo: 'Mujeres y Adicciones v1',
        tipo_material: 'pdf',
        url_archivo: '/master en adicciones/8) GENERO Y ADICCIONES/mujeresyadiccionesv1.pdf',
        descripcion: 'Estudio completo sobre las especificidades de las adicciones femeninas, factores de riesgo y abordajes terapéuticos.',
        creado_en: new Date().toISOString(),
        tamaño_archivo: '20080341'
      },
      {
        leccion_id: leccion8.id,
        curso_id: cursoId,
        titulo: 'Perspectiva de Género en Ámbito de Drogas',
        tipo_material: 'pdf',
        url_archivo: '/master en adicciones/8) GENERO Y ADICCIONES/RIOD_PERSPECTIVA-GENERO-EN-AMBITO-DROGAS-1.pdf',
        descripcion: 'Documento RIOD sobre perspectiva de género en el ámbito de las drogodependencias, con estrategias de intervención.',
        creado_en: new Date().toISOString(),
        tamaño_archivo: '3953993'
      },
      {
        leccion_id: leccion8.id,
        curso_id: cursoId,
        titulo: 'Género en Adicciones',
        tipo_material: 'pdf',
        url_archivo: '/master en adicciones/8) GENERO Y ADICCIONES/GENERO EN ADICCIONES.pdf',
        descripcion: 'Guía especializada sobre la perspectiva de género en el tratamiento de adicciones, con enfoque en diferencias biológicas y sociales.',
        creado_en: new Date().toISOString(),
        tamaño_archivo: '922719'
      }
    ];

    console.log('\n➕ Añadiendo 4 PDFs sobre Género y Adicciones...');

    for (const material of nuevosMateriales) {
      // Check if material already exists
      const { data: existente } = await supabase
        .from('materiales')
        .select('id')
        .eq('leccion_id', leccion8.id)
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
    console.log('\n📚 Materiales finales de la lección 8:');
    const { data: materialesFinales, error: finalesError } = await supabase
      .from('materiales')
      .select('titulo, tipo_material, url_archivo')
      .eq('leccion_id', leccion8.id)
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

addGeneroToTema8().catch(console.error);