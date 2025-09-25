const { createTransport } = require('nodemailer');
const axios = require('axios');

// Configuración del webhook
const WEBHOOK_URL = 'https://n8n.srv1024767.hstgr.cloud/webhook/fbdc5d15-3435-42f9-8047-891869aa9f7e';

// Configuración de la API de Google Gemini
const geminiConfig = {
    apiKey: process.env.GEMINI_API_KEY,
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
};

// Función para generar correcciones con Gemini API
async function generateCorrections(quizData, userAnswers) {
    try {
        // Construir el prompt con las preguntas y respuestas del usuario
        let preguntasTexto = '';
        quizData.preguntas.forEach((pregunta, index) => {
            const respuesta = userAnswers[pregunta.id] || userAnswers[`pregunta${index + 1}`] || '';
            preguntasTexto += `
Pregunta ${index + 1}: ${pregunta.pregunta}
Respuesta del estudiante: ${respuesta.textoRespuesta || respuesta || ''}
`;
        });

        const prompt = `
Eres un experto en educación y evaluación académica. Evalúa y proporciona retroalimentación constructiva sobre las siguientes respuestas de un cuestionario:

${preguntasTexto}

Por favor, proporciona:
1. Una corrección detallada para cada respuesta
2. Una puntuación del 1 al 10 para cada respuesta
3. Sugerencias específicas de mejora para cada respuesta
4. Un resumen general del desempeño
5. Puntuación total y porcentaje de acierto
6. Una recomendación final basada en el desempeño general

La evaluación debe ser justa, constructiva y motivadora. Considera:
- La claridad y coherencia de las respuestas
- El uso de ejemplos y evidencias
- La profundidad del análisis
- La aplicación práctica de conceptos
- La estructura y organización de las ideas

Responde en formato JSON con la siguiente estructura:
{
    "correcciones": [
        {
            "numero": 1,
            "pregunta": "texto de la pregunta",
            "correccion": "corrección detallada",
            "puntuacion": 8,
            "sugerencias": ["sugerencia 1", "sugerencia 2"]
        }
    ],
    "resumen": "resumen general del desempeño",
    "puntuacionTotal": 32,
    "puntuacionMaxima": 40,
    "porcentaje": 80,
    "recomendacion": "recomendación final"
}
`;

        console.log('Enviando solicitud a Gemini API...');
        console.log('Gemini API Key utilizada:', geminiConfig.apiKey ? 'Configurada' : 'No configurada o vacía');

        const response = await axios.post(
            `${geminiConfig.baseUrl}?key=${geminiConfig.apiKey}`,
            {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 8000, // Aumentado para permitir respuestas más largas
                    responseMimeType: "application/json"
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Respuesta recibida de Gemini API');
        console.log('Respuesta completa de Gemini (response.data):', JSON.stringify(response.data, null, 2));

        // Verificar si la respuesta contiene el texto esperado
        if (!response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content || !response.data.candidates[0].content.parts || !response.data.candidates[0].content.parts[0] || !response.data.candidates[0].content.parts[0].text) {
            throw new Error('La respuesta de Gemini no contiene el campo de texto esperado.');
        }

        // Parsear la respuesta de la API
        const responseText = response.data.candidates[0].content.parts[0].text;

        // Extraer JSON de la respuesta de forma más robusta
        const startIndex = responseText.indexOf('{');
        const endIndex = responseText.lastIndexOf('}');

        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
            const jsonString = responseText.substring(startIndex, endIndex + 1);
            const parsedResponse = JSON.parse(jsonString);
            return parsedResponse;
        } else {
            throw new Error('No se encontró JSON válido en la respuesta de Gemini');
        }

    } catch (error) {
        console.error('Error generando correcciones:', error.response?.data || error.message);
        throw error;
    }
}

// Función para enviar datos brutos directamente al webhook n8n (SIN PROCESAMIENTO GEMINI)
async function sendRawDataToWebhook(data) {
    try {
        console.log('Enviando datos brutos al webhook n8n...');

        // Extraer respuestas abiertas de forma estructurada
        const openAnswers = [];
        data.quizData.preguntas.forEach((pregunta, index) => {
            const respuesta = data.userAnswers[pregunta.id] || data.userAnswers[`pregunta${index + 1}`] || '';

            if (pregunta.tipo === 'texto_libre' || respuesta.textoRespuesta) {
                openAnswers.push({
                    questionNumber: index + 1,
                    questionId: pregunta.id,
                    questionText: pregunta.pregunta,
                    answer: respuesta.textoRespuesta || respuesta || '',
                    files: respuesta.archivos || [],
                    responseTime: respuesta.tiempoRespuesta || 0
                });
            }
        });

        const webhookPayload = {
            type: 'quiz-raw-responses',
            source: 'instituto-lidera-elearning',
            timestamp: new Date().toISOString(),
            studentInfo: {
                name: data.nombre,
                email: data.email, // Email del estudiante incluido (IMPORTANTE)
                processDate: new Date().toISOString()
            },
            quizInfo: {
                title: data.quizData.titulo || 'Evaluación',
                totalQuestions: data.quizData.preguntas?.length || 0,
                lessonId: data.quizData.leccion_id,
                courseId: data.quizData.curso_id,
                quizId: data.quizData.id
            },
            openAnswers: openAnswers, // Solo respuestas abiertas
            allUserAnswers: data.userAnswers, // Todas las respuestas del usuario
            quizData: {
                questions: data.quizData.preguntas,
                settings: {
                    allowMultipleAttempts: data.quizData.permitir multiples_intentos || false,
                    timeLimit: data.quizData.limite_tiempo || 0,
                    passingScore: data.quizData.puntuacion_aprobacion || 70
                }
            },
            metadata: {
                version: '2.0.0',
                source: 'instituto-lidera-elearning',
                processing: 'raw-data-to-n8n',
                priority: 'high'
            }
        };

        console.log('Payload preparado para webhook:', {
            type: webhookPayload.type,
            studentEmail: webhookPayload.studentInfo.email,
            openAnswersCount: openAnswers.length,
            totalQuestions: webhookPayload.quizInfo.totalQuestions
        });

        const response = await axios.post(WEBHOOK_URL, webhookPayload, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Instituto-Lidera-Webhook/2.0.0',
                'X-Webhook-Priority': 'high'
            },
            timeout: 45000 // Aumentado timeout para respuestas largas
        });

        console.log('✅ Webhook enviado exitosamente a n8n:', {
            status: response.status,
            statusText: response.statusText,
            webhookUrl: WEBHOOK_URL,
            payloadSize: JSON.stringify(webhookPayload).length
        });

        return {
            success: true,
            status: response.status,
            statusText: response.statusText,
            webhookUrl: WEBHOOK_URL,
            payloadSize: JSON.stringify(webhookPayload).length,
            openAnswersCount: openAnswers.length
        };

    } catch (error) {
        console.error('❌ Error enviando webhook a n8n:', {
            message: error.message,
            webhookUrl: WEBHOOK_URL,
            status: error.response?.status,
            statusText: error.response?.statusText,
            responseData: error.response?.data
        });

        return {
            success: false,
            error: error.message,
            webhookUrl: WEBHOOK_URL,
            status: error.response?.status,
            errorDetails: error.response?.data
        };
    }
}

