const axios = require('axios');
const nodemailer = require('nodemailer');

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
                    maxOutputTokens: 3000,
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

        // Parsear la respuesta de la API
        const responseText = response.data.candidates[0].content.parts[0].text;
        console.log('Respuesta cruda:', responseText);

        // Extraer JSON de la respuesta
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsedResponse = JSON.parse(jsonMatch[0]);
            return parsedResponse;
        } else {
            throw new Error('No se encontró JSON en la respuesta');
        }

    } catch (error) {
        console.error('Error generando correcciones:', error.response?.data || error.message);
        throw error;
    }
}

// Función para enviar email con correcciones
async function sendCorrectionsEmail(email, nombre, quizData, corrections) {
    try {
        console.log('Configurando transporte de correo...');

        const transporter = nodemailer.createTransporter({
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
        console.log('Datos recibidos:', JSON.stringify(data, null, 2));

        const { nombre, email, quizData, userAnswers } = data;

        // Validar datos requeridos
        if (!nombre || !email || !quizData || !userAnswers) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Faltan datos requeridos: nombre, email, quizData, userAnswers' })
            };
        }

        console.log('Generando correcciones con Gemini API...');
        const corrections = await generateCorrections(quizData, userAnswers);
        console.log('Correcciones generadas:', corrections);

        console.log('Enviando correo con resultados...');
        const emailResult = await sendCorrectionsEmail(email, nombre, quizData, corrections);
        console.log('Email enviado:', emailResult);

        // Logging del proceso completo
        const processLog = {
            timestamp: new Date().toISOString(),
            user: nombre,
            email: email,
            preguntas: quizData.preguntas.length,
            puntuacionTotal: corrections.puntuacionTotal,
            puntuacionMaxima: corrections.puntuacionMaxima,
            porcentaje: corrections.porcentaje,
            emailEnviado: emailResult.success
        };

        console.log('Proceso completado:', JSON.stringify(processLog, null, 2));

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Correcciones enviadas exitosamente',
                corrections: corrections,
                emailResult: emailResult,
                processLog: processLog
            })
        };

    } catch (error) {
        console.error('Error en el handler:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error procesando las correcciones',
                error: error.message,
                stack: error.stack
            })
        };
    }
};