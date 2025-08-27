import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para limpiar nombres de archivos
function cleanFileName(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Función para extraer solo el contenido educativo
function extractEducationalContent(html) {
    const $ = cheerio.load(html);
    
    // Buscar el contenido principal en diferentes selectores posibles
    let mainContent = null;
    
    // Intentar diferentes selectores donde puede estar el contenido
    const contentSelectors = [
        '#ld-tab-content-10058',
        '.ld-tab-content',
        '.entry-content',
        '.content-area .entry-content',
        '.lesson-content',
        'article .entry-content',
        '.post-content'
    ];
    
    for (const selector of contentSelectors) {
        const element = $(selector);
        if (element.length > 0 && element.text().trim().length > 100) {
            mainContent = element;
            break;
        }
    }
    
    if (!mainContent) {
        console.log('No se encontró contenido principal, buscando en el body...');
        mainContent = $('body');
    }
    
    // Crear un nuevo documento limpio
    const cleanContent = cheerio.load('<div></div>');
    const container = cleanContent('div');
    
    // Extraer solo elementos educativos relevantes
    const educationalElements = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'ul', 'ol', 'li',
        'img', 'figure',
        'strong', 'em', 'b', 'i',
        'blockquote', 'pre', 'code'
    ];
    
    mainContent.find('*').each((i, element) => {
        const tagName = element.tagName.toLowerCase();
        const $element = $(element);
        
        // Solo procesar elementos educativos
        if (educationalElements.includes(tagName)) {
            const text = $element.text().trim();
            
            // Filtrar elementos vacíos o con contenido irrelevante
            if (text.length > 0 && 
                !text.includes('WordPress') &&
                !text.includes('admin') &&
                !text.includes('login') &&
                !text.includes('cookie') &&
                !$element.hasClass('wp-') &&
                !$element.hasClass('admin-') &&
                !$element.attr('id')?.includes('wp-') &&
                !$element.attr('id')?.includes('admin')) {
                
                if (tagName === 'img') {
                    // Procesar imágenes
                    const src = $element.attr('src');
                    const alt = $element.attr('alt') || '';
                    if (src && !src.includes('wp-admin') && !src.includes('emoji')) {
                        container.append(`<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto;">`);
                    }
                } else {
                    // Procesar otros elementos de texto
                    const cleanElement = cleanContent(element).clone();
                    // Limpiar atributos innecesarios
                    cleanElement.removeAttr('class')
                               .removeAttr('id')
                               .removeAttr('style')
                               .removeAttr('data-*');
                    container.append(cleanElement);
                }
            }
        }
    });
    
    return container.html() || '';
}

// Función principal
async function extractLessons() {
    const cursoPath = path.join(__dirname, 'curso_extraido', 'Módulo 1');
    const outputPath = path.join(__dirname, 'public', 'lessons');
    const imagesPath = path.join(outputPath, 'images');
    
    // Limpiar directorio de salida
    if (fs.existsSync(outputPath)) {
        fs.rmSync(outputPath, { recursive: true, force: true });
    }
    
    // Crear directorios
    fs.mkdirSync(outputPath, { recursive: true });
    fs.mkdirSync(imagesPath, { recursive: true });
    
    const lessons = [];
    
    try {
        const lessonFolders = fs.readdirSync(cursoPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .sort();
        
        console.log(`Encontradas ${lessonFolders.length} lecciones`);
        
        for (let i = 0; i < lessonFolders.length; i++) {
            const folderName = lessonFolders[i];
            const lessonPath = path.join(cursoPath, folderName);
            const htmlFile = path.join(lessonPath, 'contenido.html');
            
            if (!fs.existsSync(htmlFile)) {
                console.log(`Archivo HTML no encontrado para: ${folderName}`);
                continue;
            }
            
            console.log(`Procesando: ${folderName}`);
            
            // Leer HTML
            const htmlContent = fs.readFileSync(htmlFile, 'utf-8');
            
            // Extraer título de la carpeta
            const titleMatch = folderName.match(/\d+_(.+)/);
            const title = titleMatch ? titleMatch[1].replace(/_/g, ' ') : folderName;
            
            // Extraer contenido educativo
            const cleanContent = extractEducationalContent(htmlContent);
            
            if (cleanContent.trim().length === 0) {
                console.log(`No se pudo extraer contenido de: ${folderName}`);
                continue;
            }
            
            // Generar HTML limpio
            const cleanFileName = `leccion-${i + 1}-${cleanFileName(title)}.html`;
            const htmlOutput = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        h1 {
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        p {
            margin-bottom: 15px;
            text-align: justify;
        }
        ul, ol {
            margin-bottom: 15px;
            padding-left: 30px;
        }
        li {
            margin-bottom: 5px;
        }
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 20px auto;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        strong {
            color: #2c3e50;
        }
        blockquote {
            border-left: 4px solid #3498db;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #f8f9fa;
            font-style: italic;
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="lesson-content">
        ${cleanContent}
    </div>
</body>
</html>`;
            
            // Guardar archivo HTML
            const outputFile = path.join(outputPath, cleanFileName);
            fs.writeFileSync(outputFile, htmlOutput, 'utf-8');
            
            // Copiar imágenes si existen
            const imagesFolder = path.join(lessonPath, 'imagenes');
            if (fs.existsSync(imagesFolder)) {
                const lessonImagesPath = path.join(imagesPath, `leccion-${i + 1}`);
                fs.mkdirSync(lessonImagesPath, { recursive: true });
                
                const imageFiles = fs.readdirSync(imagesFolder);
                imageFiles.forEach(imageFile => {
                    const srcImage = path.join(imagesFolder, imageFile);
                    const destImage = path.join(lessonImagesPath, imageFile);
                    fs.copyFileSync(srcImage, destImage);
                });
            }
            
            // Agregar a metadatos
            lessons.push({
                id: i + 1,
                title: title,
                fileName: cleanFileName,
                originalFolder: folderName,
                contentLength: cleanContent.length,
                hasImages: fs.existsSync(path.join(lessonPath, 'imagenes'))
            });
            
            console.log(`✓ Procesada: ${title}`);
        }
        
        // Guardar metadatos
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
        
        console.log(`\n✅ Extracción completada:`);
        console.log(`- ${lessons.length} lecciones procesadas`);
        console.log(`- Archivos guardados en: ${outputPath}`);
        console.log(`- Metadatos guardados en: lessons-metadata.json`);
        
    } catch (error) {
        console.error('Error durante la extracción:', error);
    }
}

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
    extractLessons();
}

export { extractLessons };