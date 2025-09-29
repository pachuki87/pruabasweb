require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findMatrixTerapeuta() {
  try {
    console.log('🔍 Buscando material MATRIX-manual_terapeuta...');
    
    // Buscar por nombre de archivo específico
    const { data: materials, error } = await supabase
      .from('materiales')
      .select('id, titulo, leccion_id, url_archivo, curso_id')
      .or('titulo.ilike.%MATRIX-manual_terapeuta%,url_archivo.ilike.%MATRIX-manual_terapeuta%');
    
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log(`\n📋 Materiales MATRIX-manual_terapeuta encontrados: ${materials.length}`);
    
    if (materials.length === 0) {
      console.log('\n🔍 Buscando con términos más amplios...');
      
      // Buscar con términos más amplios
      const { data: broadSearch, error: broadError } = await supabase
        .from('materiales')
        .select('id, titulo, leccion_id, url_archivo, curso_id')
        .or('titulo.ilike.%manual_terapeuta%,url_archivo.ilike.%manual_terapeuta%,titulo.ilike.%MATRIX%');
      
      if (broadError) {
        console.error('❌ Error en búsqueda amplia:', broadError);
        return;
      }
      
      console.log(`\n📋 Materiales relacionados encontrados: ${broadSearch.length}`);
      
      broadSearch.forEach((material, index) => {
        console.log(`\n${index + 1}. Material:`);
        console.log(`   ID: ${material.id}`);
        console.log(`   Título: ${material.titulo}`);
        console.log(`   Lección ID: ${material.leccion_id}`);
        console.log(`   Curso ID: ${material.curso_id}`);
        console.log(`   URL: ${material.url_archivo}`);
      });
      
      // Buscar información de las lecciones si hay materiales
      if (broadSearch.length > 0) {
        const leccionIds = [...new Set(broadSearch.map(m => m.leccion_id).filter(Boolean))];
        
        if (leccionIds.length > 0) {
          const { data: lecciones, error: leccionError } = await supabase
            .from('lecciones')
            .select('id, titulo, orden')
            .in('id', leccionIds);
          
          if (!leccionError && lecciones) {
            console.log('\n📚 Información de lecciones:');
            lecciones.forEach(leccion => {
              console.log(`   Lección ${leccion.orden}: ${leccion.titulo} (ID: ${leccion.id})`);
            });
            
            // Identificar duplicados (materiales que NO están en la lección 1)
            const leccion1 = lecciones.find(l => l.orden === 1);
            if (leccion1) {
              const duplicates = broadSearch.filter(m => 
                m.leccion_id && m.leccion_id !== leccion1.id && 
                (m.titulo.toLowerCase().includes('matrix') || m.url_archivo.toLowerCase().includes('matrix'))
              );
              
              if (duplicates.length > 0) {
                console.log('\n🗑️ Materiales MATRIX duplicados para eliminar:');
                duplicates.forEach(dup => {
                  console.log(`   - ID: ${dup.id} (Lección: ${dup.leccion_id})`);
                });
              } else {
                console.log('\n✅ No se encontraron duplicados para eliminar.');
              }
            }
          }
        }
      }
    } else {
      materials.forEach((material, index) => {
        console.log(`\n${index + 1}. Material:`);
        console.log(`   ID: ${material.id}`);
        console.log(`   Título: ${material.titulo}`);
        console.log(`   Lección ID: ${material.leccion_id}`);
        console.log(`   Curso ID: ${material.curso_id}`);
        console.log(`   URL: ${material.url_archivo}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

findMatrixTerapeuta();