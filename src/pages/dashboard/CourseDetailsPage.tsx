import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, FileText, FileQuestion, Share2, ThumbsUp, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type CourseDetailsProps = {
  role: string;
};

type Course = {
  id: string;
  titulo: string;
  descripcion: string;
  imagen_url: string | null;
  profesor_nombre: string;
  created_at: string;
  tecnologias: string[];
  capitulos_count: number;
  materiales_count: number;
  estudiantes_count: number;
};

type Chapter = {
  id: string;
  titulo: string;
  descripcion: string | null;
  video_url: string | null;
};

const CourseDetailsPage: React.FC<CourseDetailsProps> = ({ role }) => {
  const { id: courseId } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeTab, setActiveTab] = useState('resumen');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, we would fetch from Supabase
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        const mockCourse: Course = {
          id: courseId || 'c563c497-5583-451a-a625-a3c07d6cb6b4',
          titulo: 'Master en Adicciones',
          descripcion: 'Programa especializado en el estudio y tratamiento de las adicciones. Este curso proporciona una formación integral en el campo de las adicciones comportamentales y químicas.',
          imagen_url: null,
          profesor_nombre: 'pablocardonafeliu',
          created_at: '2023-06-15',
          tecnologias: ['Psicología', 'Neurociencia', 'Terapia', 'Rehabilitación'],
          capitulos_count: 12,
          materiales_count: 5,
          estudiantes_count: 24,
        };
        
        const mockChapters: Chapter[] = [
          {
            id: '1',
            titulo: 'Introducción a las Adicciones',
            descripcion: 'Fundamentos y conceptos básicos sobre adicciones',
            video_url: null,
          },
          {
            id: '2',
            titulo: 'Neurobiología de las Adicciones',
            descripcion: 'Estudio de los mecanismos cerebrales en las adicciones',
            video_url: null,
          },
          {
            id: '3',
            titulo: 'Tratamiento y Rehabilitación',
            descripcion: 'Estrategias y métodos de intervención terapéutica',
            video_url: null,
          },
        ];
        
        setCourse(mockCourse);
        setChapters(mockChapters);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setIsLoading(false);
    }
  };

  const getImageUrl = () => {
    if (course?.imagen_url) {
      return course.imagen_url;
    }
    
    // Default image based on course title
    // Removed specific images for PHP, Python, and Flask
    return 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  };

  if (!courseId) {
    return <div>Se requiere el ID del curso</div>;
  }

  return (
    <div>
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-100 h-64 rounded-lg"></div>
          <div className="bg-gray-100 h-12 rounded-lg"></div>
          <div className="bg-gray-100 h-48 rounded-lg"></div>
        </div>
      ) : course ? (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-6">
                <img
                  src={getImageUrl()}
                  alt={course.titulo}
                  className="max-h-48 object-contain"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <h1 className="text-2xl font-bold mb-2">{course.titulo}</h1>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <User className="w-4 h-4 mr-1" />
                  <span className="text-sm">Instructor: {course.profesor_nombre}</span>
                </div>
                
                <p className="text-gray-700 mb-4">{course.descripcion}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tecnologias.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{course.capitulos_count}</div>
                    <div className="text-sm text-gray-500">Capítulos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{course.materiales_count}</div>
                    <div className="text-sm text-gray-500">Materiales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{course.estudiantes_count}</div>
                    <div className="text-sm text-gray-500">Estudiantes</div>
                  </div>
                </div>
                
                {role === 'student' && (
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Inscribirse en el Curso
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('resumen')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'resumen'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Resumen
                </button>
                <button
                  onClick={() => setActiveTab('chapters')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'chapters'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-1" />
                  Capítulos
                </button>
                <button
                  onClick={() => setActiveTab('quizzes')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'quizzes'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <FileQuestion className="w-4 h-4 inline mr-1" />
                  Cuestionarios
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'resumen' && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Acerca de este curso</h2>
                  <p className="text-gray-700 mb-6">
                    {course.descripcion}
                  </p>
                  
                  <h2 className="text-lg font-semibold mb-4">Lo que aprenderás</h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
                    <li>Construir aplicaciones web completas con Laravel</li>
                    <li>Comprender la arquitectura MVC y cómo la implementa Laravel</li>
                    <li>Trabajar con bases de datos usando Eloquent ORM</li>
                    <li>Implementar autenticación y autorización</li>
                    <li>Crear APIs RESTful</li>
                  </ul>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-gray-700 hover:text-blue-600">
                        <ThumbsUp className="w-5 h-5 mr-1" />
                        <span>Me gusta</span>
                      </button>
                      <button className="flex items-center text-gray-700 hover:text-blue-600">
                        <Share2 className="w-5 h-5 mr-1" />
                        <span>Compartir</span>
                      </button>
                    </div>
                    
                    {role === 'teacher' && (
                      <Link
                        to={`/teacher/courses/edit/${courseId}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Editar Curso
                      </Link>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'chapters' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Capítulos del Curso</h2>
                    
                    {role === 'teacher' && (
                      <Link
                        to={`/teacher/courses/${courseId}/chapters/add`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        Añadir Capítulo
                      </Link>
                    )}
                  </div>
                  
                  {chapters.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No hay capítulos disponibles para este curso todavía.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {chapters.map((chapter, index) => (
                        <div key={chapter.id} className="border rounded-md p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <h3 className="text-md font-medium">
                              <span className="text-blue-600 mr-2">{index + 1}.</span>
                              {chapter.titulo}
                            </h3>
                            
                            {role === 'teacher' && (
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm">
                                  Editar
                                </button>
                                <button className="text-red-600 hover:text-red-800 text-sm">
                                  Eliminar
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {chapter.descripcion && (
                            <p className="text-gray-600 text-sm mt-1">{chapter.descripcion}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'quizzes' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Cuestionarios del Curso</h2>
                    
                    {role === 'teacher' && (
                      <Link
                        to={`/teacher/quizzes/add`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        Añadir Cuestionario
                      </Link>
                    )}
                  </div>
                  
                  <p className="text-gray-500 text-center py-4">
                    No hay cuestionarios disponibles para este curso todavía.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Curso no encontrado</p>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;
