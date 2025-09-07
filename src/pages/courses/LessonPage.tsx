import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LessonViewer from '../../components/courses/LessonViewer';
import LessonNavigation from '../../components/courses/LessonNavigation';
import { supabase } from '../../lib/supabase';
import { useProgress } from '../../hooks/useProgress';
import { useAuth } from '../../contexts/AuthContext';

interface Lesson {
  id: string;
  titulo: string;
  slug?: string; // Opcional porque lo generamos dinámicamente
  orden: number;
  archivo_url?: string; // URL del archivo HTML migrado
  contenido_html?: string; // Mantenemos por compatibilidad, pero será null después de la migración
  pdfs?: string[];
  externalLinks?: Array<{title: string; url: string; isExternal: boolean}>;
  tiene_cuestionario?: boolean;
}

interface Course {
  id: string;
  titulo: string;
  descripcion: string;
}

const LessonPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateChapterProgress, trackStudyTime } = useProgress(courseId);
  
  // Estado para tracking de tiempo
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [lastActivityTime, setLastActivityTime] = useState<Date>(new Date());

  // Función para obtener el quiz ID asociado a una lección
  const getQuizIdForLesson = async (lessonId: string): Promise<string | null> => {
    try {
      // Primero verificar si es la lección 2 o 4
      const { data: lessonData, error: lessonError } = await supabase
        .from('lecciones')
        .select('titulo, orden')
        .eq('id', lessonId)
        .single();
      
      if (lessonError) {
        console.log('Error fetching lesson info:', lessonError);
      }
      
      // Si es la lección 2, buscar específicamente el cuestionario de texto libre
      if (lessonData && (lessonData.orden === 2 || lessonData.titulo.includes('¿Qué es una adicción'))) {
        console.log('🎯 Detected lesson 2, looking for text-based quiz');
        const { data: textQuizData, error: textQuizError } = await supabase
          .from('cuestionarios')
          .select('id')
          .eq('leccion_id', lessonId)
          .eq('titulo', 'Definición conducta adictiva')
          .limit(1);
        
        if (!textQuizError && textQuizData && textQuizData.length > 0) {
          console.log('✅ Found text-based quiz for lesson 2:', textQuizData[0].id);
          return textQuizData[0].id;
        }
      }
      
      // Si es la lección 4, buscar específicamente el cuestionario de criterios DSM V
      if (lessonData && (lessonData.orden === 4 || lessonData.titulo.includes('Criterios para diagnosticar'))) {
        console.log('🎯 Detected lesson 4, looking for DSM V criteria quiz');
        const { data: dsmQuizData, error: dsmQuizError } = await supabase
          .from('cuestionarios')
          .select('id')
          .eq('leccion_id', lessonId)
          .eq('titulo', 'Criterio de diagnóstico DSM V')
          .limit(1);
        
        if (!dsmQuizError && dsmQuizData && dsmQuizData.length > 0) {
          console.log('✅ Found DSM V criteria quiz for lesson 4:', dsmQuizData[0].id);
          return dsmQuizData[0].id;
        }
      }
      
      // Para otras lecciones o si no se encuentra el cuestionario específico, usar el comportamiento original
      const { data, error } = await supabase
        .from('cuestionarios')
        .select('id')
        .eq('leccion_id', lessonId)
        .limit(1);
      
      if (error) {
        console.log('No quiz found for lesson:', lessonId);
        return null;
      }
      
      // Retornar el primer quiz ID si existe
      return data && data.length > 0 ? data[0].id : null;
    } catch (err) {
      console.error('Error fetching quiz for lesson:', err);
      return null;
    }
  };
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 useEffect triggered - courseId:', courseId, 'lessonId:', lessonId);
    
    const loadCourseData = async () => {
      console.log('🔍 LessonPage - courseId:', courseId, 'lessonId:', lessonId);
      if (!courseId) {
        console.log('❌ No courseId provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);

        console.log('📚 Loading course data for courseId:', courseId);
        // Cargar información del curso
        const { data: courseData, error: courseError } = await supabase
          .from('cursos')
          .select('*')
          .eq('id', courseId)
          .single();

        if (courseError) {
          console.error('❌ Course error:', courseError);
          throw courseError;
        }
        console.log('✅ Course data loaded:', courseData);
        setCourse(courseData);

        // Cargar lecciones del curso
        console.log('📖 Loading lessons for courseId:', courseId);
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lecciones')
          .select('*')
          .eq('curso_id', courseId)
          .order('orden', { ascending: true });

        if (lessonsError) {
          console.error('❌ Lessons error:', lessonsError);
          throw lessonsError;
        }
        console.log('✅ Lessons data loaded:', lessonsData, 'Count:', lessonsData?.length || 0);
        
        // Función para mapear títulos de lecciones a nombres de carpetas
        const mapTitleToSlug = (titulo: string): string => {
          const titleMappings: { [key: string]: string } = {
            '¿Qué significa ser adicto?': '01_¿Qué significa ser adicto_',
            '¿Qué es una adicción 1 Cuestionario': '02_¿Qué es una adicción_1 Cuestionario',
            'Consecuencias de las adicciones': '03_Consecuencias de las adicciones',
            'Criterios para diagnosticar una conducta adictiva según DSM 51 Cuestionario': '04_Criterios para diagnosticar una conducta adictiva según DSM 51 Cuestionario',
            'Criterios para diagnosticar una conducta adictiva (DSM-5) Cuestionario': '04_Criterios para diagnosticar una conducta adictiva según DSM 51 Cuestionario',
            'Material Complementario y Ejercicios2 Cuestionarios': '05_Material Complementario y Ejercicios2 Cuestionarios',
            'Adicciones Comportamentales2 Cuestionarios': '06_Adicciones Comportamentales2 Cuestionarios',
            'La familia': '07_La familia',
            'La recaída': '08_La recaída',
            'Nuevas terapias psicológicas': '09_Nuevas terapias psicológicas',
            'Terapia integral de pareja1 Cuestionario': '10_Terapia integral de pareja1 Cuestionario',
            'Psicología positiva1 Cuestionario': '11_Psicología positiva1 Cuestionario',
            'Mindfulness aplicado a la Conducta Adictiva1 Cuestionario': '12_Mindfulness aplicado a la Conducta Adictiva1 Cuestionario',
            'Material complementario Mindfulness y ejercicio1 Cuestionario': '13_Material complementario Mindfulness y ejercicio1 Cuestionario',
            'FUNDAMENTOS P TERAPEUTICO': '01_¿Qué significa ser adicto_'
          };
          
          // Buscar coincidencia exacta primero
          if (titleMappings[titulo]) {
            return titleMappings[titulo];
          }
          
          // Buscar coincidencia parcial
          for (const [key, value] of Object.entries(titleMappings)) {
            if (titulo.includes(key.split(' ')[0]) || key.includes(titulo.split(' ')[0])) {
              return value;
            }
          }
          
          // Fallback: crear slug básico desde el título
          return titulo.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
        };

        // Obtener información de cuestionarios para todas las lecciones
        const { data: quizData, error: quizError } = await supabase
          .from('cuestionarios')
          .select('leccion_id, id')
          .in('leccion_id', lessonsData.map(l => l.id));
        
        if (quizError) {
          console.error('❌ Quiz data error:', quizError);
        }
        
        console.log('📝 Quiz data loaded:', quizData);
        
        // Crear un mapa de lección ID a quiz ID
        const quizMap = new Map();
        if (quizData) {
          quizData.forEach(quiz => {
            if (!quizMap.has(quiz.leccion_id)) {
              quizMap.set(quiz.leccion_id, []);
            }
            quizMap.get(quiz.leccion_id).push(quiz.id);
          });
        }
        
        // Procesar lecciones para extraer información de PDFs y cuestionarios
        const processedLessons = lessonsData.map(lesson => {
          const generatedSlug = mapTitleToSlug(lesson.titulo);
          console.log('🔄 Processing lesson:', lesson.titulo, 'generated slug:', generatedSlug);
          
          // Extraer PDFs basado en el slug generado
          const pdfs: string[] = [];
          const hasQuiz = quizMap.has(lesson.id) && quizMap.get(lesson.id).length > 0;
          
          console.log('🎯 Lesson', lesson.titulo, 'has quiz:', hasQuiz, 'quiz IDs:', quizMap.get(lesson.id));
          
          // Verificar si es el curso Master en Adicciones
          const isMasterCourse = courseId === 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
          
          if (isMasterCourse) {
            // PDFs para el Master en Adicciones
            if (lesson.titulo.includes('FUNDAMENTOS P TERAPEUTICO')) {
              pdfs.push('Bloque-1-Tecnico-en-Adicciones.pdf', 'Manual-MATRIX-para-Terapeutas.pdf');
            }
            if (lesson.titulo.includes('TERAPIA COGNITIVA DROGODEPENDENENCIAS')) {
              pdfs.push('BLOQUE 2 TÉCNICO EN ADICCIONES.pdf', 'bloque-2-tecnico-adicciones.pdf', 'Manual-MATRIX-para-Terapeutas.pdf');
            }
            if (lesson.titulo.includes('FAMILIA Y TRABAJO EQUIPO')) {
              pdfs.push('BLOQUE III - FAMILIA Y TRABAJO EN EQUIPO.pdf', 'Manual-MATRIX-para-Terapeutas.pdf');
            }
            if (lesson.titulo.includes('RECOVERY COACHING')) {
              pdfs.push('Recovery Coach reinservida.pdf', 'Manual-MATRIX-para-Terapeutas.pdf');
            }
            if (lesson.titulo.includes('INTERVENCION FAMILIAR Y RECOVERY MENTORING')) {
              pdfs.push('intervencion-Familiar-en-Adicciones-y.-Recovery-Mentoring-1.pdf', 'Manual-MATRIX-para-Terapeutas.pdf');
            }
            if (lesson.titulo.includes('NUEVOS MODELOS TERAPEUTICOS')) {
              pdfs.push('Manual-MATRIX-para-Terapeutas.pdf');
            }
            if (lesson.titulo.includes('INTELIGENCIA EMOCIONAL')) {
              pdfs.push('Cuaderno-de-ejercicios-de-inteligencia-emocional.pdf', 'PPT INTELIGENCIA EMOCIONAL.pdf', 'Manual-MATRIX-para-Terapeutas.pdf');
            }
          } else {
            // PDFs para el curso Experto en Conductas Adictivas
            if (generatedSlug.includes('Material Complementario')) {
              pdfs.push('Clasificacion-de-sustancias.pdf', 'Fundamentos-de-la-conducta-adictiva.pdf', 'Informe-europeo-sobre-drogas-2020.pdf', 'Programa-Ibiza.pdf');
            }
            // Archivo no disponible: Actividad-casos-clinicos.pdf
            // if (generatedSlug.includes('Criterios para diagnosticar') || generatedSlug.includes('DSM')) {
            //   pdfs.push('Actividad-casos-clinicos.pdf');
            // }
            // Archivo no disponible: Articilo-Terapia-Integral-de-Pareja.pdf
            // if (generatedSlug.includes('Terapia integral')) {
            //   pdfs.push('Articilo-Terapia-Integral-de-Pareja.pdf');
            // }
            // Archivos no disponibles: Psicolgia-positiva-introduccion.pdf, Psicologia-positiva-la-investigacion-sobre-los-efectos-de-las-emociones-positivas.pdf
            // if (generatedSlug.includes('Psicología positiva')) {
            //   pdfs.push('Psicolgia-positiva-introduccion.pdf', 'Psicologia-positiva-la-investigacion-sobre-los-efectos-de-las-emociones-positivas.pdf');
            // }
          }
          
          // Enlaces externos para Adicciones Comportamentales2 Cuestionarios y Psicología positiva
          const externalLinks: any[] = [];
          if (generatedSlug.includes('Adicciones Comportamentales2 Cuestionarios')) {
            externalLinks.push(
              {
                title: 'Aquí tienes un artículo sobre el tratamiento de las adicciones a las TIC',
                url: 'https://sindrome-adicciones.es/adiccion-a-las-nuevas-tecnologias/',
                isExternal: true
              },
              {
                title: 'Test',
                url: 'https://www.ocu.org/tecnologia/telefono/noticias/test-adiccion-movil',
                isExternal: true
              },
              {
                title: 'Artículo sobre el juego y cómo dejarlo',
                url: 'https://sindrome-adicciones.es/adiccion-al-juego/',
                isExternal: true
              },
              {
                title: 'Artículo sobre la adicción al móvil',
                url: 'https://www.nuestropsicologoenmadrid.com/adiccion-movil/',
                isExternal: true
              },
              {
                title: 'Artículo sobre la adicción al porno',
                url: 'https://www.abc.es/familia/parejas/daniel-adicto-porno-pensaba-fundido-genitales-20221103163535-nt.html',
                isExternal: true
              },
              {
                title: 'Test',
                url: 'https://www.psicologosonline.cl/articulos/aprende-a-eliminar-la-dependencia-emocional',
                isExternal: true
              }
            );
          }
          
          // Video de YouTube para Psicología positiva
          if (generatedSlug.includes('Psicología positiva')) {
            externalLinks.push(
              {
                title: 'Video: Victor Küppers - El valor de tu actitud',
                url: 'https://www.youtube.com/watch?v=Z3_f6a-YrY8',
                isExternal: true
              }
            );
          }
          
          return {
            ...lesson,
            slug: generatedSlug,
            pdfs,
            externalLinks,
            tiene_cuestionario: hasQuiz
          };
        });
        
        console.log('✅ Processed lessons:', processedLessons);
        setLessons(processedLessons);

        // Verificar que hay lecciones disponibles
        if (processedLessons.length === 0) {
          console.log('❌ No lessons found for this course');
          setError('No se encontraron lecciones para este curso');
          setLoading(false);
          return;
        }

        // Establecer lección actual
        if (lessonId) {
          console.log('🎯 Looking for specific lesson with ID:', lessonId, 'type:', typeof lessonId);
          console.log('📋 Available lesson IDs:', processedLessons.map(l => ({ id: l.id, titulo: l.titulo })));
          
          const lesson = processedLessons.find(l => l.id === lessonId);
          if (lesson) {
            console.log('✅ Found target lesson:', lesson);
            setCurrentLesson(lesson);
            // Obtener el quiz ID para esta lección
            const quizId = await getQuizIdForLesson(lesson.id);
            setCurrentQuizId(quizId);
            
            // Registrar progreso del usuario si está autenticado
            if (user && courseId) {
              await updateChapterProgress(lesson.id, 'in_progress');
              setStartTime(new Date());
              setLastActivityTime(new Date());
            }
          } else {
            console.log('❌ Target lesson not found, using first lesson');
            console.log('🎯 Setting first lesson as current:', processedLessons[0]);
            setCurrentLesson(processedLessons[0]);
            // Obtener el quiz ID para la primera lección
            const quizId = await getQuizIdForLesson(processedLessons[0].id);
            setCurrentQuizId(quizId);
            
            // Registrar progreso del usuario si está autenticado
            if (user && courseId) {
              await updateChapterProgress(processedLessons[0].id, 'in_progress');
              setStartTime(new Date());
              setLastActivityTime(new Date());
            }
            // Actualizar la URL para reflejar la lección actual
            const currentPath = window.location.pathname;
            const isStudent = currentPath.includes('/student/');
            const isTeacher = currentPath.includes('/teacher/');
            
            if (isStudent) {
              navigate(`/student/courses/${courseId}/lessons/${processedLessons[0].id}`, { replace: true });
            } else if (isTeacher) {
              navigate(`/teacher/courses/${courseId}/lessons/${processedLessons[0].id}`, { replace: true });
            }
          }
        } else {
          console.log('📝 No specific lessonId, selecting first lesson');
          console.log('🎯 Setting first lesson as current:', processedLessons[0]);
          setCurrentLesson(processedLessons[0]);
          // Obtener el quiz ID para la primera lección
          const quizId = await getQuizIdForLesson(processedLessons[0].id);
          setCurrentQuizId(quizId);
        }

      } catch (err) {
        console.error('❌ Error loading course data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        console.log('🏁 Loading finished');
        setLoading(false);
      }
    };

    if (courseId) {
      loadCourseData();
    } else {
      console.log('⏭️ Skipping load - no courseId');
      setLoading(false);
    }
  }, [courseId, lessonId]);

  // Efecto para registrar tiempo de estudio al salir de la página
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (user && courseId && currentLesson && startTime) {
        const studyTime = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
        if (studyTime > 30) {
          await trackStudyTime(currentLesson.id, studyTime);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleBeforeUnload();
      } else if (document.visibilityState === 'visible') {
        setLastActivityTime(new Date());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Registrar tiempo final al desmontar el componente
      handleBeforeUnload();
    };
  }, [user, courseId, currentLesson, startTime, trackStudyTime]);

  const handleLessonSelect = async (lesson: Lesson) => {
    // Registrar tiempo de estudio de la lección anterior
    if (user && courseId && currentLesson && startTime) {
      const studyTime = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      if (studyTime > 30) { // Solo registrar si estudió más de 30 segundos
        await trackStudyTime(currentLesson.id, studyTime);
      }
    }
    
    setCurrentLesson(lesson);
    // Obtener el quiz ID para la nueva lección
    const quizId = await getQuizIdForLesson(lesson.id);
    setCurrentQuizId(quizId);
    
    // Registrar progreso de la nueva lección
    if (user && courseId) {
      await updateChapterProgress(lesson.id, 'in_progress');
      setStartTime(new Date());
      setLastActivityTime(new Date());
    }
    
    // Determinar el rol del usuario desde la URL actual
    const currentPath = window.location.pathname;
    const isStudent = currentPath.includes('/student/');
    const isTeacher = currentPath.includes('/teacher/');
    
    if (isStudent) {
      navigate(`/student/courses/${courseId}/lessons/${lesson.id}`, { replace: true });
    } else if (isTeacher) {
      navigate(`/teacher/courses/${courseId}/lessons/${lesson.id}`, { replace: true });
    } else {
      // Fallback para rutas sin rol específico
      navigate(`/student/courses/${courseId}/lessons/${lesson.id}`, { replace: true });
    }
  };

  const handleNextLesson = () => {
    if (!currentLesson) return;
    
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      console.log('📍 Navigating to next lesson:', nextLesson.titulo);
      handleLessonSelect(nextLesson);
    } else {
      console.log('📍 Already at last lesson');
    }
  };

  const handlePreviousLesson = () => {
    if (!currentLesson) return;
    
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex > 0) {
      const previousLesson = lessons[currentIndex - 1];
      console.log('📍 Navigating to previous lesson:', previousLesson.titulo);
      handleLessonSelect(previousLesson);
    } else {
      console.log('📍 Already at first lesson');
    }
  };

  const handleBackToCourse = () => {
    // Determinar el rol del usuario desde la URL actual
    const currentPath = window.location.pathname;
    const isStudent = currentPath.includes('/student/');
    const isTeacher = currentPath.includes('/teacher/');
    
    if (isStudent) {
      navigate(`/student/courses/${courseId}`);
    } else if (isTeacher) {
      navigate(`/teacher/courses/${courseId}`);
    } else {
      // Fallback para rutas sin rol específico
      navigate(`/student/courses/${courseId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Cargando curso...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error al cargar el curso</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-gray-800 font-semibold mb-2">Curso no encontrado</h3>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBackToCourse}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al curso
              </button>
            </div>
            
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-900">{course.titulo}</h1>
            </div>
            
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <LessonNavigation
              lessons={lessons}
              currentLessonId={currentLesson.id}
              onLessonSelect={handleLessonSelect}
            />
          </div>
          
          {/* Main content - Lesson viewer */}
          <div className="lg:col-span-3">
            <LessonViewer
              lessonSlug={currentLesson.slug || ''}
              lessonTitle={currentLesson.titulo}
              lessonContent={currentLesson?.contenido_html}
              lessonFileUrl={currentLesson?.archivo_url}
              pdfs={currentLesson.pdfs}
              externalLinks={currentLesson.externalLinks}
              hasQuiz={currentLesson.tiene_cuestionario}
              quizId={currentQuizId}
              onBackToCourse={handleBackToCourse}
              onNextLesson={handleNextLesson}
              onPreviousLesson={handlePreviousLesson}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;