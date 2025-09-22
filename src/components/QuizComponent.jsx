// @flow
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import EmailService from '../services/EmailService';
import WebhookService from '../services/WebhookService';
import QuizSummaryGenerator from '../services/QuizSummaryGenerator';

const QuizComponent = ({
  leccionId,
  courseId,
  onQuizComplete,
  onBackToLesson,
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzxyz.supabase.co',
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'xyz'
}) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [textAnswers, setTextAnswers] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [sendingSummary, setSendingSummary] = useState(false);
  const [emailStatus, setEmailStatus] = useState('idle');
  const [webhookStatus, setWebhookStatus] = useState('idle');
  const [servicesStatus, setServicesStatus] = useState({
    email: EmailService.isConfigured(),
    webhook: WebhookService.isConfigured()
  });

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Efecto para cargar el cuestionario
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        // Primero intentar cargar cuestionarios específicos de la lección
        const { data: quizData, error: quizError } = await supabase
          .from('cuestionarios')
          .select('*')
          .eq('leccion_id', leccionId)
          .single();

        if (quizError && quizError.code !== 'PGRST116') {
          throw quizError;
        }

        if (quizData) {
          // Cargar preguntas del cuestionario
          const { data: preguntas, error: preguntasError } = await supabase
            .from('preguntas_cuestionario')
            .select('*')
            .eq('cuestionario_id', quizData.id);

          if (preguntasError) throw preguntasError;

          // Cargar opciones de respuesta para preguntas de opción múltiple
          const preguntasConOpciones = await Promise.all(
            (preguntas || []).map(async (pregunta) => {
              if (pregunta.tipo === 'multiple_choice') {
                const { data: opciones } = await supabase
                  .from('opciones_respuesta')
                  .select('*')
                  .eq('pregunta_id', pregunta.id);
                
                return {
                  ...pregunta,
                  opciones_respuesta: opciones || []
                };
              }
              return pregunta;
            })
          );

          setQuiz({
            ...quizData,
            preguntas: preguntasConOpciones
          });
          setSelectedQuiz(quizData.id);
        } else {
          // Si no hay cuestionario específico, cargar cuestionarios generales del curso
          if (courseId) {
            const { data: generalQuizzes, error: generalError } = await supabase
              .from('cuestionarios')
              .select('*')
              .eq('curso_id', courseId)
              .or('leccion_id.is.null,leccion_id.eq.' + leccionId);

            if (generalError) throw generalError;

            if (generalQuizzes && generalQuizzes.length > 0) {
              // Por simplicidad, tomar el primer cuestionario encontrado
              const selectedQuiz = generalQuizzes[0];
              
              // Cargar preguntas del cuestionario
              const { data: preguntas, error: preguntasError } = await supabase
                .from('preguntas_cuestionario')
                .select('*')
                .eq('cuestionario_id', selectedQuiz.id);

              if (preguntasError) throw preguntasError;

              // Cargar opciones de respuesta para preguntas de opción múltiple
              const preguntasConOpciones = await Promise.all(
                (preguntas || []).map(async (pregunta) => {
                  if (pregunta.tipo === 'multiple_choice') {
                    const { data: opciones } = await supabase
                      .from('opciones_respuesta')
                      .select('*')
                      .eq('pregunta_id', pregunta.id);
                    
                    return {
                      ...pregunta,
                      opciones_respuesta: opciones || []
                    };
                  }
                  return pregunta;
                })
              );

              setQuiz({
                ...selectedQuiz,
                preguntas: preguntasConOpciones
              });
              setSelectedQuiz(selectedQuiz.id);
            }
          }
        }
      } catch (err) {
        console.error('Error loading quiz:', err);
        setError('No se pudo cargar el cuestionario. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (leccionId) {
      loadQuiz();
    }
  }, [leccionId, courseId, supabase]);

  // Efecto para registrar el tiempo de inicio
  useEffect(() => {
    if (quiz && !quizCompleted && !startTime) {
      setStartTime(Date.now());
    }
  }, [quiz, quizCompleted, startTime]);

  const handleAnswerSelect = (questionId, opcionId) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: {
        opcionId,
        esCorrecta: false, // Se calculará al final
        tiempoRespuesta: startTime ? Date.now() - startTime : 0,
        tipo: 'multiple_choice'
      }
    }));
  };

  const handleTextAnswerChange = (questionId, text) => {
    setTextAnswers(prev => ({
      ...prev,
      [questionId]: text
    }));
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: {
        textoRespuesta: text,
        esCorrecta: false, // Se calculará al final
        tiempoRespuesta: startTime ? Date.now() - startTime : 0,
        tipo: 'texto_libre',
        archivos: uploadedFiles[questionId] || []
      }
    }));
  };

  const handleFileUpload = (questionId, files) => {
    const fileArray = Array.from(files);
    setUploadedFiles(prev => ({
      ...prev,
      [questionId]: [...(prev[questionId] || []), ...fileArray]
    }));
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        archivos: [...(prev[questionId]?.archivos || []), ...fileArray]
      }
    }));
  };

  const removeFile = (questionId, fileIndex) => {
    setUploadedFiles(prev => ({
      ...prev,
      [questionId]: prev[questionId]?.filter((_, index) => index !== fileIndex) || []
    }));
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        archivos: prev[questionId]?.archivos?.filter((_, index) => index !== fileIndex) || []
      }
    }));
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestion < quiz.preguntas.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    if (!quiz) return {
      puntuacionObtenida: 0,
      puntuacionMaxima: 0,
      porcentajeAcierto: 0,
      tiempoTotal: 0,
      aprobado: false,
      respuestasCorrectas: 0,
      totalPreguntas: 0
    };

    let puntuacionObtenida = 0;
    let puntuacionMaxima = 0;
    let respuestasCorrectas = 0;
    let tiempoTotal = 0;

    const updatedAnswers = { ...userAnswers };

    quiz.preguntas.forEach((question) => {
      puntuacionMaxima += 1;
      const userAnswer = userAnswers[question.id];
      
      if (userAnswer) {
        tiempoTotal += userAnswer.tiempoRespuesta;

        let esCorrecta = false;
        
        if (question.tipo === 'multiple_choice') {
          const opcionCorrecta = question.opciones_respuesta?.find(op => op.es_correcta);
          esCorrecta = userAnswer.opcionId === opcionCorrecta?.id;
        } else if (question.tipo === 'verdadero_falso') {
          // Implementar lógica para verdadero/falso
          esCorrecta = true; // Por ahora, asumir correcto
        } else if (question.tipo === 'texto_libre') {
          // Implementar lógica para texto libre
          esCorrecta = true; // Por ahora, asumir correcto
        }

        if (esCorrecta) {
          puntuacionObtenida += 1;
          respuestasCorrectas += 1;
        }

        updatedAnswers[question.id] = {
          ...userAnswer,
          esCorrecta
        };
      }
    });

    setUserAnswers(updatedAnswers);

    const porcentajeAcierto = puntuacionMaxima > 0 ? Math.round((puntuacionObtenida / puntuacionMaxima) * 100) : 0;
    const porcentajeAprobacion = quiz?.porcentaje_aprobacion || 70;
    const aprobado = porcentajeAcierto >= porcentajeAprobacion;

    return {
      puntuacionObtenida,
      puntuacionMaxima,
      porcentajeAcierto,
      tiempoTotal,
      aprobado,
      respuestasCorrectas,
      totalPreguntas: quiz.preguntas.length
    };
  };

  const finishQuiz = async () => {
    if (!quiz) return;

    const results = calculateResults();
    setQuizResults(results);
    setQuizCompleted(true);

    // Notificar al componente padre
    if (onQuizComplete) {
      onQuizComplete(results);
    }

    // Enviar resumen por email y webhook
    await sendQuizSummary(results);
  };

  const sendQuizSummary = async (results) => {
    if (!quiz || !selectedQuiz) return;

    try {
      setSendingSummary(true);
      setEmailStatus('sending');
      setWebhookStatus('sending');

      // Obtener información del usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.warn('No se pudo obtener información del usuario');
        setEmailStatus('error');
        setWebhookStatus('error');
        return;
      }

      // Generar resumen detallado
      const summaryData = QuizSummaryGenerator.generateDetailedSummary(
        quiz,
        userAnswers,
        quiz.preguntas,
        user,
        results
      );

      // Generar HTML para email
      const htmlContent = QuizSummaryGenerator.generateHTMLSummary(summaryData);

      // Enviar email si está configurado
      if (servicesStatus.email) {
        try {
          const emailResult = await EmailService.sendQuizSummaryEmail(
            user,
            quiz,
            summaryData,
            htmlContent
          );
          
          if (emailResult.success) {
            setEmailStatus('success');
          } else {
            setEmailStatus('error');
          }
        } catch (error) {
          console.error('Error sending email:', error);
          setEmailStatus('error');
        }
      } else {
        setEmailStatus('idle');
      }

      // Enviar webhook si está configurado
      if (servicesStatus.webhook) {
        try {
          const webhookPayload = QuizSummaryGenerator.generateWebhookSummary(summaryData);
          const webhookResult = await WebhookService.sendQuizWebhook(webhookPayload);
          
          if (webhookResult.success) {
            setWebhookStatus('success');
          } else {
            setWebhookStatus('error');
          }
        } catch (error) {
          console.error('Error sending webhook:', error);
          setWebhookStatus('error');
        }
      } else {
        setWebhookStatus('idle');
      }

    } catch (error) {
      console.error('Error sending quiz summary:', error);
      setEmailStatus('error');
      setWebhookStatus('error');
    } finally {
      setSendingSummary(false);
    }
  };

  const retryQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setQuizResults(null);
    setTextAnswers({});
    setUploadedFiles({});
    setEmailStatus('idle');
    setWebhookStatus('idle');
    setStartTime(Date.now());
  };

  const renderQuestion = () => {
    if (!quiz || currentQuestion >= quiz.preguntas.length) return null;

    const question = quiz.preguntas[currentQuestion];
    const userAnswer = userAnswers[question.id];

    return (
      <div className="question-container">
        <div className="question-header">
          <h3 className="question-text">
            Pregunta {currentQuestion + 1} de {quiz.preguntas.length}
          </h3>
          <p className="question-main-text">{question.pregunta}</p>
        </div>

        <div className="options-container">
          {question.tipo === 'multiple_choice' && question.opciones_respuesta && (
            <div className="multiple-choice-options">
              {question.opciones_respuesta.map((opcion, index) => (
                <button
                  key={opcion.id}
                  className={`option-button ${userAnswer?.opcionId === opcion.id ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(question.id, opcion.id)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{opcion.opcion}</span>
                </button>
              ))}
            </div>
          )}

          {question.tipo === 'texto_libre' && (
            <div className="text-answer-container">
              <textarea
                className="text-answer-input"
                placeholder="Escribe tu respuesta aquí..."
                value={textAnswers[question.id] || ''}
                onChange={(e) => handleTextAnswerChange(question.id, e.target.value)}
                rows={4}
              />
              <div className="character-count">
                {textAnswers[question.id]?.length || 0} caracteres
              </div>

              {question.archivo_requerido && (
                <div className="file-upload-container">
                  <div className="file-upload-header">
                    <h4>Adjuntar archivos (opcional)</h4>
                    <p>Puedes subir archivos para complementar tu respuesta</p>
                  </div>

                  <div className="file-upload-area">
                    <input
                      type="file"
                      id={`file-upload-${question.id}`}
                      className="file-upload-input"
                      multiple
                      onChange={(e) => handleFileUpload(question.id, e.target.files)}
                    />
                    <label htmlFor={`file-upload-${question.id}`} className="file-upload-label">
                      <div className="upload-icon">📎</div>
                      <div className="upload-text">
                        <strong>Haz clic para subir archivos</strong>
                        <span>O arrastra y suelta aquí</span>
                      </div>
                    </label>
                  </div>

                  {uploadedFiles[question.id] && uploadedFiles[question.id].length > 0 && (
                    <div className="uploaded-files-list">
                      <h5>Archivos adjuntos:</h5>
                      {uploadedFiles[question.id].map((file, index) => (
                        <div key={index} className="uploaded-file-item">
                          <div className="file-info">
                            <span className="file-icon">📄</span>
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            className="remove-file-btn"
                            onClick={() => removeFile(question.id, index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {question.tipo === 'verdadero_falso' && (
            <div className="true-false-options">
              <button
                className={`option-button ${userAnswer?.opcionId === 'verdadero' ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(question.id, 'verdadero')}
              >
                <span className="option-letter">V</span>
                <span className="option-text">Verdadero</span>
              </button>
              <button
                className={`option-button ${userAnswer?.opcionId === 'falso' ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(question.id, 'falso')}
              >
                <span className="option-letter">F</span>
                <span className="option-text">Falso</span>
              </button>
            </div>
          )}
        </div>

        <div className="question-actions">
          <button
            className="btn-previous"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            Anterior
          </button>
          
          <button
            className="btn-next"
            onClick={handleNextQuestion}
            disabled={!userAnswers[question.id]}
          >
            {currentQuestion === quiz.preguntas.length - 1 ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!quiz || !quizResults) return null;

    return (
      <div className="quiz-results">
        <div className="results-header">
          <h2>Resultados del Cuestionario</h2>
          <div className={`score-badge ${quizResults.aprobado ? 'approved' : 'failed'}`}>
            {quizResults.porcentajeAcierto}%
          </div>
          <p className="result-message">
            {quizResults.aprobado 
              ? '¡Felicidades! Has aprobado el cuestionario.' 
              : 'No has alcanzado el porcentaje necesario para aprobar.'}
          </p>
        </div>

        <div className="results-details">
          <div className="result-item">
            <span className="label">Puntuación obtenida:</span>
            <span className={`value ${quizResults.aprobado ? 'approved' : 'failed'}`}>
              {quizResults.puntuacionObtenida}/{quizResults.puntuacionMaxima}
            </span>
          </div>
          <div className="result-item">
            <span className="label">Respuestas correctas:</span>
            <span className={`value ${quizResults.aprobado ? 'approved' : 'failed'}`}>
              {quizResults.respuestasCorrectas}/{quizResults.totalPreguntas}
            </span>
          </div>
          <div className="result-item">
            <span className="label">Tiempo total:</span>
            <span className="value">
              {Math.floor(quizResults.tiempoTotal / 60000)}m {Math.floor((quizResults.tiempoTotal % 60000) / 1000)}s
            </span>
          </div>
          <div className="result-item">
            <span className="label">Estado:</span>
            <span className={`value ${quizResults.aprobado ? 'approved' : 'failed'}`}>
              {quizResults.aprobado ? 'Aprobado' : 'No aprobado'}
            </span>
          </div>
        </div>

        {/* Estado de envío de resumen */}
        <div className="summary-status">
          <h4>Envío de Resumen</h4>
          
          <div className={`status-item ${emailStatus}`}>
            <span className="status-icon">
              {emailStatus === 'sending' && '⏳'}
              {emailStatus === 'success' && '✅'}
              {emailStatus === 'error' && '❌'}
              {emailStatus === 'idle' && '📧'}
            </span>
            <span className="status-text">
              {emailStatus === 'sending' && 'Enviando resumen por email...'}
              {emailStatus === 'success' && 'Email enviado correctamente'}
              {emailStatus === 'error' && 'Error al enviar email'}
              {emailStatus === 'idle' && 'Email no configurado'}
            </span>
          </div>

          <div className={`status-item ${webhookStatus}`}>
            <span className="status-icon">
              {webhookStatus === 'sending' && '⏳'}
              {webhookStatus === 'success' && '✅'}
              {webhookStatus === 'error' && '❌'}
              {webhookStatus === 'idle' && '🔗'}
            </span>
            <span className="status-text">
              {webhookStatus === 'sending' && 'Enviando resumen por webhook...'}
              {webhookStatus === 'success' && 'Webhook enviado correctamente'}
              {webhookStatus === 'error' && 'Error al enviar webhook'}
              {webhookStatus === 'idle' && 'Webhook no configurado'}
            </span>
          </div>
        </div>

        <div className="results-actions">
          {quiz.permite_reintentar && !quizResults.aprobado && (
            <button className="btn-retry" onClick={retryQuiz}>
              Reintentar Cuestionario
            </button>
          )}
          
          <button className="btn-next-quiz" onClick={onBackToLesson}>
            Volver a la Lección
          </button>
        </div>
      </div>
    );
  };

  const renderQuizStart = () => {
    if (!quiz) return null;

    return (
      <div className="quiz-start">
        <div className="quiz-selector">
          <h2>{quiz.titulo}</h2>
          {quiz.descripcion && (
            <p>{quiz.descripcion}</p>
          )}
        </div>

        <div className="quiz-info">
          <h3>Información del Cuestionario</h3>
          <div className="quiz-details">
            <p><strong>Número de preguntas:</strong> {quiz.preguntas.length}</p>
            {quiz.tiempo_limite && (
              <p><strong>Tiempo límite:</strong> {quiz.tiempo_limite} minutos</p>
            )}
            <p><strong>Porcentaje de aprobación:</strong> {quiz.porcentaje_aprobacion || 70}%</p>
            {quiz.intentos_maximos && (
              <p><strong>Intentos máximos:</strong> {quiz.intentos_maximos}</p>
            )}
            <p><strong>Mostrar retroalimentación:</strong> {quiz.mostrar_retroalimentacion ? 'Sí' : 'No'}</p>
            <p><strong>Permite reintentar:</strong> {quiz.permite_reintentar ? 'Sí' : 'No'}</p>
          </div>

          {/* Estado de servicios */}
          <div className="services-status">
            <h5>Estado de Servicios</h5>
            <div className={`service-status ${servicesStatus.email ? 'configured' : 'not-configured'}`}>
              Email: {servicesStatus.email ? '✅ Configurado' : '❌ No configurado'}
            </div>
            <div className={`service-status ${servicesStatus.webhook ? 'configured' : 'not-configured'}`}>
              Webhook: {servicesStatus.webhook ? '✅ Configurado' : '❌ No configurado'}
            </div>
          </div>

          <button 
            className="btn-start" 
            onClick={() => setStartTime(Date.now())}
            disabled={loading}
          >
            Comenzar Cuestionario
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Cargando cuestionario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-empty">
        <h3>Error</h3>
        <p>{error}</p>
        {onBackToLesson && (
          <button className="btn-back" onClick={onBackToLesson}>
            Volver a la Lección
          </button>
        )}
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-empty">
        <h3>No hay cuestionario disponible</h3>
        <p>No se encontró ningún cuestionario para esta lección.</p>
        {onBackToLesson && (
          <button className="btn-back" onClick={onBackToLesson}>
            Volver a la Lección
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {!startTime && renderQuizStart()}
      {startTime && !quizCompleted && renderQuestion()}
      {quizCompleted && renderResults()}
    </div>
  );
};

export default QuizComponent;
