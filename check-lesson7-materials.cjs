const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson7Materials() {
  try {
    console.log('🔍 Verificando materiales de la lección 7...');
    
    // Primero, buscar las lecciones con orden 7
    const { data: lessons7, error: lessonError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('orden', 7);
    
    if (lessonError) {
      console.error('❌ Error al buscar lección 7:', lessonError);
      return;
    }
    
    if (!lessons7 || lessons7.length === 0) {
      console.log('❌ No se encontraron lecciones con orden 7');
      return;
    }
    
    console.log(`✅ Lecciones con orden 7 encontradas: ${lessons7.length}`);
    
    let allMaterials = [];
    
    for (const lesson of lessons7) {
      console.log(`\n📚 Lección: ${lesson.titulo}`);
      console.log(`   ID: ${lesson.id}`);
      console.log(`   Orden: ${lesson.orden}`);
      
      // Buscar materiales para esta lección específica
       const { data: materials, error: materialsError } = await supabase
         .from('materiales')
         .select('*')
         .eq('leccion_id', lesson.id)
         .order('creado_en', { ascending: true });
      
      if (materialsError) {
        console.error(`❌ Error al buscar materiales para lección ${lesson.id}:`, materialsError);
        continue;
      }
      
      console.log(`   📄 Materiales: ${materials.length}`);
      
      if (materials.length > 0) {
        materials.forEach((material, index) => {
           console.log(`   ${index + 1}. ${material.titulo}`);
           console.log(`      Tipo: ${material.tipo_material}`);
           console.log(`      URL: ${material.url_archivo}`);
           console.log(`      Descripción: ${material.descripcion || 'Sin descripción'}`);
           console.log(`      Creado: ${new Date(material.creado_en).toLocaleString()}`);
         });
        allMaterials = allMaterials.concat(materials);
      }
    }
    
    console.log(`\n📊 RESUMEN TOTAL:`);
     console.log(`   Lecciones con orden 7: ${lessons7.length}`);
     console.log(`   Total de materiales: ${allMaterials.length}`);
    
    console.log('✅ Verificación completada');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la verificación
checkLesson7Materials();