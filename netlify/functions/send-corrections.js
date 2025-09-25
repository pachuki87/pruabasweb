const axios = require('axios');

// Configuración mejorada con variables de entorno y fallback
const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://n8n.srv1024767.hstgr.cloud/webhook-test/fbdc5d15-3435-42f9-8047-891869aa9f7e';
const MAX_RETRIES = process.env.MAX_RETRIES || 3;
const TIMEOUT = process.env.WEBHOOK_TIMEOUT || 30000;
const DEBUG_MODE = process.env.DEBUG_MODE === 'true';

// Función mejorada para probar la conectividad del webhook
const testWebhookConnectivity = async () => {
    const testId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
        console.log(`🔍 [${testId}] Probando conectividad del webhook...`);
        console.log(`🔍 [${testId}] URL: ${WEBHOOK_URL}`);

        const testPayload = {
            type: 'test-connection',
            timestamp: new Date().toISOString(),
            source: 'instituto-lidera-elearning-test',
            testId: testId,
            message: 'Prueba de conectividad',
            debug: DEBUG_MODE
        };

        const startTime = Date.now();
        const response = await axios.post(WEBHOOK_URL, testPayload, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Instituto-Lidera-Webhook-Test/1.0',
                'X-Test-Request': 'true',
                'X-Request-ID': testId
            },
            timeout: 15000
        });
        const responseTime = Date.now() - startTime;

        console.log(`✅ [${testId}] Prueba de conectividad exitosa:`, {
            status: response.status,
            statusText: response.statusText,
            responseTime: `${responseTime}ms`,
            dataSize: JSON.stringify(response.data).length
        });

        return {
            success: true,
            status: response.status,
            responseTime,
            testId,
            message: 'Conectividad del webhook verificada',
            n8nResponse: response.data
        };
    } catch (error) {
        const errorTime = Date.now();
        console.error(`❌ [${testId}] Error en prueba de conectividad:`, {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            url: WEBHOOK_URL,
            timestamp: errorTime
        });

        // Análisis detallado del error
        let errorType = 'unknown';
        let errorSolution = '';

        if (error.code === 'ECONNREFUSED') {
            errorType = 'connection_refused';
            errorSolution = 'El servidor n8n no está respondiendo. Verifica que el servicio esté activo.';
        } else if (error.code === 'ENOTFOUND') {
            errorType = 'dns_resolution';
            errorSolution = 'No se puede resolver el dominio. Verifica la URL del webhook.';
        } else if (error.code === 'ETIMEDOUT') {
            errorType = 'timeout';
            errorSolution = 'El servidor tardó demasiado en responder. Aumenta el timeout o verifica el estado del servidor.';
        } else if (error.response?.status === 404) {
            errorType = 'not_found';
            errorSolution = 'El webhook no existe. Verifica la URL del webhook.';
        } else if (error.response?.status >= 500) {
            errorType = 'server_error';
            errorSolution = 'Error del servidor n8n. Contacta al administrador.';
        } else if (error.response?.status >= 400) {
            errorType = 'client_error';
            errorSolution = 'Error en la solicitud. Verifica el formato del payload.';
        }

        return {
            success: false,
            error: error.message,
            errorType,
            errorSolution,
            testId,
            details: {
                code: error.code,
                status: error.response?.status,
                data: error.response?.data,
                url: WEBHOOK_URL
            }
        };
    }
};

// Función mejorada para enviar datos al webhook con retry y mejor manejo de errores
const sendToWebhookWithRetry = async (payload, options = {}) => {
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const maxRetries = options.maxRetries || MAX_RETRIES;
    const timeout = options.timeout || TIMEOUT;

    console.log(`📤 [${requestId}] Iniciando envío al webhook...`);
    console.log(`📤 [${requestId}] URL: ${WEBHOOK_URL}`);
    if (DEBUG_MODE) {
        console.log(`📤 [${requestId}] Payload:`, JSON.stringify(payload, null, 2));
    }

    const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Instituto-Lidera-Webhook/1.0',
        'X-Request-ID': requestId,
        'X-Source': 'instituto-lidera-elearning',
        ...options.headers
    };

    let lastError = null;
    let attempt = 0;

    while (attempt <= maxRetries) {
        attempt++;
        const attemptId = `${requestId}-attempt-${attempt}`;

        let startTime;
        try {
            console.log(`📤 [${attemptId}] Intento ${attempt}/${maxRetries + 1}`);

            startTime = Date.now();
            const response = await axios.post(WEBHOOK_URL, payload, {
                headers,
                timeout,
                maxRedirects: 5,
                validateStatus: function (status) {
                    // Consideramos válidos los códigos 2xx y 3xx
                    return status >= 200 && status < 400;
                }
            });

            const responseTime = Date.now() - startTime;

            console.log(`✅ [${attemptId}] Envío exitoso:`, {
                status: response.status,
                statusText: response.statusText,
                responseTime: `${responseTime}ms`,
                dataSize: JSON.stringify(response.data).length
            });

            return {
                success: true,
                status: response.status,
                responseTime,
                attempt,
                requestId,
                data: response.data,
                headers: response.headers
            };

        } catch (error) {
            lastError = error;

            console.error(`❌ [${attemptId}] Error en intento ${attempt}:`, {
                message: error.message,
                code: error.code,
                status: error.response?.status,
                responseTime: error.response ? `${Date.now() - startTime}ms` : 'N/A'
            });

            // Si es el último intento, no esperamos más
            if (attempt > maxRetries) {
                break;
            }

            // Esperar antes de reintentar (exponential backoff)
            const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Max 10 segundos
            console.log(`⏳ [${attemptId}] Esperando ${waitTime}ms antes de reintentar...`);

            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }

    // Si llegamos aquí, todos los intentos fallaron
    console.error(`💀 [${requestId}] Todos los intentos fallaron después de ${maxRetries + 1} reintentos`);

    // Análisis del error final
    const errorAnalysis = analyzeError(lastError);

    return {
        success: false,
        error: lastError.message,
        errorType: errorAnalysis.type,
        errorSolution: errorAnalysis.solution,
        attempt: attempt - 1,
        requestId,
        details: {
            code: lastError.code,
            status: lastError.response?.status,
            data: lastError.response?.data,
            config: lastError.config
        }
    };
};

// Función para analizar errores y proporcionar soluciones
const analyzeError = (error) => {
    if (!error) {
        return {
            type: 'unknown',
            solution: 'Error desconocido. Contacte al administrador.'
        };
    }

    if (error.code === 'ECONNREFUSED') {
        return {
            type: 'connection_refused',
            solution: 'El servidor n8n no está respondiendo. Verifique que el servicio esté activo y accesible.'
        };
    } else if (error.code === 'ENOTFOUND') {
        return {
            type: 'dns_resolution',
            solution: 'No se puede resolver el dominio. Verifique la URL del webhook y la configuración DNS.'
        };
    } else if (error.code === 'ETIMEDOUT') {
        return {
            type: 'timeout',
            solution: 'El servidor tardó demasiado en responder. Aumente el timeout o verifique el estado del servidor.'
        };
    } else if (error.code === 'ECONNRESET') {
        return {
            type: 'connection_reset',
            solution: 'La conexión fue reseteada. Intente nuevamente o verifique la estabilidad de la red.'
        };
    } else if (error.response?.status === 404) {
        return {
            type: 'not_found',
            solution: 'El webhook no existe. Verifique que la URL del webhook sea correcta.'
        };
    } else if (error.response?.status === 401) {
        return {
            type: 'unauthorized',
            solution: 'No autorizado. Verifique si el webhook requiere autenticación.'
        };
    } else if (error.response?.status === 403) {
        return {
            type: 'forbidden',
            solution: 'Acceso denegado. Verifique la configuración de seguridad del webhook.'
        };
    } else if (error.response?.status >= 500) {
        return {
            type: 'server_error',
            solution: 'Error del servidor n8n. Contacte al administrador del servidor.'
        };
    } else if (error.response?.status >= 400) {
        return {
            type: 'client_error',
            solution: 'Error en la solicitud. Verifique el formato del payload y los headers.'
        };
    }

    return {
        type: 'unknown',
        solution: 'Error no categorizado. Verifique los logs del servidor para más detalles.'
    };
};

