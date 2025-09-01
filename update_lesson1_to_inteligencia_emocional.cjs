const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateLesson1ToInteligenciaEmocional() {
  try {
    console.log('🔄 Actualizando la primera lección del máster para usar leccion-1-introduccion-inteligencia-emocional.html...');
    
    // Buscar la primera lección del máster (orden 1) - usando 'orden' en lugar de 'numero_orden'
    const { data: lessons, error: fetchError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .eq('orden', 1);
    
    if (fetchError) {
      console.error('❌ Error al buscar la lección:', fetchError);
      return;
    }
    
    if (!lessons || lessons.length === 0) {
      console.error('❌ No se encontró la lección con orden 1');
      return;
    }
    
    const lesson = lessons[0];
    console.log('📋 Lección encontrada:', {
      id: lesson.id,
      titulo: lesson.titulo,
      archivo_url_actual: lesson.archivo_url
    });
    
    // Actualizar el archivo_url para apuntar al archivo de inteligencia emocional
    const { data: updateData, error: updateError } = await supabase
      .from('lecciones')
      .update({
        archivo_url: '/lessons/leccion-1-introduccion-inteligencia-emocional.html'
      })
      .eq('id', lesson.id)
      .select();
    
    if (updateError) {
      console.error('❌ Error al actualizar la lección:', updateError);
      return;
    }
    
    console.log('✅ Lección actualizada exitosamente:');
    console.log('📄 Nuevo archivo_url:', updateData[0].archivo_url);
    
    // Verificar que el archivo existe
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'public', 'lessons', 'leccion-1-introduccion-inteligencia-emocional.html');
    
    if (fs.existsSync(filePath)) {
      console.log('✅ El archivo HTML existe en:', filePath);
      
      // Mostrar una vista previa del contenido
      const content = fs.readFileSync(filePath, 'utf8');
      const titleMatch = content.match(/<title>(.*?)<\/title>/i);
      const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
      
      console.log('📖 Vista previa del contenido:');
      if (titleMatch) console.log('   Título:', titleMatch[1]);
      if (h1Match) console.log('   H1:', h1Match[1]);
      console.log('   Tamaño del archivo:', Math.round(content.length / 1024), 'KB');
    } else {
      console.error('❌ El archivo HTML no existe en:', filePath);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

updateLesson1ToInteligenciaEmocional();