// Función para enviar datos al webhook (versión anterior con Gemini - DORMIDA)
async function sendToWebhook(data) {
    try {
        console.log('⚠️ Función sendToWebhook con Gemini está dormida. Usar sendRawDataToWebhook en su lugar.');
        return {
            success: false,
            message: 'Función dormida - usar sendRawDataToWebhook',
            webhookUrl: WEBHOOK_URL
        };
    } catch (error) {
        return {
            success: false,
            error: 'Función dormida',
            webhookUrl: WEBHOOK_URL
        };
    }
}

// Función para enviar email con correcciones
async function sendCorrectionsEmail(email, nombre, quizData, corrections) {
    try {
        console.log('Configurando transporte de correo...');

        const transporter = createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.EMAIL_USER || 'pablitocfv@hotmail.com',
                pass: process.env.EMAIL_PASSWORD || 'hotmail070823'
            }
        });

        // Preparar el contenido del email
        const emailHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">📋 Resultados de tu Evaluación</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Instituto Lidera</p>
                </div>

                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
                    <h2 style="color: #333; margin-top: 0;">Hola ${nombre},</h2>
                    <p style="color: #666; line-height: 1.6;">Hemos completado la evaluación de tus respuestas. Aquí están tus resultados detallados:</p>

                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
                        <h3 style="color: #007bff; margin-top: 0;">📊 Resumen General</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 15px 0;">
                            <div style="background: white; padding: 15px; border-radius: 5px; text-align: center;">
                                <strong>Puntuación Total:</strong><br>
                                <span style="font-size: 24px; color: #007bff;">${corrections.puntuacionTotal}/${corrections.puntuacionMaxima}</span>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 5px; text-align: center;">
                                <strong>Porcentaje:</strong><br>
                                <span style="font-size: 24px; color: ${corrections.porcentaje >= 70 ? '#28a745' : '#dc3545'};">${corrections.porcentaje}%</span>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 5px; text-align: center;">
                                <strong>Estado:</strong><br>
                                <span style="font-size: 18px; color: ${corrections.porcentaje >= 70 ? '#28a745' : '#dc3545'};">
                                    ${corrections.porcentaje >= 70 ? '✅ Aprobado' : '❌ Necesita mejorar'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <h3 style="color: #333;">📝 Correcciones Detalladas:</h3>

                    ${corrections.correcciones.map((correccion, index) => {
                        const pregunta = quizData.preguntas[index];
                        return `
                            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #007bff;">
                                <h4 style="color: #333; margin-top: 0;">Pregunta ${correccion.numero}</h4>
                                <p style="background: white; padding: 10px; border-radius: 4px; margin: 10px 0; font-style: italic;">
                                    <strong>Pregunta:</strong> ${pregunta.pregunta}
                                </p>

                                <div style="background: #e8f5e8; padding: 15px; border-radius: 4px; margin: 10px 0;">
                                    <h5 style="color: #155724; margin-top: 0;">📝 Corrección y Evaluación:</h5>
                                    <p>${correccion.correccion}</p>

                                    <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0;">
                                        <span><strong>Puntuación:</strong> ${correccion.puntuacion}/10</span>
                                        <span style="background: ${correccion.puntuacion >= 7 ? '#d4edda' : '#f8d7da'}; color: ${correccion.puntuacion >= 7 ? '#155724' : '#721c24'}; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                                            ${correccion.puntuacion >= 7 ? 'Buen desempeño' : 'Necesita mejorar'}
                                        </span>
                                    </div>
                                </div>

                                ${correccion.sugerencias && correccion.sugerencias.length > 0 ? `
                                    <div style="background: #fff3cd; padding: 15px; border-radius: 4px; margin: 10px 0;">
                                        <h5 style="color: #856404; margin-top: 0;">💡 Sugerencias de mejora:</h5>
                                        <ul style="margin: 5px 0; padding-left: 20px;">
                                            ${correccion.sugerencias.map(s => `<li>${s}</li>`).join('')}
                                        </ul>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}

                    <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #28a745;">
                        <h3 style="color: #155724; margin-top: 0;">📊 Resumen de tu Desempeño</h3>
                        <p>${corrections.resumen}</p>

                        ${corrections.recomendacion ? `
                            <div style="background: white; padding: 15px; border-radius: 4px; margin: 15px 0;">
                                <h4 style="color: #333; margin-top: 0;">🎯 Recomendación Final:</h4>
                                <p>${corrections.recomendacion}</p>
                            </div>
                        ` : ''}
                    </div>

                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; border: 1px solid #dee2e6;">
                        <h4 style="color: #495057; margin-top: 0;">📋 Información del Formulario</h4>
                        <p style="margin: 5px 0;"><strong>Curso:</strong> ${quizData.titulo || 'Evaluación General'}</p>
                        <p style="margin: 5px 0;"><strong>Fecha de evaluación:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
                        <p style="margin: 5px 0;"><strong>Número de preguntas:</strong> ${quizData.preguntas.length}</p>
                    </div>

                    <p style="text-align: center; margin: 30px 0 0 0;">
                        <em>Gracias por confiar en Instituto Lidera para tu evaluación educativa.</em><br>
                        <strong>Equipo de Instituto Lidera</strong>
                    </p>
                </div>

                <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                    <p>© 2024 Instituto Lidera. Todos los derechos reservados.</p>
                    <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER || 'pablitocfv@hotmail.com',
            to: email,
            subject: `Resultados de Evaluación - ${nombre} - Instituto Lidera`,
            html: emailHTML
        };

        console.log('Enviando correo electrónico...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente:', info.messageId);

        return {
            success: true,
            messageId: info.messageId
        };

    } catch (error) {
        console.error('Error enviando correo:', error);
        throw error;
    }
}

