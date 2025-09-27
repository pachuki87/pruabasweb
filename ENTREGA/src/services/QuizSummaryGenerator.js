/**
 * QuizSummaryGenerator.js
 * Servicio para generar resúmenes detallados de cuestionarios completados
 */

class QuizSummaryGenerator {
  /**
   * Genera un resumen detallado del cuestionario
   * @param {Object} quizData - Datos del cuestionario
   * @param {Object} userAnswers - Respuestas del usuario
   * @param {Array} questions - Lista de preguntas completas
   * @param {Object} userData - Datos del usuario
   * @param {Object} resultsData - Datos de resultados (puntuación, tiempo, etc.)
   * @returns {Object} - Objeto con resumen detallado
   */
  generateDetailedSummary(quizData, userAnswers, questions, userData, resultsData) {
    const summary = {
      userInfo: {
        id: userData?.id || '',
        name: userData?.nombre || userData?.name || 'Usuario',
        email: userData?.email || ''
      },
      quizInfo: {
        id: quizData?.id || '',
        title: quizData?.titulo || 'Cuestionario',
        courseId: quizData?.curso_id || '',
        lessonId: quizData?.leccion_id || ''
      },
      results: {
        score: resultsData?.puntuacionObtenida || 0,
        maxScore: resultsData?.puntuacionMaxima || questions.length * 10,
        percentage: resultsData?.porcentajeAcierto || 0,
        correctAnswers: resultsData?.respuestasCorrectas || 0,
        totalQuestions: questions.length,
        timeSpent: resultsData?.tiempoTotal || 0,
        approved: resultsData?.aprobado || false,
        averageTimePerQuestion: resultsData?.tiempoPromedioPorPregunta || 0
      },
      questionsSummary: [],
      generatedAt: new Date().toISOString()
    };

    // Generar resumen para cada pregunta
    questions.forEach((question, index) => {
      const userAnswer = userAnswers[question.id];
      const questionSummary = this.generateQuestionSummary(question, userAnswer, index + 1);
      summary.questionsSummary.push(questionSummary);
    });

    return summary;
  }

  /**
   * Genera resumen para una pregunta individual
   * @param {Object} question - Datos de la pregunta
   * @param {Object} userAnswer - Respuesta del usuario
   * @param {number} questionNumber - Número de la pregunta
   * @returns {Object} - Resumen de la pregunta
   */
  generateQuestionSummary(question, userAnswer, questionNumber) {
    const summary = {
      questionNumber,
      questionId: question.id,
      questionText: question.pregunta || '',
      questionType: question.tipo || 'multiple_choice',
      timeSpent: userAnswer?.tiempoRespuesta || 0,
      userAnswer: null,
      correctAnswer: null,
      isCorrect: false,
      points: 0
    };

    if (question.tipo === 'texto_libre') {
      // Para preguntas de texto libre
      summary.userAnswer = {
        type: 'text',
        content: userAnswer?.textoRespuesta || '',
        files: userAnswer?.archivos || []
      };
      summary.correctAnswer = {
        type: 'text',
        content: 'Respuesta abierta - se muestra tal cual fue respondida'
      };
      summary.isCorrect = true; // Para texto libre, consideramos válida cualquier respuesta no vacía
      summary.points = userAnswer?.textoRespuesta?.trim() ? 10 : 0;
    } else {
      // Para preguntas tipo test (multiple_choice, verdadero_falso, etc.)
      summary.userAnswer = {
        type: 'choice',
        selectedOption: this.getSelectedOptionText(question, userAnswer?.opcionId),
        selectedOptionId: userAnswer?.opcionId || null
      };
      summary.correctAnswer = {
        type: 'choice',
        correctOption: this.getCorrectOptionText(question),
        correctOptionId: this.getCorrectOptionId(question)
      };
      summary.isCorrect = userAnswer?.esCorrecta || false;
      summary.points = userAnswer?.esCorrecta ? 10 : 0;
    }

    return summary;
  }

  /**
   * Obtiene el texto de la opción seleccionada por el usuario
   * @param {Object} question - Datos de la pregunta
   * @param {string} selectedOptionId - ID de la opción seleccionada
   * @returns {string} - Texto de la opción seleccionada
   */
  getSelectedOptionText(question, selectedOptionId) {
    if (!selectedOptionId || !question.opciones_respuesta) {
      return 'No respondida';
    }

    const selectedOption = question.opciones_respuesta.find(option => option.id === selectedOptionId);
    return selectedOption?.opcion || 'Opción no encontrada';
  }

  /**
   * Obtiene el texto de la opción correcta
   * @param {Object} question - Datos de la pregunta
   * @returns {string} - Texto de la opción correcta
   */
  getCorrectOptionText(question) {
    if (!question.opciones_respuesta) {
      return 'No hay opciones disponibles';
    }

    const correctOption = question.opciones_respuesta.find(option => option.es_correcta);
    return correctOption?.opcion || 'No hay respuesta correcta definida';
  }

  /**
   * Obtiene el ID de la opción correcta
   * @param {Object} question - Datos de la pregunta
   * @returns {string} - ID de la opción correcta
   */
  getCorrectOptionId(question) {
    if (!question.opciones_respuesta) {
      return null;
    }

    const correctOption = question.opciones_respuesta.find(option => option.es_correcta);
    return correctOption?.id || null;
  }

