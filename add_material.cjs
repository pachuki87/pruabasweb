const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addMasterMaterial() {
  try {
    console.log('Buscando el curso Máster en Adicciones...');
    
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .ilike('titulo', '%máster%adicciones%')
      .single();

    if (cursoError || !curso) {
      console.error('Error al encontrar el curso:', cursoError);
      return;
    }

    console.log('Curso encontrado:', curso.titulo, '- ID:', curso.id);

    const { data: existingMaterial } = await supabase
      .from('materiales')
      .select('id, titulo')
      .eq('curso_id', curso.id)
      .ilike('titulo', '%guia%practica%tfm%');

    if (existingMaterial && existingMaterial.length > 0) {
      console.log('El material ya existe:', existingMaterial[0].titulo);
      return;
    }

    const materialData = {
      titulo: 'GUIA PRACTICA TFM',
      curso_id: curso.id,
      url_archivo: '/pdfs/master-adicciones/guia-practica-tfm.pages',
      tipo_material: 'documento',
      descripcion: 'Guía práctica para el Trabajo Final de Máster',
      tamaño_archivo: null,
      leccion_id: null,
      creado_en: new Date().toISOString()
    };

    const { data: newMaterial, error: insertError } = await supabase
      .from('materiales')
      .insert([materialData])
      .select();

    if (insertError) {
      console.error('Error al insertar el material:', insertError);
      return;
    }

    console.log('Material añadido exitosamente:');
    console.log('- ID:', newMaterial[0].id);
    console.log('- Título:', newMaterial[0].titulo);
    console.log('- URL:', newMaterial[0].url_archivo);

  } catch (error) {
    console.error('Error general:', error);
  }
}

addMasterMaterial();