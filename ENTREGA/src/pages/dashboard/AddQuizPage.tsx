import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import QuizForm, { QuizFormData } from '../../components/quiz/QuizForm';
import { supabase } from '../../lib/supabase';

type Course = {
  id: string;
  titulo: string;
};

const AddQuizPage: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, we would fetch from Supabase
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        const mockCourses: Course[] = [
          { id: 'c563c497-5583-451a-a625-a3c07d6cb6b4', titulo: 'Master en Adicciones' },
        ];
        
        setCourses(mockCourses);
        if (mockCourses.length > 0) {
          setSelectedCourseId(mockCourses[0].id);
        }
        
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: QuizFormData) => {
    if (!selectedCourseId) {
      toast.error('Please select a course');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, we would:
      // 1. Create the quiz in the quizzes table
      // 2. Create all the questions in the quiz_questions table
      
      // Mock the process for now
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success('Quiz created successfully!');
        navigate('/teacher/quizzes');
      }, 1000);
    } catch (error) {
      console.error('Error creating quiz:', error);
      setIsSubmitting(false);
      toast.error('Failed to create quiz');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Quiz</h1>
      
      {isLoading ? (
        <div className="animate-pulse bg-gray-100 h-12 rounded-lg"></div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 mb-4">
            You need to create a course before you can add a quiz.
          </p>
          <button
            onClick={() => navigate('/teacher/courses/add')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Course
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Course
            </label>
            <select
              id="course-select"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.titulo}
                </option>
              ))}
            </select>
          </div>
          
          <QuizForm
            courseId={selectedCourseId}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        </div>
      )}
    </div>
  );
};

export default AddQuizPage;
