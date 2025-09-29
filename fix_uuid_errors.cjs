require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeUUIDErrors() {
  console.log('🔍 Analizando errores de UUID...');
  
  try {
    // 1. Verificar mapeo de cursos
    console.log('\n📋 Verificando mapeo de cursos:');
    const courseMapping = {
      'master-adicciones': 'b5ef8c64-fe26-4f20-8221-80a1bf475b05',
      'experto-conductas-adictivas': 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836'
    };
    
    for (const [slug, uuid] of Object.entries(courseMapping)) {
      console.log(`  ${slug} -> ${uuid}`);
      
      // Verificar que el curso existe
      const { data: course, error: courseError } = await supabase
        .from('cursos')
        .select('id, titulo')
        .eq('id', uuid)
        .single();
        
      if (courseError) {
        console.error(`  ❌ Error verificando curso ${slug}:`, courseError.message);
      } else {
        console.log(`  ✅ Curso ${slug} existe: ${course.titulo}`);
      }
    }
    
    // 2. Verificar lecciones y sus UUIDs
    console.log('\n📚 Verificando lecciones:');
    for (const [slug, courseId] of Object.entries(courseMapping)) {
      const { data: lessons, error: lessonsError } = await supabase
        .from('lecciones')
        .select('id, titulo, orden')
        .eq('curso_id', courseId)
        .order('orden');
        
      if (lessonsError) {
        console.error(`  ❌ Error cargando lecciones de ${slug}:`, lessonsError.message);
      } else {
        console.log(`  ✅ ${slug}: ${lessons.length} lecciones encontradas`);
        lessons.forEach((lesson, index) => {
          if (index < 3) { // Mostrar solo las primeras 3
            console.log(`    - ${lesson.orden}: ${lesson.titulo} (${lesson.id})`);
          }
        });
      }
    }
    
    // 3. Verificar problemas comunes de UUID
    console.log('\n🔍 Verificando problemas comunes de UUID:');
    
    // Verificar registros con UUIDs nulos o inválidos en user_course_progress
    const { data: invalidProgress, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .or('user_id.is.null,course_id.is.null')
      .limit(5);
      
    if (progressError) {
      console.log('  ⚠️ No se pudo verificar user_course_progress (puede no existir)');
    } else {
      console.log(`  📊 Registros con UUIDs nulos en user_course_progress: ${invalidProgress.length}`);
    }
    
    // 4. Simular los errores más comunes
    console.log('\n🧪 Simulando escenarios de error:');
    
    // Escenario 1: courseId undefined
    console.log('  🔸 Escenario 1: courseId undefined');
    try {
      const undefinedCourseId = undefined;
      const { data, error } = await supabase
        .from('lecciones')
        .select('*')
        .eq('curso_id', undefinedCourseId)
        .limit(1);
        
      if (error) {
        console.log(`    ❌ Error esperado: ${error.message}`);
      }
    } catch (e) {
      console.log(`    ❌ Error capturado: ${e.message}`);
    }
    
    // Escenario 2: lessonId undefined
    console.log('  🔸 Escenario 2: lessonId undefined');
    try {
      const undefinedLessonId = undefined;
      const { data, error } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('leccion_id', undefinedLessonId)
        .limit(1);
        
      if (error) {
        console.log(`    ❌ Error esperado: ${error.message}`);
      }
    } catch (e) {
      console.log(`    ❌ Error capturado: ${e.message}`);
    }
    
    // 5. Verificar autenticación
    console.log('\n👤 Verificando estado de autenticación:');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('  ❌ Error de autenticación:', authError.message);
    } else if (!user) {
      console.log('  ⚠️ Usuario no autenticado');
    } else {
      console.log(`  ✅ Usuario autenticado: ${user.id}`);
    }
    
    // 6. Recomendaciones
    console.log('\n💡 Recomendaciones para solucionar errores UUID:');
    console.log('  1. Verificar que courseId no sea undefined antes de hacer queries');
    console.log('  2. Validar lessonId antes de usarlo en user_course_progress');
    console.log('  3. Asegurar que el usuario esté autenticado');
    console.log('  4. Usar valores por defecto o validaciones en el frontend');
    console.log('  5. Implementar mejor manejo de errores en useProgress hook');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

analyzeUUIDErrors();