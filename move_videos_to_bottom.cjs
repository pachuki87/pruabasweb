require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function moveVideosToBottom() {
  try {
    console.log('🚀 Iniciando el proceso de mover videos de YouTube...');

    const masterCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('id, titulo, descripcion')
      .eq('curso_id', masterCourseId);

    if (lessonsError) {
      console.error('❌ Error al obtener las lecciones:', lessonsError);
      return;
    }

    for (const lesson of lessons) {
      if (!lesson.descripcion || !lesson.descripcion.toLowerCase().startsWith('<!doctype html>')) {
        console.log(`- Lección "${lesson.titulo}" no tiene contenido HTML en la descripción, omitiendo.`);
        continue;
      }

      const youtubeIframeRegex = /<iframe[^>]+src="https:\/\/www\.youtube\.com\/embed\/[^"]+"[^>]*><\/iframe>/g;
      const matches = lesson.descripcion.match(youtubeIframeRegex);

      if (matches) {
        console.log(`📹 Encontrados ${matches.length} video(s) en la lección "${lesson.titulo}".`);

        // Eliminar los iframes de su posición original
        const contentWithoutVideos = lesson.descripcion.replace(youtubeIframeRegex, '');

        // Añadir los iframes al final
        const newContent = contentWithoutVideos + matches.join('');

        const { error: updateError } = await supabase
          .from('lecciones')
          .update({ descripcion: newContent })
          .eq('id', lesson.id);

        if (updateError) {
          console.error(`❌ Error al actualizar la lección "${lesson.titulo}":`, updateError);
        } else {
          console.log(`✅ Lección "${lesson.titulo}" actualizada correctamente.`);
        }
      } else {
        console.log(`- No se encontraron videos en la lección "${lesson.titulo}".`);
      }
    }

    console.log('🎉 Proceso completado.');
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

moveVideosToBottom();