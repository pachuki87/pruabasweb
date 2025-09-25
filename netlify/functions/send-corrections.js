const axios = require('axios');

const WEBHOOK_URL = 'https://n8n.srv1024767.hstgr.cloud/webhook/fbdc5d15-3435-42f9-8047-891869aa9f7e';

// Función para probar la conectividad del webhook
const testWebhookConnectivity = async () => {
    try {
        console.log('🔍 Probando conectividad del webhook...');

        const testPayload = {
            type: 'test-connection',
            timestamp: new Date().toISOString(),
            source: 'instituto-lidera-elearning-test',
            message: 'Prueba de conectividad'
        };

        const response = await axios.post(WEBHOOK_URL, testPayload, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Instituto-Lidera-Webhook-Test/1.0'
            },
            timeout: 15000
        });

        console.log('✅ Prueba de conectividad exitosa:', response.status);
        return {
            success: true,
            status: response.status,
            message: 'Conectividad del webhook verificada'
        };
    } catch (error) {
        console.error('❌ Error en prueba de conectividad:', error.message);
        return {
            success: false,
            error: error.message,
            details: error.response?.data || 'Error desconocido'
        };
    }
};

exports.handler = async (event, context) => {
    console.log('🚀 Iniciando función send-corrections...');
    console.log('Método HTTP:', event.httpMethod);
    console.log('Headers:', JSON.stringify(event.headers, null, 2));

    try {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: 'Método no permitido' })
            };
        }

        // Manejar solicitud de prueba de conectividad
        let parsedBody;
        try {
            parsedBody = JSON.parse(event.body);
        } catch (e) {
            parsedBody = {};
        }

        if (parsedBody.action === 'test-webhook') {
            console.log('🧪 Ejecutando prueba de conectividad...');
            const testResult = await testWebhookConnectivity();
            return {
                statusCode: 200,
                body: JSON.stringify(testResult)
            };
        }

        let data;
        try {
            // Limpiar y sanitizar el JSON antes de parsear
            let cleanBody = event.body;

            // Eliminar caracteres problemáticos que puedan causar errores de JSON
            cleanBody = cleanBody.replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, '');
            cleanBody = cleanBody.replace(/\n/g, '\\n');
            cleanBody = cleanBody.replace(/\r/g, '\\r');
            cleanBody = cleanBody.replace(/\t/g, '\\t');

            console.log('Body limpiado:', cleanBody);
            data = JSON.parse(cleanBody);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            console.error('Raw body:', event.body);
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    error: 'JSON inválido',
                    details: parseError.message,
                    rawBody: event.body.substring(0, 500) + (event.body.length > 500 ? '...' : '')
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
        console.log('URL del webhook:', WEBHOOK_URL);

        try {
            // Enviar datos al webhook de n8n
            const response = await axios.post(WEBHOOK_URL, webhookPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Instituto-Lidera-Webhook/1.0'
                },
                timeout: 30000,
                maxRedirects: 5
            });

            console.log('Respuesta de n8n:', {
                status: response.status,
                statusText: response.statusText,
                data: response.data
            });

            // Verificar si la respuesta es exitosa
            if (response.status >= 200 && response.status < 300) {
                console.log('✅ Datos enviados exitosamente a n8n');
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        success: true,
                        message: 'Datos enviados correctamente a n8n',
                        webhookResponse: response.data,
                        webhookStatus: 'success'
                    })
                };
            } else {
                throw new Error(`Respuesta inesperada del webhook: ${response.status}`);
            }
        } catch (webhookError) {
            console.error('❌ Error al enviar datos al webhook:', webhookError);

            // Detalles específicos del error
            const errorDetails = {
                message: webhookError.message,
                code: webhookError.code,
                response: webhookError.response?.data,
                status: webhookError.response?.status,
                config: {
                    url: webhookError.config?.url,
                    method: webhookError.config?.method,
                    timeout: webhookError.config?.timeout
                }
            };

            console.error('Detalles del error del webhook:', JSON.stringify(errorDetails, null, 2));

            return {
                statusCode: 200, // Mantenemos 200 para que el frontend muestre el mensaje personalizado
                body: JSON.stringify({
                    success: false,
                    message: 'Error al enviar datos al webhook de n8n',
                    error: webhookError.message,
                    errorDetails: errorDetails,
                    webhookStatus: 'failed'
                })
            };
        }

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