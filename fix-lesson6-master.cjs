const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixLesson6Master() {
  try {
    console.log('🔧 Solucionando lección 6 del Master en Adicciones...');
    
    // Leer el contenido HTML del archivo
    const htmlFilePath = path.join(__dirname, 'public', 'lessons', 'leccion-6-intervencion-familiar-y-recovery-mentoring.html');
    
    if (!fs.existsSync(htmlFilePath)) {
      console.error('❌ No se encontró el archivo HTML:', htmlFilePath);
      return;
    }
    
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    console.log('📄 Contenido HTML leído:', htmlContent.length, 'caracteres');
    
    // Buscar el curso Master en Adicciones
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .ilike('titulo', '%máster%adicciones%');
    
    if (cursosError) {
      console.error('❌ Error al buscar cursos:', cursosError);
      return;
    }
    
    if (!cursos || cursos.length === 0) {
      console.log('⚠️ No se encontró el curso Master en Adicciones');
      return;
    }
    
    const cursoId = cursos[0].id;
    console.log('🎯 ID del curso Master:', cursoId);
    
    // Actualizar la lección 6
    const { data: updateResult, error: updateError } = await supabase
      .from('lecciones')
      .update({
        contenido_html: htmlContent,
        archivo_url: '/lessons/leccion-6-intervencion-familiar-y-recovery-mentoring.html',
        titulo: 'INTERVENCIÓN FAMILIAR Y RECOVERY MENTORING',
        descripcion: 'Estrategias de intervención familiar y mentoring en procesos de recuperación de adicciones',
        actualizado_en: new Date().toISOString()
      })
      .eq('curso_id', cursoId)
      .eq('orden', 6)
      .select();
    
    if (updateError) {
      console.error('❌ Error al actualizar la lección:', updateError);
      return;
    }
    
    console.log('✅ Lección 6 actualizada exitosamente!');
    console.log('📊 Resultado:', updateResult);
    
    // Verificar la actualización
    const { data: verificacion, error: verError } = await supabase
      .from('lecciones')
      .select('titulo, descripcion, contenido_html, archivo_url')
      .eq('curso_id', cursoId)
      .eq('orden', 6)
      .single();
    
    if (verError) {
      console.error('❌ Error al verificar:', verError);
      return;
    }
    
    console.log('🔍 Verificación:');
    console.log('  📝 Título:', verificacion.titulo);
    console.log('  📄 Descripción:', verificacion.descripcion);
    console.log('  📋 Contenido HTML:', verificacion.contenido_html ? 'SÍ (presente)' : 'NO (vacío)');
    console.log('  🔗 Archivo URL:', verificacion.archivo_url);
    
    if (verificacion.contenido_html) {
      console.log('  📏 Longitud del contenido:', verificacion.contenido_html.length, 'caracteres');
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

fixLesson6Master();