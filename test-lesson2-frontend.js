import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

const COURSE_ID = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
const LESSON_ID = '2b1d91ce-2b59-4f49-b227-626f803bd74d';

async function testLesson2Frontend() {
  console.log('🧪 Probando la lección 2 en el frontend...');
  console.log(`Curso ID: ${COURSE_ID}`);
  console.log(`Lección ID: ${LESSON_ID}`);
  console.log('=' .repeat(60));

  try {
    // 1. Verificar que el curso existe
    console.log('\n1️⃣ Verificando curso...');
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', COURSE_ID)
      .single();

    if (courseError) {
      console.log('❌ Error al obtener curso:', courseError.message);
      return;
    }

    console.log('✅ Curso encontrado:', course.titulo);

    // 2. Obtener todas las lecciones del curso (simulando lo que hace el frontend)
    console.log('\n2️⃣ Obteniendo lecciones del curso...');
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', COURSE_ID)
      .order('orden', { ascending: true });

    if (lessonsError) {
      console.log('❌ Error al obtener lecciones:', lessonsError.message);
      return;
    }

    console.log(`✅ Lecciones encontradas: ${lessons.length}`);
    lessons.forEach((lesson, index) => {
      const isTarget = lesson.id === LESSON_ID;
      const marker = isTarget ? '🎯' : '📖';
      console.log(`   ${marker} ${lesson.orden}. ${lesson.titulo} ${isTarget ? '(OBJETIVO)' : ''}`);
    });

    // 3. Verificar específicamente la lección 2
    console.log('\n3️⃣ Verificando lección 2 específicamente...');
    const lesson2 = lessons.find(l => l.id === LESSON_ID);
    
    if (!lesson2) {
      console.log('❌ Lección 2 NO encontrada en la lista de lecciones del curso');
      return;
    }

    console.log('✅ Lección 2 encontrada en la lista:');
    console.log(`   - ID: ${lesson2.id}`);
    console.log(`   - Título: ${lesson2.titulo}`);
    console.log(`   - Orden: ${lesson2.orden}`);
    console.log(`   - Contenido HTML: ${lesson2.contenido_html ? `${lesson2.contenido_html.length} caracteres` : 'Vacío'}`);
    console.log(`   - Archivo URL: ${lesson2.archivo_url || 'No definido'}`);

    // 4. Verificar si hay cuestionarios asociados
    console.log('\n4️⃣ Verificando cuestionarios...');
    const { data: quizzes, error: quizError } = await supabase
      .from('cuestionarios')
      .select('id, titulo')
      .eq('leccion_id', LESSON_ID);

    if (quizError) {
      console.log('❌ Error al obtener cuestionarios:', quizError.message);
    } else {
      console.log(`✅ Cuestionarios encontrados: ${quizzes.length}`);
      quizzes.forEach(quiz => {
        console.log(`   📝 ${quiz.titulo} (ID: ${quiz.id})`);
      });
    }

    // 5. Simular la lógica del frontend para procesar la lección
    console.log('\n5️⃣ Simulando procesamiento del frontend...');
    
    const mapTitleToSlug = (titulo) => {
      const titleMappings = {
        'TERAPIA COGNITIVA DROGODEPENDENCIAS': '02_Terapia_Cognitiva_Drogodependencias'
      };
      
      if (titleMappings[titulo]) {
        return titleMappings[titulo];
      }
      
      return titulo.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    };

    const processedLesson = {
      ...lesson2,
      slug: mapTitleToSlug(lesson2.titulo),
      pdfs: [],
      tiene_cuestionario: quizzes.length > 0
    };

    console.log('✅ Lección procesada para el frontend:');
    console.log(`   - Slug generado: ${processedLesson.slug}`);
    console.log(`   - Tiene cuestionario: ${processedLesson.tiene_cuestionario}`);
    console.log(`   - PDFs: ${processedLesson.pdfs.length}`);

    // 6. Verificar archivo físico si existe archivo_url
    if (lesson2.archivo_url) {
      console.log('\n6️⃣ Verificando archivo físico...');
      const filePath = `public${lesson2.archivo_url}`;
      console.log(`   Ruta esperada: ${filePath}`);
      
      try {
        const fs = await import('fs');
        const path = await import('path');
        
        const fullPath = path.resolve(filePath);
        if (fs.existsSync(fullPath)) {
          const stats = fs.statSync(fullPath);
          console.log(`   ✅ Archivo existe: ${stats.size} bytes`);
        } else {
          console.log(`   ❌ Archivo NO existe en: ${fullPath}`);
        }
      } catch (err) {
        console.log(`   ⚠️ No se pudo verificar archivo: ${err.message}`);
      }
    }

    // 7. Resumen final
    console.log('\n📊 RESUMEN FINAL:');
    console.log('=' .repeat(40));
    console.log(`✅ Curso existe: ${course.titulo}`);
    console.log(`✅ Lección 2 existe en BD: ${lesson2.titulo}`);
    console.log(`✅ Contenido HTML: ${lesson2.contenido_html ? 'Presente' : 'Ausente'}`);
    console.log(`✅ Archivo URL: ${lesson2.archivo_url ? 'Definido' : 'No definido'}`);
    console.log(`✅ Cuestionarios: ${quizzes.length}`);
    console.log(`✅ Orden en curso: ${lesson2.orden}`);
    
    console.log('\n🌐 URL de la lección:');
    console.log(`http://localhost:5173/student/courses/${COURSE_ID}/lessons/${LESSON_ID}`);
    
    if (lesson2.contenido_html && lesson2.contenido_html.trim().length > 0) {
      console.log('\n✅ CONCLUSIÓN: La lección 2 debería mostrarse correctamente.');
      console.log('   Si no se muestra, el problema podría estar en:');
      console.log('   - Caché del navegador');
      console.log('   - Errores de JavaScript en el frontend');
      console.log('   - Problemas de renderizado del componente');
    } else {
      console.log('\n❌ CONCLUSIÓN: La lección 2 NO tiene contenido HTML.');
      console.log('   Esto explicaría por qué no se muestra.');
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

// Ejecutar prueba
testLesson2Frontend().then(() => {
  console.log('\n🏁 Prueba completada.');
}).catch(console.error);