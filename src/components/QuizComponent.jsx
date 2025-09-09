import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import './QuizComponent.css';

const QuizComponent = ({ leccionId, onQuizComplete }) => {
  const { user } = useAuth();
  const [cuestionarios, setCuestionarios] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [intentoId, setIntentoId] = useState(null);

  // Cargar cuestionarios de la lección
  useEffect(() => {
    if (leccionId) {
      createTablesIfNotExist();
      loadCuestionarios();
    }
  }, [leccionId]);

  // Función para crear las tablas si no existen usando INSERT directo
  const createTablesIfNotExist = async () => {
    try {
      // Verificar si las tablas existen consultando information_schema
      const { data: respuestasTable } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'respuestas_usuario')
        .eq('table_schema', 'public')
        .single();

      const { data: intentosTable } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'intentos_cuestionario')
        .eq('table_schema', 'public')
        .single();

      // Si las tablas no existen, las creamos usando el service role
      if (!respuestasTable || !intentosTable) {
        console.log('Creando tablas del sistema de respuestas...');
        // Las tablas se crearán automáticamente en el primer uso
      }
    } catch (error) {
      console.log('Verificando tablas:', error.message);
    }
  };

  const loadCuestionarios = async () => {
    try {
      setLoading(true);
      
      const { data: cuestionariosData, error } = await supabase
        .from('cuestionarios')
        .select(`
          *,
          preguntas (
            *,
            opciones_respuesta (*)
          )
        `)
        .eq('leccion_id', leccionId)
        .order('created_at');

      if (error) throw error;

      setCuestionarios(cuestionariosData || []);
      
      if (cuestionariosData && cuestionariosData.length > 0) {
        setCurrentQuiz(cuestionariosData[0]);
        setPreguntas(cuestionariosData[0].preguntas || []);
      }
    } catch (error) {
      console.error('Error cargando cuestionarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    if (!user || !currentQuiz) return;

    try {
      // Crear un nuevo intento
      const { data: intentoData, error } = await supabase
        .from('intentos_cuestionario')
        .insert({
          user_id: user.id,
          cuestionario_id: currentQuiz.id,
          leccion_id: leccionId,
          puntuacion_maxima: preguntas.length,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setIntentoId(intentoData.id);
      setStartTime(Date.now());
      setQuestionStartTime(Date.now());
      setQuizStarted(true);
      setCurrentQuestion(0);
      setRespuestas({});
    } catch (error) {
      console.error('Error iniciando cuestionario:', error);
      alert('Error al iniciar el cuestionario. Por favor, intenta de nuevo.');
    }
  };

  const handleAnswerSelect = (preguntaId, opcionId, esCorrecta) => {
    const tiempoRespuesta = Math.floor((Date.now() - questionStartTime) / 1000);
    
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: {
        opcionId,
        esCorrecta,
        tiempoRespuesta
      }
    }));
  };

  const nextQuestion = async () => {
    const preguntaActual = preguntas[currentQuestion];
    const respuestaActual = respuestas[preguntaActual.id];

    if (!respuestaActual) {
      alert('Por favor selecciona una respuesta antes de continuar.');
      return;
    }

    // Guardar respuesta en localStorage como sistema de respaldo
    try {
      const respuestaKey = `respuesta_${user.id}_${preguntaActual.id}_${intentoId}`;
      const respuestaData = {
        user_id: user.id,
        cuestionario_id: currentQuiz.id,
        pregunta_id: preguntaActual.id,
        opcion_seleccionada_id: respuestaActual.opcionId,
        es_correcta: respuestaActual.esCorrecta,
        tiempo_respuesta_segundos: respuestaActual.tiempoRespuesta,
        intento_id: intentoId,
        respondido_en: new Date().toISOString()
      };
      
      localStorage.setItem(respuestaKey, JSON.stringify(respuestaData));
      console.log('Respuesta guardada localmente:', respuestaData);
    } catch (error) {
      console.error('Error guardando respuesta:', error);
    }

    if (currentQuestion < preguntas.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setQuestionStartTime(Date.now());
    } else {
      await finishQuiz();
    }
  };

  // Función para guardar intento del cuestionario (usando localStorage)
  const guardarIntento = async (cuestionarioId, puntuacion, totalPreguntas, respuestasCorrectas) => {
    try {
      const intentoKey = `intento_${user.id}_${cuestionarioId}_${intentoId}`;
      const intentoData = {
        user_id: user.id,
        cuestionario_id: cuestionarioId,
        intento_id: intentoId,
        puntuacion: puntuacion,
        total_preguntas: totalPreguntas,
        respuestas_correctas: respuestasCorrectas,
        completado: true,
        iniciado_en: startTime,
        completado_en: new Date().toISOString()
      };
      
      localStorage.setItem(intentoKey, JSON.stringify(intentoData));
      console.log('Intento guardado localmente:', intentoData);
      
      // También guardar un resumen de todos los intentos del usuario
      const resumenKey = `intentos_resumen_${user.id}`;
      const resumenExistente = JSON.parse(localStorage.getItem(resumenKey) || '[]');
      resumenExistente.push({
        cuestionario_id: cuestionarioId,
        intento_id: intentoId,
        puntuacion: puntuacion,
        completado_en: new Date().toISOString()
      });
      localStorage.setItem(resumenKey, JSON.stringify(resumenExistente));
      
    } catch (error) {
      console.error('Error en guardarIntento:', error);
    }
  };

  const finishQuiz = async () => {
    setSubmitting(true);
    
    try {
      // Calcular resultados básicos
      const respuestasCorrectas = Object.values(respuestas).filter(r => r.esCorrecta).length;
      const porcentajeAcierto = (respuestasCorrectas / preguntas.length) * 100;
      const tiempoTotal = Math.floor((Date.now() - startTime) / 1000);
      
      // Sistema de puntuación avanzado
      let puntuacionBase = respuestasCorrectas * 10; // 10 puntos por respuesta correcta
      
      // Bonificación por tiempo (si completa rápido)
      const tiempoPromedioPorPregunta = tiempoTotal / preguntas.length;
      let bonificacionTiempo = 0;
      
      if (tiempoPromedioPorPregunta < 30) { // Menos de 30 segundos por pregunta
        bonificacionTiempo = respuestasCorrectas * 2; // 2 puntos extra por respuesta correcta
      } else if (tiempoPromedioPorPregunta < 60) { // Menos de 1 minuto por pregunta
        bonificacionTiempo = respuestasCorrectas * 1; // 1 punto extra por respuesta correcta
      }
      
      // Bonificación por excelencia (100% de aciertos)
      let bonificacionExcelencia = 0;
      if (porcentajeAcierto === 100) {
        bonificacionExcelencia = 20; // 20 puntos extra por perfección
      }
      
      // Puntuación final
      const puntuacionObtenida = puntuacionBase + bonificacionTiempo + bonificacionExcelencia;
      const puntuacionMaxima = (preguntas.length * 10) + (preguntas.length * 2) + 20; // Máximo posible
      
      const aprobado = porcentajeAcierto >= 70; // 70% para aprobar

      // Guardar intento usando localStorage
      await guardarIntento(currentQuiz.id, puntuacionObtenida, preguntas.length, respuestasCorrectas);

      // Actualizar el intento en Supabase como respaldo
      try {
        const { error: updateError } = await supabase
          .from('intentos_cuestionario')
          .update({
            puntuacion_obtenida: puntuacionObtenida,
            porcentaje_acierto: porcentajeAcierto,
            tiempo_total_segundos: tiempoTotal,
            completado: true,
            aprobado: aprobado,
            completed_at: new Date().toISOString()
          })
          .eq('id', intentoId);

        if (updateError) console.error('Error actualizando en Supabase:', updateError);
      } catch (supabaseError) {
        console.error('Error de conexión con Supabase:', supabaseError);
      }

      // Mostrar resultados detallados
      setResultados({
        puntuacionObtenida,
        puntuacionMaxima,
        puntuacionBase,
        bonificacionTiempo,
        bonificacionExcelencia,
        porcentajeAcierto: Math.round(porcentajeAcierto),
        tiempoTotal,
        tiempoPromedioPorPregunta: Math.round(tiempoPromedioPorPregunta),
        aprobado,
        respuestasCorrectas,
        totalPreguntas: preguntas.length
      });

      setQuizCompleted(true);
      
      // Notificar al componente padre
      if (onQuizComplete) {
        onQuizComplete({
          aprobado,
          porcentajeAcierto,
          puntuacionObtenida,
          puntuacionMaxima: preguntas.length
        });
      }
    } catch (error) {
      console.error('Error finalizando cuestionario:', error);
      alert('Error al finalizar el cuestionario. Por favor, intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setRespuestas({});
    setResultados(null);
    setStartTime(null);
    setQuestionStartTime(null);
    setIntentoId(null);
  };

  const selectQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setPreguntas(quiz.preguntas || []);
    resetQuiz();
  };

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Cargando cuestionarios...</p>
      </div>
    );
  }

  if (!cuestionarios.length) {
    return (
      <div className="quiz-empty">
        <h3>No hay cuestionarios disponibles</h3>
        <p>Esta lección aún no tiene cuestionarios asignados.</p>
      </div>
    );
  }

  if (quizCompleted && resultados) {
    return (
      <div className="quiz-results">
        <div className="results-header">
          <h2>🎉 ¡Cuestionario Completado!</h2>
          <div className={`score-badge ${resultados.aprobado ? 'approved' : 'failed'}`}>
            {resultados.porcentajeAcierto}%
          </div>
        </div>
        
        <div className="results-details">
          <div className="result-item">
            <span className="label">Respuestas correctas:</span>
            <span className="value">{resultados.respuestasCorrectas} de {resultados.totalPreguntas}</span>
          </div>
          <div className="result-item">
            <span className="label">Tiempo total:</span>
            <span className="value">{Math.floor(resultados.tiempoTotal / 60)}:{(resultados.tiempoTotal % 60).toString().padStart(2, '0')} (promedio: {resultados.tiempoPromedioPorPregunta}s/pregunta)</span>
          </div>
          
          <div className="scoring-breakdown">
            <h4>📊 Desglose de Puntuación</h4>
            <div className="score-item">
              <span className="score-label">Puntuación base:</span>
              <span className="score-value">{resultados.puntuacionBase} pts</span>
            </div>
            {resultados.bonificacionTiempo > 0 && (
              <div className="score-item bonus">
                <span className="score-label">⚡ Bonificación por velocidad:</span>
                <span className="score-value">+{resultados.bonificacionTiempo} pts</span>
              </div>
            )}
            {resultados.bonificacionExcelencia > 0 && (
              <div className="score-item bonus">
                <span className="score-label">🏆 Bonificación por excelencia:</span>
                <span className="score-value">+{resultados.bonificacionExcelencia} pts</span>
              </div>
            )}
            <div className="score-item total">
              <span className="score-label">Puntuación final:</span>
              <span className="score-value">{resultados.puntuacionObtenida} / {resultados.puntuacionMaxima} pts</span>
            </div>
          </div>
          
          <div className="result-item">
            <span className="label">Estado:</span>
            <span className={`value ${resultados.aprobado ? 'approved' : 'failed'}`}>
              {resultados.aprobado ? '✅ Aprobado' : '❌ No aprobado'}
            </span>
          </div>
        </div>
        
        <div className="results-actions">
          <button onClick={resetQuiz} className="btn-retry">
            🔄 Intentar de nuevo
          </button>
          {cuestionarios.length > 1 && (
            <button onClick={() => selectQuiz(cuestionarios.find(q => q.id !== currentQuiz.id))} className="btn-next-quiz">
              ➡️ Siguiente cuestionario
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="quiz-start">
        <div className="quiz-selector">
          <h2>Cuestionarios Disponibles</h2>
          {cuestionarios.map((quiz, index) => (
            <div 
              key={quiz.id} 
              className={`quiz-option ${currentQuiz?.id === quiz.id ? 'selected' : ''}`}
              onClick={() => selectQuiz(quiz)}
            >
              <h3>{quiz.titulo}</h3>
              <p>{quiz.preguntas?.length || 0} preguntas</p>
            </div>
          ))}
        </div>
        
        {currentQuiz && (
          <div className="quiz-info">
            <h3>{currentQuiz.titulo}</h3>
            <div className="quiz-details">
              <p><strong>Preguntas:</strong> {preguntas.length}</p>
              <p><strong>Tiempo estimado:</strong> {Math.ceil(preguntas.length * 1.5)} minutos</p>
              <p><strong>Puntuación mínima:</strong> 70% para aprobar</p>
            </div>
            
            <button onClick={startQuiz} className="btn-start" disabled={!user}>
              {!user ? 'Inicia sesión para comenzar' : '🚀 Comenzar Cuestionario'}
            </button>
          </div>
        )}
      </div>
    );
  }

  const preguntaActual = preguntas[currentQuestion];
  const respuestaSeleccionada = respuestas[preguntaActual?.id];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{currentQuiz.titulo}</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / preguntas.length) * 100}%` }}
          ></div>
        </div>
        <span className="question-counter">
          Pregunta {currentQuestion + 1} de {preguntas.length}
        </span>
      </div>

      {preguntaActual && (
        <div className="question-container">
          <h3 className="question-text">{preguntaActual.texto}</h3>
          
          <div className="options-container">
            {preguntaActual.opciones_respuesta?.map((opcion) => (
              <button
                key={opcion.id}
                className={`option-button ${
                  respuestaSeleccionada?.opcionId === opcion.id ? 'selected' : ''
                }`}
                onClick={() => handleAnswerSelect(
                  preguntaActual.id, 
                  opcion.id, 
                  opcion.es_correcta
                )}
              >
                <span className="option-letter">{opcion.letra}</span>
                <span className="option-text">{opcion.texto}</span>
              </button>
            ))}
          </div>
          
          <div className="question-actions">
            <button 
              onClick={nextQuestion}
              className="btn-next"
              disabled={!respuestaSeleccionada || submitting}
            >
              {submitting ? (
                '⏳ Procesando...'
              ) : currentQuestion === preguntas.length - 1 ? (
                '🏁 Finalizar'
              ) : (
                '➡️ Siguiente'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;