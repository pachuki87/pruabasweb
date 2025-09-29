require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno faltantes');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Presente' : '❌ Faltante');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Presente' : '❌ Faltante');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCourseLoading() {
  console.log('🔍 Probando carga de cursos...');
  
  // Test 1: Verificar conexión a Supabase
  try {
    const { data, error } = await supabase.from('cursos').select('count').limit(1);
    if (error) {
      console.error('❌ Error de conexión a Supabase:', error.message);
      return;
    }
    console.log('✅ Conexión a Supabase exitosa');
  } catch (err) {
    console.error('❌ Error de red:', err.message);
    return;
  }
  
  // Test 2: Cargar curso específico
  const courseIds = {
    'master': 'b5ef8c64-fe26-4f20-8221-80a1bf475b05',
    'experto': 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836'
  };
  
  for (const [name, courseId] of Object.entries(courseIds)) {
    console.log(`\n🔍 Probando curso ${name} (${courseId})...`);
    
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('cursos')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (courseError) {
        console.error(`❌ Error cargando curso ${name}:`, courseError.message);
        continue;
      }
      
      if (!courseData) {
        console.error(`❌ Curso ${name} no encontrado`);
        continue;
      }
      
      console.log(`✅ Curso ${name} cargado:`, courseData.titulo);
      
      // Test 3: Cargar lecciones del curso
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lecciones')
        .select('*')
        .eq('curso_id', courseId)
        .order('orden');
      
      if (lessonsError) {
        console.error(`❌ Error cargando lecciones de ${name}:`, lessonsError.message);
        continue;
      }
      
      console.log(`✅ ${lessonsData?.length || 0} lecciones encontradas para ${name}`);
      
      // Test 4: Probar primera lección
      if (lessonsData && lessonsData.length > 0) {
        const firstLesson = lessonsData[0];
        console.log(`📖 Primera lección: ${firstLesson.titulo} (ID: ${firstLesson.id})`);
        
        // Test 5: Verificar materiales de la primera lección
        const { data: materialsData, error: materialsError } = await supabase
          .from('materiales')
          .select('*')
          .eq('leccion_id', firstLesson.id);
        
        if (materialsError) {
          console.error(`❌ Error cargando materiales:`, materialsError.message);
        } else {
          console.log(`📚 ${materialsData?.length || 0} materiales encontrados`);
        }
      }
      
    } catch (err) {
      console.error(`❌ Error inesperado con curso ${name}:`, err.message);
    }
  }
  
  console.log('\n🏁 Prueba completada');
}

testCourseLoading().catch(console.error);