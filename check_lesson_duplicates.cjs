const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  console.log('Asegúrate de que VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY estén configuradas en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLessonDuplicates() {
  try {
    console.log('🔍 Verificando lecciones del curso "Experto en Conductas Adictivas"...');
    
    const courseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';
    
    // Obtener todas las lecciones del curso
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseId)
      .order('orden', { ascending: true });
    
    if (error) {
      console.error('❌ Error al obtener lecciones:', error);
      return;
    }
    
    console.log(`📚 Total de lecciones encontradas: ${lessons.length}`);
    
    // Verificar duplicados por título
    const titleCounts = {};
    const duplicates = [];
    
    lessons.forEach(lesson => {
      const title = lesson.titulo;
      if (titleCounts[title]) {
        titleCounts[title]++;
        duplicates.push(lesson);
      } else {
        titleCounts[title] = 1;
      }
    });
    
    console.log('\n📋 Análisis de duplicados:');
    if (duplicates.length > 0) {
      console.log(`❌ Se encontraron ${duplicates.length} lecciones duplicadas:`);
      duplicates.forEach(lesson => {
        console.log(`  - ID: ${lesson.id}, Título: "${lesson.titulo}", Orden: ${lesson.orden}`);
      });
    } else {
      console.log('✅ No se encontraron duplicados por título');
    }
    
    // Verificar duplicados por orden
    const orderCounts = {};
    const orderDuplicates = [];
    
    lessons.forEach(lesson => {
      const order = lesson.orden;
      if (orderCounts[order]) {
        orderCounts[order]++;
        orderDuplicates.push(lesson);
      } else {
        orderCounts[order] = 1;
      }
    });
    
    console.log('\n🔢 Análisis de orden duplicado:');
    if (orderDuplicates.length > 0) {
      console.log(`❌ Se encontraron ${orderDuplicates.length} lecciones con orden duplicado:`);
      orderDuplicates.forEach(lesson => {
        console.log(`  - ID: ${lesson.id}, Título: "${lesson.titulo}", Orden: ${lesson.orden}`);
      });
    } else {
      console.log('✅ No se encontraron duplicados por orden');
    }
    
    // Verificar contenido truncado
    console.log('\n📝 Análisis de contenido truncado:');
    const truncatedLessons = lessons.filter(lesson => {
      const content = lesson.contenido_html || '';
      return content.includes('...') || content.includes('EMOCI...') || content.length < 100;
    });
    
    if (truncatedLessons.length > 0) {
      console.log(`❌ Se encontraron ${truncatedLessons.length} lecciones con contenido posiblemente truncado:`);
      truncatedLessons.forEach(lesson => {
        const contentPreview = (lesson.contenido_html || '').substring(0, 100) + '...';
        console.log(`  - ID: ${lesson.id}`);
        console.log(`    Título: "${lesson.titulo}"`);
        console.log(`    Contenido (primeros 100 chars): ${contentPreview}`);
        console.log(`    Longitud total: ${(lesson.contenido_html || '').length} caracteres`);
        console.log('');
      });
    } else {
      console.log('✅ No se encontraron lecciones con contenido truncado');
    }
    
    // Mostrar resumen de todas las lecciones
    console.log('\n📚 Resumen de todas las lecciones:');
    lessons.forEach((lesson, index) => {
      console.log(`${index + 1}. [Orden: ${lesson.orden}] ${lesson.titulo}`);
      console.log(`   ID: ${lesson.id}`);
      console.log(`   Contenido: ${(lesson.contenido_html || '').length} caracteres`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkLessonDuplicates();