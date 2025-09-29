import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para limpiar nombres de archivos
function cleanFilename(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Función para extraer contenido educativo específico
function extractCleanContent(html) {
    const $ = cheerio.load(html);
    
    // Buscar el contenido específico del div ld-tab-content
    const contentDiv = $('[id^="ld-tab-content"]').first();
    
    if (!contentDiv.length) {
        console.log('No se encontró el div ld-tab-content');
        return '';
    }
    
    const cleanElements = [];
    
    // Extraer títulos principales
    contentDiv.find('h1, h2, h3, h4, h5, h6').each((i, element) => {
        const $el = $(element);
        const text = $el.text().trim();
        if (text && !text.includes('WordPress') && !text.includes('admin')) {
            cleanElements.push(`<h2>${text}</h2>`);
        }
    });
    
    // Extraer párrafos con contenido significativo
    contentDiv.find('p').each((i, element) => {
        const $el = $(element);
        const text = $el.text().trim();
        
        // Solo párrafos con contenido educativo real
        if (text && 
            text.length > 20 && 
            !text.includes('WordPress') && 
            !text.includes('wp-') && 
            !text.includes('admin') &&
            !text.includes('cookie') &&
            !text.includes('javascript') &&
            !$el.closest('.wp-admin').length &&
            !$el.closest('[class*="admin"]').length) {
            
            // Limpiar el HTML interno
            let cleanHtml = $el.html();
            cleanHtml = cleanHtml.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
            cleanHtml = cleanHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
            cleanHtml = cleanHtml.replace(/class="[^"]*"/g, '');
            cleanHtml = cleanHtml.replace(/id="[^"]*"/g, '');
            cleanHtml = cleanHtml.replace(/style="[^"]*"/g, '');
            
            cleanElements.push(`<p>${cleanHtml}</p>`);
        }
    });
    
    // Extraer imágenes educativas
    contentDiv.find('img').each((i, element) => {
        const $el = $(element);
        const src = $el.attr('src');
        const alt = $el.attr('alt') || '';
        
        if (src && !src.includes('admin') && !src.includes('wp-admin')) {
            cleanElements.push(`<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; margin: 15px 0;">`);
        }
    });
    
    // Extraer listas
    contentDiv.find('ul, ol').each((i, element) => {
        const $el = $(element);
        const text = $el.text().trim();
        
        if (text && !text.includes('WordPress') && !text.includes('admin')) {
            const tagName = element.tagName.toLowerCase();
            let listHtml = $el.html();
            
            // Limpiar atributos de las listas
            listHtml = listHtml.replace(/class="[^"]*"/g, '');
            listHtml = listHtml.replace(/id="[^"]*"/g, '');
            listHtml = listHtml.replace(/style="[^"]*"/g, '');
            
            cleanElements.push(`<${tagName}>${listHtml}</${tagName}>`);
        }
    });
    
    return cleanElements.join('\n\n');
}

// Función principal
async function extractLessons() {
    const cursoPath = path.join(__dirname, 'curso_extraido', 'Módulo 1');
    const outputPath = path.join(__dirname, 'public', 'lessons');
    
    console.log('🚀 Iniciando extracción de lecciones...');
    console.log(`📂 Carpeta origen: ${cursoPath}`);
    console.log(`📁 Carpeta destino: ${outputPath}`);
    
    // Limpiar directorio de salida
    if (fs.existsSync(outputPath)) {
        console.log('🧹 Limpiando archivos anteriores...');
        fs.rmSync(outputPath, { recursive: true, force: true });
    }
    fs.mkdirSync(outputPath, { recursive: true });
    
    const lessons = [];
    
    try {
        // Leer carpetas de lecciones
        const folders = fs.readdirSync(cursoPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .sort();
        
        console.log(`📚 Encontradas ${folders.length} carpetas de lecciones`);
        
        for (let i = 0; i < folders.length; i++) {
            const folder = folders[i];
            const lessonPath = path.join(cursoPath, folder);
            const htmlFile = path.join(lessonPath, 'contenido.html');
            const imagesPath = path.join(lessonPath, 'imagenes');
            
            console.log(`\n📖 Procesando: ${folder}`);
            
            if (!fs.existsSync(htmlFile)) {
                console.log(`⚠️  Saltando ${folder} - no tiene contenido.html`);
                continue;
            }
            
            // Leer HTML original
            const htmlContent = fs.readFileSync(htmlFile, 'utf-8');
            console.log(`📄 Archivo HTML leído: ${htmlContent.length} caracteres`);
            
            // Extraer contenido limpio
            const cleanContent = extractCleanContent(htmlContent);
            console.log(`✨ Contenido extraído: ${cleanContent.length} caracteres`);
            
            if (!cleanContent || cleanContent.trim().length === 0) {
                console.log(`❌ No se pudo extraer contenido de ${folder}`);
                continue;
            }
            
            // Extraer título de la carpeta
            const titleMatch = folder.match(/\d+_(.+)/);
            let title = titleMatch ? titleMatch[1].replace(/_/g, ' ') : folder;
            
            // Limpiar el título
            if (title.endsWith('_')) {
                title = title.slice(0, -1);
            }
            
            console.log(`📝 Título: ${title}`);
            
            // Crear nombre de archivo limpio
            const filename = `leccion-${i + 1}-${cleanFilename(title)}.html`;
            
            // Crear HTML completo
            const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f9f9f9;
            color: #333;
        }
        .lesson-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .lesson-header {
            border-bottom: 4px solid #007cba;
            padding-bottom: 20px;
            margin-bottom: 40px;
            text-align: center;
        }
        .lesson-header h1 {
            color: #007cba;
            margin: 0;
            font-size: 2.2em;
            font-weight: 600;
        }
        .lesson-info {
            color: #666;
            font-size: 0.9em;
            margin-top: 10px;
        }
        .lesson-content h1, .lesson-content h2, .lesson-content h3 {
            color: #007cba;
            margin-top: 35px;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .lesson-content h2 {
            font-size: 1.5em;
            border-left: 4px solid #007cba;
            padding-left: 15px;
        }
        .lesson-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 20px 0;
            display: block;
            margin-left: auto;
            margin-right: auto;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .lesson-content p {
            margin-bottom: 18px;
            text-align: justify;
            line-height: 1.7;
            font-size: 1.05em;
        }
        .lesson-content ul, .lesson-content ol {
            margin-bottom: 20px;
            padding-left: 30px;
        }
        .lesson-content li {
            margin-bottom: 10px;
            line-height: 1.6;
        }
        .lesson-content strong {
            color: #007cba;
            font-weight: 600;
        }
        .lesson-content em {
            font-style: italic;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="lesson-container">
        <div class="lesson-header">
            <h1>${title}</h1>
            <div class="lesson-info">
                <strong>Lección ${i + 1}</strong> de ${folders.length}
            </div>
        </div>
        <div class="lesson-content">
            ${cleanContent}
        </div>
    </div>
</body>
</html>`;
            
            // Guardar archivo HTML
            const outputFile = path.join(outputPath, filename);
            fs.writeFileSync(outputFile, fullHtml, 'utf-8');
            console.log(`💾 Guardado: ${filename}`);
            
            // Copiar imágenes si existen
            if (fs.existsSync(imagesPath)) {
                const lessonImagesPath = path.join(outputPath, `images-leccion-${i + 1}`);
                fs.mkdirSync(lessonImagesPath, { recursive: true });
                
                const images = fs.readdirSync(imagesPath);
                console.log(`🖼️  Copiando ${images.length} imágenes...`);
                
                images.forEach(image => {
                    const srcImage = path.join(imagesPath, image);
                    const destImage = path.join(lessonImagesPath, image);
                    fs.copyFileSync(srcImage, destImage);
                });
            }
            
            // Agregar a metadatos
            lessons.push({
                id: i + 1,
                title: title,
                filename: filename,
                folder: folder,
                hasImages: fs.existsSync(imagesPath),
                contentLength: cleanContent.length,
                extractedAt: new Date().toISOString()
            });
            
            console.log(`✅ Lección ${i + 1} completada`);
        }
        
        // Crear archivo de metadatos
        const metadata = {
            totalLessons: lessons.length,
            extractedAt: new Date().toISOString(),
            lessons: lessons
        };
        
        const metadataFile = path.join(outputPath, 'lessons-metadata.json');
        fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2), 'utf-8');
        
        console.log(`\n🎉 ¡Extracción completada exitosamente!`);
        console.log(`📊 Resumen:`);
        console.log(`   • ${lessons.length} lecciones procesadas`);
        console.log(`   • Archivos guardados en: ${outputPath}`);
        console.log(`   • Metadatos: lessons-metadata.json`);
        
        // Mostrar lista de archivos generados
        console.log(`\n📋 Archivos generados:`);
        lessons.forEach(lesson => {
            console.log(`   ${lesson.id}. ${lesson.filename}`);
        });
        
    } catch (error) {
        console.error('❌ Error durante la extracción:', error);
        throw error;
    }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
    extractLessons().catch(console.error);
}

export { extractLessons };