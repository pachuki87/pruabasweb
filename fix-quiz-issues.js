import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const COURSE_ID = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';

async function fixQuizIssues() {
  console.log('🔧 Iniciando corrección de problemas de cuestionarios...');
  
  const report = {
    timestamp: new Date().toISOString(),
    course_id: COURSE_ID,
    actions_performed: [],
    errors: [],
    summary: {
      duplicates_removed: 0,
      lessons_updated: 0,
      total_fixes: 0
    }
  };

  try {
    // 1. Obtener todas las lecciones del curso
    console.log('📚 Obteniendo lecciones del curso...');
    const { data: lessons, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', COURSE_ID)
      .order('orden');

    if (lessonsError) {
      throw new Error(`Error obteniendo lecciones: ${lessonsError.message}`);
    }

    console.log(`✅ Encontradas ${lessons.length} lecciones`);

    // 2. Verificar que todas las lecciones tengan un orden definido
    console.log('\n2. Verificando orden de lecciones...');
    let leccionesConOrdenFaltante = 0;
    
    for (const leccion of lessons) {
        if (!leccion.orden || leccion.orden === null) {
            leccionesConOrdenFaltante++;
            console.log(`   - Lección sin orden: ${leccion.titulo}`);
            report.errors.push(`Lección sin orden definido: ${leccion.titulo}`);
        }
    }
    
    report.leccionesConOrdenFaltante = leccionesConOrdenFaltante;
    console.log(`   Total lecciones sin orden: ${leccionesConOrdenFaltante}`);
    
    // Si hay lecciones sin orden, las ordenamos por fecha de creación
    if (leccionesConOrdenFaltante > 0) {
        console.log('   Asignando orden basado en fecha de creación...');
        const leccionesSinOrden = lessons.filter(l => !l.orden || l.orden === null);
        leccionesSinOrden.sort((a, b) => new Date(a.creado_en) - new Date(b.creado_en));
        
        let ordenActual = Math.max(...lessons.filter(l => l.orden).map(l => l.orden)) + 1;
        
        for (const leccion of leccionesSinOrden) {
            try {
                const { error: updateError } = await supabase
                    .from('lecciones')
                    .update({ orden: ordenActual })
                    .eq('id', leccion.id);
                
                if (updateError) {
                    console.log(`   - Error actualizando orden de lección ${leccion.titulo}: ${updateError.message}`);
                    report.errors.push(`Error actualizando orden para lección ${leccion.titulo}: ${updateError.message}`);
                } else {
                    console.log(`   - Actualizada lección: ${leccion.titulo} (orden: ${ordenActual})`);
                    ordenActual++;
                }
            } catch (error) {
                console.log(`   - Error actualizando lección ${leccion.titulo}: ${error.message}`);
                report.errors.push(`Error actualizando orden para lección ${leccion.titulo}: ${error.message}`);
            }
        }
    }

    report.summary.lessons_updated = 0;
     console.log(`✅ Verificación de orden completada`);
     let lessonsUpdated = 0;

    // 3. Obtener todos los cuestionarios del curso
    console.log('📝 Obteniendo cuestionarios del curso...');
    const { data: quizzes, error: quizzesError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('curso_id', COURSE_ID)
      .order('creado_en');

    if (quizzesError) {
      throw new Error(`Error obteniendo cuestionarios: ${quizzesError.message}`);
    }

    console.log(`✅ Encontrados ${quizzes.length} cuestionarios`);

    // 4. Identificar y eliminar duplicados
    console.log('🗑️ Identificando cuestionarios duplicados...');
    const quizzesByLesson = {};
    const duplicatesToDelete = [];

    for (const quiz of quizzes) {
      if (!quizzesByLesson[quiz.leccion_id]) {
        quizzesByLesson[quiz.leccion_id] = [];
      }
      quizzesByLesson[quiz.leccion_id].push(quiz);
    }

    // Para cada lección, mantener solo el cuestionario más antiguo
    for (const [lessonId, lessonQuizzes] of Object.entries(quizzesByLesson)) {
      if (lessonQuizzes.length > 1) {
        // Ordenar por fecha de creación (más antiguo primero)
        lessonQuizzes.sort((a, b) => new Date(a.creado_en) - new Date(b.creado_en));
        
        // Mantener el primero, marcar el resto para eliminación
        for (let i = 1; i < lessonQuizzes.length; i++) {
          duplicatesToDelete.push(lessonQuizzes[i]);
        }
      }
    }

    console.log(`🗑️ Encontrados ${duplicatesToDelete.length} cuestionarios duplicados para eliminar`);

    // 5. Eliminar cuestionarios duplicados
    let duplicatesRemoved = 0;
    for (const duplicate of duplicatesToDelete) {
      // Primero eliminar las preguntas asociadas
      const { error: deleteQuestionsError } = await supabase
        .from('preguntas')
        .delete()
        .eq('cuestionario_id', duplicate.id);

      if (deleteQuestionsError) {
        report.errors.push(`Error eliminando preguntas del cuestionario ${duplicate.titulo}: ${deleteQuestionsError.message}`);
        continue;
      }

      // Luego eliminar el cuestionario
      const { error: deleteQuizError } = await supabase
        .from('cuestionarios')
        .delete()
        .eq('id', duplicate.id);

      if (deleteQuizError) {
        report.errors.push(`Error eliminando cuestionario ${duplicate.titulo}: ${deleteQuizError.message}`);
      } else {
        duplicatesRemoved++;
        report.actions_performed.push(`Eliminado cuestionario duplicado: ${duplicate.titulo} (ID: ${duplicate.id})`);
      }
    }

    report.summary.duplicates_removed = duplicatesRemoved;
    console.log(`✅ Eliminados ${duplicatesRemoved} cuestionarios duplicados`);

    // 6. Verificar estado final
    console.log('🔍 Verificando estado final...');
    const { data: finalQuizzes, error: finalError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('curso_id', COURSE_ID);

    if (finalError) {
      report.errors.push(`Error en verificación final: ${finalError.message}`);
    } else {
      console.log(`✅ Estado final: ${finalQuizzes.length} cuestionarios únicos`);
      report.actions_performed.push(`Verificación final: ${finalQuizzes.length} cuestionarios únicos restantes`);
    }

    report.summary.total_fixes = lessonsUpdated + duplicatesRemoved;

    // 7. Guardar reporte
    const reportPath = './quiz-fix-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Reporte guardado en: ${reportPath}`);

    console.log('\n🎉 Corrección completada exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - Lecciones actualizadas: ${report.summary.lessons_updated}`);
    console.log(`   - Cuestionarios duplicados eliminados: ${report.summary.duplicates_removed}`);
    console.log(`   - Total de correcciones: ${report.summary.total_fixes}`);
    
    if (report.errors.length > 0) {
      console.log(`⚠️  Errores encontrados: ${report.errors.length}`);
      report.errors.forEach(error => console.log(`   - ${error}`));
    }

  } catch (error) {
    console.error('❌ Error durante la corrección:', error.message);
    report.errors.push(`Error crítico: ${error.message}`);
    
    // Guardar reporte incluso si hay errores
    const reportPath = './quiz-fix-report-error.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Reporte de error guardado en: ${reportPath}`);
  }
}

// Ejecutar el script
fixQuizIssues().catch(console.error);