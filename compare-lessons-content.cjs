require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function compareLessonsContent() {
  try {
    console.log('🔍 Comparando contenido de lecciones 1 y 11...');
    
    // Obtener el curso
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id')
      .eq('titulo', 'Experto en Conductas Adictivas')
      .single();
    
    if (cursoError) {
      console.error('❌ Error al obtener curso:', cursoError);
      return;
    }
    
    // Obtener lecciones 1 y 11
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', curso.id)
      .in('orden', [1, 11])
      .order('orden');
    
    if (error) {
      console.error('❌ Error al obtener lecciones:', error);
      return;
    }
    
    console.log('\n' + '='.repeat(80));
    
    for (const lesson of lessons) {
      console.log(`\n📚 LECCIÓN ${lesson.orden}: ${lesson.titulo}`);
      console.log('─'.repeat(60));
      console.log(`📄 ID: ${lesson.id}`);
      console.log(`📁 Archivo URL: ${lesson.archivo_url || 'No definido'}`);
      console.log(`📝 Contenido HTML: ${lesson.contenido_html ? 'Presente (' + lesson.contenido_html.length + ' caracteres)' : 'No presente'}`);
      console.log(`❓ Tiene cuestionario: ${lesson.tiene_cuestionario ? 'Sí' : 'No'}`);
      
      // Verificar si el archivo HTML existe
      if (lesson.archivo_url) {
        const filePath = path.join(__dirname, 'public', lesson.archivo_url);
        const fileExists = fs.existsSync(filePath);
        console.log(`📂 Archivo existe: ${fileExists ? 'Sí' : 'No'} (${filePath})`);
        
        if (fileExists) {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          console.log(`📊 Tamaño del archivo: ${fileContent.length} caracteres`);
          console.log(`🔍 Primeros 200 caracteres del archivo:`);
          console.log(fileContent.substring(0, 200) + '...');
        }
      }
      
      // Mostrar contenido HTML si existe
      if (lesson.contenido_html) {
        console.log(`🔍 Primeros 200 caracteres del contenido HTML:`);
        console.log(lesson.contenido_html.substring(0, 200) + '...');
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ Comparación completada');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

compareLessonsContent();