// Función para validar el payload antes de enviarlo
const validatePayload = (payload) => {
    const errors = [];

    if (!payload || typeof payload !== 'object') {
        errors.push('El payload debe ser un objeto válido');
        return { valid: false, errors };
    }

    if (!payload.type) {
        errors.push('El payload debe incluir un campo "type"');
    }

    if (!payload.timestamp) {
        errors.push('El payload debe incluir un campo "timestamp"');
    }

    if (!payload.source) {
        errors.push('El payload debe incluir un campo "source"');
    }

    if (payload.type === 'quiz-responses' && !payload.studentInfo) {
        errors.push('Para respuestas de quiz, el payload debe incluir "studentInfo"');
    }

    if (payload.type === 'quiz-responses' && !payload.responses) {
        errors.push('Para respuestas de quiz, el payload debe incluir "responses"');
    }

    if (payload.type === 'quiz-responses' && payload.studentInfo && !payload.studentInfo.email) {
        errors.push('Para respuestas de quiz, studentInfo debe incluir "email"');
    }

    return {
        valid: errors.length === 0,
        errors
    };
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
                statusCode: testResult.success ? 200 : 502,
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

        // Si el payload ya está en el formato correcto, usarlo directamente
        let webhookPayload;
        if (data.type === 'quiz-responses' && data.studentInfo && data.responses) {
            console.log('✅ Payload ya está en formato correcto, usándolo directamente');
            webhookPayload = data;
        } else {
            console.log('🔄 Transformando payload al formato esperado...');
            // Preparar payload para n8n con información completa
            webhookPayload = {
                type: 'quiz-responses',
                timestamp: new Date().toISOString(),
                source: 'instituto-lidera-elearning',
                studentInfo: {
                    name: data.nombre || data.nombre_completo || 'Estudiante',
                    email: data.email || data.correo || '',
                    userId: data.userId || null,
                    quizId: data.quizId || data.cuestionario_id || null,
                    submittedAt: data.fechaEnvio || new Date().toISOString()
                },
                quizInfo: {
                    title: data.quizData?.titulo || data.titulo_cuestionario || 'Evaluación',
                    lessonId: data.quizData?.leccion_id || data.leccion_id || null,
                    courseId: data.quizData?.curso_id || data.curso_id || null,
                    totalQuestions: data.quizData?.preguntas?.length || data.total_preguntas || 0,
                    score: data.puntuacion || 0,
                    maxScore: data.puntuacion_maxima || 0,
                    percentage: data.porcentaje || 0,
                    passed: data.aprobado || false,
                    timeSpent: data.tiempo_transcurrido || 0,
                    attemptNumber: data.intento_numero || 1
                },
                responses: [],
                rawData: data // Incluir datos crudos para referencia
            };
        }

        // Procesar respuestas abiertas (solo para payloads que necesitan transformación)
        if (data.type !== 'quiz-responses' && data.openAnswers && Array.isArray(data.openAnswers)) {
            data.openAnswers.forEach((respuesta, index) => {
                webhookPayload.responses.push({
                    questionNumber: index + 1,
                    questionId: respuesta.questionId,
                    question: respuesta.question || '',
                    answer: respuesta.answer || '',
                    answerType: 'open',
                    files: respuesta.files || [],
                    timeSpent: respuesta.timeSpent || 0,
                    submittedAt: respuesta.submittedAt || new Date().toISOString()
                });
            });
        }

        // Procesar respuestas de opción múltiple (solo para payloads que necesitan transformación)
        if (data.type !== 'quiz-responses' && data.userAnswers) {
            Object.keys(data.userAnswers).forEach(questionId => {
                const answer = data.userAnswers[questionId];
                const existingResponse = webhookPayload.responses.find(r => r.questionId === questionId);

                if (!existingResponse) {
                    webhookPayload.responses.push({
                        questionId: questionId,
                        answer: answer.textoRespuesta || answer.opcionId || answer.answer || '',
                        answerType: 'multiple_choice',
                        selectedOption: answer.opcionSeleccionada || answer.opcionId || null,
                        isCorrect: answer.esCorrecta || answer.correcta || false,
                        timeSpent: answer.tiempoRespuesta || answer.tiempo || 0,
                        submittedAt: answer.fechaRespuesta || new Date().toISOString()
                    });
                }
            });
        }

        // Procesar respuestas desde la base de datos (respuestas_guardadas) - solo para payloads que necesitan transformación
        if (data.type !== 'quiz-responses' && data.respuestas_guardadas && typeof data.respuestas_guardadas === 'object') {
            Object.keys(data.respuestas_guardadas).forEach(questionId => {
                const answer = data.respuestas_guardadas[questionId];
                const existingResponse = webhookPayload.responses.find(r => r.questionId === questionId);

                if (!existingResponse) {
                    webhookPayload.responses.push({
                        questionId: questionId,
                        answer: 'Respuesta guardada en BD',
                        answerType: 'database',
                        isCorrect: answer.es_correcta || answer.esCorrecta || false,
                        timeSpent: answer.tiempo_respuesta || answer.tiempoRespuesta || 0,
                        submittedAt: answer.fecha_respuesta || new Date().toISOString()
                    });
                }
            });
        }

        // Asegurar que tenemos el email del usuario en el payload
        if (!webhookPayload.studentInfo.email && data.userId) {
            // Intentar obtener el email desde la base de datos si tenemos el userId
            webhookPayload.studentInfo.email = data.userId + '@usuario.local'; // Fallback temporal
        }

        // Validar el payload antes de enviarlo
        const validation = validatePayload(webhookPayload);
        if (!validation.valid) {
            console.error('❌ Payload inválido:', validation.errors);
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: 'Payload inválido',
                    validationErrors: validation.errors,
                    webhookStatus: 'validation_failed'
                })
            };
        }

        console.log('📋 Enviando datos a n8n...');
        console.log('📋 URL del webhook:', WEBHOOK_URL);
        console.log('📋 Payload size:', JSON.stringify(webhookPayload).length, 'bytes');

        // Enviar datos al webhook de n8n con retry logic
        const webhookResult = await sendToWebhookWithRetry(webhookPayload, {
            maxRetries: MAX_RETRIES,
            timeout: TIMEOUT
        });

        console.log('📊 Resultado del envío:', webhookResult);

        if (webhookResult.success) {
            console.log('✅ Datos enviados exitosamente a n8n');
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: 'Datos enviados correctamente a n8n',
                    webhookResponse: webhookResult.data,
                    webhookStatus: 'success',
                    performance: {
                        attempt: webhookResult.attempt,
                        responseTime: webhookResult.responseTime,
                        requestId: webhookResult.requestId
                    }
                })
            };
        } else {
            console.error('❌ Error al enviar datos al webhook de n8n:', webhookResult.error);

            // Determinar el código de estado HTTP apropiado basado en el tipo de error
            let statusCode = 502; // Bad Gateway por defecto
            if (webhookResult.errorType === 'connection_refused' || webhookResult.errorType === 'dns_resolution') {
                statusCode = 503; // Service Unavailable
            } else if (webhookResult.errorType === 'timeout') {
                statusCode = 504; // Gateway Timeout
            } else if (webhookResult.errorType === 'client_error') {
                statusCode = 400; // Bad Request
            } else if (webhookResult.errorType === 'not_found') {
                statusCode = 404; // Not Found
            }

            return {
                statusCode: statusCode,
                body: JSON.stringify({
                    success: false,
                    message: 'Error al enviar datos al webhook de n8n',
                    error: webhookResult.error,
                    errorType: webhookResult.errorType,
                    errorSolution: webhookResult.errorSolution,
                    webhookStatus: 'failed',
                    performance: {
                        attempts: webhookResult.attempt,
                        requestId: webhookResult.requestId
                    },
                    details: webhookResult.details
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