require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixLesson2Duplicates() {
  try {
    console.log('🔍 Buscando materiales duplicados en lección 2...');
    
    // Buscar por el ID específico de la lección que vemos en la URL
    const lessonId = 'e4546103-526d-42ff-a98b-0db4828caa44';
    
    console.log(`🎯 Revisando lección ID: ${lessonId}`);
    
    // Verificar que la lección existe
    const { data: lesson, error: lessonError } = await supabase
      .from('lecciones')
      .select('id, titulo, curso_id')
      .eq('id', lessonId)
      .single();
    
    if (lessonError) {
      console.error('❌ Error al buscar lección:', lessonError);
      return;
    }
    
    if (!lesson) {
      console.log('❌ No se encontró la lección');
      return;
    }
    
    console.log(`✅ Lección encontrada: ${lesson.titulo}`);
    
    // Buscar todos los materiales de esta lección
    const { data: materials, error: materialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lessonId)
      .order('creado_en');
    
    if (materialsError) {
      console.error('❌ Error al buscar materiales:', materialsError);
      return;
    }
    
    console.log(`\n📚 Total de materiales encontrados: ${materials.length}`);
    
    materials.forEach((material, index) => {
      console.log(`\n${index + 1}. Material ID: ${material.id}`);
      console.log(`   Título: ${material.titulo}`);
      console.log(`   URL: ${material.url_archivo}`);
      console.log(`   Tipo: ${material.tipo_material || 'PDF'}`);
      console.log(`   Creado: ${material.creado_en}`);
    });
    
    // Identificar duplicados por nombre de archivo similar
    const duplicateGroups = {};
    materials.forEach(material => {
      // Normalizar el nombre del archivo
      const fileName = material.url_archivo ? material.url_archivo.split('/').pop().toLowerCase() : '';
      const normalizedName = fileName.replace(/[^a-z0-9]/g, '');
      
      if (!duplicateGroups[normalizedName]) {
        duplicateGroups[normalizedName] = [];
      }
      duplicateGroups[normalizedName].push(material);
    });
    
    console.log('\n🔍 Análisis de duplicados por archivo:');
    let duplicatesFound = false;
    const toDelete = [];
    
    Object.entries(duplicateGroups).forEach(([normalizedName, group]) => {
      if (group.length > 1) {
        duplicatesFound = true;
        console.log(`\n⚠️  Duplicados encontrados (${group.length} materiales):`);
        
        // Ordenar por fecha de creación (mantener el más antiguo)
        group.sort((a, b) => new Date(a.creado_en) - new Date(b.creado_en));
        
        group.forEach((material, index) => {
          const status = index === 0 ? '✅ MANTENER' : '❌ ELIMINAR';
          console.log(`   ${index + 1}. ${status} - ID: ${material.id}`);
          console.log(`      Título: "${material.titulo}"`);
          console.log(`      URL: ${material.url_archivo}`);
          console.log(`      Creado: ${material.creado_en}`);
          
          if (index > 0) {
            toDelete.push(material.id);
          }
        });
      }
    });
    
    if (!duplicatesFound) {
      console.log('✅ No se encontraron duplicados por archivo');
      return;
    }
    
    console.log(`\n🗑️  Materiales a eliminar: ${toDelete.length}`);
    toDelete.forEach(id => console.log(`   - ${id}`));
    
    // Eliminar duplicados
    if (toDelete.length > 0) {
      console.log('\n🔄 Eliminando materiales duplicados...');
      
      for (const materialId of toDelete) {
        const { error: deleteError } = await supabase
          .from('materiales')
          .delete()
          .eq('id', materialId);
        
        if (deleteError) {
          console.error(`❌ Error al eliminar material ${materialId}:`, deleteError);
        } else {
          console.log(`✅ Material ${materialId} eliminado`);
        }
      }
      
      console.log('\n🎉 Limpieza completada!');
      
      // Verificar resultado final
      const { data: finalMaterials, error: finalError } = await supabase
        .from('materiales')
        .select('id, titulo, url_archivo')
        .eq('leccion_id', lessonId);
      
      if (!finalError) {
        console.log(`\n📊 Materiales restantes: ${finalMaterials.length}`);
        finalMaterials.forEach((material, index) => {
          console.log(`${index + 1}. ${material.titulo} - ${material.url_archivo}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

fixLesson2Duplicates();