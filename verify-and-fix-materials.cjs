const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAndFixMaterials() {
  try {
    console.log('🔍 Verificando estado actual de la lección TRABAJO FINAL DE MÁSTER...');
    
    // Buscar la lección
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .ilike('titulo', '%TRABAJO FINAL DE MÁSTER%');
    
    if (lessonsError) {
      console.error('❌ Error al buscar lecciones:', lessonsError);
      return;
    }
    
    if (!lessons || lessons.length === 0) {
      console.log('❌ No se encontró la lección');
      return;
    }
    
    const lesson = lessons[0];
    console.log(`✅ Lección encontrada: "${lesson.titulo}" (ID: ${lesson.id})`);
    
    // Verificar materiales actuales
    const { data: currentMaterials, error: materialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lesson.id);
    
    if (materialsError) {
      console.error('❌ Error al buscar materiales:', materialsError);
      return;
    }
    
    console.log(`\n📄 Materiales actuales: ${currentMaterials.length}`);
    if (currentMaterials.length > 0) {
      currentMaterials.forEach(material => {
        console.log(`- "${material.titulo}" (ID: ${material.id})`);
      });
    } else {
      console.log('⚠️ No hay materiales. Necesitamos crear el material correcto.');
    }
    
    // Si no hay materiales, crear el material correcto
    if (currentMaterials.length === 0) {
      console.log('\n🔧 Creando el material "Guía Práctica TFM"...');
      
      const { data: newMaterial, error: createError } = await supabase
        .from('materiales')
        .insert({
          leccion_id: lesson.id,
          titulo: 'GUIA PRACTICA TFM',
          tipo: 'pdf',
          url: '/pdfs/master-adicciones/GUIA PRACTICA TFM.pages',
          descripcion: 'Guía práctica para el desarrollo del Trabajo Final de Máster'
        })
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Error al crear material:', createError);
        return;
      }
      
      console.log(`✅ Material creado: "${newMaterial.titulo}" (ID: ${newMaterial.id})`);
    }
    
    // Verificar estado final
    console.log('\n🔍 Verificando estado final...');
    const { data: finalMaterials, error: finalError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lesson.id);
    
    if (finalError) {
      console.error('❌ Error al verificar estado final:', finalError);
      return;
    }
    
    console.log(`\n✅ Estado final - Materiales: ${finalMaterials.length}`);
    finalMaterials.forEach(material => {
      console.log(`- "${material.titulo}" (ID: ${material.id})`);
      console.log(`  URL: ${material.url}`);
      console.log(`  Tipo: ${material.tipo}`);
    });
    
    if (finalMaterials.length === 1) {
      console.log('\n🎉 ¡PERFECTO! Solo hay un material como se requería.');
    } else {
      console.log('\n⚠️ Hay más de un material. Revisar si es necesario.');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la función
verifyAndFixMaterials().then(() => {
  console.log('\n🏁 Verificación y corrección completada');
}).catch(error => {
  console.error('❌ Error en la ejecución:', error);
});