const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2NxamlpeGtxcXRwb2VqZG8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcyMzg1NjgwOCwiZXhwIjoyMDM5NDMyODA4fQ.N5U2y_3H1g2q9JQYQ20z4Zf7rQ0z0xX3xW3xZ1wW3xQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson9Materials() {
  try {
    console.log('🔍 Verificando materiales actuales de la lección 9...');

    // Obtener el ID de la lección 9 (INTELIGENCIA EMOCIONAL)
    const { data: lesson, error: lessonError } = await supabase
      .from('lecciones')
      .select('id')
      .eq('titulo', 'INTELIGENCIA EMOCIONAL')
      .single();

    if (lessonError) {
      console.error('❌ Error al obtener la lección:', lessonError);
      return;
    }

    console.log(`✅ Lección encontrada: ${lesson.id} - INTELIGENCIA EMOCIONAL`);

    // Obtener materiales actuales
    const { data: currentMaterials, error: materialsError } = await supabase
      .from('materiales_lecciones')
      .select(`
        material_id,
        materiales (
          id,
          titulo,
          archivo_url,
          tipo_archivo
        )
      `)
      .eq('leccion_id', lesson.id);

    if (materialsError) {
      console.error('❌ Error al obtener materiales:', materialsError);
      return;
    }

    console.log('\n📄 Materiales actuales en la lección 9:');
    if (currentMaterials && currentMaterials.length > 0) {
      currentMaterials.forEach(item => {
        console.log(`  • ${item.materiales.titulo}`);
        console.log(`    URL: ${item.materiales.archivo_url}`);
        console.log(`    Tipo: ${item.materiales.tipo_archivo}`);
        console.log(`    ID: ${item.material_id}`);
        console.log('');
      });
    } else {
      console.log('  No hay materiales asignados actualmente');
    }

    // Los materiales que DEBEN estar
    const requiredMaterials = [
      'PPT INTELIGENCIA EMOCIONAL.pdf',
      'Informe-Educación-emocional-para-las-conductas-adictivas.pdf'
    ];

    console.log('📋 Materiales requeridos:');
    requiredMaterials.forEach(material => {
      console.log(`  • ${material}`);
    });

    // Verificar qué materiales faltan o sobran
    const currentMaterialNames = currentMaterials ? currentMaterials.map(item => item.materiales.titulo) : [];

    const missingMaterials = requiredMaterials.filter(req => !currentMaterialNames.includes(req));
    const extraMaterials = currentMaterialNames.filter(current => !requiredMaterials.includes(current));

    if (missingMaterials.length > 0) {
      console.log('\n❌ Materiales faltantes:');
      missingMaterials.forEach(material => {
        console.log(`  • ${material}`);
      });
    }

    if (extraMaterials.length > 0) {
      console.log('\n🗑️ Materiales que deben ser eliminados:');
      extraMaterials.forEach(material => {
        console.log(`  • ${material}`);
      });
    }

    if (missingMaterials.length === 0 && extraMaterials.length === 0) {
      console.log('\n✅ La lección 9 ya tiene los materiales correctos');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkLesson9Materials();