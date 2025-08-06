const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  console.log('Asegúrate de que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén configuradas en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const courseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';

async function verifyLessons() {
  console.log('🔍 Verificando lecciones del curso "Experto en Conductas Adictivas"...');
  console.log(`📋 ID del curso: ${courseId}`);
  console.log('\n' + '='.repeat(60));

  try {
    // Verificar conexión a Supabase
    console.log('🔗 Verificando conexión a Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('cursos')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error de conexión a Supabase:', testError.message);
      return;
    }
    console.log('✅ Conexión a Supabase exitosa');

    // Verificar si el curso existe
    console.log('\n📚 Verificando si el curso existe...');
    const { data: courseData, error: courseError } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError) {
      console.error('❌ Error al buscar el curso:', courseError.message);
      return;
    }

    if (!courseData) {
      console.error('❌ Curso no encontrado con ID:', courseId);
      return;
    }

    console.log('✅ Curso encontrado:');
    console.log(`   📖 Título: ${courseData.titulo}`);
    console.log(`   👨‍🏫 Profesor: ${courseData.profesor_nombre}`);
    console.log(`   📅 Creado: ${new Date(courseData.created_at).toLocaleDateString('es-ES')}`);

    // Buscar lecciones del curso
    console.log('\n📝 Buscando lecciones del curso...');
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseId)
      .order('orden', { ascending: true });

    if (lessonsError) {
      console.error('❌ Error al buscar lecciones:', lessonsError.message);
      return;
    }

    console.log(`\n📊 Resultado: ${lessonsData?.length || 0} lecciones encontradas`);

    if (!lessonsData || lessonsData.length === 0) {
      console.log('\n⚠️  No se encontraron lecciones para este curso.');
      console.log('\n🔧 Posibles soluciones:');
      console.log('   1. Ejecutar el script insert_lessons.cjs para insertar las lecciones');
      console.log('   2. Verificar que el ID del curso sea correcto');
      console.log('   3. Revisar los permisos de la tabla lecciones');
    } else {
      console.log('\n📋 Lista de lecciones:');
      lessonsData.forEach((lesson, index) => {
        console.log(`   ${lesson.orden || index + 1}. ${lesson.titulo}`);
        if (lesson.descripcion) {
          console.log(`      📄 ${lesson.descripcion.substring(0, 100)}${lesson.descripcion.length > 100 ? '...' : ''}`);
        }
      });
    }

    // Verificar materiales también
    console.log('\n📎 Verificando materiales del curso...');
    const { data: materialsData, error: materialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('curso_id', courseId);

    if (materialsError) {
      console.error('❌ Error al buscar materiales:', materialsError.message);
    } else {
      console.log(`📊 ${materialsData?.length || 0} materiales encontrados`);
      if (materialsData && materialsData.length > 0) {
        materialsData.forEach((material, index) => {
          console.log(`   ${index + 1}. ${material.titulo || material.nombre || 'Sin título'}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Verificación completada');
}

// Ejecutar la verificación
verifyLessons().catch(console.error);