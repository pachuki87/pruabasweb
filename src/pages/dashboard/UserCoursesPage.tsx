import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Course = {
  id: string;
  title: string;
  teacher_name: string;
  teacher_id?: string;
};

type UserCoursesPageProps = {
  role: string;
};

const UserCoursesPage: React.FC<UserCoursesPageProps> = ({ role }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, [role]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser(); // Obtener el usuario autenticado

      if (!user) {
        console.warn('No user authenticated. Cannot fetch assigned courses.');
        setCourses([]);
        setIsLoading(false);
        return;
      }

      let coursesData;
      let coursesError;

      if (role === 'student') {
        // Lógica existente para estudiantes
        const { data: inscriptionsData, error: inscriptionsError } = await supabase
          .from('inscripciones')
          .select('curso_id')
          .eq('usuario_id', user.id);

        if (inscriptionsError) {
          throw inscriptionsError;
        }

        const assignedCourseIds = inscriptionsData.map(inscription => inscription.curso_id);

        ({ data: coursesData, error: coursesError } = await supabase
          .from('cursos')
          .select('id, titulo, profesor_id')
          .in('id', assignedCourseIds));
      } else if (role === 'teacher') {
        // Lógica para profesores: obtener todos los cursos disponibles
        ({ data: coursesData, error: coursesError } = await supabase
          .from('cursos')
          .select('id, titulo, profesor_id'));
      } else {
        // Rol desconocido, no cargar cursos
        setCourses([]);
        setIsLoading(false);
        return;
      }

      if (coursesError) {
        throw coursesError;
      }

      // Obtener los nombres de los profesores (asumiendo que profesor_id se relaciona con la tabla usuarios)
      const teacherIds = coursesData.map(course => course.profesor_id).filter(Boolean);
      let teachersMap = new Map();
      if (teacherIds.length > 0) {
        const { data: teachersData, error: teachersError } = await supabase
          .from('usuarios')
          .select('id, nombre') // Asumiendo que 'nombre' es el campo del nombre del profesor
          .in('id', teacherIds);

        if (teachersError) {
          console.error('Error fetching teachers:', teachersError);
        } else {
          teachersData.forEach(teacher => {
            teachersMap.set(teacher.id, teacher.nombre);
          });
        }
      }

      const formattedCourses = coursesData.map(course => ({
        id: course.id,
        title: course.titulo,
        teacher_name: teachersMap.get(course.profesor_id) || 'Desconocido' // Usar el nombre del profesor
      }));

      setCourses(formattedCourses);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]); // En caso de error, no mostrar cursos
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Cursos</h1>
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 mb-4">Aún no tienes cursos.</p>
          <Link
            to="/courses"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Explorar Cursos
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creado Por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cuestionario
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mensaje al Profesor
                </th>
                {role === 'teacher' && (
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/${role}/courses/${course.id}`}
                      className="text-red-600 hover:text-red-800"
                    >
                      {course.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.teacher_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/${role}/courses/${course.id}/quiz`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors"
                    >
                      Lista de Cuestionarios
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {/* Handle chat */}}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                  {role === 'teacher' && (
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <Link
                        to={`/${role}/courses/edit/${course.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Editar
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserCoursesPage;
