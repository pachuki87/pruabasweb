const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';
const COURSE_ID = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'; // Master course ID

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runCleanup() {
    const report = [];
    const sqlActions = [];

    // 1. Fetch all lessons for the course
    const { data: lessons, error: lessonsError } = await supabase
        .from('lecciones')
        .select('id, titulo, orden, tiene_cuestionario')
        .eq('curso_id', COURSE_ID)
        .order('orden', { ascending: true });

    if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
        return;
    }

    report.push(`--- Cleanup Report for Course: ${COURSE_ID} ---`);
    report.push(`Found ${lessons.length} lessons.`);

    for (const lesson of lessons) {
        report.push(`\n--- Lesson ${lesson.orden}: ${lesson.titulo} (ID: ${lesson.id}) ---`);

        // 2. Fetch all questionnaires for the current lesson
        const { data: questionnaires, error: qError } = await supabase
            .from('cuestionarios')
            .select('id, titulo')
            .eq('leccion_id', lesson.id);

        if (qError) {
            report.push(`  Error fetching questionnaires: ${qError.message}`);
            continue;
        }

        if (questionnaires.length === 0) {
            report.push(`  No questionnaires found for this lesson.`);
            if (lesson.tiene_cuestionario) {
                report.push(`  Action: UPDATE lecciones SET tiene_cuestionario = false WHERE id = '${lesson.id}';`);
                sqlActions.push(`UPDATE lecciones SET tiene_cuestionario = false WHERE id = '${lesson.id}';`);
            }
            continue;
        }

        // 3. For each questionnaire, count its questions
        const qWithCounts = [];
        for (const q of questionnaires) {
            const { count, error: pCountError } = await supabase
                .from('preguntas')
                .select('id', { count: 'exact' })
                .eq('cuestionario_id', q.id);

            if (pCountError) {
                report.push(`  Error counting questions for Q ID ${q.id}: ${pCountError.message}`);
                continue;
            }
            qWithCounts.push({ ...q, questionCount: count });
        }

        // 4. Analyze and propose actions
        const correctQs = qWithCounts.filter(q => q.questionCount > 0);
        const emptyQs = qWithCounts.filter(q => q.questionCount === 0);

        if (correctQs.length === 1 && emptyQs.length === 0) {
            report.push(`  Found 1 correct questionnaire: "${correctQs[0].titulo}" (ID: ${correctQs[0].id}) with ${correctQs[0].questionCount} questions.`);
            if (!lesson.tiene_cuestionario) {
                report.push(`  Action: UPDATE lecciones SET tiene_cuestionario = true WHERE id = '${lesson.id}';`);
                sqlActions.push(`UPDATE lecciones SET tiene_cuestionario = true WHERE id = '${lesson.id}';`);
            }
        } else if (correctQs.length > 1) {
            report.push(`  WARNING: Found multiple (${correctQs.length}) questionnaires with questions for this lesson. This might indicate a deeper data issue.`);
            correctQs.forEach(q => report.push(`    - "${q.titulo}" (ID: ${q.id}) with ${q.questionCount} questions.`));
            if (!lesson.tiene_cuestionario) {
                report.push(`  Action: UPDATE lecciones SET tiene_cuestionario = true WHERE id = '${lesson.id}';`);
                sqlActions.push(`UPDATE lecciones SET tiene_cuestionario = true WHERE id = '${lesson.id}';`);
            }
        } else if (correctQs.length === 0 && emptyQs.length > 0) {
            report.push(`  WARNING: Found ${emptyQs.length} empty questionnaires. No correct questionnaire found.`);
            emptyQs.forEach(q => {
                report.push(`    - Empty: "${q.titulo}" (ID: ${q.id}). Action: DELETE FROM cuestionarios WHERE id = '${q.id}';`);
                sqlActions.push(`DELETE FROM cuestionarios WHERE id = '${q.id}';`);
            });
            if (lesson.tiene_cuestionario) {
                report.push(`  Action: UPDATE lecciones SET tiene_cuestionario = false WHERE id = '${lesson.id}';`);
                sqlActions.push(`UPDATE lecciones SET tiene_cuestionario = false WHERE id = '${lesson.id}';`);
            }
        } else if (correctQs.length === 1 && emptyQs.length > 0) {
            report.push(`  Found 1 correct questionnaire: "${correctQs[0].titulo}" (ID: ${correctQs[0].id}) with ${correctQs[0].questionCount} questions.`);
            emptyQs.forEach(q => {
                report.push(`    - Duplicate empty: "${q.titulo}" (ID: ${q.id}). Action: DELETE FROM cuestionarios WHERE id = '${q.id}';`);
                sqlActions.push(`DELETE FROM cuestionarios WHERE id = '${q.id}';`);
            });
            if (!lesson.tiene_cuestionario) {
                report.push(`  Action: UPDATE lecciones SET tiene_cuestionario = true WHERE id = '${lesson.id}';`);
                sqlActions.push(`UPDATE lecciones SET tiene_cuestionario = true WHERE id = '${lesson.id}';`);
            }
        }
    }

    report.push('\n--- Proposed SQL Actions ---');
    if (sqlActions.length === 0) {
        report.push('No SQL actions proposed. Data seems consistent.');
    } else {
        sqlActions.forEach(action => report.push(action));
    }

    return { report: report.join('\n'), sqlActions };
}

runCleanup().then(({ report, sqlActions }) => {
    console.log(report);
    // For actual execution, you'd need to confirm with the user and then run these SQL actions
    // For now, just print them.
}).catch(console.error);