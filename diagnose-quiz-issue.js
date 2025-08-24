import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function diagnoseQuizIssue() {
  console.log('🔍 Iniciando diagnóstico de cuestionarios...');
  
  const report = {
    timestamp: new Date().toISOString(),
    course_info: null,
    lessons: [],
    questionnaires: [],
    associations: [],
    issues: [],
    recommendations: []
  };

  try {
    // 1. Obtener información del curso "Experto en Conductas Adictivas"
    console.log('📚 Obteniendo información del curso...');
    const { data: courseData, error: courseError } = await supabase
      .from('cursos')
      .select('*')
      .ilike('titulo', '%Experto en Conductas Adictivas%')
      .single();

    if (courseError) {
      report.issues.push(`Error al obtener curso: ${courseError.message}`);
      console.error('❌ Error obteniendo curso:', courseError);
      return;
    }

    report.course_info = courseData;
    console.log('✅ Curso encontrado:', courseData.titulo, 'ID:', courseData.id);

    // 2. Obtener todas las lecciones del curso
    console.log('📖 Obteniendo lecciones del curso...');
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseData.id)
      .order('orden', { ascending: true });

    if (lessonsError) {
      report.issues.push(`Error al obtener lecciones: ${lessonsError.message}`);
      console.error('❌ Error obteniendo lecciones:', lessonsError);
      return;
    }

    report.lessons = lessonsData;
    console.log(`✅ ${lessonsData.length} lecciones encontradas`);

    // 3. Obtener todos los cuestionarios asociados al curso
    console.log('📝 Obteniendo cuestionarios del curso...');
    const { data: quizData, error: quizError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('curso_id', courseData.id);

    if (quizError) {
      report.issues.push(`Error al obtener cuestionarios: ${quizError.message}`);
      console.error('❌ Error obteniendo cuestionarios:', quizError);
    } else {
      report.questionnaires = quizData || [];
      console.log(`✅ ${quizData?.length || 0} cuestionarios encontrados`);
    }

    // 4. Verificar asociaciones entre lecciones y cuestionarios
    console.log('🔗 Verificando asociaciones lección-cuestionario...');
    for (const lesson of lessonsData) {
      const associatedQuizzes = report.questionnaires.filter(q => q.leccion_id === lesson.id);
      
      const association = {
        lesson_id: lesson.id,
        lesson_title: lesson.titulo,
        lesson_order: lesson.orden,
        numero_leccion: lesson.numero_leccion,
        associated_quizzes: associatedQuizzes.map(q => ({
          id: q.id,
          titulo: q.titulo,
          created_at: q.creado_en
        }))
      };
      
      report.associations.push(association);
      
      if (associatedQuizzes.length === 0) {
        console.log(`⚠️ Lección "${lesson.titulo}" no tiene cuestionarios asociados`);
      } else {
        console.log(`✅ Lección "${lesson.titulo}" tiene ${associatedQuizzes.length} cuestionario(s)`);
      }
    }

    // 5. Verificar problemas específicos
    console.log('🔍 Analizando problemas potenciales...');
    
    // Verificar si hay lecciones sin numero_leccion
    const lessonsWithoutNumber = lessonsData.filter(l => !l.numero_leccion);
    if (lessonsWithoutNumber.length > 0) {
      report.issues.push(`${lessonsWithoutNumber.length} lecciones sin numero_leccion definido`);
      report.recommendations.push('Actualizar campo numero_leccion en las lecciones afectadas');
    }

    // Verificar si hay cuestionarios duplicados
    const quizTitles = report.questionnaires.map(q => q.titulo);
    const duplicateQuizTitles = quizTitles.filter((title, index) => quizTitles.indexOf(title) !== index);
    if (duplicateQuizTitles.length > 0) {
      report.issues.push(`Cuestionarios duplicados encontrados: ${[...new Set(duplicateQuizTitles)].join(', ')}`);
      report.recommendations.push('Eliminar cuestionarios duplicados de la base de datos');
    }

    // Verificar si hay cuestionarios sin leccion_id
    const quizzesWithoutLesson = report.questionnaires.filter(q => !q.leccion_id);
    if (quizzesWithoutLesson.length > 0) {
      report.issues.push(`${quizzesWithoutLesson.length} cuestionarios sin leccion_id asociado`);
      report.recommendations.push('Asociar cuestionarios huérfanos con sus lecciones correspondientes');
    }

    // 6. Verificar estructura de URLs y routing
    console.log('🌐 Verificando estructura de URLs...');
    const sampleLessonId = lessonsData[0]?.id;
    const sampleQuizId = report.questionnaires[0]?.id;
    
    if (sampleLessonId && sampleQuizId) {
      report.url_structure = {
        lesson_url: `/student/courses/${courseData.id}/lessons/${sampleLessonId}`,
        quiz_url: `/student/quizzes/attempt/${sampleQuizId}`,
        expected_navigation: 'LessonPage -> LessonViewer -> QuizAttemptPage'
      };
    }

    // 7. Generar recomendaciones finales
    if (report.issues.length === 0) {
      report.recommendations.push('No se encontraron problemas evidentes en la estructura de datos');
      report.recommendations.push('Verificar logs del navegador para errores de frontend');
      report.recommendations.push('Comprobar que los componentes React estén cargando correctamente');
    }

    console.log('✅ Diagnóstico completado');
    console.log(`📊 Resumen: ${report.lessons.length} lecciones, ${report.questionnaires.length} cuestionarios, ${report.issues.length} problemas encontrados`);

  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
    report.issues.push(`Error general: ${error.message}`);
  }

  // Guardar reporte
  const reportPath = './quiz-diagnosis-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Reporte guardado en: ${reportPath}`);

  return report;
}

// Ejecutar diagnóstico
diagnoseQuizIssue().then(report => {
  console.log('\n🎯 RESUMEN DEL DIAGNÓSTICO:');
  console.log(`- Curso: ${report.course_info?.titulo || 'No encontrado'}`);
  console.log(`- Lecciones: ${report.lessons?.length || 0}`);
  console.log(`- Cuestionarios: ${report.questionnaires?.length || 0}`);
  console.log(`- Problemas: ${report.issues?.length || 0}`);
  
  if (report.issues?.length > 0) {
    console.log('\n❌ PROBLEMAS ENCONTRADOS:');
    report.issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
  }
  
  if (report.recommendations?.length > 0) {
    console.log('\n💡 RECOMENDACIONES:');
    report.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
}).catch(error => {
  console.error('❌ Error ejecutando diagnóstico:', error);
});