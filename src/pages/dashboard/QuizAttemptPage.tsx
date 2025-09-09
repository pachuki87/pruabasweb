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
  curso_id: string;
  leccion_id?: string;
  questions: Question[];
}

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
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

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
        .from('cuestionarios')
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
        .from('preguntas')
        .select(`
          *,
          opciones_respuesta (*)
        `)
        .eq('cuestionario_id', quizId)
        .order('orden');

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        toast.error('Error al cargar las preguntas');
        return;
      }

      const formattedQuiz: Quiz = {
        id: quizData.id,
        title: quizData.titulo,
        description: quizData.descripcion || '',
        curso_id: quizData.curso_id,
        leccion_id: quizData.leccion_id,
        questions: (questionsData || []).map(q => ({
          id: q.id,
          question: q.pregunta,
          options: q.opciones_respuesta || [],
          correct_answer: q.respuesta_correcta,
          explanation: q.explicacion
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
          .from('user_test_results')
          .insert({
            student_id: user.id,
            cuestionario_id: quiz.id,
            user_id: user.id,
            curso_id: quiz.curso_id,
            score: finalScore,
            total_questions: quiz.questions.length,
            correct_answers: correctAnswers,
            incorrect_answers: quiz.questions.length - correctAnswers,
            time_taken_minutes: Math.round(timeElapsed / 60),
            passed: finalScore >= 70,
            attempt_number: 1,
            answers_data: selectedAnswers,
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
    if (!quiz?.curso_id) {
      console.error('Error: curso_id is undefined in quiz data:', quiz);
      toast.error('Error: ID de curso no disponible');
      navigate('/student/quizzes');
      return;
    }
    
    if (quiz?.leccion_id) {
      navigate(`/student/courses/${quiz.curso_id}/lessons/${quiz.leccion_id}`);
    } else {
      navigate(`/student/courses/${quiz.curso_id}`);
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
            Has respondido correctamente {quiz?.questions?.filter((_, index) => selectedAnswers[index] === quiz.questions[index].correct_answer).length || 0} de {quiz?.questions?.length || 0} preguntas
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

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No hay preguntas disponibles</h2>
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
          {currentQuestion?.question || 'Pregunta no disponible'}
        </h2>
        
        <div className="space-y-3">
          {(currentQuestion?.options || []).map((option, index) => (
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