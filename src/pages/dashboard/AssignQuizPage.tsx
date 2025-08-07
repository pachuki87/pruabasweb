import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import StudentList from '../../components/students/StudentList';
import { supabase } from '../../lib/supabase';

type Student = {
  id: string;
  name: string;
  email: string;
  joinDate: string;
};

type Quiz = {
  id: string;
  title: string;
  course_id: string;
  course_title: string;
};

const AssignQuizPage: React.FC = () => {
  const { id: quizId } = useParams<{ id: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (quizId) {
      fetchQuizAndStudents();
    }
  }, [quizId]);

  const fetchQuizAndStudents = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, we would fetch from Supabase
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        const mockQuiz: Quiz = {
          id: quizId || 'quiz-adicciones-1', // Usar un ID representativo
          title: 'Quiz Master en Adicciones',
          course_id: 'c563c497-5583-451a-a625-a3c07d6cb6b4', // ID del Master en Adicciones
          course_title: 'Master en Adicciones',
        };
        
        const mockStudents: Student[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            joinDate: '2023-05-15',
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            joinDate: '2023-06-20',
          },
          {
            id: '3',
            name: 'Michael Johnson',
            email: 'michael@example.com',
            joinDate: '2023-07-10',
          },
        ];
        
        setQuiz(mockQuiz);
        setStudents(mockStudents);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const toggleSelectStudent = (studentId: string) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleAssignQuiz = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, we would create entries in the quiz_assignments table
      
      // Mock the process for now
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success(`Quiz assigned to ${selectedStudents.length} students`);
        navigate('/teacher/quizzes');
      }, 1000);
    } catch (error) {
      console.error('Error assigning quiz:', error);
      setIsSubmitting(false);
      toast.error('Failed to assign quiz');
    }
  };

  if (!quizId) {
    return <div>Quiz ID is required</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Assign Quiz</h1>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-100 h-12 rounded-lg"></div>
          <div className="bg-gray-100 h-64 rounded-lg"></div>
        </div>
      ) : (
        <div>
          {quiz && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
              <p className="text-gray-600 mb-4">Course: {quiz.course_title}</p>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Select students to assign this quiz to
                  </p>
                  <p className="text-sm text-gray-500">
                    Selected: {selectedStudents.length} students
                  </p>
                </div>
                
                <button
                  onClick={handleAssignQuiz}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Assigning...' : 'Assign Quiz'}
                </button>
              </div>
            </div>
          )}
          
          {students.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">
                No students are enrolled in this course
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      <input
                        type="checkbox"
                        checked={selectedStudents.length === students.length}
                        onChange={() => {
                          if (selectedStudents.length === students.length) {
                            setSelectedStudents([]);
                          } else {
                            setSelectedStudents(students.map((s) => s.id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr 
                      key={student.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedStudents.includes(student.id) ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => toggleSelectStudent(student.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleSelectStudent(student.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignQuizPage;
