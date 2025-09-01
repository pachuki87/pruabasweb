const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mapeo de lecciones del máster a archivos de inteligencia emocional disponibles
const lessonMapping = {
  1: '/lessons/leccion-1-introduccion-inteligencia-emocional.html',
  2: '/lessons/leccion-2-autoconciencia-emocional.html',
  3: '/lessons/leccion-3-regulacion-emocional.html',
  4: '/lessons/leccion-4-empatia-habilidades-sociales.html',
  5: '/lessons/leccion-5-inteligencia-emocional-adicciones.html',
  6: '/lessons/leccion-6-plan-personal-inteligencia-emocional.html',
  7: '/lessons/leccion-7-aplicacion-practica-inteligencia-emocional.html'
};

async function updateAllMasterLessons() {
  try {
    console.log('🔄 Actualizando todas las lecciones del máster para usar archivos de inteligencia emocional...');
    
    // Obtener todas las lecciones del máster ordenadas
    const { data: lessons, error: fetchError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden', { ascending: true });
    
    if (fetchError) {
      console.error('❌ Error al buscar las lecciones:', fetchError);
      return;
    }
    
    if (!lessons || lessons.length === 0) {
      console.error('❌ No se encontraron lecciones del máster');
      return;
    }
    
    console.log(`📋 Encontradas ${lessons.length} lecciones del máster`);
    
    const fs = require('fs');
    const path = require('path');
    
    // Actualizar cada lección
    for (const lesson of lessons) {
      const newFileUrl = lessonMapping[lesson.orden];
      
      if (!newFileUrl) {
        console.log(`⚠️  No hay mapeo para la lección orden ${lesson.orden}`);
        continue;
      }
      
      console.log(`\n🔄 Actualizando lección ${lesson.orden}: ${lesson.titulo}`);
      console.log(`   Archivo anterior: ${lesson.archivo_url}`);
      console.log(`   Archivo nuevo: ${newFileUrl}`);
      
      // Verificar que el archivo existe
      const filePath = path.join(__dirname, 'public', newFileUrl.replace('/lessons/', 'lessons/'));
      if (!fs.existsSync(filePath)) {
        console.error(`❌ El archivo no existe: ${filePath}`);
        continue;
      }
      
      // Actualizar en la base de datos
      const { data: updateData, error: updateError } = await supabase
        .from('lecciones')
        .update({ archivo_url: newFileUrl })
        .eq('id', lesson.id)
        .select();
      
      if (updateError) {
        console.error(`❌ Error al actualizar lección ${lesson.orden}:`, updateError);
        continue;
      }
      
      // Mostrar vista previa del contenido
      const content = fs.readFileSync(filePath, 'utf8');
      const titleMatch = content.match(/<title>(.*?)<\/title>/i);
      const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
      
      console.log(`✅ Lección ${lesson.orden} actualizada exitosamente`);
      if (titleMatch) console.log(`   📖 Título del archivo: ${titleMatch[1]}`);
      if (h1Match) console.log(`   📝 H1: ${h1Match[1]}`);
      console.log(`   📊 Tamaño: ${Math.round(content.length / 1024)} KB`);
    }
    
    console.log('\n🎉 ¡Todas las lecciones han sido actualizadas exitosamente!');
    
    // Verificación final
    console.log('\n📋 Verificación final:');
    const { data: updatedLessons, error: verifyError } = await supabase
      .from('lecciones')
      .select('orden, titulo, archivo_url')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden', { ascending: true });
    
    if (verifyError) {
      console.error('❌ Error en verificación:', verifyError);
      return;
    }
    
    updatedLessons.forEach(lesson => {
      console.log(`   ${lesson.orden}. ${lesson.titulo} → ${lesson.archivo_url}`);
    });
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

updateAllMasterLessons();