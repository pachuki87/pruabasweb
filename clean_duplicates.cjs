require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function cleanDuplicates() {
  try {
    console.log('🧹 Limpiando duplicados en materiales del Master...');
    
    // 1. Verificar duplicados de Manual MATRIX
    console.log('\n🔍 Verificando duplicados de Manual MATRIX...');
    const { data: matrixMaterials, error: matrixError } = await supabase
      .from('materiales')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .ilike('titulo', '%manual matrix%');
    
    if (matrixError) {
      console.error('❌ Error obteniendo materiales MATRIX:', matrixError);
      return;
    }
    
    console.log(`📋 Materiales MATRIX encontrados: ${matrixMaterials.length}`);
    matrixMaterials.forEach(material => {
      console.log(`   - ID: ${material.id}`);
      console.log(`     Título: ${material.titulo}`);
      console.log(`     URL: ${material.url_archivo}`);
    });
    
    // Eliminar el que tiene URL incorrecta (PPT INTELIGENCIA EMOCIONAL)
    const incorrectMatrix = matrixMaterials.find(m => 
      m.url_archivo.includes('PPT INTELIGENCIA EMOCIONAL')
    );
    
    if (incorrectMatrix) {
      console.log(`\n🗑️ Eliminando material MATRIX con URL incorrecta: ${incorrectMatrix.id}`);
      const { error: deleteError } = await supabase
        .from('materiales')
        .delete()
        .eq('id', incorrectMatrix.id);
      
      if (deleteError) {
        console.error('❌ Error eliminando material:', deleteError);
      } else {
        console.log('✅ Material eliminado exitosamente');
      }
    }
    
    // 2. Verificar duplicados de Bloque 1
    console.log('\n🔍 Verificando duplicados de Bloque 1...');
    const { data: bloque1Materials, error: bloque1Error } = await supabase
      .from('materiales')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .ilike('titulo', '%bloque 1%');
    
    if (bloque1Error) {
      console.error('❌ Error obteniendo materiales Bloque 1:', bloque1Error);
      return;
    }
    
    console.log(`📋 Materiales Bloque 1 encontrados: ${bloque1Materials.length}`);
    bloque1Materials.forEach(material => {
      console.log(`   - ID: ${material.id}`);
      console.log(`     Título: ${material.titulo}`);
      console.log(`     URL: ${material.url_archivo}`);
    });
    
    // Verificar si hay duplicados (debería haber solo uno ahora)
    if (bloque1Materials.length > 1) {
      console.log('⚠️ Aún hay duplicados de Bloque 1');
      // Mantener solo el que tiene la URL correcta (con espacios)
      const correctBloque1 = bloque1Materials.find(m => 
        m.url_archivo.includes('BLOQUE 1 TECNICO EN ADICIONES')
      );
      
      const incorrectBloque1 = bloque1Materials.find(m => 
        m.url_archivo.includes('BLOQUE-1-TECNICO-EN-ADICCIONES') && 
        m.id !== correctBloque1?.id
      );
      
      if (incorrectBloque1) {
        console.log(`🗑️ Eliminando Bloque 1 con URL incorrecta: ${incorrectBloque1.id}`);
        const { error: deleteError } = await supabase
          .from('materiales')
          .delete()
          .eq('id', incorrectBloque1.id);
        
        if (deleteError) {
          console.error('❌ Error eliminando material:', deleteError);
        } else {
          console.log('✅ Material eliminado exitosamente');
        }
      }
    } else {
      console.log('✅ No hay duplicados de Bloque 1');
    }
    
    // 3. Verificación final
    console.log('\n📊 Verificación final de materiales...');
    const { data: finalMaterials, error: finalError } = await supabase
      .from('materiales')
      .select('id, titulo, url_archivo')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('titulo');
    
    if (finalError) {
      console.error('❌ Error en verificación final:', finalError);
    } else {
      console.log(`✅ Total de materiales finales: ${finalMaterials.length}`);
      console.log('\n📋 Lista final:');
      finalMaterials.forEach((material, index) => {
        console.log(`${index + 1}. ${material.titulo}`);
        console.log(`   URL: ${material.url_archivo}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

cleanDuplicates();