require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function simulateFrontendLoading() {
  console.log('🎭 Simulando carga del frontend...');
  
  // Simular parámetros de URL
  const rawCourseId = 'master-adicciones';
  const rawLessonId = null; // Sin lección específica
  
  // Mapear slug de curso a UUID real (igual que en el frontend)
  const mapCourseSlugToId = (slug) => {
    const courseMapping = {
      'master-adicciones': 'b5ef8c64-fe26-4f20-8221-80a1bf475b05',
      'experto-conductas-adictivas': 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836'
    };
    console.log('🔄 MAPEO DE CURSO - slug:', slug, '-> UUID:', courseMapping[slug] || slug);
    return courseMapping[slug] || slug;
  };
  
  const courseId = mapCourseSlugToId(rawCourseId || '');
  console.log('✅ CURSO MAPEADO - rawCourseId:', rawCourseId, '-> courseId:', courseId);
  
  try {
    console.log('🔍 Cargando datos del curso...');
    console.log('📊 courseId:', courseId);
    console.log('📊 lessonId:', rawLessonId);
    
    // Paso 1: Cargar datos del curso (igual que en el frontend)
    const { data: courseData, error: courseError } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', courseId)
      .single();
    
    if (courseError) {
      console.error('❌ Error cargando curso:', courseError);
      throw courseError;
    }
    
    console.log('✅ Curso cargado:', courseData.titulo);
    
    // Paso 2: Cargar lecciones del curso
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseId)
      .order('orden');
    
    if (lessonsError) {
      console.error('❌ Error cargando lecciones:', lessonsError);
      throw lessonsError;
    }
    
    console.log(`✅ ${lessonsData?.length || 0} lecciones cargadas`);
    
    if (!lessonsData || lessonsData.length === 0) {
      throw new Error('No se encontraron lecciones para este curso');
    }
    
    // Paso 3: Procesar lecciones (igual que en el frontend)
    const processedLessons = lessonsData.map((lesson, index) => ({
      ...lesson,
      isCompleted: false, // Simplificado para el test
      isActive: index === 0 // Primera lección activa
    }));
    
    console.log('📚 Lecciones procesadas:', processedLessons.length);
    
    // Paso 4: Seleccionar lección actual
    let currentLesson;
    if (rawLessonId) {
      currentLesson = processedLessons.find(l => l.id === rawLessonId);
      if (!currentLesson) {
        console.warn('⚠️ Lección específica no encontrada, usando primera lección');
        currentLesson = processedLessons[0];
      }
    } else {
      console.log('📝 No specific lessonId, selecting first lesson');
      currentLesson = processedLessons[0];
    }
    
    console.log('🎯 Lección actual seleccionada:', currentLesson.titulo);
    
    // Paso 5: Obtener quiz ID para la lección (simulando getQuizIdForLesson)
    const getQuizIdForLesson = async (lessonId) => {
      try {
        // Verificar si es la lección 2 o 4
        const { data: lessonData, error: lessonError } = await supabase
          .from('lecciones')
          .select('titulo, orden')
          .eq('id', lessonId)
          .single();
        
        if (lessonError) {
          console.error('❌ Error obteniendo datos de lección:', lessonError);
          return null;
        }
        
        console.log('📖 Datos de lección:', lessonData);
        
        // Buscar cuestionario
        const { data: quizData, error: quizError } = await supabase
          .from('cuestionarios')
          .select('id')
          .eq('leccion_id', lessonId)
          .single();
        
        if (quizError) {
          console.log('ℹ️ No hay cuestionario para esta lección:', quizError.message);
          return null;
        }
        
        console.log('✅ Quiz encontrado:', quizData.id);
        return quizData.id;
        
      } catch (err) {
        console.error('❌ Error en getQuizIdForLesson:', err);
        return null;
      }
    };
    
    const quizId = await getQuizIdForLesson(currentLesson.id);
    console.log('🧩 Quiz ID:', quizId || 'Sin quiz');
    
    console.log('\n🎉 ¡Carga simulada exitosa!');
    console.log('📊 Resumen:');
    console.log('  - Curso:', courseData.titulo);
    console.log('  - Lecciones:', processedLessons.length);
    console.log('  - Lección actual:', currentLesson.titulo);
    console.log('  - Quiz:', quizId ? 'Sí' : 'No');
    
  } catch (err) {
    console.error('❌ Error en simulación:', err);
    console.error('🔍 Tipo de error:', err.constructor.name);
    console.error('📝 Mensaje:', err.message);
    if (err.details) console.error('📋 Detalles:', err.details);
    if (err.hint) console.error('💡 Sugerencia:', err.hint);
  }
}

simulateFrontendLoading().catch(console.error);