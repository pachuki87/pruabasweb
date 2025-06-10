import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Check, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

type Quiz = {
  id: string;
  title: string;
  course_id: string;
  course_title: string;
  assigned: boolean;
};

type QuizzesPageProps = {
  role: string;
};

const QuizzesPage: React.FC<QuizzesPageProps> = ({ role }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, [role]);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, we would fetch from Supabase
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        const mockQuizzes: Quiz[] = [
          // Keep only quizzes not associated with the courses to be removed.
          // The courses to remove are: PHP Course Laravel, PHP Course for Beginners, Flask
        ];
        
        setQuizzes(mockQuizzes);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setIsLoading(false);
    }
  };

  const handleAssignQuiz = (quizId: string) => {
    navigate(`/${role}/quizzes/assign/${quizId}`);
  };

  const handleAttemptQuiz = (quizId: string) => {
    // In a real app, navigate to the quiz attempt page
    toast.info('Quiz attempt feature will be implemented soon');
  };

  const handleViewResults = (quizId: string) => {
    // In a real app, navigate to the quiz results page
    navigate(`/${role}/quizzes/results/${quizId}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quizzes</h1>
        
        {role === 'teacher' && (
          <Link
            to={`/${role}/quizzes/add`}
            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Quiz
          </Link>
        )}
      </div>
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="bg-gray-100 h-12 rounded-t-lg mb-2"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 h-16 mb-2 rounded-md"></div>
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 mb-4">
            {role === 'teacher' 
              ? "You haven't created any quizzes yet."
              : "There are no quizzes available for your courses."}
          </p>
          {role === 'teacher' && (
            <Link
              to={`/${role}/quizzes/add`}
              className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create Your First Quiz
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {role === 'teacher' ? 'Status' : 'Action'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-red-600">
                      {quiz.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{quiz.course_title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {role === 'teacher' ? (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        quiz.assigned 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {quiz.assigned ? 'Assigned' : 'Not Assigned'}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAttemptQuiz(quiz.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md"
                      >
                        Attempt Quiz
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {role === 'teacher' ? (
                      <div className="flex justify-end space-x-2">
                        {!quiz.assigned && (
                          <button
                            onClick={() => handleAssignQuiz(quiz.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Assign quiz"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleViewResults(quiz.id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="View results"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleViewResults(quiz.id)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View results"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuizzesPage;
