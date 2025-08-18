import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, Clock, CheckCircle } from 'lucide-react';

type Question = {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
};

type Quiz = {
  id: string;
  title: string;
  description?: string;
  course_id: string;
  lesson_id?: string;
  questions: Question[];
};

const QuizAttemptPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      setIsLoading(true);
      
      // Fetch quiz data
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (quizError) {
        console.error('Error fetching quiz:', quizError);
        toast.error('Error al cargar el cuestionario');
        return;
      }

      // Fetch quiz questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index');

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        toast.error('Error al cargar las preguntas');
        return;
      }

      const formattedQuiz: Quiz = {
        id: quizData.id,
        title: quizData.title,
        description: quizData.description,
        course_id: quizData.course_id,
        lesson_id: quizData.lesson_id,
        questions: questionsData.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation
        }))
      };

      setQuiz(formattedQuiz);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar el cuestionario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answerIndex
    });
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    setIsSubmitting(true);
    
    try {
      // Calculate score
      let correctAnswers = 0;
      quiz.questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correct_answer) {
          correctAnswers++;
        }
      });
      
      const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
      setScore(finalScore);

      // Save quiz attempt to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('quiz_attempts')
          .insert({
            quiz_id: quiz.id,
            student_id: user.id,
            score: finalScore,
            answers: selectedAnswers,
            completed_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error saving quiz attempt:', error);
          toast.error('Error al guardar el intento');
        } else {
          toast.success('Cuestionario completado exitosamente');
        }
      }

      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Error al enviar el cuestionario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToCourse = () => {
    if (quiz?.lesson_id) {
      navigate(`/student/courses/${quiz.course_id}/lessons/${quiz.lesson_id}`);
    } else {
      navigate(`/student/courses/${quiz?.course_id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cuestionario no encontrado</h2>
          <button
            onClick={() => navigate('/student/quizzes')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Volver a cuestionarios
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Cuestionario Completado!</h2>
          <div className="text-6xl font-bold text-blue-600 mb-4">{score}%</div>
          <p className="text-lg text-gray-600 mb-6">
            Has respondido correctamente {quiz.questions.filter((_, index) => selectedAnswers[index] === quiz.questions[index].correct_answer).length} de {quiz.questions.length} preguntas
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleBackToCourse}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Volver al curso
            </button>
            <button
              onClick={() => navigate('/student/quizzes')}
              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
            >
              Ver todos los cuestionarios
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBackToCourse}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Volver al curso
          </button>
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2" />
            Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuestion.question}
        </h2>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                selectedAnswers[currentQuestionIndex] === index
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </button>
        
        <div className="text-sm text-gray-600">
          {Object.keys(selectedAnswers).length} de {quiz.questions.length} respondidas
        </div>
        
        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={isSubmitting || Object.keys(selectedAnswers).length !== quiz.questions.length}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Enviando...' : 'Finalizar cuestionario'}
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizAttemptPage;