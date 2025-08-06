const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase (usar las variables de entorno)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables de entorno de Supabase no encontradas');
    console.log('Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY configuradas');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Función para limpiar HTML y extraer texto plano
function cleanHtmlContent(html) {
    // Remover scripts, estilos y comentarios
    let cleaned = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
    
    // Mantener solo el contenido principal
    const mainContentMatch = cleaned.match(/<div[^>]*class="[^"]*elementor[^"]*"[^>]*>[\s\S]*?<\/div>/gi);
    if (mainContentMatch && mainContentMatch.length > 0) {
        cleaned = mainContentMatch[0];
    }
    
    return cleaned;
}

// Función para estimar duración de lectura
function estimateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.max(5, Math.ceil(words / wordsPerMinute));
}

// Función principal para insertar lecciones
async function insertLessons() {
    try {
        // Leer el archivo JSON con el contenido extraído
        const jsonContent = fs.readFileSync('./curso_content_extracted.json', 'utf8');
        const courseData = JSON.parse(jsonContent);
        
        console.log(`📚 Procesando ${courseData.totalLessons} lecciones...`);
        
        // Obtener el ID del curso
        const { data: cursos, error: cursosError } = await supabase
            .from('cursos')
            .select('id')
            .eq('titulo', 'Experto en Conductas Adictivas')
            .single();
        
        if (cursosError || !cursos) {
            console.error('❌ Error al obtener el curso:', cursosError);
            return;
        }
        
        const cursoId = cursos.id;
        console.log(`✅ Curso encontrado con ID: ${cursoId}`);
        
        // Insertar cada lección
        for (const lesson of courseData.lessons) {
            const cleanedHtml = cleanHtmlContent(lesson.htmlContent);
            const readingTime = estimateReadingTime(lesson.cleanText);
            
            const leccionData = {
                curso_id: cursoId,
                titulo: lesson.title.trim(),
                descripcion: lesson.cleanText.substring(0, 500) + '...',
                contenido_html: cleanedHtml,
                orden: lesson.order,
                duracion_estimada: readingTime,
                tiene_cuestionario: lesson.hasQuiz,
                imagen_url: lesson.imageFiles.length > 0 ? 
                    `https://institutolidera.com/wp-content/uploads/2022/10/${lesson.imageFiles[0]}` : null
            };
            
            const { data: leccionInsertada, error: leccionError } = await supabase
                .from('lecciones')
                .insert(leccionData)
                .select()
                .single();
            
            if (leccionError) {
                console.error(`❌ Error al insertar lección "${lesson.title}":`, leccionError);
                continue;
            }
            
            console.log(`✅ Lección insertada: ${lesson.order}. ${lesson.title}`);
            
            // Insertar materiales PDF si existen
            if (lesson.pdfFiles.length > 0) {
                for (const pdfFile of lesson.pdfFiles) {
                    const materialData = {
                        titulo: pdfFile.replace('.pdf', '').replace(/-/g, ' '),
                        curso_id: cursoId,
                        leccion_id: leccionInsertada.id,
                        url_archivo: `/curso_materiales/${pdfFile}`,
                        tipo_material: 'pdf',
                        descripcion: `Material complementario para la lección: ${lesson.title}`
                    };
                    
                    const { error: materialError } = await supabase
                        .from('materiales')
                        .insert(materialData);
                    
                    if (materialError) {
                        console.error(`❌ Error al insertar material "${pdfFile}":`, materialError);
                    } else {
                        console.log(`  📄 Material agregado: ${pdfFile}`);
                    }
                }
            }
        }
        
        console.log('\n🎉 ¡Todas las lecciones han sido insertadas exitosamente!');
        
        // Mostrar estadísticas finales
        const { data: leccionesCount } = await supabase
            .from('lecciones')
            .select('id', { count: 'exact' })
            .eq('curso_id', cursoId);
        
        const { data: materialesCount } = await supabase
            .from('materiales')
            .select('id', { count: 'exact' })
            .eq('curso_id', cursoId);
        
        console.log(`📊 Estadísticas finales:`);
        console.log(`   - Lecciones creadas: ${leccionesCount?.length || 0}`);
        console.log(`   - Materiales agregados: ${materialesCount?.length || 0}`);
        
    } catch (error) {
        console.error('❌ Error general:', error);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    insertLessons();
}

module.exports = { insertLessons };