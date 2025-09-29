const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson6Master() {
  try {
    console.log('🔍 Verificando lección 6 del Master en Adicciones...');
    
    // Primero, obtener todos los cursos para ver qué hay
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id, titulo');
    
    if (cursosError) {
      console.error('❌ Error al buscar cursos:', cursosError);
      return;
    }
    
    console.log('📚 Cursos encontrados:', cursos);
    
    if (!cursos || cursos.length === 0) {
      console.log('⚠️ No se encontraron cursos');
      return;
    }
    
    // Buscar específicamente el Master en Adicciones
    const masterCurso = cursos.find(curso => 
      curso.titulo.toLowerCase().includes('máster') && 
      curso.titulo.toLowerCase().includes('adicciones')
    );
    
    if (!masterCurso) {
      console.log('⚠️ No se encontró el curso MÁSTER EN ADICCIONES');
      console.log('📚 Cursos disponibles:');
      cursos.forEach(curso => console.log(`  - ${curso.titulo} (ID: ${curso.id})`));
      return;
    }
    
    const cursoId = masterCurso.id;
    console.log('🎯 ID del curso Master:', cursoId);
    console.log('📚 Título del curso:', masterCurso.titulo);
    
    // Buscar la lección 6
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', cursoId)
      .eq('orden', 6);
    
    if (leccionesError) {
      console.error('❌ Error al buscar lección 6:', leccionesError);
      return;
    }
    
    console.log('📖 Lección 6 encontrada:', lecciones);
    
    if (!lecciones || lecciones.length === 0) {
      console.log('⚠️ No se encontró la lección 6 en la base de datos');
      
      // Buscar todas las lecciones del curso para ver qué hay
      const { data: todasLecciones, error: todasError } = await supabase
        .from('lecciones')
        .select('orden, titulo, descripcion, contenido_html, archivo_url')
        .eq('curso_id', cursoId)
        .order('orden');
      
      if (todasError) {
        console.error('❌ Error al buscar todas las lecciones:', todasError);
        return;
      }
      
      console.log('📚 Todas las lecciones del curso:');
      todasLecciones?.forEach(leccion => {
        console.log(`  ${leccion.orden}. ${leccion.titulo}`);
        console.log(`     Contenido HTML: ${leccion.contenido_html ? 'SÍ' : 'NO'}`);
        console.log(`     Archivo URL: ${leccion.archivo_url || 'NO'}`);
      });
      
      return;
    }
    
    const leccion6 = lecciones[0];
    console.log('✅ Lección 6 encontrada:');
    console.log('  📝 Título:', leccion6.titulo);
    console.log('  📄 Descripción:', leccion6.descripcion);
    console.log('  🔢 Orden:', leccion6.orden);
    console.log('  📋 Contenido HTML:', leccion6.contenido_html ? 'SÍ (presente)' : 'NO (vacío)');
    console.log('  🔗 Archivo URL:', leccion6.archivo_url || 'NO');
    console.log('  ⏱️ Duración estimada:', leccion6.duracion_estimada);
    console.log('  🖼️ Imagen URL:', leccion6.imagen_url || 'NO');
    
    if (leccion6.contenido_html) {
      console.log('  📏 Longitud del contenido HTML:', leccion6.contenido_html.length, 'caracteres');
      console.log('  🔍 Primeros 200 caracteres:', leccion6.contenido_html.substring(0, 200) + '...');
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

checkLesson6Master();