// Función principal
exports.handler = async (event, context) => {
    // Solo permitir POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        console.log('📥 Datos recibidos:', JSON.stringify(data, null, 2));

        const { nombre, email, quizData, userAnswers } = data;

        // Validar datos requeridos
        if (!nombre || !email || !quizData || !userAnswers) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Faltan datos requeridos: nombre, email, quizData, userAnswers' })
            };
        }

        console.log('🚀 Iniciando envío DIRECTO al webhook n8n (SIN procesamiento Gemini)...');

        // Preparar datos para el webhook
        const webhookData = {
            nombre: nombre,
            email: email,
            quizData: quizData,
            userAnswers: userAnswers
        };

        // ENVIAR DIRECTAMENTE AL WEBHOOK N8N (SISTEMA ACTIVO)
        console.log('📤 Enviando datos brutos al webhook n8n...');
        const webhookResult = await sendRawDataToWebhook(webhookData);
        console.log('📊 Resultado del webhook:', JSON.stringify(webhookResult, null, 2));

        // SISTEMA ANTERIOR CON GEMINI (DORMIDO - Comentado)
        /*
        console.log('⏸️ Sistema Gemini dormido. Código comentado:');

        // Código dormido - Descomentar para reactivar sistema con Gemini
        // console.log('Generando correcciones con Gemini API...');
        // const corrections = await generateCorrections(quizData, userAnswers);
        // console.log('Correcciones generadas (objeto completo):', JSON.stringify(corrections, null, 2));

        // console.log('Enviando correo con resultados...');
        // const emailResult = await sendCorrectionsEmail(email, nombre, quizData, corrections);
        // console.log('Email enviado:', emailResult);
        */

        // Logging del proceso simplificado
        const processLog = {
            timestamp: new Date().toISOString(),
            mode: 'direct-webhook-n8n',
            user: nombre,
            email: email,
            preguntas: quizData.preguntas?.length || 0,
            webhookEnviado: webhookResult.success,
            webhookStatus: webhookResult.status,
            openAnswersCount: webhookResult.openAnswersCount || 0
        };

        console.log('✅ Proceso completado (modo directo):', JSON.stringify(processLog, null, 2));

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Datos enviados exitosamente al webhook n8n',
                mode: 'direct-webhook',
                webhookResult: webhookResult,
                processLog: processLog,
                info: 'Sistema Gemini dormido - enviando datos brutos a n8n para procesamiento'
            })
        };

    } catch (error) {
        console.error('❌ Error en el handler:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error procesando el envío al webhook n8n',
                error: error.message,
                stack: error.stack,
                mode: 'direct-webhook'
            })
        };
    }
};