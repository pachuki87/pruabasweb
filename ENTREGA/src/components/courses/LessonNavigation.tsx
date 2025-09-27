import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import ProgressIndicator from './ProgressIndicator';
import { useProgress } from '../../hooks/useProgress';
import { useAuth } from '../../contexts/AuthContext';

interface Lesson {
  id: string;
  titulo: string;
  slug: string;
  orden: number;
  pdfs?: string[];
  tiene_cuestionario?: boolean;
}

interface LessonNavigationProps {
  lessons: Lesson[];
  currentLessonId: string;
  courseId: string;
  onLessonSelect: (lesson: Lesson) => void;
}

const LessonNavigation: React.FC<LessonNavigationProps> = ({
  lessons,
  currentLessonId,
  courseId,
  onLessonSelect
}) => {
  const { user } = useAuth();
  const { progresoDelCurso, cargando } = useProgress(courseId);
  const [lessonProgress, setLessonProgress] = useState<{[key: string]: any}>({});
  
  const currentIndex = lessons.findIndex(lesson => lesson.id === currentLessonId);
  const currentLesson = lessons[currentIndex];
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  // Cargar progreso de las lecciones
  useEffect(() => {
    if (progresoDelCurso && progresoDelCurso.length > 0) {
      const progressMap: {[key: string]: any} = {};
      progresoDelCurso.forEach((progress: any) => {
        progressMap[progress.leccion_id] = progress;
      });
      setLessonProgress(progressMap);
    }
  }, [progresoDelCurso]);

  // Función para obtener el estado de progreso de una lección
  const getLessonProgressStatus = (lessonId: string) => {
    const progress = lessonProgress[lessonId];
    if (!progress) return 'not_started';
    if (progress.estado === 'completado') return 'completed';
    if (progress.progreso_porcentaje > 0) return 'in_progress';
    return 'not_started';
  };

  // Función para obtener el porcentaje de progreso
  const getLessonProgressPercentage = (lessonId: string) => {
    const progress = lessonProgress[lessonId];
    return progress ? progress.progreso_porcentaje || 0 : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 min-h-[calc(100vh-12rem)] flex flex-col">
      {/* Lista de lecciones */}
      <div className="p-6 border-b border-gray-200 flex-1">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-3" />
          Lecciones del Módulo
        </h3>
        
        <div className="space-y-3 max-h-[calc(100vh-20rem)] overflow-y-auto pr-2">
          {lessons.map((lesson) => {
            const isActive = lesson.id === currentLessonId;
            
            return (
              <button
                key={lesson.id}
                onClick={() => onLessonSelect(lesson)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 text-blue-900 transform scale-[1.02]'
                    : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`text-sm font-bold px-2 py-1 rounded-full mr-3 ${
                        isActive ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {lesson.orden.toString().padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm leading-tight ${
                          isActive ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {lesson.titulo}
                        </h4>
                        {user && (
                          <div className="mt-1">
                            <ProgressIndicator
                              status={getLessonProgressStatus(lesson.id)}
                              percentage={getLessonProgressPercentage(lesson.id)}
                              size="sm"
                              showText={false}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Indicadores de recursos */}
                    <div className="flex items-center gap-2 mt-2">
                      {lesson.pdfs && lesson.pdfs.length > 0 && (
                        <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          <FileText className="w-3 h-3 mr-1" />
                          {lesson.pdfs.length} PDF{lesson.pdfs.length > 1 ? 's' : ''}
                        </span>
                      )}
                      
                      {lesson.tiene_cuestionario && (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          ✓ Cuestionario
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Navegación anterior/siguiente */}
      <div className="p-6 bg-gray-50 rounded-b-lg">
        <div className="space-y-4">
          {/* Indicador de progreso */}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">
              Lección {currentIndex + 1} de {lessons.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Botones de navegación */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={() => previousLesson && onLessonSelect(previousLesson)}
              disabled={!previousLesson}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                previousLesson
                  ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm hover:shadow-md'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </button>
            
            <button
              onClick={() => nextLesson && onLessonSelect(nextLesson)}
              disabled={!nextLesson}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                nextLesson
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonNavigation;