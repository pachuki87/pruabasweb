const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addFamilyInterventionGuide() {
  const leccion6Id = '0b2dde26-092c-44a3-8694-875af52d7805';

  console.log('🔍 Verificando si la guía práctica ya existe...');

  // Check if the guide already exists
  const { data: existingMaterials, error: existingError } = await supabase
    .from('materiales')
    .select('titulo, url_archivo')
    .eq('leccion_id', leccion6Id);

  if (existingError) {
    console.error('❌ Error al verificar materiales existentes:', existingError);
    return;
  }

  const guideExists = existingMaterials.some(material =>
    material.titulo.toLowerCase().includes('valentin escudero') ||
    (material.url_archivo && material.url_archivo.toLowerCase().includes('valentin-escudero'))
  );

  if (guideExists) {
    console.log('✅ La guía práctica de Valentín Escudero ya existe en la lección 6');
    console.log('📚 Materiales actuales:');
    existingMaterials.forEach(material => {
      console.log(`   - ${material.titulo}`);
    });
    return;
  }

  console.log('➕ Añadiendo guía práctica para la intervención familiar...');

  // Add the family intervention guide
  const newMaterial = {
    leccion_id: leccion6Id,
    curso_id: 'b5ef8c64-fe26-4f20-8221-80a1bf475b05',
    titulo: 'Guía Práctica para la Intervención Familiar - Valentín Escudero 2023',
    tipo_material: 'pdf',
    url_archivo: '/master en adicciones/6) INTERVENCION FAMILIAR Y RECOVERY MENTORING/GUIA-PRACTICA-para-la-INTERVENCION-FAMILIAR-VALENTIN-ESCUDERO-2023.pdf',
    descripcion: 'Guía práctica completa para profesionales sobre intervención familiar en adicciones, con técnicas y estrategias actualizadas.',
    creado_en: new Date().toISOString(),
    tamaño_archivo: '12503453'
  };

  const { data: insertedMaterial, error: insertError } = await supabase
    .from('materiales')
    .insert([newMaterial])
    .select()
    .single();

  if (insertError) {
    console.error('❌ Error al añadir la guía práctica:', insertError);
    return;
  }

  console.log('✅ Guía práctica añadida exitosamente:');
  console.log(`   📝 Título: ${insertedMaterial.titulo}`);
  console.log(`   📄 Tipo: ${insertedMaterial.tipo_material}`);
  console.log(`   🔗 URL: ${insertedMaterial.url_archivo}`);
  console.log(`   📋 ID: ${insertedMaterial.id}`);

  // Show all materials in the lesson
  console.log('\n📚 Todos los materiales de la lección 6:');
  const { data: allMaterials, error: allMaterialsError } = await supabase
    .from('materiales')
    .select('titulo, tipo_material, url_archivo')
    .eq('leccion_id', leccion6Id);

  if (allMaterialsError) {
    console.error('❌ Error al obtener todos los materiales:', allMaterialsError);
    return;
  }

  allMaterials.forEach((material, index) => {
    console.log(`   ${index + 1}. ${material.titulo}`);
    console.log(`      Tipo: ${material.tipo_material}`);
    console.log(`      URL: ${material.url_archivo}`);
    console.log('');
  });
}

addFamilyInterventionGuide().catch(console.error);