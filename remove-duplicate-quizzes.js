import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function removeDuplicateQuizzes() {
    console.log('🗑️ Eliminando cuestionarios duplicados...');
    
    const report = {
        timestamp: new Date().toISOString(),
        course_id: 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836',
        duplicates_removed: [],
        errors: [],
        summary: {
            total_duplicates_found: 0,
            duplicates_removed: 0,
            errors_count: 0
        }
    };

    try {
        // Obtener todas las lecciones con cuestionarios
        const lessonsWithQuizzes = [
            'f40519ef-c569-4dd9-874b-df9a9b7cad26', // Criterios DSM-5
            '64e1b69a-795b-4cf0-b2ce-4b4a416c2ede', // Material Complementario
            'ba9f3851-65a0-4dc2-91ab-02fadd60e4a3', // Adicciones Comportamentales
            '9d91427d-0ab8-45d5-b761-684d3497e2a3', // Terapia de pareja
            'd3b2fd97-3f62-4825-99f4-e8e56eaaf08e', // Psicología positiva
            '1cf3848f-f965-4a1e-9810-955e082472fb'  // Mindfulness
        ];

        for (const lessonId of lessonsWithQuizzes) {
            console.log(`\n🔍 Procesando lección: ${lessonId}`);
            
            // Obtener todos los cuestionarios de esta lección
            const { data: quizzes, error: quizzesError } = await supabase
                .from('cuestionarios')
                .select('*')
                .eq('leccion_id', lessonId)
                .order('creado_en', { ascending: false }); // Más reciente primero

            if (quizzesError) {
                console.log(`❌ Error obteniendo cuestionarios: ${quizzesError.message}`);
                report.errors.push(`Error obteniendo cuestionarios para lección ${lessonId}: ${quizzesError.message}`);
                continue;
            }

            if (quizzes.length > 1) {
                console.log(`📊 Encontrados ${quizzes.length} cuestionarios duplicados`);
                report.summary.total_duplicates_found += quizzes.length - 1;
                
                // Mantener el más reciente (primero en la lista) y eliminar el resto
                const quizToKeep = quizzes[0];
                const quizzesToDelete = quizzes.slice(1);
                
                console.log(`✅ Manteniendo: ${quizToKeep.titulo} (ID: ${quizToKeep.id})`);
                
                for (const quiz of quizzesToDelete) {
                    console.log(`🗑️ Eliminando: ${quiz.titulo} (ID: ${quiz.id})`);
                    
                    // Primero eliminar las preguntas asociadas
                    const { error: questionsError } = await supabase
                        .from('preguntas')
                        .delete()
                        .eq('cuestionario_id', quiz.id);
                    
                    if (questionsError) {
                        console.log(`❌ Error eliminando preguntas: ${questionsError.message}`);
                        report.errors.push(`Error eliminando preguntas del cuestionario ${quiz.id}: ${questionsError.message}`);
                        continue;
                    }
                    
                    // Luego eliminar el cuestionario
                    const { error: quizError } = await supabase
                        .from('cuestionarios')
                        .delete()
                        .eq('id', quiz.id);
                    
                    if (quizError) {
                        console.log(`❌ Error eliminando cuestionario: ${quizError.message}`);
                        report.errors.push(`Error eliminando cuestionario ${quiz.id}: ${quizError.message}`);
                    } else {
                        report.duplicates_removed.push({
                            quiz_id: quiz.id,
                            quiz_title: quiz.titulo,
                            lesson_id: lessonId,
                            deleted_at: new Date().toISOString()
                        });
                        report.summary.duplicates_removed++;
                        console.log(`✅ Eliminado exitosamente`);
                    }
                }
            } else {
                console.log(`✅ Solo 1 cuestionario encontrado, no hay duplicados`);
            }
        }

        report.summary.errors_count = report.errors.length;
        
        // Guardar reporte
        fs.writeFileSync('./duplicate-removal-report.json', JSON.stringify(report, null, 2));
        console.log('\n📄 Reporte guardado en: ./duplicate-removal-report.json');

        // Mostrar resumen
        console.log('\n🎉 Eliminación de duplicados completada!');
        console.log('📊 Resumen:');
        console.log(`   - Total duplicados encontrados: ${report.summary.total_duplicates_found}`);
        console.log(`   - Duplicados eliminados: ${report.summary.duplicates_removed}`);
        console.log(`   - Errores: ${report.summary.errors_count}`);
        
        if (report.errors.length > 0) {
            console.log('\n⚠️ Errores encontrados:');
            report.errors.forEach(error => console.log(`   - ${error}`));
        }

    } catch (error) {
        console.error('❌ Error durante la eliminación:', error.message);
        report.error = error.message;
        fs.writeFileSync('./duplicate-removal-error.json', JSON.stringify(report, null, 2));
    }
}

removeDuplicateQuizzes();