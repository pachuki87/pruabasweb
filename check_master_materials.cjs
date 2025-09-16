const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMasterMaterials() {
  try {
    console.log('🔍 Verificando materiales del Máster en Adicciones...\n');
    
    // Buscar el curso del Máster
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .ilike('titulo', '%máster%adicciones%')
      .single();

    if (cursoError || !curso) {
      console.error('❌ Error al encontrar el curso:', cursoError);
      return;
    }

    console.log('✅ Curso encontrado:');
    console.log(`   - Título: ${curso.titulo}`);
    console.log(`   - ID: ${curso.id}\n`);

    // Obtener todos los materiales del curso
    const { data: materiales, error: materialesError } = await supabase
      .from('materiales')
      .select('*')
      .eq('curso_id', curso.id)
      .order('creado_en', { ascending: true });

    if (materialesError) {
      console.error('❌ Error al obtener materiales:', materialesError);
      return;
    }

    console.log(`📚 Materiales encontrados: ${materiales.length}\n`);

    if (materiales.length === 0) {
      console.log('⚠️ No se encontraron materiales para este curso');
      return;
    }

    materiales.forEach((material, index) => {
      console.log(`${index + 1}. ${material.titulo}`);
      console.log(`   - ID: ${material.id}`);
      console.log(`   - URL: ${material.url_archivo}`);
      console.log(`   - Tipo: ${material.tipo_material}`);
      console.log(`   - Descripción: ${material.descripcion || 'Sin descripción'}`);
      console.log(`   - Lección ID: ${material.leccion_id || 'No asignado'}`);
      console.log(`   - Creado: ${material.creado_en}`);
      console.log('');
    });

    // Verificar específicamente el material de la guía práctica
    const guiaPractica = materiales.find(m => 
      m.titulo.toLowerCase().includes('guia') && 
      m.titulo.toLowerCase().includes('practica')
    );

    if (guiaPractica) {
      console.log('✅ Material "GUIA PRACTICA TFM" encontrado:');
      console.log(`   - ID: ${guiaPractica.id}`);
      console.log(`   - URL: ${guiaPractica.url_archivo}`);
      console.log(`   - Estado: Activo`);
    } else {
      console.log('❌ Material "GUIA PRACTICA TFM" NO encontrado');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkMasterMaterials();