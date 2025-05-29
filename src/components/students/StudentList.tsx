import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserCheck, UserX } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Student = {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  result?: {
    score: number;
    totalQuestions: number;
  };
};

type StudentListProps = {
  students: Student[]; // This prop will no longer be used for fetching, but keeping for type compatibility if needed elsewhere
  showResults?: boolean;
  onShowResult?: (studentId: string) => void;
};

const StudentList: React.FC<StudentListProps> = ({ 
  students, // This prop is not used for fetching data in this modified component
  showResults = false,
  onShowResult
}) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [searchTerm, setSearchTerm] = useState('');
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('usuarios') // Corrected table name to 'usuarios'
        .select('id, email, creado_en, nombre'); // Selecting relevant columns from 'usuarios' table

      if (error) {
        throw error;
      }

      const formattedStudents = data.map(usuario => ({
        id: usuario.id,
        name: usuario.nombre, // Using 'nombre' as name
        email: usuario.email,
        joinDate: usuario.creado_en, // Corrected to use 'creado_en'
      }));

      setStudentsData(formattedStudents);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setIsLoading(false);
    }
  };
  
  const filteredStudents = studentsData.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="relative flex-1 mr-4">
          <input
            type="text"
            placeholder="Buscar estudiantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <button
          onClick={() => navigate('/teacher/users/add')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Añadir Alumno
        </button>
      </div>
      
      {isLoading ? (
        <div className="p-6 text-center text-gray-500">
          Cargando estudiantes...
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No se encontraron estudiantes
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Registro
              </th>
              {showResults && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resultado
                </th>
              )}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">{student.name.charAt(0).toUpperCase()}</span>
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentList;
