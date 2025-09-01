const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugLessonData() {
  try {
    console.log('🔍 Debugging lesson data for Master course...');
    
    // Buscar el curso máster
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .single();
    
    if (cursoError) {
      console.error('❌ Error finding course:', cursoError);
      return;
    }
    
    console.log('✅ Course found:', curso.titulo);
    
    // Obtener la primera lección
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden', { ascending: true })
      .limit(1);
    
    if (leccionesError) {
      console.error('❌ Error getting lessons:', leccionesError);
      return;
    }
    
    if (!lecciones || lecciones.length === 0) {
      console.log('❌ No lessons found');
      return;
    }
    
    const primeraLeccion = lecciones[0];
    console.log('\n📚 First lesson data:');
    console.log('- ID:', primeraLeccion.id);
    console.log('- Título:', primeraLeccion.titulo);
    console.log('- Orden:', primeraLeccion.orden);
    console.log('- archivo_url:', primeraLeccion.archivo_url);
    console.log('- contenido_html:', primeraLeccion.contenido_html ? 'EXISTS' : 'NULL');
    
    // Verificar si el archivo existe
    if (primeraLeccion.archivo_url) {
      console.log('\n🌐 Testing file URL:', primeraLeccion.archivo_url);
      try {
        const response = await fetch(primeraLeccion.archivo_url);
        console.log('📡 Response status:', response.status, response.statusText);
        
        if (response.ok) {
          const content = await response.text();
          console.log('📄 Content length:', content.length);
          console.log('📄 Content preview (first 200 chars):', content.substring(0, 200));
        }
      } catch (fetchError) {
        console.error('❌ Error fetching file:', fetchError.message);
      }
    } else {
      console.log('⚠️ No archivo_url found for this lesson');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugLessonData();