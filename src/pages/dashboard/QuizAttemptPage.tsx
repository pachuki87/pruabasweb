import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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
  const { user, loading: authLoading } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Memoized calculations for performance
  const progress = useMemo(() => {
    if (!quiz) return 0;
    return Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100);
  }, [currentQuestionIndex, quiz]);



  const currentQuestion = useMemo(() => {
    return quiz?.questions[currentQuestionIndex] || null;
  }, [quiz, currentQuestionIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Debes iniciar sesión para acceder al cuestionario');
      navigate('/login/student');
      return;
    }
    
    if (quizId && user) {
      fetchQuiz();
    }
  }, [quizId, user, authLoading, navigate]);

  const fetchQuiz = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    // Fetch quiz data
    const { data: quizData, error: quizError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('id', quizId)
      .single();

    if (quizError) {
      console.error('Error fetching quiz:', quizError);
      const errorMessage = quizError.message || 'Error al cargar el cuestionario';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return;
    }

    // Fetch quiz questions
    const { data: questionsData, error: questionsError } = await supabase
      .from('preguntas')
      .select(`
        *,
        opciones_respuesta (id, opcion, es_correcta, orden, pregunta_id)
      `)
      .eq('cuestionario_id', quizId)
      .order('orden');

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      const errorMessage = questionsError.message || 'Error al cargar las preguntas';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return;
    }

    const formattedQuiz: Quiz = {
      id: quizData.id,
      title: quizData.titulo,
      description: quizData.descripcion || '',
      curso_id: quizData.curso_id,
      leccion_id: quizData.leccion_id,
      questions: (questionsData || []).map(q => {
        // Ordenar opciones por el campo 'orden' y extraer solo el texto
        const sortedOptions = (q.opciones_respuesta || [])
          .sort((a, b) => a.orden - b.orden)
          .map(opt => opt.opcion);
        
        // Encontrar el índice de la respuesta correcta
        const correctAnswerIndex = (q.opciones_respuesta || [])
          .sort((a, b) => a.orden - b.orden)
          .findIndex(opt => opt.es_correcta);
        
        return {
          id: q.id,
          question: q.pregunta,
          options: sortedOptions,
          correct_answer: correctAnswerIndex,
          explanation: q.explicacion
        };
      })
    };

    setQuiz(formattedQuiz);
    setIsLoading(false);
    setRetryCount(0); // Reset retry count on success
  }, [quizId]);

  const retryFetchQuiz = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setTimeout(() => fetchQuiz(), 1000 * Math.pow(2, retryCount)); // Exponential backoff
    }
  }, [fetchQuiz, retryCount]);

  const handleAnswerSelect = useCallback(async (answerIndex: number) => {
    setIsSavingAnswer(true);
    
    // Simular pequeña carga para feedback visual
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answerIndex
    });
    
    setIsSavingAnswer(false);
  }, [selectedAnswers, currentQuestionIndex]);

  const handleSubmitQuiz = useCallback(async () => {
    if (!quiz) return;

    setIsSubmitting(true);
    
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
    if (user) {
      const { error } = await supabase
        .from('user_test_results')
        .insert({
          user_id: user.id,
          cuestionario_id: quiz.id,
          curso_id: quiz.curso_id,
          puntuacion: finalScore,
          puntuacion_maxima: 100,
          respuestas_detalle: selectedAnswers
        });

      if (error) {
        console.error('Error saving quiz attempt:', error);
        // Provide more specific error messages based on error details
        let errorMessage = 'Error al guardar el intento';
        if (error.code === 'PGRST116') {
          errorMessage = 'Error de conexión con la base de datos';
        } else if (error.code === '23505') {
          errorMessage = 'Ya existe un intento para este cuestionario';
        } else if (error.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
        setIsSubmitting(false);
        return;
      }
      
      toast.success('Cuestionario completado exitosamente');
    }

    setShowResults(true);
    setIsSubmitting(false);
  }, [quiz, selectedAnswers, user, timeElapsed]);

  const handleNextQuestion = useCallback(async () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setIsLoadingQuestion(true);
      // Simular pequeña carga para transición suave
      await new Promise(resolve => setTimeout(resolve, 200));
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsLoadingQuestion(false);
    } else {
      await handleSubmitQuiz();
    }
  }, [quiz, currentQuestionIndex, handleSubmitQuiz]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const handleBackToCourse = useCallback(async () => {
    setIsNavigating(true);
    
    if (!quiz?.curso_id) {
      console.error('Error: curso_id is undefined in quiz data:', quiz);
      toast.error('Error: ID de curso no disponible');
      navigate('/student/quizzes');
      return;
    }
    
    // Pequeña pausa para mostrar el estado de carga
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (quiz?.leccion_id) {
      navigate(`/student/courses/${quiz.curso_id}/lessons/${quiz.leccion_id}`);
    } else {
      navigate(`/student/courses/${quiz.curso_id}`);
    }
  }, [quiz, navigate]);

  const isLastQuestion = useMemo(() => currentQuestionIndex === (quiz?.questions.length || 0) - 1, [currentQuestionIndex, quiz]);
  
  const canSubmit = useMemo(() => {
    if (!quiz) return false;
    return quiz.questions.every((_, index) => selectedAnswers[index] !== undefined);
  }, [quiz, selectedAnswers]);

  const correctAnswersCount = useMemo(() => {
    if (!quiz?.questions) return 0;
    return quiz.questions.filter((_, index) => selectedAnswers[index] === quiz.questions[index].correct_answer).length;
  }, [quiz, selectedAnswers]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authLoading ? 'Verificando autenticación...' : 'Cargando cuestionario...'}
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-center text-red-600 mb-2">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-700 text-sm mb-3">{error}</p>
              {retryCount < 3 && (
                <button
                  onClick={retryFetchQuiz}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Reintentando...' : `Reintentar (${retryCount + 1}/3)`}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso no autorizado</h2>
          <p className="text-gray-600 mb-4">Debes iniciar sesión para acceder al cuestionario</p>
          <button
            onClick={() => navigate('/login/student')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Iniciar sesión
          </button>
        </div>
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
              disabled={isNavigating}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isNavigating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Navegando...
                </>
              ) : (
                'Volver al curso'
              )}
            </button>
            <button
              onClick={() => navigate('/student/quizzes')}
              disabled={isNavigating}
              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isSavingAnswer}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors flex items-center ${
                selectedAnswers[currentQuestionIndex] === index
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${isSavingAnswer ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
              {option}
              {isSavingAnswer && selectedAnswers[currentQuestionIndex] === index && (
                <div className="ml-auto animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              )}
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
        
        {isLastQuestion ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={isSubmitting || !canSubmit}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : !canSubmit ? (
              <>
                <AlertCircle className="h-5 w-5 mr-2" />
                Responde todas las preguntas
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Finalizar cuestionario
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswers[currentQuestionIndex] === undefined || isLoadingQuestion}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isLoadingQuestion ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Cargando...
              </>
            ) : (
              'Siguiente'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizAttemptPage;
