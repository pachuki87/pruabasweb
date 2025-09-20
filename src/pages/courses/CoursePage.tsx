import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, BookOpen, Play, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Course {
  id: string;
  titulo: string;
  descripcion: string;
  imagen_url?: string;
  precio?: number;
  estado?: string;
  duracion?: string;
  nivel?: string;
}

interface Lesson {
  id: string;
  titulo: string;
  orden: number;
  descripcion?: string;
  duracion_estimada?: number;
  tiene_cuestionario?: boolean;
}

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseId) {
        setError('ID de curso no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Cargar información del curso
        const { data: courseData, error: courseError } = await supabase
          .from('cursos')
          .select('*')
          .eq('id', courseId)
          .single();

        if (courseError) {
          throw courseError;
        }
        
        setCourse(courseData);

        // Cargar lecciones del curso
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lecciones')
          .select('id, titulo, orden, descripcion, duracion_estimada, tiene_cuestionario')
          .eq('curso_id', courseId)
          .order('orden', { ascending: true });

        if (lessonsError) {
          console.error('Error al cargar lecciones:', lessonsError);
        } else {
          setLessons(lessonsData || []);
        }

      } catch (err) {
        console.error('Error al cargar datos del curso:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

  const handleBackToCourses = () => {
    navigate('/courses');
  };

  const handleEnrollNow = () => {
    // Redirigir a la página de registro o login
    navigate('/login/student');
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
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
            onClick={handleBackToCourses}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Volver a cursos
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-gray-800 font-semibold mb-2">Curso no encontrado</h3>
          <button
            onClick={handleBackToCourses}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBackToCourses}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver a cursos
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-900">{course.titulo}</h1>
            </div>
            
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-6">{course.titulo}</h1>
              <p className="text-xl mb-8 text-blue-100">{course.descripcion}</p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>40 horas</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  <span>{lessons.length} lecciones</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>1,234 estudiantes</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  <span>4.8 (256 reseñas)</span>
                </div>
              </div>
              
              <button
                onClick={handleEnrollNow}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
              >
                Inscribirse ahora
              </button>
            </div>
            
            <div className="flex justify-center">
              {course.imagen_url ? (
                <img 
                  src={course.imagen_url} 
                  alt={course.titulo}
                  className="rounded-lg shadow-2xl max-w-full h-auto"
                />
              ) : (
                <div className="bg-white/20 rounded-lg shadow-2xl w-96 h-64 flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-white/50" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Descripción del curso</h2>
              <div className="prose prose-lg text-gray-700">
                <p>{course.descripcion}</p>
                <p className="mt-4">
                  Este curso está diseñado para profesionales que desean especializarse en el tratamiento de adicciones 
                  y la intervención psicosocial. A través de un enfoque teórico-práctico, aprenderás las últimas 
                  técnicas y metodologías para trabajar con personas que padecen conductas adictivas.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contenido del curso</h2>
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div key={lesson.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">{index + 1}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{lesson.titulo}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            {lesson.duracion_estimada && (
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatDuration(lesson.duracion_estimada)}
                              </span>
                            )}
                            {lesson.tiene_cuestionario && (
                              <span className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Incluye cuestionario
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Play className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Información del curso</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duración total:</span>
                  <span className="font-medium">40 horas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lecciones:</span>
                  <span className="font-medium">{lessons.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nivel:</span>
                  <span className="font-medium">Intermedio</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificado:</span>
                  <span className="font-medium">Incluido</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Acceso:</span>
                  <span className="font-medium">De por vida</span>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  €299
                  <span className="text-lg font-normal text-gray-500 line-through ml-2">€599</span>
                </div>
                <p className="text-sm text-green-600 mb-4">50% de descuento por tiempo limitado</p>
                
                <button
                  onClick={handleEnrollNow}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
                >
                  Inscribirse ahora
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  Garantía de devolución de 30 días
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
