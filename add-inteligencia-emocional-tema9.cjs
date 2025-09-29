const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addInteligenciaEmocionalToTema9() {
  try {
    console.log('🔍 Buscando lección 9 del Máster en Adicciones...');

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

    // Find lesson 9
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', cursoId)
      .eq('orden', 9);

    if (leccionesError) {
      console.error('❌ Error al buscar lección 9:', leccionesError);
      return;
    }

    if (!lecciones || lecciones.length === 0) {
      console.error('❌ No se encontró la lección 9');
      return;
    }

    const leccion9 = lecciones[0];
    console.log('📖 Lección 9 encontrada:', leccion9.titulo);
    console.log('📝 Descripción:', leccion9.descripcion);

    // Check current materials
    console.log('\n📚 Materiales actuales de la lección 9:');
    const { data: materialesActuales, error: materialesError } = await supabase
      .from('materiales')
      .select('titulo, tipo_material, url_archivo')
      .eq('leccion_id', leccion9.id);

    if (materialesError) {
      console.error('❌ Error al buscar materiales actuales:', materialesError);
    } else {
      materialesActuales.forEach(material => {
        console.log(`   - ${material.titulo}`);
      });
    }

    // Add the 3 inteligencia emocional PDFs
    const nuevosMateriales = [
      {
        leccion_id: leccion9.id,
        curso_id: cursoId,
        titulo: 'Manual de Inteligencia Emocional Práctica',
        tipo_material: 'pdf',
        url_archivo: '/master en adicciones/9) INTELIGENCIA EMOCIONAL/Manual-de-Inteligencia-Emocional-Practica.pdf',
        descripcion: 'Guía práctica completa para desarrollar y aplicar la inteligencia emocional en el ámbito profesional y personal.',
        creado_en: new Date().toISOString(),
        tamaño_archivo: '282031'
      },
      {
        leccion_id: leccion9.id,
        curso_id: cursoId,
        titulo: 'Dialnet - Inteligencia Emocional',
        tipo_material: 'pdf',
        url_archivo: '/master en adicciones/9) INTELIGENCIA EMOCIONAL/Dialnet-InteligenciaEmocional-9642407.pdf',
        descripcion: 'Artículo académico sobre inteligencia emocional y su aplicación en diferentes contextos terapéuticos.',
        creado_en: new Date().toISOString(),
        tamaño_archivo: '977723'
      },
      {
        leccion_id: leccion9.id,
        curso_id: cursoId,
        titulo: 'Cuaderno de Ejercicios de Inteligencia Emocional',
        tipo_material: 'pdf',
        url_archivo: '/master en adicciones/9) INTELIGENCIA EMOCIONAL/Cuaderno-de-ejercicios-de-inteligencia-emocional copia.pdf',
        descripcion: 'Cuaderno completo con ejercicios prácticos para desarrollar habilidades de inteligencia emocional y autoconocimiento.',
        creado_en: new Date().toISOString(),
        tamaño_archivo: '2852944'
      }
    ];

    console.log('\n➕ Añadiendo 3 PDFs sobre Inteligencia Emocional...');

    for (const material of nuevosMateriales) {
      // Check if material already exists
      const { data: existente } = await supabase
        .from('materiales')
        .select('id')
        .eq('leccion_id', leccion9.id)
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
    console.log('\n📚 Materiales finales de la lección 9:');
    const { data: materialesFinales, error: finalesError } = await supabase
      .from('materiales')
      .select('titulo, tipo_material, url_archivo')
      .eq('leccion_id', leccion9.id)
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

addInteligenciaEmocionalToTema9().catch(console.error);