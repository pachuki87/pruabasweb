const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixLesson10Materials() {
  const courseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
  const lesson10Id = '3df75902-4d3e-4141-b564-e85c06603365';
  
  console.log('🔧 Fixing Lesson 10 materials assignment...');
  console.log('='.repeat(50));
  
  try {
    // 1. Obtener materiales sin lección asignada
    console.log('📄 Fetching materials without lesson assignment...');
    const { data: unassignedMaterials, error: materialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('curso_id', courseId)
      .is('leccion_id', null);
    
    if (materialsError) {
      console.error('❌ Error fetching unassigned materials:', materialsError);
      return;
    }
    
    console.log(`✅ Found ${unassignedMaterials.length} unassigned materials:`);
    unassignedMaterials.forEach((material, index) => {
      console.log(`   ${index + 1}. ${material.titulo}`);
      console.log(`      URL: ${material.url_archivo}`);
      console.log(`      ID: ${material.id}`);
      console.log('');
    });
    
    // 2. Filtrar materiales que parecen pertenecer a la lección 10 (TFM)
    const tfmKeywords = ['tfm', 'trabajo final', 'master', 'guia', 'practica'];
    const lesson10Materials = unassignedMaterials.filter(material => {
      const title = material.titulo.toLowerCase();
      const url = material.url_archivo.toLowerCase();
      return tfmKeywords.some(keyword => 
        title.includes(keyword) || url.includes(keyword)
      );
    });
    
    console.log(`🎯 Found ${lesson10Materials.length} materials that seem to belong to Lesson 10:`);
    lesson10Materials.forEach((material, index) => {
      console.log(`   ${index + 1}. ${material.titulo}`);
    });
    
    if (lesson10Materials.length === 0) {
      console.log('⚠️ No materials found that clearly belong to Lesson 10');
      console.log('📋 All unassigned materials will be assigned to Lesson 10');
      lesson10Materials.push(...unassignedMaterials);
    }
    
    // 3. Asignar materiales a la lección 10
    if (lesson10Materials.length > 0) {
      console.log('\n🔄 Assigning materials to Lesson 10...');
      
      for (const material of lesson10Materials) {
        const { error: updateError } = await supabase
          .from('materiales')
          .update({ leccion_id: lesson10Id })
          .eq('id', material.id);
        
        if (updateError) {
          console.error(`❌ Error updating material ${material.titulo}:`, updateError);
        } else {
          console.log(`✅ Assigned "${material.titulo}" to Lesson 10`);
        }
      }
      
      console.log('\n🎉 Materials assignment completed!');
    } else {
      console.log('⚠️ No materials to assign');
    }
    
    // 4. Verificar el resultado
    console.log('\n🔍 Verifying assignment...');
    const { data: lesson10Materials_check, error: checkError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lesson10Id);
    
    if (checkError) {
      console.error('❌ Error checking lesson 10 materials:', checkError);
    } else {
      console.log(`✅ Lesson 10 now has ${lesson10Materials_check.length} materials:`);
      lesson10Materials_check.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.titulo}`);
      });
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

fixLesson10Materials();