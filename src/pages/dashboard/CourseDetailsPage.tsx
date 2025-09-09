import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, FileText, FileQuestion, Share2, ThumbsUp, User, Trash2, Settings, Play } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

// Types
type Course = {
  id: string;
  titulo: string;
  descripcion: string;
  profesor_nombre: string;
  creado_en: string;
  tecnologias: string[];
};

type Lesson = {
  id: string;
  titulo: string;
  descripcion?: string;
  contenido_html: string;
  orden: number;
  curso_id: string;
};

type Material = {
  name: string;
  url: string;
};

type CourseDetailsPageProps = {
  role: string;
};

const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({ role }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  // State variables
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [activeTab, setActiveTab] = useState('resumen');
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [lessonContent, setLessonContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMaterialsLoading, setIsMaterialsLoading] = useState(false);

  // Fetch course data
  const fetchCourse = async () => {
    if (!courseId) return;
    
    try {
      const { data, error } = await supabase
        .from('cursos')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) {
        console.error('Error fetching course:', error);
        toast.error('Error al cargar el curso');
        return;
      }

      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Error al cargar el curso');
    }
  };

  // Fetch lessons
  const fetchLessons = async () => {
    if (!courseId) return;
    
    try {
      const { data, error } = await supabase
        .from('lecciones')
        .select('*')
        .eq('curso_id', courseId)
        .order('orden', { ascending: true });

      if (error) {
        console.error('Error fetching lessons:', error);
        toast.error('Error al cargar las lecciones');
        return;
      }

      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Error al cargar las lecciones');
    }
  };

  // Fetch materials
  const fetchMaterials = async () => {
    if (!courseId) return;
    
    setIsMaterialsLoading(true);
    try {
      const { data, error } = await supabase
        .from('materiales')
        .select('*')
        .eq('curso_id', courseId);

      if (error) {
        console.error('Error fetching materials:', error);
        toast.error('Error al cargar los materiales');
        return;
      }

      // Transform materials data to match expected format
      const transformedMaterials = (data || []).map(material => ({
        name: material.titulo || 'Material sin nombre',
        url_archivo: material.url_archivo || '#'
      }));

      setMaterials(transformedMaterials);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Error al cargar los materiales');
    } finally {
      setIsMaterialsLoading(false);
    }
  };

  // Handle lesson click
  const handleLessonClick = async (lessonId: string) => {
    if (selectedLesson === lessonId) {
      setSelectedLesson(null);
      setLessonContent(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('lecciones')
        .select('contenido_html')
        .eq('id', lessonId)
        .single();

      if (error) {
        console.error('Error fetching lesson content:', error);
        toast.error('Error al cargar el contenido de la lección');
        return;
      }

      setSelectedLesson(lessonId);
      setLessonContent(data.contenido_html);
    } catch (error) {
      console.error('Error fetching lesson content:', error);
      toast.error('Error al cargar el contenido de la lección');
    }
  };

  // Delete material
  const deleteMaterial = async (materialName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${materialName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('materiales')
        .delete()
        .eq('curso_id', courseId)
        .eq('titulo', materialName);

      if (error) {
        console.error('Error deleting material:', error);
        toast.error('Error al eliminar el material');
        return;
      }

      toast.success('Material eliminado correctamente');
      fetchMaterials(); // Refresh materials list
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('Error al eliminar el material');
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchCourse(),
        fetchLessons(),
        fetchMaterials()
      ]);
      setIsLoading(false);
    };

    if (courseId) {
      loadData();
    }
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando curso...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Curso no encontrado</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{course.titulo}</h1>
          <div className="flex space-x-2">
            <button className="text-gray-600 hover:text-gray-800">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <ThumbsUp className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{course.profesor_nombre}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            <span>{lessons.length} lecciones</span>
          </div>
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            <span>{materials.length} materiales</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md">
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
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'materials'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-1" />
              Materiales
            </button>
            {role === 'teacher' && (
              <button
                onClick={() => setActiveTab('manage-materials')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'manage-materials'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-1" />
                Gestionar Materiales
              </button>
            )}
          </nav>
        </div>
        
        <div className="p-6">
          {/* Resumen Tab */}
          {activeTab === 'resumen' && (
            <div>
              <h2 className="text-xl font-bold mb-4">{course.titulo}</h2>
              <p className="text-gray-700 mb-6">{course.descripcion}</p>
              
              {/* Botón para comenzar el curso */}
              {lessons.length > 0 && (
                <div className="mb-6">
                  <button
                    onClick={() => navigate(`/${role}/courses/${courseId}/lessons/${lessons[0].id}`)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium max-w-full w-fit overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Comenzar Curso
                  </button>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Información del Curso</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Instructor</h4>
                    <p className="text-gray-700">{course.profesor_nombre}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Fecha de Creación</h4>
                    <p className="text-gray-700">
                      {course.creado_en ? new Date(course.creado_en).toLocaleDateString('es-ES') : 'No disponible'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Número de Lecciones</h4>
                    <p className="text-gray-700">{lessons.length} lecciones</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Materiales</h4>
                    <p className="text-gray-700">{materials.length} archivos</p>
                  </div>
                </div>
                
                {course.tecnologias && course.tecnologias.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Áreas de Conocimiento</h4>
                    <div className="flex flex-wrap gap-2">
                      {course.tecnologias.map((tech, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Chapters Tab */}
          {activeTab === 'chapters' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Lecciones del Curso</h2>
                
                {role === 'teacher' && (
                  <Link
                    to={`/teacher/courses/${courseId}/chapters/add`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Añadir Lección
                  </Link>
                )}
              </div>
              
              {lessons.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No hay lecciones disponibles para este curso todavía.
                </p>
              ) : (
                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="border rounded-md p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-md font-medium">
                            <span className="text-blue-600 mr-2">{lesson.orden || index + 1}.</span>
                            {lesson.titulo}
                          </h3>
                          <button
                            onClick={() => navigate(`/${role}/courses/${courseId}/lessons/${lesson.id}`)}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors text-sm flex items-center"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Ver Lección
                          </button>
                        </div>
                        
                        <div className="flex space-x-2">
                          {role === 'teacher' && (
                            <>
                              <button className="text-blue-600 hover:text-blue-800 text-sm">
                                Editar
                              </button>
                              <button className="text-blue-600 hover:text-blue-800 text-sm">
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {lesson.descripcion && (
                        <p className="text-gray-600 text-sm mt-2">{lesson.descripcion}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Quizzes Tab */}
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
          
          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Materiales del Curso</h2>
                
                {role === 'teacher' && (
                  <Link
                    to={`/teacher/courses/edit/${courseId}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Añadir Material
                  </Link>
                )}
              </div>
              
              {isMaterialsLoading ? (
                <p className="text-gray-500 text-center py-4">
                  Cargando materiales...
                </p>
              ) : materials.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No hay materiales disponibles para este curso todavía.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materials.map((material, index) => (
                    <div key={index} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <FileText className="w-6 h-6 mr-3 text-red-600" />
                        <h3 className="font-medium text-gray-900 truncate">{material.name}</h3>
                      </div>
                      <div className="flex space-x-2">
                        <a 
                          href={material.url_archivo} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors text-sm text-center"
                        >
                          Ver PDF
                        </a>
                        <a 
                          href={material.url_archivo} 
                          download
                          className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm text-center"
                        >
                          Descargar
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Manage Materials Tab */}
          {activeTab === 'manage-materials' && role === 'teacher' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Gestionar Materiales del Curso</h2>
                
                <Link
                  to={`/teacher/courses/edit/${courseId}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Añadir Material
                </Link>
              </div>
              
              {isMaterialsLoading ? (
                <p className="text-gray-500 text-center py-4">
                  Cargando materiales...
                </p>
              ) : materials.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No hay materiales disponibles para este curso todavía.
                </p>
              ) : (
                <div className="space-y-4">
                  {materials.map((material, index) => (
                    <div key={index} className="border rounded-md p-4 hover:bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-600" />
                        <span className="font-medium">{material.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a 
                          href={material.url_archivo} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                        >
                          Ver
                        </a>
                        <button
                          onClick={() => deleteMaterial(material.name)}
                          className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
