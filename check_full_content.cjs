const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFullContent() {
  try {
    console.log('🔍 Verificando contenido completo de una lección específica...');
    
    const courseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';
    
    // Obtener la primera lección para análisis detallado
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseId)
      .eq('orden', 1)
      .limit(1);
    
    if (error) {
      console.error('❌ Error al obtener lección:', error);
      return;
    }
    
    if (!lessons || lessons.length === 0) {
      console.log('❌ No se encontró la lección');
      return;
    }
    
    const lesson = lessons[0];
    
    console.log('📚 Análisis detallado de la lección:');
    console.log(`  🆔 ID: ${lesson.id}`);
    console.log(`  📖 Título: ${lesson.titulo}`);
    console.log(`  🔢 Orden: ${lesson.orden}`);
    console.log(`  📝 Descripción (${lesson.descripcion?.length || 0} chars):`);
    console.log(`     "${lesson.descripcion}"`);
    console.log(`\n  🌐 Contenido HTML (${lesson.contenido_html?.length || 0} chars):`);
    
    // Mostrar el contenido HTML completo
    if (lesson.contenido_html) {
      console.log('--- INICIO DEL CONTENIDO HTML ---');
      console.log(lesson.contenido_html);
      console.log('--- FIN DEL CONTENIDO HTML ---');
      
      // Verificar si realmente termina abruptamente
      const content = lesson.contenido_html;
      const lastChars = content.slice(-50);
      console.log(`\n🔚 Últimos 50 caracteres: "${lastChars}"`);
      
      // Verificar si el HTML está bien formado
      const openTags = (content.match(/<[^/][^>]*>/g) || []).length;
      const closeTags = (content.match(/<\/[^>]*>/g) || []).length;
      console.log(`\n🏷️  Análisis de tags HTML:`);
      console.log(`   📂 Tags de apertura: ${openTags}`);
      console.log(`   📁 Tags de cierre: ${closeTags}`);
      console.log(`   ⚖️  Balance: ${openTags === closeTags ? '✅ Balanceado' : '❌ Desbalanceado'}`);
      
      // Buscar patrones de truncamiento
      if (content.includes('...')) {
        console.log('\n⚠️  Patrones de truncamiento encontrados:');
        const ellipsisMatches = content.match(/[^.]\.{3}[^.]/g) || [];
        ellipsisMatches.forEach((match, index) => {
          console.log(`   ${index + 1}. "${match}"`);
        });
      }
      
    } else {
      console.log('❌ No hay contenido HTML');
    }
    
    // Verificar otros campos
    console.log(`\n📊 Otros campos:`);
    console.log(`  🎯 Objetivos: ${lesson.objetivos || 'N/A'}`);
    console.log(`  ⏱️  Duración: ${lesson.duracion_estimada || 'N/A'}`);
    console.log(`  📅 Creado: ${lesson.creado_en}`);
    console.log(`  🔄 Actualizado: ${lesson.actualizado_en}`);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkFullContent();