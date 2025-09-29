require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson2Materials() {
  try {
    console.log('🔍 Buscando todas las lecciones del Master en Adicciones...');
    
    // Primero buscar el curso Master en Adicciones
    const { data: courses, error: coursesError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .ilike('titulo', '%master%adicciones%');
    
    if (coursesError) {
      console.error('❌ Error al buscar cursos:', coursesError);
      return;
    }
    
    if (!courses || courses.length === 0) {
      console.log('❌ No se encontró el curso Master en Adicciones');
      return;
    }
    
    const masterCourse = courses[0];
    console.log(`✅ Curso encontrado: ${masterCourse.titulo} (ID: ${masterCourse.id})`);
    
    // Buscar todas las lecciones del curso
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', masterCourse.id)
      .order('orden');
    
    if (lessonsError) {
      console.error('❌ Error al buscar lecciones:', lessonsError);
      return;
    }
    
    console.log(`\n📚 Lecciones encontradas: ${lessons.length}`);
    lessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.titulo} (ID: ${lesson.id}, Orden: ${lesson.orden})`);
    });
    
    // Buscar la lección 2 (orden 2 o que contenga "terapia cognitiva")
    const lesson2 = lessons.find(l => l.orden === 2) || 
                   lessons.find(l => l.titulo.toLowerCase().includes('terapia cognitiva')) ||
                   lessons.find(l => l.titulo.toLowerCase().includes('drogodependencias'));
    
    if (!lesson2) {
      console.log('❌ No se encontró la lección 2');
      return;
    }
    
    console.log(`\n🎯 Analizando lección 2: ${lesson2.titulo} (ID: ${lesson2.id})`);
    
    // Buscar todos los materiales de esta lección
    const { data: materials, error: materialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lesson2.id)
      .order('titulo');
    
    if (materialsError) {
      console.error('❌ Error al buscar materiales:', materialsError);
      return;
    }
    
    console.log(`\n📚 Materiales encontrados: ${materials.length}`);
    
    materials.forEach((material, index) => {
      console.log(`\n${index + 1}. Material ID: ${material.id}`);
      console.log(`   Título: ${material.titulo}`);
      console.log(`   URL: ${material.url_archivo}`);
      console.log(`   Tipo: ${material.tipo_material || 'No especificado'}`);
      console.log(`   Creado: ${material.creado_en}`);
    });
    
    // Identificar duplicados por título similar
    const titleGroups = {};
    materials.forEach(material => {
      const normalizedTitle = material.titulo.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!titleGroups[normalizedTitle]) {
        titleGroups[normalizedTitle] = [];
      }
      titleGroups[normalizedTitle].push(material);
    });
    
    console.log('\n🔍 Análisis de duplicados:');
    let hasDuplicates = false;
    Object.entries(titleGroups).forEach(([normalizedTitle, group]) => {
      if (group.length > 1) {
        hasDuplicates = true;
        console.log(`\n⚠️  Duplicados encontrados (${group.length} materiales):`);
        group.forEach((material, index) => {
          console.log(`   ${index + 1}. ID: ${material.id}, Título: "${material.titulo}", URL: ${material.url_archivo}`);
        });
      }
    });
    
    if (!hasDuplicates) {
      console.log('✅ No se encontraron duplicados evidentes por título');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkLesson2Materials();