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

// Función para extraer solo contenido educativo
function extractEducationalContent(html) {
    const $ = cheerio.load(html);
    
    // Buscar específicamente el contenido de la lección
    const mainContent = $('[id^="ld-tab-content"]').first();
    
    if (!mainContent.length) {
        console.log('No se encontró contenido principal');
        return '';
    }
    
    // Crear un nuevo documento limpio
    const cleanContent = [];
    
    // Extraer títulos (h1, h2, h3, etc.)
    mainContent.find('.elementor-heading-title').each((i, element) => {
        const $el = $(element);
        const text = $el.text().trim();
        if (text) {
            cleanContent.push(`<h2>${text}</h2>`);
        }
    });
    
    // Extraer párrafos de texto
    mainContent.find('.elementor-widget-text-editor .elementor-widget-container').each((i, element) => {
        const $el = $(element);
        const paragraphs = $el.find('p');
        
        paragraphs.each((j, p) => {
            const $p = $(p);
            const text = $p.text().trim();
            if (text && text.length > 10) { // Solo párrafos con contenido significativo
                const html = $p.html();
                cleanContent.push(`<p>${html}</p>`);
            }
        });
    });
    
    // Extraer imágenes
    mainContent.find('.elementor-widget-image img').each((i, element) => {
        const $el = $(element);
        const src = $el.attr('src');
        const alt = $el.attr('alt') || '';
        
        if (src) {
            cleanContent.push(`<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; margin: 15px 0;">`);
        }
    });
    
    // Extraer listas si las hay
    mainContent.find('ul, ol').each((i, element) => {
        const $el = $(element);
        const listHtml = $el.html();
        if (listHtml && listHtml.trim()) {
            const tagName = element.tagName.toLowerCase();
            cleanContent.push(`<${tagName}>${listHtml}</${tagName}>`);
        }
    });
    
    return cleanContent.join('\n');
}

// Función principal
async function extractLessons() {
    const cursoPath = path.join(__dirname, 'curso_extraido', 'Módulo 1');
    const outputPath = path.join(__dirname, 'public', 'lessons');
    
    // Limpiar directorio de salida
    if (fs.existsSync(outputPath)) {
        fs.rmSync(outputPath, { recursive: true, force: true });
    }
    fs.mkdirSync(outputPath, { recursive: true });
    
    const lessons = [];
    
    try {
        const folders = fs.readdirSync(cursoPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .sort();
        
        console.log(`Encontradas ${folders.length} carpetas de lecciones`);
        
        for (let i = 0; i < folders.length; i++) {
            const folder = folders[i];
            const lessonPath = path.join(cursoPath, folder);
            const htmlFile = path.join(lessonPath, 'contenido.html');
            const imagesPath = path.join(lessonPath, 'imagenes');
            
            if (!fs.existsSync(htmlFile)) {
                console.log(`Saltando ${folder} - no tiene contenido.html`);
                continue;
            }
            
            console.log(`Procesando: ${folder}`);
            
            // Leer y procesar HTML
            const htmlContent = fs.readFileSync(htmlFile, 'utf-8');
            const cleanContent = extractEducationalContent(htmlContent);
            
            if (!cleanContent || cleanContent.trim().length === 0) {
                console.log(`Advertencia: No se extrajo contenido de ${folder}`);
                continue;
            }
            
            // Extraer título de la carpeta
            const titleMatch = folder.match(/\d+_(.+)/);
            let title = titleMatch ? titleMatch[1].replace(/_/g, ' ') : folder;
            
            // Limpiar el título
            if (title.endsWith('_')) {
                title = title.slice(0, -1);
            }
            
            // Crear nombre de archivo limpio
            const filename = `leccion-${i + 1}-${cleanFilename(title)}.html`;
            
            // Crear HTML completo y limpio
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
        }
        .lesson-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .lesson-header {
            border-bottom: 3px solid #007cba;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        .lesson-header h1 {
            color: #333;
            margin: 0;
            font-size: 2em;
        }
        .lesson-content h1, .lesson-content h2, .lesson-content h3 {
            color: #007cba;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        .lesson-content img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 15px 0;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        .lesson-content p {
            margin-bottom: 15px;
            text-align: justify;
            color: #333;
        }
        .lesson-content ul, .lesson-content ol {
            margin-bottom: 15px;
            padding-left: 25px;
        }
        .lesson-content li {
            margin-bottom: 8px;
        }
        .lesson-content blockquote {
            border-left: 4px solid #007cba;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #f0f8ff;
            font-style: italic;
        }
        .lesson-content strong {
            color: #007cba;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="lesson-container">
        <div class="lesson-header">
            <h1>${title}</h1>
            <p><strong>Lección:</strong> ${i + 1} de ${folders.length}</p>
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
            
            // Copiar imágenes si existen
            if (fs.existsSync(imagesPath)) {
                const lessonImagesPath = path.join(outputPath, `images-leccion-${i + 1}`);
                fs.mkdirSync(lessonImagesPath, { recursive: true });
                
                const images = fs.readdirSync(imagesPath);
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
                contentLength: cleanContent.length
            });
            
            console.log(`✓ Procesada lección ${i + 1}: ${title}`);
        }
        
        // Crear archivo de metadatos
        const metadata = {
            totalLessons: lessons.length,
            extractedAt: new Date().toISOString(),
            lessons: lessons
        };
        
        fs.writeFileSync(
            path.join(outputPath, 'lessons-metadata.json'),
            JSON.stringify(metadata, null, 2),
            'utf-8'
        );
        
        console.log(`\n🎉 Extracción completada:`);
        console.log(`- ${lessons.length} lecciones procesadas`);
        console.log(`- Archivos guardados en: ${outputPath}`);
        console.log(`- Metadatos guardados en: lessons-metadata.json`);
        
    } catch (error) {
        console.error('Error durante la extracción:', error);
    }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
    extractLessons();
}

export { extractLessons };