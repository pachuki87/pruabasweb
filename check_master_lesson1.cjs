require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMasterLesson1() {
  try {
    console.log('🔍 Verificando lección 1 del Máster en Adicciones...');
    
    // Buscar el curso máster
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .single();
    
    if (cursoError) {
      console.error('❌ Error al buscar curso:', cursoError);
      return;
    }
    
    console.log('📚 Curso encontrado:', curso.nombre);
    
    // Buscar la lección 1
    const { data: leccion, error: leccionError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .eq('orden', 1)
      .single();
    
    if (leccionError) {
      console.error('❌ Error al buscar lección:', leccionError);
      return;
    }
    
    console.log('\n📖 Lección 1 del Máster:');
    console.log('Título:', leccion.titulo);
    console.log('Descripción:', leccion.descripcion);
    console.log('Archivo URL:', leccion.archivo_url);
    console.log('Contenido HTML:', leccion.contenido_html ? 'SÍ TIENE' : 'NO TIENE');
    
    if (leccion.archivo_url && leccion.archivo_url.includes('inteligencia-emocional')) {
      console.log('\n⚠️  PROBLEMA DETECTADO: La lección 1 tiene archivo_url de inteligencia emocional');
      console.log('Archivo incorrecto:', leccion.archivo_url);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkMasterLesson1();