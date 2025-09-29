import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configurar Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mapeo correcto basado en las carpetas disponibles
const correctFolderMapping = {
  '4)RECOVERY COACHING': 4,  // Esta carpeta existe pero no estaba mapeada correctamente
  '6) INTERVENCION FAMILIAR Y RECOVERY MENTORING': 5,  // Esta debería ser lección 5
  '7) NUEVOS MODELOS TERAPEUTICOS': 6,  // Esta debería ser lección 6
  '9) INTELIGENCIA EMOCIONAL': 7   // Esta debería ser lección 7
};

// Función para limpiar texto de caracteres problemáticos
function cleanText(text) {
  return text
    .replace(/\x00/g, '') // Eliminar caracteres null
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Eliminar caracteres de control
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim();
}

// Función para convertir texto a HTML estructurado
function convertToHTML(text, filename) {
  const cleanedText = cleanText(text);
  
  let html = `<p>=== ${filename} ===</p>\n`;
  
  const lines = cleanedText.split('\n');
  let currentParagraph = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine === '') {
      if (currentParagraph) {
        html += `<p>${currentParagraph}</p>\n`;
        currentParagraph = '';
      }
      continue;
    }
    
    // Detectar títulos (líneas cortas en mayúsculas o con palabras clave)
    if (trimmedLine.length < 100 && 
        (trimmedLine === trimmedLine.toUpperCase() || 
         /^(CAPÍTULO|TEMA|MÓDULO|BLOQUE|UNIDAD)/i.test(trimmedLine))) {
      if (currentParagraph) {
        html += `<p>${currentParagraph}</p>\n`;
        currentParagraph = '';
      }
      html += `<h3>${trimmedLine}</h3>\n`;
    } else {
      if (currentParagraph) {
        currentParagraph += ' ' + trimmedLine;
      } else {
        currentParagraph = trimmedLine;
      }
    }
  }
  
  if (currentParagraph) {
    html += `<p>${currentParagraph}</p>\n`;
  }
  
  return html;
}

async function fixMissingLessons() {
  try {
    console.log('🔧 Corrigiendo mapeo de lecciones faltantes...');
    
    // Obtener el curso
    const { data: course, error: courseError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
      .single();
    
    if (courseError) {
      console.error('❌ Error al obtener el curso:', courseError);
      return;
    }
    
    console.log(`📚 Curso encontrado: ${course.titulo}`);
    
    const baseDir = 'C:\\Users\\pabli\\Downloads\\project - copia\\inteligencia_emocional_drive';
    
    // Procesar cada carpeta en el mapeo correcto
    for (const [folderName, lessonOrder] of Object.entries(correctFolderMapping)) {
      const folderPath = path.join(baseDir, folderName);
      
      if (!fs.existsSync(folderPath)) {
        console.log(`⚠️  Carpeta no encontrada: ${folderName}`);
        continue;
      }
      
      console.log(`\n📁 Procesando carpeta: ${folderName} → Lección ${lessonOrder}`);
      
      // Obtener la lección existente
      const { data: existingLesson, error: lessonError } = await supabase
        .from('lecciones')
        .select('id, titulo, contenido_html')
        .eq('curso_id', course.id)
        .eq('orden', lessonOrder)
        .single();
      
      if (lessonError) {
        console.log(`❌ No se encontró lección ${lessonOrder}:`, lessonError.message);
        continue;
      }
      
      console.log(`📖 Lección encontrada: ${existingLesson.titulo}`);
      
      // Leer archivos PDF de la carpeta
      const files = fs.readdirSync(folderPath);
      const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
      
      if (pdfFiles.length === 0) {
        console.log(`⚠️  No se encontraron archivos PDF en ${folderName}`);
        continue;
      }
      
      let combinedHTML = '';
      
      // Procesar cada PDF
      for (const pdfFile of pdfFiles) {
        const pdfPath = path.join(folderPath, pdfFile);
        console.log(`   📄 Procesando: ${pdfFile}`);
        
        try {
          const dataBuffer = fs.readFileSync(pdfPath);
          const data = await pdfParse(dataBuffer);
          const htmlContent = convertToHTML(data.text, pdfFile.replace('.pdf', ''));
          combinedHTML += htmlContent + '\n\n';
          console.log(`   ✅ Extraído: ${data.text.length} caracteres`);
        } catch (pdfError) {
          console.log(`   ❌ Error procesando ${pdfFile}:`, pdfError.message);
        }
      }
      
      if (combinedHTML.trim()) {
        // Actualizar la lección con el nuevo contenido
        const { error: updateError } = await supabase
          .from('lecciones')
          .update({ contenido_html: combinedHTML.trim() })
          .eq('id', existingLesson.id);
        
        if (updateError) {
          console.log(`   ❌ Error actualizando lección ${lessonOrder}:`, updateError.message);
        } else {
          console.log(`   ✅ Lección ${lessonOrder} actualizada con ${combinedHTML.length} caracteres`);
        }
      }
    }
    
    console.log('\n🎉 Proceso completado!');
    console.log('\n📋 RESUMEN:');
    console.log('   • Se corrigió el mapeo de las carpetas a las lecciones correctas');
    console.log('   • Lección 4: Recovery Coaching');
    console.log('   • Lección 5: Intervención Familiar y Recovery Mentoring');
    console.log('   • Lección 6: Nuevos Modelos Terapéuticos');
    console.log('   • Lección 7: Inteligencia Emocional');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la corrección
fixMissingLessons();