  /**
   * Genera un resumen en formato HTML para email
   * @param {Object} summary - Resumen generado
   * @returns {string} - HTML formateado
   */
  generateHTMLSummary(summary) {
    const { userInfo, quizInfo, results, questionsSummary } = summary;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: #f9f9f9; border-radius: 10px; padding: 30px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #2c3e50; margin: 0; }
        .header p { color: #7f8c8d; margin: 10px 0 0 0; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .info-item { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db; }
        .results-summary { background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #2ecc71; }
        .score { font-size: 24px; font-weight: bold; color: #2ecc71; }
        .score.failed { color: #e74c3c; }
        .question { background: white; margin-bottom: 15px; padding: 20px; border-radius: 5px; border-left: 4px solid #95a5a6; }
        .question.correct { border-left-color: #2ecc71; }
        .question.incorrect { border-left-color: #e74c3c; }
        .question-text { font-weight: bold; margin-bottom: 10px; }
        .answer { margin: 10px 0; }
        .user-answer { background: #ecf0f1; padding: 10px; border-radius: 3px; }
        .correct-answer { background: #d5f4e6; padding: 10px; border-radius: 3px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #bdc3c7; color: #7f8c8d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Resumen de Cuestionario Completado</h1>
            <p>Gracias por participar en la evaluación</p>
        </div>

        <div class="section">
            <h2>📋 Información General</h2>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Alumno:</strong> ${userInfo.name}
                </div>
                <div class="info-item">
                    <strong>Email:</strong> ${userInfo.email}
                </div>
                <div class="info-item">
                    <strong>Curso:</strong> ${quizInfo.title}
                </div>
                <div class="info-item">
                    <strong>Fecha:</strong> ${new Date(summary.generatedAt).toLocaleString('es-ES')}
                </div>
            </div>
        </div>

        <div class="section">
            <h2>📊 Resultados</h2>
            <div class="results-summary">
                <div class="score ${results.approved ? '' : 'failed'}">
                    ${results.score}/${results.maxScore} (${results.percentage}%)
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Respuestas Correctas:</strong> ${results.correctAnswers}/${results.totalQuestions}
                    </div>
                    <div class="info-item">
                        <strong>Tiempo Empleado:</strong> ${Math.floor(results.timeSpent / 60)}:${(results.timeSpent % 60).toString().padStart(2, '0')}
                    </div>
                    <div class="info-item">
                        <strong>Promedio por Pregunta:</strong> ${results.averageTimePerQuestion}s
                    </div>
                    <div class="info-item">
                        <strong>Estado:</strong> ${results.approved ? '✅ Aprobado' : '❌ No aprobado'}
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>📝 Detalle de Respuestas</h2>
            ${questionsSummary.map(q => this.generateQuestionHTML(q)).join('')}
        </div>

        <div class="footer">
            <p>Este resumen se ha generado automáticamente tras completar el cuestionario.</p>
            <p>© ${new Date().getFullYear()} Instituto Lidera - Sistema de E-Learning</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Genera HTML para una pregunta individual
   * @param {Object} questionSummary - Resumen de la pregunta
   * @returns {string} - HTML de la pregunta
   */
  generateQuestionHTML(questionSummary) {
    const { questionNumber, questionText, questionType, userAnswer, correctAnswer, isCorrect, timeSpent } = questionSummary;

    return `
        <div class="question ${isCorrect ? 'correct' : 'incorrect'}">
            <div class="question-text">
                <strong>Pregunta ${questionNumber}:</strong> ${questionText}
                <span style="float: right; color: ${isCorrect ? '#2ecc71' : '#e74c3c'};">
                    ${isCorrect ? '✅' : '❌'} ${timeSpent}s
                </span>
            </div>
            
            ${questionType === 'texto_libre' ? `
                <div class="answer">
                    <strong>Tu respuesta:</strong>
                    <div class="user-answer">
                        ${userAnswer.content || 'No respondida'}
                    </div>
                    ${userAnswer.files && userAnswer.files.length > 0 ? `
                        <div style="margin-top: 10px;">
                            <strong>Archivos adjuntos:</strong>
                            <ul>
                                ${userAnswer.files.map(file => `<li>${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            ` : `
                <div class="answer">
                    <strong>Tu respuesta:</strong>
                    <div class="user-answer">
                        ${userAnswer.selectedOption}
                    </div>
                    <strong>Respuesta correcta:</strong>
                    <div class="correct-answer">
                        ${correctAnswer.correctOption}
                    </div>
                </div>
            `}
        </div>
    `;
  }

  /**
   * Genera un resumen simplificado para webhook
   * @param {Object} summary - Resumen completo
   * @returns {Object} - Resumen simplificado para webhook
   */
  generateWebhookSummary(summary) {
    return {
      userId: summary.userInfo.id,
      userEmail: summary.userInfo.email,
      userName: summary.userInfo.name,
      quizId: summary.quizInfo.id,
      quizTitle: summary.quizInfo.title,
      courseId: summary.quizInfo.courseId,
      lessonId: summary.quizInfo.lessonId,
      results: {
        score: summary.results.score,
        maxScore: summary.results.maxScore,
        percentage: summary.results.percentage,
        correctAnswers: summary.results.correctAnswers,
        totalQuestions: summary.results.totalQuestions,
        timeSpent: summary.results.timeSpent,
        approved: summary.results.approved,
        averageTimePerQuestion: summary.results.averageTimePerQuestion
      },
      questions: summary.questionsSummary.map(q => ({
        questionNumber: q.questionNumber,
        questionId: q.questionId,
        questionText: q.questionText,
        questionType: q.questionType,
        isCorrect: q.isCorrect,
        points: q.points,
        timeSpent: q.timeSpent,
        userAnswer: q.questionType === 'texto_libre' ? q.userAnswer.content : q.userAnswer.selectedOption,
        correctAnswer: q.questionType === 'texto_libre' ? null : q.correctAnswer.correctOption
      })),
      generatedAt: summary.generatedAt
    };
  }
}

export default new QuizSummaryGenerator();
