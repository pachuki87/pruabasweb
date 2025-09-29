import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function activateLessons() {
  try {
    console.log('🔄 Activando todas las lecciones del curso...');
    
    // Actualizar todas las lecciones del curso para marcarlas como activas
    const { data, error } = await supabase
      .from('lecciones')
      .update({ activo: true })
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .select();

    if (error) {
      console.error('❌ Error al activar lecciones:', error);
      return;
    }

    console.log(`✅ Se activaron ${data.length} lecciones exitosamente`);
    
    // Verificar el resultado
    console.log('\n📋 Lecciones activadas:');
    data.forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.titulo} - Orden: ${lesson.orden} - Activo: ${lesson.activo}`);
    });

    // Consultar nuevamente para confirmar
    console.log('\n🔍 Verificando estado final...');
    const { data: finalCheck, error: checkError } = await supabase
      .from('lecciones')
      .select('titulo, orden, activo, archivo_url')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden', { ascending: true });

    if (checkError) {
      console.error('❌ Error en verificación final:', checkError);
      return;
    }

    console.log('\n📊 Estado final de las lecciones:');
    finalCheck.forEach((lesson, index) => {
      const status = lesson.activo ? '✅ ACTIVA' : '❌ INACTIVA';
      const hasFile = lesson.archivo_url ? '📄 CON ARCHIVO' : '❌ SIN ARCHIVO';
      console.log(`${index + 1}. [${lesson.orden}] ${lesson.titulo} - ${status} - ${hasFile}`);
    });

    const activeCount = finalCheck.filter(l => l.activo).length;
    const withFilesCount = finalCheck.filter(l => l.archivo_url).length;
    
    console.log(`\n📈 Resumen:`);
    console.log(`- Total de lecciones: ${finalCheck.length}`);
    console.log(`- Lecciones activas: ${activeCount}`);
    console.log(`- Lecciones con archivos: ${withFilesCount}`);
    
    if (activeCount === finalCheck.length && withFilesCount === finalCheck.length) {
      console.log('\n🎉 ¡Todas las lecciones están correctamente configuradas!');
    } else {
      console.log('\n⚠️ Aún hay problemas pendientes por resolver.');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

activateLessons();