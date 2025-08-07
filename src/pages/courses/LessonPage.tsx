import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LessonViewer from '../../components/courses/LessonViewer';
import LessonNavigation from '../../components/courses/LessonNavigation';
import { supabase } from '../../lib/supabase';

interface Lesson {
  id: string;
  titulo: string;
  slug?: string; // Opcional porque lo generamos dinámicamente
  orden: number;
  contenido_html: string;
  pdfs?: string[];
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
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
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
            'Material complementario Mindfulness y ejercicio1 Cuestionario': '13_Material complementario Mindfulness y ejercicio1 Cuestionario'
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

        // Procesar lecciones para extraer información de PDFs y cuestionarios
        const processedLessons = lessonsData.map(lesson => {
          const generatedSlug = mapTitleToSlug(lesson.titulo);
          console.log('🔄 Processing lesson:', lesson.titulo, 'generated slug:', generatedSlug);
          
          // Extraer PDFs basado en el slug generado
          const pdfs: string[] = [];
          const hasQuiz = lesson.titulo ? lesson.titulo.includes('Cuestionario') : false;
          
          // Buscar PDFs en el directorio correspondiente basado en el slug
          if (generatedSlug.includes('Material Complementario')) {
            pdfs.push('Clasificacion-de-sustancias.pdf', 'Fundamentos-de-la-conducta-adictiva.pdf');
          }
          if (generatedSlug.includes('Terapia integral')) {
            pdfs.push('Articilo-Terapia-Integral-de-Pareja.pdf');
          }
          if (generatedSlug.includes('Psicología positiva')) {
            pdfs.push('Psicolgia-positiva-introduccion.pdf');
          }
          
          return {
            ...lesson,
            slug: generatedSlug,
            pdfs,
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
          } else {
            console.log('❌ Target lesson not found, using first lesson');
            console.log('🎯 Setting first lesson as current:', processedLessons[0]);
            setCurrentLesson(processedLessons[0]);
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

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
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
              pdfs={currentLesson.pdfs}
              hasQuiz={currentLesson.tiene_cuestionario}
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