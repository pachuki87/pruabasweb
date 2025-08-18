import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

// Mapping of folders to lesson numbers
const folderToLessonMap = {
  '1)FUNDAMENTOS P TERAPEUTICO': 1,
  '2) TERAPIA COGNITIVA DROGODEPENDENENCIAS': 2,
  '3) FAMILIA Y TRABAJO EQUIPO': 3,
  '4)RECOVERY COACHING': 4,
  '6) INTERVENCION FAMILIAR Y RECOVERY MENTORING': 5,
  '7) NUEVOS MODELOS TERAPEUTICOS': 6,
  '9) INTELIGENCIA EMOCIONAL': 7
};

// Función para convertir texto a HTML estructurado
function convertTextToHTML(text) {
  if (!text || text.trim() === '') {
    return '<p>Contenido no disponible</p>';
  }

  // Limpiar el texto
  let cleanText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Dividir en párrafos
  let paragraphs = cleanText.split('\n\n');
  let html = '';

  paragraphs.forEach((paragraph, index) => {
    paragraph = paragraph.trim();
    if (paragraph === '') return;

    // Detectar títulos (líneas cortas en mayúsculas o con números)
    if (paragraph.length < 100 && 
        (paragraph.toUpperCase() === paragraph || 
         /^\d+\./.test(paragraph) || 
         /^[A-Z][A-Z\s]{5,}$/.test(paragraph))) {
      html += `<h3>${paragraph}</h3>\n`;
    }
    // Detectar listas (líneas que empiezan con - o números)
    else if (paragraph.includes('\n-') || paragraph.includes('\n•') || /\n\d+\./.test(paragraph)) {
      let lines = paragraph.split('\n');
      let listItems = [];
      let currentParagraph = '';
      
      lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('-') || line.startsWith('•') || /^\d+\./.test(line)) {
          if (currentParagraph) {
            html += `<p>${currentParagraph}</p>\n`;
            currentParagraph = '';
          }
          listItems.push(line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, ''));
        } else {
          if (listItems.length > 0) {
            html += '<ul>\n';
            listItems.forEach(item => {
              html += `  <li>${item}</li>\n`;
            });
            html += '</ul>\n';
            listItems = [];
          }
          currentParagraph += (currentParagraph ? ' ' : '') + line;
        }
      });
      
      if (listItems.length > 0) {
        html += '<ul>\n';
        listItems.forEach(item => {
          html += `  <li>${item}</li>\n`;
        });
        html += '</ul>\n';
      }
      
      if (currentParagraph) {
        html += `<p>${currentParagraph}</p>\n`;
      }
    }
    // Párrafo normal
    else {
      html += `<p>${paragraph}</p>\n`;
    }
  });

  return html || '<p>Contenido procesado pero vacío</p>';
}

// Función para extraer texto de un PDF
async function extractPDFText(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Error extrayendo texto de ${filePath}:`, error.message);
    return null;
  }
}

// Función para procesar todos los PDFs en una carpeta
async function processFolderPDFs(folderPath) {
  const files = fs.readdirSync(folderPath);
  const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
  
  let combinedContent = '';
  
  for (const pdfFile of pdfFiles) {
    const pdfPath = path.join(folderPath, pdfFile);
    console.log(`Procesando: ${pdfFile}`);
    
    const text = await extractPDFText(pdfPath);
    if (text) {
      combinedContent += `\n\n=== ${pdfFile.replace('.pdf', '')} ===\n\n${text}`;
    }
  }
  
  return combinedContent;
}

// Función para obtener el ID del curso
async function getCourseId() {
  const { data, error } = await supabase
    .from('cursos')
    .select('id')
    .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
    .single();
    
  if (error) {
    console.error('Error obteniendo curso:', error);
    return null;
  }
  
  return data?.id;
}

// Función para actualizar una lección
async function updateLesson(courseId, lessonNumber, htmlContent) {
  const { data, error } = await supabase
    .from('lecciones')
    .update({ contenido_html: htmlContent })
    .eq('curso_id', courseId)
    .eq('orden', lessonNumber);
    
  if (error) {
    console.error(`Error actualizando lección ${lessonNumber}:`, error);
    return false;
  }
  
  console.log(`✓ Lección ${lessonNumber} actualizada correctamente`);
  return true;
}

// Función principal
async function main() {
  const baseFolder = 'C:\\Users\\pabli\\Downloads\\project - copia\\inteligencia_emocional_drive';
  
  console.log('Iniciando extracción de contenido de PDFs...');
  
  // Obtener ID del curso
  const courseId = await getCourseId();
  if (!courseId) {
    console.error('No se pudo encontrar el curso');
    return;
  }
  
  console.log(`Curso encontrado con ID: ${courseId}`);
  
  // Procesar cada carpeta
  for (const [folderName, lessonNumber] of Object.entries(folderToLessonMap)) {
    const folderPath = path.join(baseFolder, folderName);
    
    if (!fs.existsSync(folderPath)) {
      console.log(`⚠️  Carpeta no encontrada: ${folderName}`);
      continue;
    }
    
    console.log(`\n📁 Procesando carpeta: ${folderName} -> Lección ${lessonNumber}`);
    
    // Extraer contenido de todos los PDFs en la carpeta
    const combinedText = await processFolderPDFs(folderPath);
    
    if (combinedText.trim()) {
      // Convertir a HTML
      const htmlContent = convertTextToHTML(combinedText);
      
      // Actualizar lección en la base de datos
      await updateLesson(courseId, lessonNumber, htmlContent);
    } else {
      console.log(`⚠️  No se encontró contenido en PDFs de ${folderName}`);
    }
  }
  
  console.log('\n✅ Proceso completado');
}

// Ejecutar el script
main().catch(console.error);

export { main, convertTextToHTML, extractPDFText };