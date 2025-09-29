const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanLesson9Materials() {
  try {
    console.log('🔍 Buscando la lección 9...');
    
    // Buscar la lección 9 "Nuevas terapias psicológicas"
    const { data: lessons, error: lessonError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('orden', 9);
    
    if (lessonError) {
      console.error('❌ Error buscando lecciones:', lessonError);
      return;
    }
    
    const lesson = lessons.find(l => 
      l.titulo.toLowerCase().includes('nuevas terapias') || 
      l.titulo.toLowerCase().includes('terapeuticos') ||
      l.titulo.toLowerCase().includes('psicológicas')
    );
    
    if (!lesson) {
      console.log('❌ No se encontró la lección 9');
      return;
    }
    
    console.log('✅ Lección 9 encontrada:', lesson.titulo);
    
    // Obtener todos los materiales de la lección 9
    const { data: allMaterials, error: materialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lesson.id)
      .order('creado_en', { ascending: true });
    
    if (materialsError) {
      console.error('❌ Error obteniendo materiales:', materialsError);
      return;
    }
    
    console.log('📋 Total de materiales encontrados:', allMaterials.length);
    
    // Agrupar por título para encontrar duplicados
    const materialsByTitle = {};
    allMaterials.forEach(material => {
      if (!materialsByTitle[material.titulo]) {
        materialsByTitle[material.titulo] = [];
      }
      materialsByTitle[material.titulo].push(material);
    });
    
    // Identificar duplicados y mantener solo el más antiguo
    const materialsToDelete = [];
    const materialsToKeep = [];
    
    Object.keys(materialsByTitle).forEach(titulo => {
      const materials = materialsByTitle[titulo];
      if (materials.length > 1) {
        console.log(`🔄 Encontrados ${materials.length} duplicados para: ${titulo}`);
        // Mantener el más antiguo (primer elemento después del sort por creado_en)
        materialsToKeep.push(materials[0]);
        // Marcar el resto para eliminación
        materials.slice(1).forEach(material => {
          materialsToDelete.push(material.id);
        });
      } else {
        materialsToKeep.push(materials[0]);
      }
    });
    
    console.log('📄 Materiales a mantener:', materialsToKeep.length);
    console.log('🗑️ Materiales a eliminar:', materialsToDelete.length);
    
    // Eliminar duplicados
    if (materialsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('materiales')
        .delete()
        .in('id', materialsToDelete);
      
      if (deleteError) {
        console.error('❌ Error eliminando duplicados:', deleteError);
        return;
      }
      
      console.log('✅ Duplicados eliminados exitosamente');
    }
    
    // Verificar resultado final
    const { data: finalMaterials, error: finalError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lesson.id);
    
    if (finalError) {
      console.error('❌ Error verificando resultado final:', finalError);
      return;
    }
    
    console.log('\n📋 Materiales finales para la lección 9:', finalMaterials.length);
    finalMaterials.forEach((material, index) => {
      console.log(`${index + 1}. ${material.titulo} (${material.tipo_material})`);
    });
    
    console.log('\n🎉 ¡Limpieza completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

cleanLesson9Materials();