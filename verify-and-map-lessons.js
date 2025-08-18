import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de Supabase desde .env
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function verifyAndMapLessons() {
  try {
    console.log('🔍 Verificando lecciones existentes en el curso...');
    
    // 1. Obtener el curso
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
      .single();
    
    if (courseError || !course) {
      console.error('❌ Error al obtener el curso:', courseError);
      return;
    }
    
    console.log(`✅ Curso encontrado: ${course.titulo} (ID: ${course.id})`);
    
    // 2. Obtener todas las lecciones existentes del curso
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('id, orden, titulo, contenido_html')
      .eq('curso_id', course.id)
      .order('orden', { ascending: true });
    
    if (lessonsError) {
      console.error('❌ Error al obtener lecciones:', lessonsError);
      return;
    }
    
    console.log(`\n📚 Lecciones existentes en el curso:`);
    const existingLessonNumbers = [];
    lessons.forEach(lesson => {
      const hasContent = lesson.contenido_html && lesson.contenido_html.trim().length > 0;
      console.log(`   Lección ${lesson.orden}: ${lesson.titulo} ${hasContent ? '✅ (con contenido)' : '❌ (sin contenido)'}`);
      existingLessonNumbers.push(lesson.orden);
    });
    
    console.log(`\n🔢 Números de lección existentes: [${existingLessonNumbers.join(', ')}]`);
    
    // 3. Listar carpetas de PDFs disponibles
    const pdfFolderPath = path.join(__dirname, 'inteligencia_emocional_drive');
    console.log(`\n📁 Verificando carpetas de PDFs en: ${pdfFolderPath}`);
    
    if (!fs.existsSync(pdfFolderPath)) {
      console.error('❌ La carpeta inteligencia_emocional_drive no existe');
      return;
    }
    
    const folders = fs.readdirSync(pdfFolderPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();
    
    console.log('📂 Carpetas de PDFs disponibles:');
    folders.forEach((folder, index) => {
      console.log(`   ${index + 1}. ${folder}`);
    });
    
    // 4. Mapear carpetas a lecciones SOLO si la lección existe
    const folderToLessonMap = {
      '1)FUNDAMENTOS P TERAPEUTICO': 1,
      '2) TERAPIA COGNITIVA DROGODEPENDENCIAS': 2,
      '3) FAMILIA Y TRABAJO EQUIPO': 3,
      '4) TERAPIA GRUPAL': 4,
      '5) PREVENCION RECAIDAS': 5,
      '6) TERAPIA MOTIVACIONAL': 6,
      '7) TERAPIA CONDUCTUAL': 7,
      '8) MINDFULNESS': 8
    };
    
    console.log('\n🗺️  Mapeo de carpetas a lecciones:');
    const validMappings = [];
    
    for (const [folderName, lessonNumber] of Object.entries(folderToLessonMap)) {
      const lessonExists = existingLessonNumbers.includes(lessonNumber);
      const folderExists = folders.includes(folderName);
      
      if (lessonExists && folderExists) {
        validMappings.push({ folderName, lessonNumber });
        console.log(`   ✅ Carpeta "${folderName}" → Lección ${lessonNumber} (VÁLIDO)`);
      } else if (!lessonExists && folderExists) {
        console.log(`   ⚠️  Carpeta "${folderName}" → Lección ${lessonNumber} (LECCIÓN NO EXISTE - SALTANDO)`);
      } else if (lessonExists && !folderExists) {
        console.log(`   ❌ Carpeta "${folderName}" → Lección ${lessonNumber} (CARPETA NO EXISTE)`);
      } else {
        console.log(`   ❌ Carpeta "${folderName}" → Lección ${lessonNumber} (NI CARPETA NI LECCIÓN EXISTEN)`);
      }
    }
    
    // 5. Procesar solo los mapeos válidos
    console.log(`\n🔄 Procesando ${validMappings.length} mapeos válidos...`);
    
    for (const { folderName, lessonNumber } of validMappings) {
      console.log(`\n📖 Procesando Lección ${lessonNumber} (${folderName})...`);
      
      const folderPath = path.join(pdfFolderPath, folderName);
      const pdfFiles = fs.readdirSync(folderPath)
        .filter(file => file.toLowerCase().endsWith('.pdf'))
        .sort();
      
      if (pdfFiles.length === 0) {
        console.log(`   ⚠️  No se encontraron PDFs en ${folderName}`);
        continue;
      }
      
      console.log(`   📄 Encontrados ${pdfFiles.length} PDFs: ${pdfFiles.join(', ')}`);
      
      let combinedContent = '';
      
      for (const pdfFile of pdfFiles) {
        try {
          const pdfPath = path.join(folderPath, pdfFile);
          const dataBuffer = fs.readFileSync(pdfPath);
          const data = await pdfParse(dataBuffer);
          
          const cleanText = data.text
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remover caracteres de control
            .replace(/\s+/g, ' ') // Normalizar espacios
            .trim();
          
          if (cleanText.length > 0) {
            combinedContent += `<div class="pdf-content">\n<h3>${pdfFile.replace('.pdf', '')}</h3>\n<p>${cleanText}</p>\n</div>\n\n`;
            console.log(`   ✅ Extraído contenido de ${pdfFile} (${cleanText.length} caracteres)`);
          }
        } catch (error) {
          console.error(`   ❌ Error procesando ${pdfFile}:`, error.message);
        }
      }
      
      if (combinedContent.trim().length > 0) {
        // Actualizar la lección existente
        const { error: updateError } = await supabase
          .from('lecciones')
          .update({ contenido_html: combinedContent })
          .eq('curso_id', course.id)
          .eq('orden', lessonNumber);
        
        if (updateError) {
          console.error(`   ❌ Error actualizando lección ${lessonNumber}:`, updateError);
        } else {
          console.log(`   ✅ Lección ${lessonNumber} actualizada con ${combinedContent.length} caracteres`);
        }
      } else {
        console.log(`   ⚠️  No se pudo extraer contenido válido para la lección ${lessonNumber}`);
      }
    }
    
    // 6. Mostrar resumen final
    console.log('\n📊 RESUMEN FINAL:');
    console.log('==================');
    
    const { data: updatedLessons } = await supabase
      .from('lecciones')
      .select('orden, titulo, contenido_html')
      .eq('curso_id', course.id)
      .order('orden', { ascending: true });
    
    updatedLessons.forEach(lesson => {
      const hasContent = lesson.contenido_html && lesson.contenido_html.trim().length > 0;
      const contentLength = hasContent ? lesson.contenido_html.length : 0;
      console.log(`   Lección ${lesson.orden}: ${lesson.titulo}`);
      console.log(`      Estado: ${hasContent ? '✅ CON CONTENIDO' : '❌ SIN CONTENIDO'} (${contentLength} caracteres)`);
    });
    
    const lessonsWithContent = updatedLessons.filter(l => l.contenido_html && l.contenido_html.trim().length > 0).length;
    const totalLessons = updatedLessons.length;
    
    console.log(`\n🎯 Resultado: ${lessonsWithContent}/${totalLessons} lecciones tienen contenido`);
    console.log('✅ Proceso completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar el script
verifyAndMapLessons();