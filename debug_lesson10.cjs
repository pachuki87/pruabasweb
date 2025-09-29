const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugLesson10() {
  const courseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
  
  console.log('🔍 Debugging Lesson 10 for course:', courseId);
  console.log('='.repeat(50));
  
  try {
    // 1. Obtener todas las lecciones del curso
    console.log('📚 Fetching all lessons...');
    const { data: allLessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseId)
      .order('orden');
    
    if (lessonsError) {
      console.error('❌ Error fetching lessons:', lessonsError);
      return;
    }
    
    console.log(`✅ Found ${allLessons.length} lessons total`);
    
    // 2. Buscar lección 10 específicamente
    const lesson10 = allLessons.find(lesson => lesson.orden === 10);
    
    if (!lesson10) {
      console.log('❌ No lesson found with orden = 10');
      console.log('📋 Available lessons by orden:');
      allLessons.forEach(lesson => {
        console.log(`   - Orden ${lesson.orden}: ${lesson.titulo} (ID: ${lesson.id})`);
      });
      return;
    }
    
    console.log('✅ Found Lesson 10:');
    console.log(`   - ID: ${lesson10.id}`);
    console.log(`   - Título: ${lesson10.titulo}`);
    console.log(`   - Orden: ${lesson10.orden}`);
    console.log(`   - Archivo URL: ${lesson10.archivo_url || 'N/A'}`);
    
    // 3. Buscar materiales para la lección 10
    console.log('\n📄 Fetching materials for lesson 10...');
    const { data: materials, error: materialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lesson10.id);
    
    if (materialsError) {
      console.error('❌ Error fetching materials:', materialsError);
      return;
    }
    
    console.log(`✅ Found ${materials.length} materials for lesson 10:`);
    materials.forEach(material => {
      console.log(`   - ${material.titulo}`);
      console.log(`     URL: ${material.url_archivo}`);
      console.log(`     Tipo: ${material.tipo_material || 'N/A'}`);
      console.log(`     ID: ${material.id}`);
      console.log('');
    });
    
    // 4. Verificar materiales del curso en general
    console.log('📋 Checking all course materials...');
    const { data: allMaterials, error: allMaterialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('curso_id', courseId);
    
    if (allMaterialsError) {
      console.error('❌ Error fetching all materials:', allMaterialsError);
      return;
    }
    
    console.log(`✅ Found ${allMaterials.length} total materials for course`);
    
    // Agrupar materiales por lección
    const materialsByLesson = {};
    allMaterials.forEach(material => {
      const lessonId = material.leccion_id || 'sin_leccion';
      if (!materialsByLesson[lessonId]) {
        materialsByLesson[lessonId] = [];
      }
      materialsByLesson[lessonId].push(material);
    });
    
    console.log('\n📊 Materials distribution by lesson:');
    Object.keys(materialsByLesson).forEach(lessonId => {
      const lesson = allLessons.find(l => l.id === lessonId);
      const lessonTitle = lesson ? `${lesson.titulo} (Orden: ${lesson.orden})` : 'Sin lección asignada';
      console.log(`   - ${lessonId}: ${materialsByLesson[lessonId].length} materials - ${lessonTitle}`);
    });
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

debugLesson10();