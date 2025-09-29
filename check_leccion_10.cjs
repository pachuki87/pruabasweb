const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson10() {
  console.log('🔍 Verificando lección 10...');
  
  try {
    // Buscar lección 10 del Máster en Adicciones
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('*, cursos(titulo)')
      .eq('orden', 10);
      
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log('📚 Lecciones con orden 10 encontradas:', lessons.length);
    
    lessons.forEach((lesson, index) => {
      console.log(`\n--- Lección ${index + 1} ---`);
      console.log('ID:', lesson.id);
      console.log('Título:', lesson.titulo);
      console.log('Curso:', lesson.cursos?.titulo || 'Sin curso');
      console.log('Contenido HTML:', lesson.contenido_html ? 'Presente (' + lesson.contenido_html.length + ' chars)' : 'AUSENTE');
      console.log('Archivo URL:', lesson.archivo_url || 'No definido');
      
      if (lesson.contenido_html) {
        console.log('Vista previa:', lesson.contenido_html.substring(0, 200) + '...');
      }
    });
    
    // Buscar específicamente la del Máster en Adicciones
    const masterLesson = lessons.find(l => 
      l.cursos?.titulo?.includes('Máster') || 
      l.titulo?.includes('TRABAJO FINAL')
    );
    
    if (masterLesson) {
      console.log('\n=== LECCIÓN 10 DEL MÁSTER ENCONTRADA ===');
      console.log('ID:', masterLesson.id);
      console.log('Título:', masterLesson.titulo);
      console.log('Curso:', masterLesson.cursos?.titulo);
      console.log('Contenido HTML:', masterLesson.contenido_html ? 'SÍ' : 'NO');
      console.log('Archivo URL:', masterLesson.archivo_url || 'No definido');
      
      if (!masterLesson.contenido_html && !masterLesson.archivo_url) {
        console.log('\n❌ PROBLEMA: La lección no tiene contenido HTML ni archivo URL');
        console.log('🔧 SOLUCIÓN: Necesita cargar el contenido HTML desde el archivo correspondiente');
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkLesson10();