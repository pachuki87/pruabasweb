import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Función para extraer texto de PDF usando pdf-parse
async function extractPDFContent(pdfPath) {
  try {
    const pdfParse = await import('pdf-parse');
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse.default(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error al extraer contenido del PDF:', error);
    return null;
  }
}

// Función para convertir texto a HTML estructurado
function convertToHTML(text, titulo) {
  if (!text) return '';
  
  // Limpiar y estructurar el texto
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  let html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        h3 {
            color: #7f8c8d;
            margin-top: 25px;
            margin-bottom: 10px;
        }
        p {
            margin-bottom: 15px;
            text-align: justify;
        }
        .highlight {
            background-color: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #3498db;
            margin: 20px 0;
        }
        .section {
            margin-bottom: 30px;
        }
        ul, ol {
            margin-bottom: 15px;
            padding-left: 30px;
        }
        li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <h1>${titulo}</h1>
`;
  
  let currentSection = '';
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detectar títulos y subtítulos
    if (line.length < 100 && (line.toUpperCase() === line || line.includes(':') || /^\d+\./.test(line))) {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      
      if (line.length < 50) {
        html += `    <h2>${line}</h2>\n`;
      } else {
        html += `    <h3>${line}</h3>\n`;
      }
    }
    // Detectar listas
    else if (line.startsWith('•') || line.startsWith('-') || /^\d+\./.test(line)) {
      if (!inList) {
        html += '    <ul>\n';
        inList = true;
      }
      const cleanLine = line.replace(/^[•\-\d+\.\s]+/, '');
      html += `        <li>${cleanLine}</li>\n`;
    }
    // Párrafos normales
    else {
      if (inList) {
        html += '    </ul>\n';
        inList = false;
      }
      
      if (line.length > 20) {
        html += `    <p>${line}</p>\n`;
      }
    }
  }
  
  if (inList) {
    html += '    </ul>\n';
  }
  
  html += '</body>\n</html>';
  
  return html;
}

// Función principal para restaurar contenido de lecciones vacías
async function restoreLessonContent() {
  try {
    console.log('🔄 Iniciando restauración de contenido de lecciones vacías...');
    
    // Obtener el curso MÁSTER EN ADICCIONES
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('*');
    
    if (cursosError) {
      console.error('❌ Error al obtener cursos:', cursosError);
      return;
    }
    
    const curso = cursos.find(c => c.titulo && c.titulo.includes('MÁSTER EN ADICCIONES'));
    
    if (!curso) {
      console.error('❌ No se encontró el curso MÁSTER EN ADICCIONES');
      return;
    }
    
    console.log('✅ Curso encontrado:', curso.titulo);
    
    // Obtener lecciones del curso
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', curso.id)
      .order('orden');
    
    if (leccionesError) {
      console.error('❌ Error al obtener lecciones:', leccionesError);
      return;
    }
    
    console.log(`📚 Total de lecciones: ${lecciones.length}`);
    
    // Identificar lecciones vacías
    const leccionesVacias = [];
    
    for (const leccion of lecciones) {
      const tieneContenido = leccion.contenido_html && leccion.contenido_html.trim().length > 0;
      const tieneArchivoUrl = leccion.archivo_url && leccion.archivo_url.trim().length > 0;
      
      let archivoVacio = false;
      if (tieneArchivoUrl) {
        const archivoPath = leccion.archivo_url.replace('/lessons/', 'public/lessons/');
        if (fs.existsSync(archivoPath)) {
          const stats = fs.statSync(archivoPath);
          archivoVacio = stats.size === 0;
        } else {
          archivoVacio = true;
        }
      }
      
      if (!tieneContenido && (!tieneArchivoUrl || archivoVacio)) {
        leccionesVacias.push(leccion);
      }
    }
    
    console.log(`🔴 Lecciones vacías encontradas: ${leccionesVacias.length}`);
    
    if (leccionesVacias.length === 0) {
      console.log('🎉 No hay lecciones vacías para restaurar');
      return;
    }
    
    // Procesar cada lección vacía
    for (const leccion of leccionesVacias) {
      console.log(`\n📖 Procesando Lección ${leccion.orden}: ${leccion.titulo}`);
      
      // Buscar carpeta correspondiente
      const pdfDir = 'inteligencia_emocional_drive';
      const carpetas = fs.readdirSync(pdfDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      const carpetaLeccion = carpetas.find(carpeta => {
        const numeroLeccion = parseInt(carpeta.match(/\d+/)?.[0] || '0');
        return numeroLeccion === leccion.orden;
      });
      
      if (!carpetaLeccion) {
        console.log(`❌ No se encontró carpeta para lección ${leccion.orden}`);
        continue;
      }
      
      console.log(`📁 Carpeta encontrada: ${carpetaLeccion}`);
      
      // Buscar archivos PDF en la carpeta
      const carpetaPath = path.join(pdfDir, carpetaLeccion);
      const archivos = fs.readdirSync(carpetaPath)
        .filter(archivo => archivo.toLowerCase().endsWith('.pdf'));
      
      if (archivos.length === 0) {
        console.log(`❌ No se encontraron archivos PDF en ${carpetaLeccion}`);
        continue;
      }
      
      console.log(`📄 Archivos PDF encontrados: ${archivos.length}`);
      
      // Procesar cada PDF
      let contenidoCompleto = '';
      
      for (const archivo of archivos) {
        const pdfPath = path.join(carpetaPath, archivo);
        console.log(`🔍 Extrayendo contenido de: ${archivo}`);
        
        const contenidoPDF = await extractPDFContent(pdfPath);
        
        if (contenidoPDF) {
          contenidoCompleto += contenidoPDF + '\n\n';
          console.log(`✅ Contenido extraído: ${contenidoPDF.length} caracteres`);
        } else {
          console.log(`❌ No se pudo extraer contenido de: ${archivo}`);
        }
      }
      
      if (contenidoCompleto.trim().length === 0) {
        console.log(`❌ No se pudo extraer contenido de la lección ${leccion.orden}`);
        continue;
      }
      
      // Convertir a HTML
      console.log('🔄 Convirtiendo contenido a HTML...');
      const contenidoHTML = convertToHTML(contenidoCompleto, leccion.titulo);
      
      // Crear archivo HTML
      const nombreArchivo = `leccion-${leccion.orden}-${leccion.titulo.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}.html`;
      const archivoPath = path.join('public', 'lessons', nombreArchivo);
      
      // Asegurar que existe el directorio
      const dirPath = path.dirname(archivoPath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      // Escribir archivo HTML
      fs.writeFileSync(archivoPath, contenidoHTML, 'utf8');
      console.log(`✅ Archivo HTML creado: ${archivoPath}`);
      
      // Actualizar base de datos
      const archivoUrl = `/lessons/${nombreArchivo}`;
      
      const { error: updateError } = await supabase
        .from('lecciones')
        .update({ archivo_url: archivoUrl })
        .eq('id', leccion.id);
      
      if (updateError) {
        console.error(`❌ Error al actualizar lección ${leccion.orden}:`, updateError);
      } else {
        console.log(`✅ Base de datos actualizada para lección ${leccion.orden}`);
      }
    }
    
    console.log('\n🎉 Restauración de contenido completada');
    
  } catch (error) {
    console.error('❌ Error durante la restauración:', error);
  }
}

// Ejecutar restauración
restoreLessonContent().then(() => {
  console.log('✅ Proceso de restauración finalizado');
}).catch(error => {
  console.error('❌ Error fatal:', error);
});