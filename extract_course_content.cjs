const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Configuración del curso
const CURSO_DIR = './curso_extraido/Módulo 1';
const OUTPUT_FILE = './curso_content_extracted.json';

// Función para extraer texto limpio del HTML
function extractCleanText(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Remover scripts y estilos
    const scripts = document.querySelectorAll('script, style');
    scripts.forEach(script => script.remove());
    
    // Extraer el contenido principal
    const mainContent = document.querySelector('.elementor-widget-container, .entry-content, .ld-tab-content');
    
    if (mainContent) {
        return mainContent.textContent.trim().replace(/\s+/g, ' ');
    }
    
    return document.body.textContent.trim().replace(/\s+/g, ' ');
}

// Función para extraer información de una lección
function extractLessonInfo(lessonDir) {
    const contenidoPath = path.join(lessonDir, 'contenido.html');
    const imagenesDir = path.join(lessonDir, 'imagenes');
    
    if (!fs.existsSync(contenidoPath)) {
        return null;
    }
    
    const htmlContent = fs.readFileSync(contenidoPath, 'utf8');
    const cleanText = extractCleanText(htmlContent);
    
    // Extraer título de la carpeta
    const folderName = path.basename(lessonDir);
    const titleMatch = folderName.match(/^\d+_(.+)$/);
    const title = titleMatch ? titleMatch[1].replace(/_/g, ' ') : folderName;
    
    // Verificar si tiene cuestionario
    const hasQuiz = folderName.includes('Cuestionario') || cleanText.includes('cuestionario');
    
    // Buscar PDFs en la carpeta
    const pdfFiles = [];
    try {
        const files = fs.readdirSync(lessonDir);
        files.forEach(file => {
            if (file.endsWith('.pdf')) {
                pdfFiles.push(file);
            }
        });
    } catch (error) {
        console.log(`No se pudieron leer archivos en ${lessonDir}`);
    }
    
    // Buscar imágenes
    const imageFiles = [];
    try {
        if (fs.existsSync(imagenesDir)) {
            const images = fs.readdirSync(imagenesDir);
            imageFiles.push(...images.filter(img => 
                img.endsWith('.jpg') || img.endsWith('.png') || img.endsWith('.gif') || img.endsWith('.jpeg')
            ));
        }
    } catch (error) {
        console.log(`No se pudieron leer imágenes en ${imagenesDir}`);
    }
    
    return {
        title: title,
        htmlContent: htmlContent,
        cleanText: cleanText,
        hasQuiz: hasQuiz,
        pdfFiles: pdfFiles,
        imageFiles: imageFiles,
        folderName: folderName
    };
}

// Función principal
function extractAllLessons() {
    if (!fs.existsSync(CURSO_DIR)) {
        console.error(`Directorio del curso no encontrado: ${CURSO_DIR}`);
        return;
    }
    
    const lessons = [];
    const lessonDirs = fs.readdirSync(CURSO_DIR)
        .filter(dir => {
            const fullPath = path.join(CURSO_DIR, dir);
            return fs.statSync(fullPath).isDirectory();
        })
        .sort(); // Ordenar por nombre para mantener el orden numérico
    
    console.log(`Encontradas ${lessonDirs.length} lecciones`);
    
    lessonDirs.forEach((dir, index) => {
        const lessonPath = path.join(CURSO_DIR, dir);
        const lessonInfo = extractLessonInfo(lessonPath);
        
        if (lessonInfo) {
            lessonInfo.order = index + 1;
            lessons.push(lessonInfo);
            console.log(`✓ Procesada lección ${index + 1}: ${lessonInfo.title}`);
        } else {
            console.log(`✗ Error procesando lección: ${dir}`);
        }
    });
    
    // Guardar resultado
    const result = {
        courseTitle: 'Experto en Conductas Adictivas',
        moduleTitle: 'Módulo 1 - Fundamentos y Terapias',
        totalLessons: lessons.length,
        extractedAt: new Date().toISOString(),
        lessons: lessons
    };
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8');
    console.log(`\n✅ Extracción completada. Resultado guardado en: ${OUTPUT_FILE}`);
    console.log(`📊 Total de lecciones procesadas: ${lessons.length}`);
    
    // Estadísticas
    const totalPDFs = lessons.reduce((sum, lesson) => sum + lesson.pdfFiles.length, 0);
    const lessonsWithQuiz = lessons.filter(lesson => lesson.hasQuiz).length;
    
    console.log(`📄 Total de PDFs encontrados: ${totalPDFs}`);
    console.log(`❓ Lecciones con cuestionario: ${lessonsWithQuiz}`);
    
    return result;
}

// Ejecutar si se llama directamente
if (require.main === module) {
    extractAllLessons();
}

module.exports = { extractAllLessons, extractLessonInfo };