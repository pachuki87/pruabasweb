const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addManualCaballoToTema2() {
  try {
    console.log('🔍 Buscando lección 2 del Máster en Adicciones...');

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
    console.log('📖 Lección 2 encontrada:', leccion2.titulo);
    console.log('📝 Descripción:', leccion2.descripcion);

    // Check current materials
    console.log('\n📚 Materiales actuales de la lección 2:');
    const { data: materialesActuales, error: materialesError } = await supabase
      .from('materiales')
      .select('titulo, tipo_material, url_archivo')
      .eq('leccion_id', leccion2.id);

    if (materialesError) {
      console.error('❌ Error al buscar materiales actuales:', materialesError);
    } else {
      materialesActuales.forEach(material => {
        console.log(`   - ${material.titulo}`);
      });
    }

    // Check if the manual already exists
    const manualExists = materialesActuales.some(material =>
      material.titulo.toLowerCase().includes('caballo') ||
      material.titulo.toLowerCase().includes('tratamiento cognitivo conductual')
    );

    if (manualExists) {
      console.log('⚠️ El Manual de Caballo ya existe en la lección 2');
      return;
    }

    // Get file info
    const filePath = 'C:\\Users\\pabli\\OneDrive\\Desktop\\institutoooo - copia\\pruabasweb\\public\\pdfs\\master-adicciones\\Manual-para-el-tratamiento-cognitivo-conductual-de-los-trastornos-psicologicos-Vicente-Caballo.pdf';

    if (!fs.existsSync(filePath)) {
      console.error('❌ No se encontró el archivo:', filePath);
      return;
    }

    const stats = fs.statSync(filePath);
    const fileSize = stats.size.toString();

    console.log('\n📄 Información del archivo:');
    console.log(`   Tamaño: ${fileSize} bytes`);
    console.log(`   Ruta: ${filePath}`);

    // Add the manual to lesson 2
    const nuevoMaterial = {
      leccion_id: leccion2.id,
      curso_id: cursoId,
      titulo: 'Manual para el tratamiento cognitivo-conductual de los trastornos psicológicos - Vicente Caballo',
      tipo_material: 'pdf',
      url_archivo: '/pdfs/master-adicciones/Manual-para-el-tratamiento-cognitivo-conductual-de-los-trastornos-psicologicos-Vicente-Caballo.pdf',
      descripcion: 'Manual completo de Vicente Caballo sobre terapia cognitivo-conductual para el tratamiento de diversos trastornos psicológicos. Obra fundamental para profesionales de la psicología clínica.',
      creado_en: new Date().toISOString(),
      tamaño_archivo: fileSize
    };

    console.log('\n➕ Añadiendo Manual de Vicente Caballo a la lección 2...');

    const { data: insertado, error: insertError } = await supabase
      .from('materiales')
      .insert([nuevoMaterial])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error al añadir el manual:', insertError);
      return;
    }

    console.log('✅ Manual añadido exitosamente:');
    console.log(`   📝 Título: ${insertado.titulo}`);
    console.log(`   📄 Tipo: ${insertado.tipo_material}`);
    console.log(`   🔗 URL: ${insertado.url_archivo}`);
    console.log(`   📋 ID: ${insertado.id}`);

    // Show final materials list
    console.log('\n📚 Materiales finales de la lección 2:');
    const { data: materialesFinales, error: finalesError } = await supabase
      .from('materiales')
      .select('titulo, tipo_material, url_archivo')
      .eq('leccion_id', leccion2.id)
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

addManualCaballoToTema2().catch(console.error);