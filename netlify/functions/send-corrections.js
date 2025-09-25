const axios = require('axios');

const WEBHOOK_URL = 'https://n8n.srv1024767.hstgr.cloud/webhook/fbdc5d15-3435-42f9-8047-891869aa9f7e';

exports.handler = async (event, context) => {
    try {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: 'Método no permitido' })
            };
        }

        let data;
        try {
            data = JSON.parse(event.body);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            console.error('Raw body:', event.body);
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    error: 'JSON inválido',
                    details: parseError.message
                })
            };
        }
        console.log('Datos recibidos:', JSON.stringify(data, null, 2));

        // Preparar payload para n8n
        const webhookPayload = {
            type: 'quiz-responses',
            timestamp: new Date().toISOString(),
            source: 'instituto-lidera-elearning',
            studentInfo: {
                name: data.nombre || 'Estudiante',
                email: data.email || '',
                quizId: data.quizId || null,
                submittedAt: data.fechaEnvio || new Date().toISOString()
            },
            quizInfo: {
                title: data.quizData?.titulo || 'Evaluación',
                lessonId: data.quizData?.leccion_id || null,
                courseId: data.quizData?.curso_id || null,
                totalQuestions: data.quizData?.preguntas?.length || 0
            },
            responses: []
        };

        // Procesar respuestas abiertas
        if (data.openAnswers && Array.isArray(data.openAnswers)) {
            data.openAnswers.forEach((respuesta, index) => {
                webhookPayload.responses.push({
                    questionNumber: index + 1,
                    questionId: respuesta.questionId,
                    question: respuesta.question || '',
                    answer: respuesta.answer || '',
                    files: respuesta.files || [],
                    timeSpent: respuesta.timeSpent || 0
                });
            });
        }

        // Procesar todas las respuestas del usuario
        if (data.userAnswers) {
            Object.keys(data.userAnswers).forEach(questionId => {
                const answer = data.userAnswers[questionId];
                const existingResponse = webhookPayload.responses.find(r => r.questionId === questionId);

                if (!existingResponse) {
                    webhookPayload.responses.push({
                        questionId: questionId,
                        answer: answer.textoRespuesta || answer.opcionId || '',
                        isCorrect: answer.esCorrecta || false,
                        timeSpent: answer.tiempoRespuesta || 0
                    });
                }
            });
        }

        console.log('Enviando datos a n8n:', JSON.stringify(webhookPayload, null, 2));

        // Enviar datos al webhook de n8n
        const response = await axios.post(WEBHOOK_URL, webhookPayload, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Instituto-Lidera-Webhook/1.0'
            },
            timeout: 30000
        });

        console.log('Respuesta de n8n:', response.status, response.data);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Datos enviados correctamente a n8n',
                webhookResponse: response.data
            })
        };

    } catch (error) {
        console.error('Error en la función:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: error.message,
                details: error.response?.data || 'Error desconocido'
            })
        };
    }
};