import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase, supabaseAdmin } from '../../lib/supabase';

interface Question {
  id: string;
  pregunta: string;
  tipo: string;
  opciones_respuesta: Option[];
}

interface Option {
  id: string;
  opcion: string;
  es_correcta: boolean;
  orden: number;
}

interface Quiz {
  id: string;
  titulo: string;
  descripcion?: string;
  leccion_id: string;
}

const QuizAttemptPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({});
  const [textAnswers, setTextAnswers] = useState<{ [questionId: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (quizId) {
      loadQuizData();
    }
  }, [quizId]);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      
      // Cargar información del quiz usando cliente admin
      const { data: quizData, error: quizError } = await supabaseAdmin
        .from('cuestionarios')
        .select('*')
        .eq('id', quizId)
        .single();

      if (quizError) {
        console.error('Error loading quiz:', quizError);
        throw new Error(`Error al cargar el cuestionario: ${quizError.message}`);
      }
      setQuiz(quizData);

      // Cargar preguntas del quiz usando cliente admin
      const { data: questionsData, error: questionsError } = await supabaseAdmin
        .from('preguntas')
        .select(`
          id,
          pregunta,
          tipo,
          opciones_respuesta (
            id,
            opcion,
            es_correcta,
            orden
          )
        `)
        .eq('cuestionario_id', quizId)
        .order('id');

      if (questionsError) {
        console.error('Error loading questions:', questionsError);
        throw new Error(`Error al cargar las preguntas: ${questionsError.message}`);
      }
      
      setQuestions(questionsData || []);
      
    } catch (err: any) {
      console.error('Error loading quiz:', err);
      setError(err.message || 'Error al cargar el cuestionario. Verifica los permisos de la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleTextAnswerChange = (questionId: string, text: string) => {
    setTextAnswers(prev => ({
      ...prev,
      [questionId]: text
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finalizar cuestionario
      finishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishQuiz = async () => {
    try {
      // Guardar respuestas de texto libre si existen
      for (const [questionId, textAnswer] of Object.entries(textAnswers)) {
        if (textAnswer && textAnswer.trim().length > 0) {
          await supabaseAdmin
            .from('respuestas_texto_libre')
            .insert({
              pregunta_id: questionId,
              respuesta: textAnswer.trim(),
              usuario_id: 'anonymous' // Puedes cambiar esto si tienes autenticación
            });
        }
      }
      
      setShowResults(true);
    } catch (error) {
      console.error('Error saving text answers:', error);
      // Mostrar resultados aunque haya error al guardar
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    let totalGradeable = 0;
    
    questions.forEach(question => {
      if (question.tipo === 'texto_libre') {
        // Las preguntas de texto libre no se califican automáticamente
        return;
      }
      
      totalGradeable++;
      const selectedOptionId = selectedAnswers[question.id];
      if (selectedOptionId) {
        const selectedOption = question.opciones_respuesta.find(opt => opt.id === selectedOptionId);
        if (selectedOption?.es_correcta) {
          correct++;
        }
      }
    });
    
    // Si no hay preguntas calificables, mostrar mensaje especial
    if (totalGradeable === 0) {
      return { correct: 0, total: questions.length, percentage: 100, isReflective: true };
    }
    
    return { correct, total: totalGradeable, percentage: Math.round((correct / totalGradeable) * 100), isReflective: false };
  };

  const handleBackToLesson = () => {
    navigate(-1); // Volver a la página anterior
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Cargando cuestionario...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleBackToLesson}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-gray-800 font-semibold mb-2">Cuestionario no encontrado</h3>
          <p className="text-gray-600 mb-4">No se encontraron preguntas para este cuestionario.</p>
          <button
            onClick={handleBackToLesson}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a la lección
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={handleBackToLesson}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver a la lección
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Resultados del Cuestionario</h1>
              <div className="w-32"></div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                results.isReflective ? 'bg-blue-100' : (results.percentage >= 70 ? 'bg-green-100' : 'bg-red-100')
              }`}>
                {results.isReflective ? (
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                ) : results.percentage >= 70 ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{quiz.titulo}</h2>
              {results.isReflective ? (
                <div>
                  <p className="text-lg text-gray-600 mb-2">
                    ¡Gracias por compartir tu reflexión!
                  </p>
                  <p className="text-sm text-gray-500">
                    Tus respuestas han sido guardadas para tu proceso de aprendizaje.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg text-gray-600">
                    Has respondido correctamente {results.correct} de {results.total} preguntas
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${
                    results.percentage >= 70 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {results.percentage}%
                  </p>
                </div>
              )}
            </div>

            {/* Detailed Results */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revisión de respuestas:</h3>
              {questions.map((question, index) => {
                if (question.tipo === 'texto_libre') {
                  const textAnswer = textAnswers[question.id];
                  return (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-blue-100">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Pregunta {index + 1}: {question.pregunta}
                          </h4>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700 font-medium mb-1">Tu reflexión:</p>
                            <p className="text-sm text-gray-600 italic">
                              {textAnswer || 'No se proporcionó respuesta'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                const selectedOptionId = selectedAnswers[question.id];
                const selectedOption = question.opciones_respuesta.find(opt => opt.id === selectedOptionId);
                const correctOption = question.opciones_respuesta.find(opt => opt.es_correcta);
                const isCorrect = selectedOption?.es_correcta || false;

                return (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCorrect ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Pregunta {index + 1}: {question.pregunta}
                        </h4>
                        
                        {selectedOption && (
                          <p className={`text-sm mb-2 ${
                            isCorrect ? 'text-green-700' : 'text-red-700'
                          }`}>
                            Tu respuesta: {selectedOption.opcion}
                        </p>
                        )}
                        
                        {!isCorrect && correctOption && (
                          <p className="text-sm text-green-700 mb-2">
                            Respuesta correcta: {correctOption.opcion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handleBackToLesson}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continuar con la lección
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOptionId = selectedAnswers[currentQuestion.id];
  const textAnswer = textAnswers[currentQuestion.id];
  
  // Verificar si la pregunta actual tiene respuesta
  const hasAnswer = currentQuestion.tipo === 'texto_libre' 
    ? textAnswer && textAnswer.trim().length > 0
    : selectedOptionId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBackToLesson}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver a la lección
            </button>
            <h1 className="text-xl font-semibold text-gray-900">{quiz.titulo}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {currentQuestionIndex + 1} de {questions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.pregunta}
          </h2>

          <div className="space-y-3 mb-8">
            {currentQuestion.tipo === 'texto_libre' ? (
              <div className="space-y-4">
                <textarea
                  value={textAnswer || ''}
                  onChange={(e) => handleTextAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                  rows={6}
                />
                <p className="text-sm text-gray-500">
                  Comparte tu reflexión personal sobre este tema. No hay respuestas correctas o incorrectas.
                </p>
              </div>
            ) : (
              currentQuestion.opciones_respuesta.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    selectedOptionId === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      selectedOptionId === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedOptionId === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span className="text-gray-900">{option.opcion}</span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <button
              onClick={handleNextQuestion}
              disabled={!hasAnswer}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAttemptPage;