const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

// ID de la lección 1 del master (FUNDAMENTOS P TERAPEUTICO)
const LESSON1_MASTER_ID = '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44';

const materialsToAdd = [
  {
    titulo: 'BLOQUE 1 TECNICO EN ADICIONES.pdf',
    descripcion: 'Fundamentos básicos del tratamiento',
    tipo_material: 'pdf',
    url_archivo: '/pdfs/master-adicciones/BLOQUE 1 TECNICO EN ADICIONES.pdf'
  },
  {
    titulo: 'MATRIX-manual_terapeuta.pdf', 
    descripcion: 'Guía completa para profesionales',
    tipo_material: 'pdf',
    url_archivo: '/pdfs/master-adicciones/MATRIX-manual_terapeuta.pdf'
  }
];

async function addMaterialsToLesson1() {
  try {
    console.log('Agregando materiales a la lección 1 del master...');
    
    // Verificar materiales existentes
    const { data: existingMaterials, error: checkError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', LESSON1_MASTER_ID);
    
    if (checkError) {
      console.error('Error al verificar materiales existentes:', checkError);
      return;
    }
    
    console.log(`Materiales existentes: ${existingMaterials.length}`);
    existingMaterials.forEach((material, index) => {
      console.log(`${index + 1}. ${material.titulo}`);
    });
    
    // Agregar cada material
    for (const material of materialsToAdd) {
      // Verificar si el material ya existe
      const exists = existingMaterials.some(existing => 
        existing.titulo === material.titulo
      );
      
      if (exists) {
        console.log(`⚠️  Material "${material.titulo}" ya existe, saltando...`);
        continue;
      }
      
      console.log(`\n📄 Agregando: ${material.titulo}`);
      
      const { data, error } = await supabase
        .from('materiales')
        .insert({
          leccion_id: LESSON1_MASTER_ID,
          titulo: material.titulo,
          descripcion: material.descripcion,
          tipo_material: material.tipo_material,
          url_archivo: material.url_archivo
        })
        .select();
      
      if (error) {
        console.error(`❌ Error al agregar "${material.titulo}":`, error);
      } else {
        console.log(`✅ Material "${material.titulo}" agregado exitosamente`);
        console.log(`   ID: ${data[0].id}`);
        console.log(`   Descripción: ${data[0].descripcion}`);
      }
    }
    
    // Verificar el resultado final
    const { data: finalMaterials, error: finalError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', LESSON1_MASTER_ID);
    
    if (finalError) {
      console.error('Error al verificar materiales finales:', finalError);
    } else {
      console.log(`\n🎉 Total de materiales en la lección 1: ${finalMaterials.length}`);
      finalMaterials.forEach((material, index) => {
        console.log(`${index + 1}. ${material.titulo} (${material.tipo_material})`);
      });
    }
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

addMaterialsToLesson1();