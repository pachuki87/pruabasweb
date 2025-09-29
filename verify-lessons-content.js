import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Function to check for Unicode issues
function checkUnicodeIssues(text) {
  if (!text) return { hasIssues: false, issues: [] };
  
  const issues = [];
  
  // Check for null characters
  if (text.includes('\0')) {
    issues.push('Contains null characters');
  }
  
  // Check for invalid Unicode sequences
  if (text.includes('\uFFFD')) {
    issues.push('Contains replacement characters (invalid Unicode)');
  }
  
  // Check for control characters (except common ones like \n, \r, \t)
  const controlCharRegex = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
  if (controlCharRegex.test(text)) {
    issues.push('Contains control characters');
  }
  
  return {
    hasIssues: issues.length > 0,
    issues
  };
}

// Function to get course ID
async function getCourseId() {
  const { data, error } = await supabase
    .from('cursos')
    .select('id')
    .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
    .single();
  
  if (error) {
    console.error('Error finding course:', error);
    return null;
  }
  
  return data?.id;
}

// Function to verify all lessons
async function verifyLessonsContent() {
  console.log('🔍 Verificando contenido de las lecciones...');
  console.log('=' .repeat(60));
  
  try {
    // Get course ID
    const courseId = await getCourseId();
    if (!courseId) {
      console.error('❌ No se encontró el curso');
      return;
    }
    
    console.log(`✅ Curso encontrado con ID: ${courseId}`);
    console.log('');
    
    // Get all lessons for the course
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseId)
      .order('orden');
    
    if (error) {
      console.error('Error fetching lessons:', error);
      return;
    }
    
    if (!lessons || lessons.length === 0) {
      console.log('❌ No se encontraron lecciones para este curso');
      return;
    }
    
    console.log(`📚 Total de lecciones encontradas: ${lessons.length}`);
    console.log('');
    
    // Analyze each lesson
    for (const lesson of lessons) {
      console.log(`📖 Lección ${lesson.orden}: ${lesson.titulo}`);
      console.log('-'.repeat(50));
      
      // Check content length
      const contentLength = lesson.contenido_html ? lesson.contenido_html.length : 0;
      console.log(`📏 Longitud del contenido: ${contentLength} caracteres`);
      
      if (contentLength === 0) {
        console.log('⚠️  ADVERTENCIA: Esta lección no tiene contenido');
      } else {
        console.log('✅ Tiene contenido');
        
        // Show content preview (first 200 characters)
        const preview = lesson.contenido_html.substring(0, 200);
        console.log(`👀 Vista previa: ${preview}${contentLength > 200 ? '...' : ''}`);
        
        // Check for Unicode issues
        const unicodeCheck = checkUnicodeIssues(lesson.contenido_html);
        if (unicodeCheck.hasIssues) {
          console.log('⚠️  PROBLEMAS DE UNICODE DETECTADOS:');
          unicodeCheck.issues.forEach(issue => {
            console.log(`   - ${issue}`);
          });
        } else {
          console.log('✅ Sin problemas de Unicode detectados');
        }
        
        // Special check for Lesson 3
        if (lesson.orden === 3) {
          console.log('🔍 VERIFICACIÓN ESPECIAL PARA LECCIÓN 3:');
          
          // Check if content is properly structured HTML
          const hasHtmlTags = lesson.contenido_html.includes('<h') || 
                             lesson.contenido_html.includes('<p') || 
                             lesson.contenido_html.includes('<div');
          
          if (hasHtmlTags) {
            console.log('✅ Contiene etiquetas HTML estructuradas');
          } else {
            console.log('⚠️  El contenido no parece estar estructurado como HTML');
          }
          
          // Check for common problematic patterns
          const problematicPatterns = [
            { pattern: /\\u[0-9a-fA-F]{4}/g, name: 'Secuencias Unicode escapadas' },
            { pattern: /\\x[0-9a-fA-F]{2}/g, name: 'Secuencias hexadecimales escapadas' },
            { pattern: /\\[0-7]{3}/g, name: 'Secuencias octales escapadas' }
          ];
          
          problematicPatterns.forEach(({ pattern, name }) => {
            const matches = lesson.contenido_html.match(pattern);
            if (matches) {
              console.log(`⚠️  Encontradas ${matches.length} ${name}`);
            }
          });
        }
      }
      
      console.log('');
    }
    
    // Summary
    console.log('📊 RESUMEN:');
    console.log('=' .repeat(30));
    
    const lessonsWithContent = lessons.filter(l => l.contenido_html && l.contenido_html.length > 0);
    const lessonsWithoutContent = lessons.filter(l => !l.contenido_html || l.contenido_html.length === 0);
    const lessonsWithUnicodeIssues = lessons.filter(l => {
      if (!l.contenido_html) return false;
      return checkUnicodeIssues(l.contenido_html).hasIssues;
    });
    
    console.log(`✅ Lecciones con contenido: ${lessonsWithContent.length}/${lessons.length}`);
    console.log(`❌ Lecciones sin contenido: ${lessonsWithoutContent.length}/${lessons.length}`);
    console.log(`⚠️  Lecciones con problemas Unicode: ${lessonsWithUnicodeIssues.length}/${lessons.length}`);
    
    if (lessonsWithoutContent.length > 0) {
      console.log('\n📝 Lecciones sin contenido:');
      lessonsWithoutContent.forEach(lesson => {
        console.log(`   - Lección ${lesson.orden}: ${lesson.titulo}`);
      });
    }
    
    if (lessonsWithUnicodeIssues.length > 0) {
      console.log('\n🔧 Lecciones con problemas Unicode:');
      lessonsWithUnicodeIssues.forEach(lesson => {
        console.log(`   - Lección ${lesson.orden}: ${lesson.titulo}`);
      });
    }
    
    console.log('\n🎉 Verificación completada!');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  }
}

// Run the verification
verifyLessonsContent();