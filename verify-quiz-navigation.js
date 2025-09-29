import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyQuizNavigation() {
    console.log('🔍 Verificando navegación de lecciones a cuestionarios...');
    
    const report = {
        timestamp: new Date().toISOString(),
        course_id: 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836',
        verification_results: [],
        issues_found: [],
        recommendations: [],
        summary: {
            total_lessons: 0,
            lessons_with_quizzes: 0,
            working_navigation: 0,
            broken_navigation: 0
        }
    };

    try {
        // 1. Obtener todas las lecciones del curso
        console.log('📚 Obteniendo lecciones del curso...');
        const { data: lessons, error: lessonsError } = await supabase
            .from('lecciones')
            .select('*')
            .eq('curso_id', 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836')
            .order('orden');

        if (lessonsError) {
            throw new Error(`Error obteniendo lecciones: ${lessonsError.message}`);
        }

        report.summary.total_lessons = lessons.length;
        console.log(`✅ Encontradas ${lessons.length} lecciones`);

        // 2. Para cada lección que tiene cuestionario, verificar la asociación
        for (const lesson of lessons) {
            const verification = {
                lesson_id: lesson.id,
                lesson_title: lesson.titulo,
                lesson_order: lesson.orden,
                has_quiz_flag: lesson.tiene_cuestionario,
                quiz_found: false,
                quiz_id: null,
                quiz_title: null,
                navigation_working: false,
                issues: []
            };

            if (lesson.tiene_cuestionario) {
                report.summary.lessons_with_quizzes++;
                
                // Buscar cuestionario asociado
                const { data: quizzes, error: quizError } = await supabase
                    .from('cuestionarios')
                    .select('*')
                    .eq('leccion_id', lesson.id);

                if (quizError) {
                    verification.issues.push(`Error buscando cuestionario: ${quizError.message}`);
                } else if (quizzes && quizzes.length > 0) {
                    verification.quiz_found = true;
                    verification.quiz_id = quizzes[0].id;
                    verification.quiz_title = quizzes[0].titulo;
                    verification.navigation_working = true;
                    report.summary.working_navigation++;
                    
                    if (quizzes.length > 1) {
                        verification.issues.push(`Múltiples cuestionarios encontrados (${quizzes.length})`);
                        report.issues_found.push(`Lección "${lesson.titulo}" tiene ${quizzes.length} cuestionarios`);
                    }
                } else {
                    verification.issues.push('No se encontró cuestionario asociado');
                    report.summary.broken_navigation++;
                    report.issues_found.push(`Lección "${lesson.titulo}" marcada con cuestionario pero no tiene uno asociado`);
                }
            }

            report.verification_results.push(verification);
            
            const status = verification.navigation_working ? '✅' : (lesson.tiene_cuestionario ? '❌' : '⚪');
            console.log(`${status} ${lesson.titulo} (Orden: ${lesson.orden})`);
            if (verification.issues.length > 0) {
                verification.issues.forEach(issue => console.log(`   - ${issue}`));
            }
        }

        // 3. Generar recomendaciones
        if (report.issues_found.length > 0) {
            report.recommendations.push('Revisar las lecciones marcadas con cuestionario que no tienen uno asociado');
            report.recommendations.push('Verificar que los IDs de cuestionarios sean correctos en la base de datos');
            report.recommendations.push('Probar manualmente la navegación desde la interfaz web');
        } else {
            report.recommendations.push('Todas las asociaciones están correctas');
            report.recommendations.push('Realizar prueba manual en la interfaz para confirmar funcionamiento');
        }

        // 4. Guardar reporte
        fs.writeFileSync('./quiz-navigation-verification.json', JSON.stringify(report, null, 2));
        console.log('\n📄 Reporte guardado en: ./quiz-navigation-verification.json');

        // 5. Mostrar resumen
        console.log('\n🎉 Verificación completada!');
        console.log('📊 Resumen:');
        console.log(`   - Total de lecciones: ${report.summary.total_lessons}`);
        console.log(`   - Lecciones con cuestionarios: ${report.summary.lessons_with_quizzes}`);
        console.log(`   - Navegación funcionando: ${report.summary.working_navigation}`);
        console.log(`   - Navegación con problemas: ${report.summary.broken_navigation}`);
        
        if (report.issues_found.length > 0) {
            console.log('\n⚠️ Problemas encontrados:');
            report.issues_found.forEach(issue => console.log(`   - ${issue}`));
        }

    } catch (error) {
        console.error('❌ Error durante la verificación:', error.message);
        report.error = error.message;
        fs.writeFileSync('./quiz-navigation-verification-error.json', JSON.stringify(report, null, 2));
    }
}

verifyQuizNavigation();