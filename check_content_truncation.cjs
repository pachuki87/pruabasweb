const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkContentTruncation() {
  try {
    console.log('🔍 Verificando contenido truncado en las lecciones...');
    
    const courseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';
    
    // Obtener todas las lecciones restantes del curso
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('id, titulo, orden, contenido_html, descripcion')
      .eq('curso_id', courseId)
      .order('orden', { ascending: true });
    
    if (error) {
      console.error('❌ Error al obtener lecciones:', error);
      return;
    }
    
    console.log(`📚 Analizando ${lessons.length} lecciones...\n`);
    
    let truncatedCount = 0;
    let emptyCount = 0;
    
    lessons.forEach((lesson, index) => {
      console.log(`${index + 1}. [Orden: ${lesson.orden}] ${lesson.titulo}`);
      
      // Verificar contenido HTML
      const htmlContent = lesson.contenido_html || '';
      const description = lesson.descripcion || '';
      
      console.log(`   📝 Descripción: ${description.length} caracteres`);
      console.log(`   🌐 Contenido HTML: ${htmlContent.length} caracteres`);
      
      // Verificar si está vacío
      if (!htmlContent.trim() && !description.trim()) {
        console.log('   ⚠️  CONTENIDO VACÍO');
        emptyCount++;
      }
      // Verificar si termina con puntos suspensivos
      else if (htmlContent.includes('...') || description.includes('...')) {
        console.log('   ⚠️  POSIBLE TRUNCAMIENTO (contiene "...")');        
        truncatedCount++;
        
        // Mostrar los últimos 100 caracteres para análisis
        const lastChars = htmlContent.slice(-100) || description.slice(-100);
        console.log(`   🔚 Últimos caracteres: "${lastChars}"`);
      }
      // Verificar si el contenido es muy corto (menos de 50 caracteres)
      else if (htmlContent.length < 50 && description.length < 50) {
        console.log('   ⚠️  CONTENIDO MUY CORTO');
        console.log(`   📄 Contenido completo: "${htmlContent || description}"`);
      }
      else {
        console.log('   ✅ Contenido parece completo');
      }
      
      console.log(''); // Línea en blanco para separar
    });
    
    console.log('\n📊 Resumen del análisis:');
    console.log(`  📚 Total de lecciones: ${lessons.length}`);
    console.log(`  ⚠️  Lecciones con posible truncamiento: ${truncatedCount}`);
    console.log(`  🚫 Lecciones vacías: ${emptyCount}`);
    console.log(`  ✅ Lecciones aparentemente completas: ${lessons.length - truncatedCount - emptyCount}`);
    
    if (truncatedCount > 0 || emptyCount > 0) {
      console.log('\n🔧 Se requiere revisión manual del contenido.');
    } else {
      console.log('\n🎉 Todas las lecciones parecen tener contenido completo.');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkContentTruncation();