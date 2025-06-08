import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react'; // Removed UserCheck, UserX as they are not used
import { supabase } from '../../lib/supabase';

type Student = {
  id: string;
  name: string; // Ensure name is always a string
  email: string;
  joinDate: string;
  // result is optional, so no changes needed here
};

// StudentListProps remains the same
type StudentListProps = {
  showResults?: boolean;
  onShowResult?: (studentId: string) => void;
};

const StudentList: React.FC<StudentListProps> = ({ 
  showResults = false,
  onShowResult
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorFetching, setErrorFetching] = useState<string | null>(null);

  console.log('[StudentList] Component rendering/re-rendering. State:', { isLoading, errorFetching: !!errorFetching, studentsDataCount: studentsData.length, searchTerm });

  useEffect(() => {
    console.log('[StudentList] useEffect[] - Mounting or dependency changed. Calling fetchStudents.');
    fetchStudents();
  }, []); // Empty dependency array means this runs once on mount

  const fetchStudents = async () => {
    console.log('[StudentList] fetchStudents: Initiating data fetch.');
    setIsLoading(true);
    setErrorFetching(null); // Reset error state before fetching
    try {
      const { data, error, status } = await supabase
        .from('usuarios')
        .select('id, email, creado_en, nombre');

      console.log('[StudentList] fetchStudents: Supabase response status:', status);

      if (error) {
        console.error('[StudentList] fetchStudents: Supabase query error:', error);
        // It's good practice to throw the error to be caught by the catch block
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!data) {
        console.warn('[StudentList] fetchStudents: No data returned from Supabase, but no explicit error.');
        // This case might lead to an empty student list.
        setStudentsData([]); // Explicitly set to empty array
      } else {
        console.log('[StudentList] fetchStudents: Raw data received:', data.length, 'items.');
        const formattedStudents = data.map(usuario => ({
          id: usuario.id,
          name: usuario.nombre || 'Nombre no disponible', // Fallback for name
          email: usuario.email || 'Email no disponible', // Fallback for email
          joinDate: usuario.creado_en || 'Fecha no disponible', // Fallback for joinDate
        }));
        console.log('[StudentList] fetchStudents: Formatted students:', formattedStudents.length, 'items.');
        setStudentsData(formattedStudents);
      }
    } catch (error) {
      console.error('[StudentList] fetchStudents: Catch block error:', error);
      setErrorFetching('Hubo un error al cargar los estudiantes. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
      console.log('[StudentList] fetchStudents: Fetch process complete. isLoading set to false.');
    }
  };
  
  // Memoize filteredStudents to prevent recalculation on every render if studentsData and searchTerm haven't changed.
  // Though with the current structure, it might not offer huge benefits unless StudentList re-renders often for other reasons.
  const filteredStudents = React.useMemo(() => {
    console.log('[StudentList] Calculating filteredStudents. SearchTerm:', searchTerm, 'StudentsData count:', studentsData.length);
    return studentsData.filter(student => 
      (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [studentsData, searchTerm]);

  console.log('[StudentList] Pre-render check. isLoading:', isLoading, 'errorFetching:', !!errorFetching, 'filteredStudentsCount:', filteredStudents.length);

  // Main conditional rendering logic
  let content;
  if (isLoading) {
    console.log('[StudentList] Rendering: "Cargando estudiantes..."');
    content = <div className="p-6 text-center text-gray-500">Cargando estudiantes...</div>;
  } else if (errorFetching) {
    console.log('[StudentList] Rendering: Error message -', errorFetching);
    content = <div className="p-6 text-center text-red-500">{errorFetching}</div>;
  } else if (filteredStudents.length === 0) {
    console.log('[StudentList] Rendering: "No se encontraron estudiantes" (Search term might be active)');
    content = <div className="p-6 text-center text-gray-500">No se encontraron estudiantes</div>;
  } else {
    console.log('[StudentList] Rendering: Students table with', filteredStudents.length, 'students.');
    content = (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
            {showResults && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredStudents.map((student, index) => {
            console.log(`[StudentList] Rendering student row ${index}:`, student.id, student.name);
            // Defensive check for student.name before using charAt
            const initial = student.name && student.name.length > 0 ? student.name.charAt(0).toUpperCase() : '?';
            return (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">{initial}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.joinDate}</div>
                </td>
                {/* Conditional rendering for results and actions remains the same */}
                {showResults && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.result ? (
                      <div className="text-sm">
                        <span className={`font-medium ${student.result.score === 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {student.result.score} / {student.result.totalQuestions}
                        </span>
                        <span className="ml-2 text-gray-500">
                          ({((student.result.score / student.result.totalQuestions) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No intentado</div>
                    )}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {showResults && onShowResult && (
                    <button
                      onClick={() => onShowResult(student.id)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md"
                    >
                      Ver Resultado
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/teacher/users/${student.id}/assign-courses`)}
                    className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md ml-2"
                  >
                    Asignar Cursos
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="relative flex-1 mr-4">
          <input
            type="text"
            placeholder="Buscar estudiantes..."
            value={searchTerm}
            onChange={(e) => {
              console.log('[StudentList] Search term changed to:', e.target.value);
              setSearchTerm(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <button
          onClick={() => {
            console.log('[StudentList] "Añadir Alumno" button clicked. Navigating to /teacher/users/add');
            navigate('/teacher/users/add');
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Añadir Alumno
        </button>
      </div>
      {content}
    </div>
  );
};

export default StudentList;
