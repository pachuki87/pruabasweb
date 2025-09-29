import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const CURSO_ID = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// Mapeo de títulos de lecciones a archivos HTML
const LESSON_HTML_MAP = {
  'INTELIGENCIA EMOCIONAL': 'lessons/leccion-1-introduccion-inteligencia-emocional.html',
  'TERAPIA COGNITIVA DROGODEPENDENENCIAS': 'lessons/leccion-2-autoconciencia-emocional.html',
  'NUEVOS MODELOS TERAPEUTICOS': 'lessons/leccion-3-regulacion-emocional.html',
  'RECOVERY COACHING': 'lessons/leccion-4-empatia-habilidades-sociales.html',
  'INTERVENCION FAMILIAR Y RECOVERY MENTORING': 'lessons/leccion-5-inteligencia-emocional-adicciones.html',
  'FAMILIA Y TRABAJO EQUIPO': 'lessons/leccion-6-plan-personal-inteligencia-emocional.html',
  'FUNDAMENTOS P TERAPEUTICO': 'lessons/leccion-7-aplicacion-practica-inteligencia-emocional.html'
};

async function updateLessonsWithHTML() {
  try {
    console.log('🔍 Consultando lecciones actuales del curso...');
    
    // Obtener todas las lecciones del curso ordenadas por orden
    const { data: lessons, error: fetchError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden, archivo_url')
      .eq('curso_id', CURSO_ID)
      .order('orden', { ascending: true });

    if (fetchError) {
      console.error('❌ Error al obtener lecciones:', fetchError);
      return;
    }

    console.log(`📚 Encontradas ${lessons.length} lecciones:`);
    lessons.forEach(lesson => {
      console.log(`  ${lesson.orden}) ${lesson.titulo} - Archivo actual: ${lesson.archivo_url || 'Sin archivo'}`);
    });

    console.log('\n🔄 Actualizando archivos HTML...');
    
    // Actualizar cada lección con su archivo HTML correspondiente
    for (const lesson of lessons) {
      const htmlFile = LESSON_HTML_MAP[lesson.titulo];
      
      if (htmlFile) {
        console.log(`  Actualizando "${lesson.titulo}" con archivo: ${htmlFile}`);
        
        const { error: updateError } = await supabase
          .from('lecciones')
          .update({ archivo_url: htmlFile })
          .eq('id', lesson.id);

        if (updateError) {
          console.error(`❌ Error al actualizar lección ${lesson.id}:`, updateError);
        } else {
          console.log(`✅ Actualizada: ${lesson.titulo}`);
        }
      } else {
        console.log(`⚠️  No se encontró archivo HTML para: ${lesson.titulo}`);
      }
    }

    console.log('\n🔍 Verificando resultado final...');
    
    // Verificar el resultado final
    const { data: finalLessons, error: finalError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden, archivo_url')
      .eq('curso_id', CURSO_ID)
      .order('orden', { ascending: true });

    if (finalError) {
      console.error('❌ Error en verificación final:', finalError);
      return;
    }

    console.log(`\n📋 Resultado final (${finalLessons.length} lecciones):`);
    finalLessons.forEach(lesson => {
      console.log(`  ${lesson.orden}) ${lesson.titulo}`);
      console.log(`     Archivo: ${lesson.archivo_url || 'Sin archivo'}`);
    });

    // Verificar que todas las lecciones tengan archivos HTML
    const lessonsWithoutHTML = finalLessons.filter(l => !l.archivo_url);
    
    if (lessonsWithoutHTML.length === 0) {
      console.log('\n🎉 ¡PERFECTO! Todas las lecciones tienen archivos HTML asignados.');
    } else {
      console.log(`\n⚠️  ${lessonsWithoutHTML.length} lecciones sin archivo HTML:`);
      lessonsWithoutHTML.forEach(lesson => {
        console.log(`    - ${lesson.titulo}`);
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

updateLessonsWithHTML();