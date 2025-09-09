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
  descripcion?: string;
  slug?: string; // Opcional porque lo generamos dinámicamente
  orden: number;
  duracion_estimada?: number;
  imagen_url?: string;
  video_url?: string;
  archivo_url?: string; // URL del archivo HTML
  pdfs?: string[];
  externalLinks?: Array<{title: string; url: string; isExternal: boolean}>;
  tiene_cuestionario?: boolean;
  leccion_anterior_id?: string;
  leccion_siguiente_id?: string;
}

interface Course {
  id: string;
  titulo: string;
  descripcion: string;
}

const NewLessonPage: React.FC = () => {
  console.log('🚀🚀🚀 NUEVO LESSONPAGE FUNCIONANDO CORRECTAMENTE 🚀🚀🚀');
  
  const { courseId: rawCourseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  console.log('📥 RAW PARAMS - rawCourseId:', rawCourseId, 'lessonId:', lessonId);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mapear slug de curso a UUID real
  const mapCourseSlugToId = (slug: string): string => {
    const courseMapping: { [key: string]: string } = {
      'master-adicciones': 'b5ef8c64-fe26-4f20-8221-80a1bf475b05',
      'experto-conductas-adictivas': 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836'
    };
    console.log('🔄 MAPEO DE CURSO - slug:', slug, '-> UUID:', courseMapping[slug] || slug);
    return courseMapping[slug] || slug;
  };
  
  const courseId = mapCourseSlugToId(rawCourseId || '');
  console.log('✅ CURSO MAPEADO - rawCourseId:', rawCourseId, '-> courseId:', courseId);
  
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
      console.log('🔍 NewLessonPage - courseId:', courseId, 'lessonId:', lessonId);
      if (!courseId) {
        console.log('❌ No courseId provided');
        setLoading(false);
        return;
      }
      
      // Eliminada redirección hardcodeada al PDF - ahora se maneja dinámicamente
      
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
          .select('id, titulo, descripcion, orden, duracion_estimada, imagen_url, video_url, tiene_cuestionario, archivo_url, leccion_anterior_id, leccion_siguiente_id')
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
        
        // Obtener materiales reales de la base de datos
        const { data: materialsData, error: materialsError } = await supabase
          .from('materiales')
          .select('leccion_id, titulo, url_archivo')
          .eq('curso_id', courseId);
        
        if (materialsError) {
          console.error('❌ Materials data error:', materialsError);
        }
        
        console.log('📄 Materials data loaded:', materialsData);
        
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
        
        // Crear un mapa de lección ID a materiales
        const materialsMap = new Map();
        if (materialsData) {
          materialsData.forEach(material => {
            if (material.leccion_id) { // Solo incluir materiales asignados a lecciones
              if (!materialsMap.has(material.leccion_id)) {
                materialsMap.set(material.leccion_id, []);
              }
              materialsMap.get(material.leccion_id).push(material);
            }
          });
        }
        
        console.log('🗂️ Materials map:', materialsMap);
        
        // Procesar lecciones para extraer información de PDFs y cuestionarios
        const processedLessons = lessonsData.map(lesson => {
          const generatedSlug = mapTitleToSlug(lesson.titulo);
          console.log('🔄 Processing lesson:', lesson.titulo, 'generated slug:', generatedSlug);
          
          // Extraer PDFs desde la base de datos
          const pdfs: string[] = [];
          const hasQuiz = quizMap.has(lesson.id) && quizMap.get(lesson.id).length > 0;
          
          console.log('🎯 Lesson', lesson.titulo, 'has quiz:', hasQuiz, 'quiz IDs:', quizMap.get(lesson.id));
          
          // Obtener materiales reales asignados a esta lección
          const lessonMaterials = materialsMap.get(lesson.id) || [];
          console.log('📄 Materials for lesson', lesson.titulo, ':', lessonMaterials);
          
          // Mapear títulos de materiales a nombres de archivos PDF
          const materialToPdfMap: { [key: string]: string } = {
            'Manual MATRIX para Terapeutas': 'MATRIX-manual_terapeuta.pdf',
            'BLOQUE 2 TÉCNICO EN ADICCIONES': 'BLOQUE-2-TECNICO-EN-ADICCIONES.pdf',
            'Bloque 1: Técnico en Adicciones': 'BLOQUE 1 TECNICO EN ADICIONES.pdf',
            'Bloque 3: Familia y Trabajo en Equipo': 'BLOQUE III - FAMILIA Y TRABAJO EN EQUIPO.pdf',
            'Recovery Coach': 'Recovery Coach reinservida.pdf',
            'Intervención Familiar en Adicciones y Recovery Mentoring': 'intervencion-Familiar-en-Adicciones-y.-Recovery-Mentoring-1.pdf',
            'Cuaderno de Ejercicios: Inteligencia Emocional': 'Cuaderno-de-ejercicios-de-inteligencia-emocional.pdf',
            'Terapias de Tercera Generación': 'MATRIX-manual_terapeuta.pdf'
          };
          
          // Agregar PDFs basados en los materiales reales asignados
          lessonMaterials.forEach(material => {
            const pdfName = materialToPdfMap[material.titulo];
            if (pdfName && !pdfs.includes(pdfName)) {
              pdfs.push(pdfName);
            }
          });
          
          // Verificar si es el curso Master en Adicciones para fallback de PDFs específicos
          const isMasterCourse = courseId === 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
          
          // Solo usar fallback si no hay materiales asignados en la base de datos
          if (isMasterCourse && lessonMaterials.length === 0) {
            console.log('⚠️ No materials found in DB for lesson', lesson.titulo, '- using fallback');
            // Mantener algunos fallbacks solo para lecciones sin materiales asignados
            if (lesson.titulo.includes('INTELIGENCIA EMOCIONAL')) {
              pdfs.push('PPT INTELIGENCIA EMOCIONAL.pdf');
            }
          } else if (!isMasterCourse) {
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
              await updateChapterProgress({
                courseId,
                chapterId: lesson.id,
                progressPercentage: 0
              });
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
              await updateChapterProgress({
                courseId,
                chapterId: processedLessons[0].id,
                progressPercentage: 0
              });
              setStartTime(new Date());
              setLastActivityTime(new Date());
            }
            // Actualizar la URL para reflejar la lección actual
            const currentPath = window.location.pathname;
            const isStudent = currentPath.includes('/student/');
            const isTeacher = currentPath.includes('/teacher/');
            
            if (isStudent) {
              navigate(`/student/courses/${rawCourseId}/lessons/${processedLessons[0].id}`, { replace: true });
            } else if (isTeacher) {
              navigate(`/teacher/courses/${rawCourseId}/lessons/${processedLessons[0].id}`, { replace: true });
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

  // Efecto para rastrear tiempo de estudio al salir de la página
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (user && currentLesson && startTime && lastActivityTime) {
        const studyTime = Math.floor((lastActivityTime.getTime() - startTime.getTime()) / 1000);
        if (studyTime > 0) {
          await updateStudyTime(currentLesson.id, studyTime);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [user, currentLesson, startTime, lastActivityTime]);

  const handleLessonSelect = async (lesson: Lesson) => {
    console.log('🎯 Selecting lesson:', lesson.titulo);
    
    // Actualizar tiempo de estudio de la lección anterior
    if (user && currentLesson && startTime && lastActivityTime) {
      const studyTime = Math.floor((lastActivityTime.getTime() - startTime.getTime()) / 1000);
      if (studyTime > 0) {
        await updateStudyTime(currentLesson.id, studyTime);
      }
    }
    
    setCurrentLesson(lesson);
    
    // Obtener el quiz ID para esta lección
    const quizId = await getQuizIdForLesson(lesson.id);
    setCurrentQuizId(quizId);
    
    // Registrar progreso del usuario si está autenticado
    if (user && courseId) {
      await updateChapterProgress({
        courseId,
        chapterId: lesson.id,
        progressPercentage: 0
      });
      setStartTime(new Date());
      setLastActivityTime(new Date());
    }
    
    // Actualizar la URL
    const currentPath = window.location.pathname;
    const isStudent = currentPath.includes('/student/');
    const isTeacher = currentPath.includes('/teacher/');
    
    if (isStudent) {
      navigate(`/student/courses/${rawCourseId}/lessons/${lesson.id}`);
    } else if (isTeacher) {
      navigate(`/teacher/courses/${rawCourseId}/lessons/${lesson.id}`);
    }
  };

  const handleNextLesson = () => {
    if (!currentLesson || lessons.length === 0) return;
    
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      handleLessonSelect(nextLesson);
    }
  };

  const handlePreviousLesson = () => {
    if (!currentLesson || lessons.length === 0) return;
    
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex > 0) {
      const previousLesson = lessons[currentIndex - 1];
      handleLessonSelect(previousLesson);
    }
  };

  const handleBackToCourse = () => {
    const currentPath = window.location.pathname;
    const isStudent = currentPath.includes('/student/');
    const isTeacher = currentPath.includes('/teacher/');
    
    if (isStudent) {
      navigate(`/student/courses/${rawCourseId}`);
    } else if (isTeacher) {
      navigate(`/teacher/courses/${rawCourseId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando lección...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar la lección</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lección no encontrada</h2>
          <p className="text-gray-600 mb-4">La lección que buscas no existe o no está disponible.</p>
          <button
            onClick={handleBackToCourse}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Volver al curso
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
              courseId={course.id}
              onLessonSelect={handleLessonSelect}
            />
          </div>
          
          {/* Main content - Lesson viewer */}
          <div className="lg:col-span-3">
            <LessonViewer
              lesson={currentLesson}
              course={course}
              quizId={currentQuizId}
              onNextLesson={handleNextLesson}
              onPreviousLesson={handlePreviousLesson}
              canGoNext={lessons.findIndex(l => l.id === currentLesson.id) < lessons.length - 1}
              canGoPrevious={lessons.findIndex(l => l.id === currentLesson.id) > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLessonPage;