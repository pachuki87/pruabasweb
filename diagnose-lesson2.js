import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

const LESSON_ID = '2b1d91ce-2b59-4f49-b227-626f803bd74d';

async function diagnoseLessonTwo() {
  console.log('🔍 Diagnosticando lección 2...');
  console.log(`ID de lección: ${LESSON_ID}`);
  console.log('=' .repeat(50));

  try {
    // 1. Verificar si la lección existe
    console.log('\n1. Verificando existencia de la lección...');
    const { data: lesson, error: lessonError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('id', LESSON_ID)
      .single();

    if (lessonError) {
      console.log('❌ Error al buscar la lección:', lessonError.message);
      return;
    }

    if (!lesson) {
      console.log('❌ La lección no existe en la base de datos');
      return;
    }

    console.log('✅ Lección encontrada:');
    console.log(`   - Título: ${lesson.titulo}`);
    console.log(`   - Orden: ${lesson.orden}`);
    console.log(`   - Activa: ${lesson.activa}`);
    console.log(`   - Curso ID: ${lesson.curso_id}`);
    console.log(`   - Archivo URL: ${lesson.archivo_url || 'No definido'}`);
    console.log(`   - Contenido HTML: ${lesson.contenido_html ? `${lesson.contenido_html.length} caracteres` : 'Vacío'}`);

    // 2. Verificar el curso asociado
    console.log('\n2. Verificando curso asociado...');
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', lesson.curso_id)
      .single();

    if (courseError) {
      console.log('❌ Error al buscar el curso:', courseError.message);
    } else {
      console.log('✅ Curso encontrado:');
      console.log(`   - Título: ${course.titulo}`);
      console.log(`   - Activo: ${course.activo}`);
    }

    // 3. Verificar archivo físico si existe archivo_url
    if (lesson.archivo_url) {
      console.log('\n3. Verificando archivo físico...');
      const filePath = path.join(process.cwd(), 'public', lesson.archivo_url);
      
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log('✅ Archivo físico encontrado:');
        console.log(`   - Ruta: ${filePath}`);
        console.log(`   - Tamaño: ${stats.size} bytes`);
        
        // Leer contenido del archivo
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          console.log(`   - Contenido: ${content.length} caracteres`);
        } catch (readError) {
          console.log('❌ Error al leer el archivo:', readError.message);
        }
      } else {
        console.log('❌ Archivo físico no encontrado:');
        console.log(`   - Ruta esperada: ${filePath}`);
      }
    }

    // 4. Buscar archivos de contenido en carpetas extraídas
    console.log('\n4. Buscando archivos de contenido en carpetas extraídas...');
    
    // Buscar en curso_extraido
    const cursoExtraidoPath = path.join(process.cwd(), 'curso_extraido');
    if (fs.existsSync(cursoExtraidoPath)) {
      console.log('📁 Explorando curso_extraido...');
      const folders = fs.readdirSync(cursoExtraidoPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      console.log(`   - Carpetas encontradas: ${folders.join(', ')}`);
      
      // Buscar específicamente la lección 2
      const possiblePaths = [
        path.join(cursoExtraidoPath, 'Módulo 1', '2', 'contenido.html'),
        path.join(cursoExtraidoPath, 'Módulo 1', 'Lección 2', 'contenido.html'),
        path.join(cursoExtraidoPath, 'Lección 2', 'contenido.html')
      ];
      
      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          console.log(`✅ Archivo de contenido encontrado: ${possiblePath}`);
          const content = fs.readFileSync(possiblePath, 'utf8');
          console.log(`   - Tamaño: ${content.length} caracteres`);
          break;
        }
      }
    }

    // 5. Resumen del diagnóstico
    console.log('\n' + '=' .repeat(50));
    console.log('📋 RESUMEN DEL DIAGNÓSTICO:');
    console.log(`✅ Lección existe: ${!!lesson}`);
    console.log(`${lesson.contenido_html ? '✅' : '❌'} Contenido HTML: ${lesson.contenido_html ? 'Presente' : 'Ausente'}`);
    console.log(`${lesson.archivo_url ? '✅' : '❌'} Archivo URL: ${lesson.archivo_url ? 'Definido' : 'No definido'}`);
    console.log(`${lesson.activa ? '✅' : '❌'} Estado activo: ${lesson.activa ? 'Activa' : 'Inactiva'}`);
    
    if (!lesson.contenido_html && !lesson.archivo_url) {
      console.log('\n🔧 RECOMENDACIÓN: La lección no tiene contenido. Usar restore_experto_content.cjs para restaurar.');
    } else if (!lesson.activa) {
      console.log('\n🔧 RECOMENDACIÓN: La lección está inactiva. Activar en la base de datos.');
    }

  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
  }
}

// Ejecutar diagnóstico
diagnoseLessonTwo().then(() => {
  console.log('\n🏁 Diagnóstico completado.');
}).catch(console.error);