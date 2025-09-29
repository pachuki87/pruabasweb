require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCourseButton() {
  try {
    console.log('🔍 Testing course button navigation...');
    
    // ID del Master en Adicciones
    const courseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
    
    // Obtener información del curso
    const { data: courseData, error: courseError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('id', courseId)
      .single();
    
    if (courseError) {
      console.error('❌ Error fetching course:', courseError);
      return;
    }
    
    console.log('✅ Course found:', courseData.titulo);
    
    // Obtener la primera lección del curso
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', courseId)
      .order('orden', { ascending: true })
      .limit(1);
    
    if (lessonsError) {
      console.error('❌ Error fetching lessons:', lessonsError);
      return;
    }
    
    if (!lessonsData || lessonsData.length === 0) {
      console.log('❌ No lessons found for this course');
      return;
    }
    
    const firstLesson = lessonsData[0];
    console.log('✅ First lesson found:', firstLesson.titulo, '(ID:', firstLesson.id + ')');
    
    // Verificar que la lección tiene materiales
    const { data: materialsData, error: materialsError } = await supabase
      .from('materiales')
      .select('id, titulo, url_archivo')
      .eq('leccion_id', firstLesson.id);
    
    if (materialsError) {
      console.error('❌ Error fetching materials:', materialsError);
      return;
    }
    
    console.log('📚 Materials for first lesson:', materialsData?.length || 0);
    if (materialsData && materialsData.length > 0) {
      materialsData.forEach(material => {
        console.log('  - ' + material.titulo);
      });
    }
    
    // Simular la URL que debería generar el botón "Comenzar Curso"
    const expectedUrl = `/student/courses/${courseId}/lessons/${firstLesson.id}`;
    console.log('🎯 Expected navigation URL:', expectedUrl);
    
    console.log('\n✅ Test completed successfully!');
    console.log('📝 The "Comenzar Curso" button should navigate to:', expectedUrl);
    console.log('📄 This should show the lesson content with materials, NOT redirect to PDF');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testCourseButton();