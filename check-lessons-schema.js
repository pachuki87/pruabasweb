import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

const LESSON_ID = '2b1d91ce-2b59-4f49-b227-626f803bd74d';

async function checkLessonsSchema() {
  console.log('🔍 Verificando estructura de la tabla lecciones...');
  console.log('=' .repeat(50));

  try {
    // Obtener una lección para ver todas las columnas disponibles
    const { data: lesson, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('id', LESSON_ID)
      .single();

    if (error) {
      console.log('❌ Error al obtener la lección:', error.message);
      return;
    }

    if (lesson) {
      console.log('✅ Estructura de la lección encontrada:');
      console.log('📋 Columnas disponibles:');
      
      Object.keys(lesson).forEach(key => {
        const value = lesson[key];
        const type = typeof value;
        const displayValue = value === null ? 'null' : 
                           type === 'string' && value.length > 50 ? `${value.substring(0, 50)}...` : 
                           value;
        
        console.log(`   - ${key}: ${displayValue} (${type})`);
      });

      // Verificar si hay columnas relacionadas con estado/activación
      const possibleStatusColumns = ['activa', 'active', 'enabled', 'visible', 'published', 'status', 'estado'];
      const availableColumns = Object.keys(lesson);
      
      console.log('\n🔍 Buscando columnas de estado:');
      const statusColumns = possibleStatusColumns.filter(col => 
        availableColumns.some(available => available.toLowerCase().includes(col.toLowerCase()))
      );
      
      if (statusColumns.length > 0) {
        console.log('✅ Posibles columnas de estado encontradas:', statusColumns);
      } else {
        console.log('❌ No se encontraron columnas obvias de estado');
        console.log('📝 Columnas disponibles:', availableColumns.join(', '));
      }

      // Verificar si la lección se muestra correctamente
      console.log('\n📊 Estado actual de la lección:');
      console.log(`   - ID: ${lesson.id}`);
      console.log(`   - Título: ${lesson.titulo}`);
      console.log(`   - Orden: ${lesson.orden}`);
      console.log(`   - Curso ID: ${lesson.curso_id}`);
      console.log(`   - Contenido HTML: ${lesson.contenido_html ? 'Presente' : 'Ausente'}`);
      console.log(`   - Archivo URL: ${lesson.archivo_url || 'No definido'}`);

    } else {
      console.log('❌ No se encontró la lección');
    }

    // También verificar otras lecciones del mismo curso para comparar
    console.log('\n🔍 Verificando otras lecciones del mismo curso...');
    const { data: otherLessons, error: otherError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .limit(3);

    if (otherError) {
      console.log('❌ Error al obtener otras lecciones:', otherError.message);
    } else if (otherLessons && otherLessons.length > 0) {
      console.log(`✅ Encontradas ${otherLessons.length} lecciones del curso:`);
      otherLessons.forEach((lesson, index) => {
        console.log(`   ${index + 1}. ${lesson.titulo} (Orden: ${lesson.orden})`);
      });
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  }
}

// Ejecutar verificación
checkLessonsSchema().then(() => {
  console.log('\n🏁 Verificación de esquema completada.');
}).catch(console.error);