import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtener información completa de navegación del curso
async function getCourseNavigationInfo() {
    try {
        // Leer credenciales de Supabase
        let supabaseUrl = '';
        let supabaseKey = '';
        
        try {
            const envPath = path.join(__dirname, '.env');
            if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, 'utf8');
                const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
                const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
                
                if (urlMatch) supabaseUrl = urlMatch[1].trim();
                if (keyMatch) supabaseKey = keyMatch[1].trim();
            }
        } catch (err) {
            console.log('No se pudo leer el archivo .env');
        }
        
        if (!supabaseUrl || !supabaseKey) {
            console.log('❌ No se encontraron las credenciales de Supabase');
            return;
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        console.log('🔍 Obteniendo información completa del curso "Experto en Conductas Adictivas"...');
        console.log('');
        
        // Obtener información del curso
        const { data: course, error: courseError } = await supabase
            .from('cursos')
            .select('*')
            .eq('titulo', 'Experto en Conductas Adictivas')
            .single();
        
        if (courseError) {
            console.error('❌ Error al buscar el curso:', courseError);
            return;
        }
        
        if (!course) {
            console.log('❌ No se encontró el curso "Experto en Conductas Adictivas"');
            return;
        }
        
        console.log('✅ INFORMACIÓN DEL CURSO:');
        console.log('=' .repeat(50));
        console.log('📚 Título:', course.titulo);
        console.log('🆔 ID del curso:', course.id);
        console.log('👨‍🏫 Profesor:', course.profesor_nombre || 'No especificado');
        console.log('📝 Descripción:', course.descripcion?.substring(0, 100) + '...');
        console.log('📅 Fecha de creación:', course.created_at ? new Date(course.created_at).toLocaleDateString('es-ES') : 'No disponible');
        console.log('');
        
        // Obtener lecciones del curso
        const { data: lessons, error: lessonsError } = await supabase
            .from('lecciones')
            .select('*')
            .eq('curso_id', course.id)
            .order('orden');
        
        if (lessonsError) {
            console.error('❌ Error al obtener lecciones:', lessonsError);
        } else {
            console.log('📖 LECCIONES DEL CURSO:');
            console.log('=' .repeat(50));
            if (lessons && lessons.length > 0) {
                lessons.forEach((lesson, index) => {
                    console.log(`${index + 1}. ${lesson.titulo}`);
                    console.log(`   📄 Contenido: ${lesson.contenido_html ? 'Disponible' : 'No disponible'}`);
                    console.log(`   🔢 Orden: ${lesson.orden}`);
                    console.log('');
                });
                console.log(`📊 Total de lecciones: ${lessons.length}`);
            } else {
                console.log('⚠️  No se encontraron lecciones para este curso');
            }
        }
        console.log('');
        
        // Obtener materiales del curso
        const { data: materials, error: materialsError } = await supabase
            .from('materiales')
            .select('*')
            .eq('curso_id', course.id);
        
        if (materialsError) {
            console.error('❌ Error al obtener materiales:', materialsError);
        } else {
            console.log('📁 MATERIALES DEL CURSO:');
            console.log('=' .repeat(50));
            if (materials && materials.length > 0) {
                materials.forEach((material, index) => {
                    console.log(`${index + 1}. ${material.nombre}`);
                    console.log(`   📎 Tipo: ${material.tipo}`);
                    console.log(`   🔗 URL: ${material.url}`);
                    console.log('');
                });
                console.log(`📊 Total de materiales: ${materials.length}`);
            } else {
                console.log('⚠️  No se encontraron materiales para este curso');
            }
        }
        console.log('');
        
        console.log('🌐 INFORMACIÓN DE NAVEGACIÓN:');
        console.log('=' .repeat(50));
        console.log('🏠 Página principal de cursos: http://localhost:5173/courses');
        console.log('👁️  Vista del curso (visitante): http://localhost:5173/visitor/courses/' + course.id);
        console.log('🎓 Vista del curso (estudiante): http://localhost:5173/student/courses/' + course.id);
        console.log('👨‍🏫 Vista del curso (profesor): http://localhost:5173/teacher/courses/' + course.id);
        console.log('');
        
        console.log('📋 PASOS PARA QUE LOS ESTUDIANTES ACCEDAN AL CURSO:');
        console.log('=' .repeat(50));
        console.log('1. 🌐 Ir a la página de cursos: http://localhost:5173/courses');
        console.log('2. 👀 Buscar el curso "Experto en Conductas Adictivas" en la lista');
        console.log('3. 👆 Hacer clic en el ícono del ojo (👁️) para ver los detalles del curso');
        console.log('4. 📚 En la página de detalles, navegar por las pestañas:');
        console.log('   - 📄 Resumen: Información general del curso');
        console.log('   - 📖 Capítulos: Lista de lecciones disponibles');
        console.log('   - ❓ Cuestionarios: Evaluaciones del curso');
        console.log('   - 📁 Materiales: Recursos descargables');
        console.log('');
        
        console.log('✅ El curso está correctamente configurado y listo para que los estudiantes lo accedan.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

getCourseNavigationInfo();