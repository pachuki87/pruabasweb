// @flow
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import QuizSummaryGenerator from '../services/QuizSummaryGenerator.js';
import FileUploadComponent from './FileUploadComponent.jsx';
import './QuizComponent.css';

const QuizComponent = ({
  leccionId,
  courseId,
  onQuizComplete,
  onBackToLesson
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
  const [debugInfo, setDebugInfo] = useState({
    leccionId: leccionId || 'No proporcionado',
    courseId: courseId || 'No proporcionado',
    timestamp: new Date().toISOString()
  });
  const [sendingSummary, setSendingSummary] = useState(false);
  const [emailStatus, setEmailStatus] = useState('idle');
  const [webhookStatus, setWebhookStatus] = useState('idle');
  const [diagnosticInfo, setDiagnosticInfo] = useState(null);
  const [servicesStatus, setServicesStatus] = useState({
    email: false,
    webhook: false
  });
  const [userEmail, setUserEmail] = useState('');




  // Efecto para cargar el cuestionario
  useEffect(() => {
    const loadQuiz = async (leccionId) => {
      try {
        setLoading(true);
        setError(null);

        // Verificar si tenemos los parámetros necesarios
        if (!leccionId) {
          throw new Error('No se proporcionó ID de lección');
        }

        console.log('🔍 Cargando cuestionario para lección:', leccionId);

        // Primero intentar cargar cuestionarios específicos de la lección
        const { data: specificQuizzes, error: quizError } = await supabase
          .from('cuestionarios')
          .select('*')
          .eq('leccion_id', leccionId);

        console.log('📊 Resultado búsqueda específica:', { specificQuizzes, quizError });

        if (quizError) {
          console.warn('⚠️ Error buscando cuestionario específico:', quizError);
          // No lanzar error aquí, intentar con cuestionarios generales
        }
        
        const quizData = specificQuizzes && specificQuizzes.length > 0 ? specificQuizzes[0] : null;

        if (quizData) {
          console.log('✅ Cuestionario específico encontrado:', quizData.titulo);
          
          // Cargar preguntas del cuestionario
          let preguntas = [];
          try {
            const result = await supabase
              .from('preguntas')
              .select('*')
              .eq('cuestionario_id', quizData.id);
            
            preguntas = result.data || [];
            
            if (result.error) {
              console.warn('⚠️ Error cargando preguntas desde la tabla "preguntas":', result.error);
            }
          } catch (err) {
            console.warn('⚠️ Excepción cargando preguntas:', err);
          }

          console.log('📝 Preguntas cargadas:', preguntas.length);

          // Cargar opciones de respuesta para preguntas de opción múltiple
          const preguntasConOpciones = await Promise.all(
            (preguntas || []).map(async (pregunta) => {
              if (pregunta.tipo === 'multiple_choice') {
                try {
                  const { data: opciones } = await supabase
                    .from('opciones_respuesta')
                    .select('*')
                    .eq('pregunta_id', pregunta.id);
                  
                  return {
                    ...pregunta,
                    opciones_respuesta: opciones || []
                  };
                } catch (err) {
                  console.warn('⚠️ Error cargando opciones para pregunta', pregunta.id, ':', err);
                  return {
                    ...pregunta,
                    opciones_respuesta: []
                  };
                }
              }
              return pregunta;
            })
          );

          setQuiz({
            ...quizData,
            preguntas: preguntasConOpciones
          });
          setSelectedQuiz(quizData.id);
          
          console.log('✅ Cuestionario cargado completamente');
        } else {
          console.log('📋 Buscando cuestionarios generales del curso...');
          
          // Si no hay cuestionario específico, cargar cuestionarios generales del curso
          if (courseId) {
            const { data: generalQuizzes, error: generalError } = await supabase
              .from('cuestionarios')
              .select('*')
              .eq('curso_id', courseId)
              .is('leccion_id', null); // Solo cuestionarios generales (sin lección específica)

            console.log('📊 Resultado búsqueda general:', { generalQuizzes, generalError });

            if (generalError) {
              throw generalError;
            }

            if (generalQuizzes && generalQuizzes.length > 0) {
              // Por simplicidad, tomar el primer cuestionario encontrado
              const selectedQuiz = generalQuizzes[0];
              console.log('✅ Cuestionario general encontrado:', selectedQuiz.titulo);
              
              // Cargar preguntas del cuestionario
              let preguntas = [];
              try {
                const result = await supabase
                  .from('preguntas')
                  .select('*')
                  .eq('cuestionario_id', selectedQuiz.id);
                
                preguntas = result.data || [];
                
                if (result.error) {
                  console.warn('⚠️ Error cargando preguntas desde la tabla "preguntas" (general):', result.error);
                }
              } catch (err) {
                console.warn('⚠️ Excepción cargando preguntas de cuestionario general:', err);
              }

              console.log('📝 Preguntas cargadas (general):', preguntas.length);

              // Cargar opciones de respuesta
              const preguntasConOpciones = await Promise.all(
                (preguntas || []).map(async (pregunta) => {
                  if (pregunta.tipo === 'multiple_choice') {
                    try {
                      const { data: opciones } = await supabase
                        .from('opciones_respuesta')
                        .select('*')
                        .eq('pregunta_id', pregunta.id);
                      
                      // Si no hay opciones en la tabla opciones_respuesta, 
                      // intentar cargarlas de las columnas de la tabla preguntas
                      if (!opciones || opciones.length === 0) {
                        const opcionesDesdeColumnas = [];
                        
                        if (pregunta.opcion_a) {
                          opcionesDesdeColumnas.push({
                            id: `${pregunta.id}_a`,
                            pregunta_id: pregunta.id,
                            opcion: pregunta.opcion_a,
                            es_correcta: pregunta.respuesta_correcta === 'a',
                            orden: 1
                          });
                        }
                        if (pregunta.opcion_b) {
                          opcionesDesdeColumnas.push({
                            id: `${pregunta.id}_b`,
                            pregunta_id: pregunta.id,
                            opcion: pregunta.opcion_b,
                            es_correcta: pregunta.respuesta_correcta === 'b',
                            orden: 2
                          });
                        }
                        if (pregunta.opcion_c) {
                          opcionesDesdeColumnas.push({
                            id: `${pregunta.id}_c`,
                            pregunta_id: pregunta.id,
                            opcion: pregunta.opcion_c,
                            es_correcta: pregunta.respuesta_correcta === 'c',
                            orden: 3
                          });
                        }
                        if (pregunta.opcion_d) {
                          opcionesDesdeColumnas.push({
                            id: `${pregunta.id}_d`,
                            pregunta_id: pregunta.id,
                            opcion: pregunta.opcion_d,
                            es_correcta: pregunta.respuesta_correcta === 'd',
                            orden: 4
                          });
                        }
                        
                        return {
                          ...pregunta,
                          opciones_respuesta: opcionesDesdeColumnas
                        };
                      }
                      
                      return {
                        ...pregunta,
                        opciones_respuesta: opciones || []
                      };
                    } catch (err) {
                      return {
                        ...pregunta,
                        opciones_respuesta: []
                      };
                    }
                  }
                  return pregunta;
                })
              );

              setQuiz({
                ...selectedQuiz,
                preguntas: preguntasConOpciones
              });
              setSelectedQuiz(selectedQuiz.id);
              
              console.log('✅ Cuestionario general cargado completamente');
            } else {
              console.log('ℹ️ No se encontraron cuestionarios para este curso/lección');
              setError('No se encontraron cuestionarios disponibles para esta lección o curso.');
            }
          } else {
            console.log('⚠️ No se proporcionó courseId para buscar cuestionarios generales');
            setError('No se puede cargar el cuestionario: falta el ID del curso.');
          }
        }
      } catch (err) {
        console.error('❌ Error loading quiz:', err);
        setError('No se pudo cargar el cuestionario. Por favor, intenta de nuevo más tarde.');
        
        // Para debugging, mostrar más detalles del error
        console.error('Detalles del error:', {
          message: err.message,
          code: err.code,
          details: err.details,
          hint: err.hint
        });
      } finally {
        setLoading(false);
      }
    };

    // Solo ejecutar si tenemos leccionId
    if (leccionId) {
      loadQuiz(leccionId);
    } else {
      console.warn('⚠️ No se proporcionó leccionId');
      setLoading(false);
      setError('No se especificó una lección para el cuestionario.');
    }
  }, [leccionId, courseId, supabase]);

  // Efecto para registrar el tiempo de inicio
  useEffect(() => {
    if (quiz && !quizCompleted && !startTime) {
      setStartTime(Date.now());
    }
  }, [quiz, quizCompleted, startTime]);

  // Detectar el email del usuario al cargar el componente
  useEffect(() => {
    const detectUserEmail = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user && user.email) {
          setUserEmail(user.email);
          setServicesStatus(prev => ({ ...prev, email: true }));
          console.log('Email del usuario detectado:', user.email);
        }
      } catch (error) {
        console.error('Error detectando email del usuario:', error);
      }
    };

    detectUserEmail();
  }, []);

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
    if (!quiz || !quiz.preguntas) {
      console.warn('⚠️ No hay quiz o preguntas para calcular resultados');
      return {
        puntuacionObtenida: 0,
        puntuacionMaxima: 0,
        porcentajeAcierto: 0,
        tiempoTotal: 0,
        aprobado: false,
        respuestasCorrectas: 0,
        totalPreguntas: 0,
        questionsSummary: []
      };
    }

    let puntuacionObtenida = 0;
    let puntuacionMaxima = 0;
    let respuestasCorrectas = 0;
    let tiempoTotal = 0;

    const updatedAnswers = { ...userAnswers };
    const questionsSummary = [];

    console.log('🔍 Calculando resultados para', quiz.preguntas.length, 'preguntas');
    console.log('📝 Respuestas del usuario:', userAnswers);

    quiz.preguntas.forEach((question, index) => {
      puntuacionMaxima += 1;
      const userAnswer = userAnswers[question.id];

      console.log(`❓ Pregunta ${index + 1}:`, question.pregunta?.substring(0, 50) + '...');
      console.log(`   Tipo: ${question.tipo}`);
      console.log(`   Respuesta usuario:`, userAnswer);

      let esCorrecta = false;
      let respuestaCorrecta = '';
      let respuestaUsuario = '';

      if (userAnswer) {
        tiempoTotal += userAnswer.tiempoRespuesta || 0;

        if (question.tipo === 'multiple_choice') {
          const opcionCorrecta = question.opciones_respuesta?.find(op => op.es_correcta);
          esCorrecta = userAnswer.opcionId === opcionCorrecta?.id;
          respuestaCorrecta = opcionCorrecta?.opcion || '';
          respuestaUsuario = question.opciones_respuesta?.find(op => op.id === userAnswer.opcionId)?.opcion || userAnswer.opcionId || '';
          console.log(`   Opción correcta: ${opcionCorrecta?.id}, Opción usuario: ${userAnswer.opcionId}, Resultado: ${esCorrecta}`);
        } else if (question.tipo === 'verdadero_falso') {
          const respuestaUsuarioValor = userAnswer.opcionId === 'verdadero' ? 'V' : 'F';
          esCorrecta = respuestaUsuarioValor === question.respuesta_correcta;
          respuestaCorrecta = question.respuesta_correcta === 'V' ? 'Verdadero' : 'Falso';
          respuestaUsuario = userAnswer.opcionId === 'verdadero' ? 'Verdadero' : 'Falso';
          console.log(`   Respuesta correcta: ${question.respuesta_correcta}, Respuesta usuario: ${respuestaUsuarioValor}, Resultado: ${esCorrecta}`);
        } else if (question.tipo === 'texto_libre' || question.tipo === 'archivo_adjunto') {
          const tieneTexto = userAnswer.textoRespuesta && userAnswer.textoRespuesta.trim().length > 3;
          const tieneArchivos = userAnswer.archivos && userAnswer.archivos.length > 0;
          esCorrecta = tieneTexto || tieneArchivos;
          respuestaUsuario = userAnswer.textoRespuesta || '';
          if (userAnswer.archivos && userAnswer.archivos.length > 0) {
            respuestaUsuario += ' (con archivos adjuntos)';
          }
          respuestaCorrecta = 'Respuesta libre';
          console.log(`   Tiene texto: ${tieneTexto}, Tiene archivos: ${tieneArchivos}, Resultado: ${esCorrecta}`);
        }

        if (esCorrecta) {
          puntuacionObtenida += 1;
          respuestasCorrectas += 1;
          console.log(`   ✅ CORRECTA`);
        } else {
          console.log(`   ❌ INCORRECTA`);
        }

        updatedAnswers[question.id] = {
          ...userAnswer,
          esCorrecta
        };

        questionsSummary.push({
          question: question.pregunta,
          userAnswer: respuestaUsuario,
          correctAnswer: respuestaCorrecta,
          isCorrect: esCorrecta,
          timeSpent: userAnswer.tiempoRespuesta || 0,
        });

      } else {
        console.log(`   ⚠️ Sin respuesta`);

        questionsSummary.push({
          question: question.pregunta,
          userAnswer: 'No respondida',
          correctAnswer: question.tipo === 'multiple_choice'
            ? question.opciones_respuesta?.find(op => op.es_correcta)?.opcion || ''
            : question.tipo === 'verdadero_falso'
            ? question.respuesta_correcta === 'V' ? 'Verdadero' : 'Falso'
            : 'Respuesta libre',
          isCorrect: false,
          timeSpent: 0,
        });
      }
    });

    setUserAnswers(updatedAnswers);

    const porcentajeAcierto = puntuacionMaxima > 0 ? Math.round((puntuacionObtenida / puntuacionMaxima) * 100) : 0;
    const porcentajeAprobacion = quiz?.porcentaje_aprobacion || 70;
    const aprobado = porcentajeAcierto >= porcentajeAprobacion;

    console.log('📊 Resultados calculados:', {
      puntuacionObtenida,
      puntuacionMaxima,
      porcentajeAcierto,
      aprobado,
      respuestasCorrectas,
      totalPreguntas: quiz.preguntas.length
    });

    return {
      puntuacionObtenida,
      puntuacionMaxima,
      porcentajeAcierto,
      tiempoTotal,
      aprobado,
      respuestasCorrectas,
      totalPreguntas: quiz.preguntas.length,
      questionsSummary: questionsSummary
    };
  };

  const finishQuiz = async () => {
    if (!quiz) return;

    const results = calculateResults();
    setQuizResults(results);
    setQuizCompleted(true);

    // Guardar resultados del test en la base de datos
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error('❌ Error de autenticación:', authError);
        return;
      }

      if (!user) {
        console.log('❌ No hay usuario autenticado');
        return;
      }

      if (!courseId) {
        console.log('❌ No hay courseId disponible');
        return;
      }

      console.log('💾 Guardando resultados del test en la base de datos...');
      console.log('📊 Datos a guardar:', {
        userId: user.id,
        quizId: quiz.id,
        courseId: courseId,
        results: results
      });

      const { data, error: saveError } = await supabase
        .from('user_test_results')
        .insert({
          user_id: user.id,
          cuestionario_id: quiz.id,
          curso_id: courseId,
          puntuacion: results.respuestasCorrectas,
          puntuacion_maxima: results.totalPreguntas,
          tiempo_completado: Math.round((Date.now() - startTime) / 1000 / 60), // minutos
          respuestas_detalle: {
            respuestas: userAnswers,
            tiempo_total: results.tiempoTotal
          },
          fecha_completado: new Date().toISOString(),
          completed_at: new Date().toISOString()
        })
        .select();

      if (saveError) {
        console.error('❌ Error guardando resultados:', saveError);
      } else {
        console.log('✅ Resultados guardados exitosamente:', data);

        // Nota: No podemos actualizar el progreso de la lección específica sin leccionId
        // El progreso general se calculará en el componente StudentProgress
        console.log('ℹ️ Progreso de lección no actualizado: se requiere leccionId');
      }
    } catch (error) {
      console.error('❌ Error en guardado de resultados:', error);
    }

    // Notificar al componente padre
    if (onQuizComplete) {
      onQuizComplete(results);
    }

    // Enviar resumen por email y webhook
    await sendQuizSummary(results);
  };

  const sendQuizSummary = async (results) => {
    if (!quiz || !selectedQuiz) {
      console.warn('⚠️ No hay quiz o selectedQuiz para enviar resumen');
      return;
    }

    try {
      setSendingSummary(true);
      setEmailStatus('sending');
      setWebhookStatus('sending');

      console.log('📤 Enviando resumen completo del cuestionario con correcciones IA...');

      // Obtener información del usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.warn('⚠️ No se pudo obtener información del usuario:', userError);
        setEmailStatus('error');
        return;
      }

      if (!user.email) {
        console.warn('⚠️ El usuario no tiene email configurado');
        setEmailStatus('error');
        return;
      }

      setUserEmail(user.email);

      // Primero, probar la conectividad del webhook
      try {
        console.log('🧪 Probando conectividad del webhook...');
        const testResponse = await fetch('/.netlify/functions/send-corrections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'test-webhook'
          })
        });

        const testResult = await testResponse.json();
        console.log('Resultado de prueba del webhook:', testResult);
        setDiagnosticInfo(testResult);
      } catch (testError) {
        console.error('Error en prueba de webhook:', testError);
        setDiagnosticInfo({
          success: false,
          error: testError.message
        });
      }

      // Preparar datos para enviar a la función de procesamiento
      const formData = {
        nombre: user.user_metadata?.nombre || user.user_metadata?.full_name || user.email.split('@')[0],
        email: user.email,
        quizData: quiz,
        userAnswers: userAnswers,
        results: results
      };

      console.log('📋 Enviando formulario completo para procesamiento...');

      // Enviar a la función de procesamiento directa
      const response = await fetch('/.netlify/functions/send-corrections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: user.user_metadata?.nombre || user.user_metadata?.full_name || user.email.split('@')[0],
          email: user.email,
          quizData: quiz,
          userAnswers: userAnswers
        })
      });

      const result = await response.json();
      console.log('📊 Respuesta del servidor:', result);

      // Analizar la respuesta de manera más detallada
      const isHttpSuccess = response.ok; // 200-299
      const isWebhookSuccess = result.success === true && result.webhookStatus === 'success';
      const isWebhookFailed = result.success === false && result.webhookStatus === 'failed';
      const isValidationError = result.webhookStatus === 'validation_failed';
      const hasErrorSolution = result.errorSolution;

      if (isHttpSuccess && isWebhookSuccess) {
        // Éxito completo
        setEmailStatus('success');
        setWebhookStatus('success');

        setTimeout(() => {
          alert('¡Formulario enviado exitosamente! Recibirás un email con tus resultados y correcciones.');
        }, 1000);

      } else if (isHttpSuccess && isWebhookFailed) {
        // Formulario recibido pero webhook falló
        setEmailStatus('partial');
        setWebhookStatus('error');

        let errorMessage = '⚠️ Advertencia: Tu formulario se guardó correctamente, pero hubo un problema al enviar los datos al sistema de procesamiento.';

        if (result.errorType) {
          errorMessage += `\n\nTipo de error: ${result.errorType}`;
        }

        if (hasErrorSolution) {
          errorMessage += `\n\nSolución sugerida: ${result.errorSolution}`;
        }

        setTimeout(() => {
          alert(errorMessage);
          console.error('Error del webhook:', result);
        }, 1000);

      } else if (isValidationError) {
        // Error de validación
        setEmailStatus('error');
        setWebhookStatus('error');

        let errorMessage = '❌ Error de validación en el formulario.';
        if (result.validationErrors && result.validationErrors.length > 0) {
          errorMessage += '\n\nErrores:\n' + result.validationErrors.join('\n');
        }

        setTimeout(() => {
          alert(errorMessage);
        }, 1000);

      } else if (!isHttpSuccess) {
        // Error HTTP
        setEmailStatus('error');
        setWebhookStatus('error');

        let errorMessage = `❌ Error HTTP ${response.status}: `;

        if (result.error) {
          errorMessage += result.error;
        } else if (result.message) {
          errorMessage += result.message;
        } else {
          errorMessage += 'Error desconocido';
        }

        if (hasErrorSolution) {
          errorMessage += `\n\nSolución: ${result.errorSolution}`;
        }

        setTimeout(() => {
          alert(errorMessage);
        }, 1000);

      } else {
        // Caso desconocido
        setEmailStatus('partial');
        setWebhookStatus('partial');

        const statusMessage = `Estado: ${result.webhookStatus || 'desconocido'}`;
        const successFlag = result.success === true ? 'Éxito' : result.success === false ? 'Fallo' : 'Desconocido';

        setTimeout(() => {
          alert(`⚠️ Formulario procesado con estado inesperado:\n${statusMessage}\nResultado: ${successFlag}`);
        }, 1000);
      }

    } catch (error) {
      console.error('❌ Error enviando formulario completo:', error);
      setEmailStatus('error');
      setWebhookStatus('error');

      // Mostrar error detallado al usuario
      let errorMessage = '❌ Error al enviar el formulario.';

      if (error.message.includes('Failed to fetch')) {
        errorMessage += '\n\nNo se pudo conectar con el servidor. Verifica tu conexión a internet.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage += `\n\nError del servidor: ${error.message}`;
      } else {
        errorMessage += `\n\nDetalles: ${error.message}`;
      }

      errorMessage += '\n\nPor favor, intenta de nuevo más tarde o contacta al soporte técnico.';

      setTimeout(() => {
        alert(errorMessage);
      }, 1000);
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

  const requiresFileUpload = (questionText) => {
    if (!questionText) return false;
    const keywords = ['cuadro', 'esquema', 'dibuja', 'gráfico', 'diagrama'];
    return keywords.some(keyword =>
      questionText.toLowerCase().includes(keyword)
    );
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
          <div className="question-main-text" dangerouslySetInnerHTML={{ __html: question.pregunta }} />
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

          {(question.tipo === 'texto_libre' || question.tipo === 'archivo_adjunto') && (
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

              {(requiresFileUpload(question.pregunta) || question.tipo === 'archivo_adjunto' || question.archivo_requerido) && (
                <div className="file-upload-container">
                  <div className="file-upload-header">
                    <h4>
                      {question.tipo === 'archivo_adjunto'
                        ? 'Sube tu archivo'
                        : 'Sube tu archivo (opcional)'}
                    </h4>
                    <p>
                      {requiresFileUpload(question.pregunta)
                        ? 'Puedes subir un archivo con tu cuadro, esquema o diagrama para complementar tu respuesta'
                        : 'Puedes subir archivos para complementar tu respuesta'}
                    </p>
                  </div>

                  <FileUploadComponent
                    onFileUpload={(files) => handleFileUpload(question.id, files)}
                    acceptedFileTypes="image/*,.pdf"
                    maxFiles={3}
                    placeholder={requiresFileUpload(question.pregunta)
                      ? 'Arrastra tu esquema o haz clic para seleccionar'
                      : 'Arrastra tu archivo aquí o haz clic para seleccionar'}
                  />

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
              {emailStatus === 'sending' && 'Procesando formulario con IA...'}
              {emailStatus === 'success' && (userEmail ? `✅ Formulario enviado a: ${userEmail}` : '✅ Formulario procesado correctamente')}
              {emailStatus === 'error' && '❌ Error al procesar formulario'}
              {emailStatus === 'idle' && (userEmail ? `📧 Email configurado: ${userEmail}` : '📧 Formulario listo para enviar')}
            </span>
          </div>

          <div className={`status-item ${webhookStatus}`}>
            <span className="status-icon">
              {webhookStatus === 'sending' && '⏳'}
              {webhookStatus === 'success' && '✅'}
              {webhookStatus === 'error' && '❌'}
              {webhookStatus === 'partial' && '⚠️'}
              {webhookStatus === 'idle' && '🔗'}
            </span>
            <span className="status-text">
              {webhookStatus === 'sending' && 'Procesando formulario con IA...'}
              {webhookStatus === 'success' && '✅ Procesamiento completado'}
              {webhookStatus === 'error' && '❌ Error en el procesamiento'}
              {webhookStatus === 'partial' && '⚠️ Procesamiento parcial - verificar webhook'}
              {webhookStatus === 'idle' && '🔗 Servicio de IA listo'}
            </span>
          </div>

          {diagnosticInfo && (
            <div className="diagnostic-info">
              <details>
                <summary>🔍 Información de diagnóstico</summary>
                <pre>{JSON.stringify(diagnosticInfo, null, 2)}</pre>
              </details>
            </div>
          )}
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
              Email: {servicesStatus.email ? `✅ Configurado (${userEmail})` : '❌ No configurado'}
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

  // Early returns for loading and error states
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
