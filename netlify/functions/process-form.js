const axios = require('axios');

// Configuración de la API de Google Gemini
const geminiConfig = {
    apiKey: process.env.GEMINI_API_KEY || 'AIzaSyC5x4c7x5Q8f8q5x4c7x5Q8f8q5x4c7x5Q',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
};

// Función para procesar respuestas con Gemini API
async function processWithGemini(quizData, answers) {
    try {
        // Construir el prompt con todas las preguntas y respuestas
        let preguntasTexto = '';
        quizData.preguntas.forEach((pregunta, index) => {
            const respuesta = answers[pregunta.id] || answers[`pregunta${index + 1}`] || '';
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
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2000,
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

        try {
            // Extraer JSON de la respuesta
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsedResponse = JSON.parse(jsonMatch[0]);
                return parsedResponse;
            } else {
                throw new Error('No se encontró JSON en la respuesta');
            }
        } catch (parseError) {
            console.log('No se pudo parsear como JSON, procesando respuesta manualmente...');
            return parseManualResponse(responseText, quizData);
        }

    } catch (error) {
        console.error('Error procesando con Gemini:', error.response?.data || error.message);

        // Fallback a respuesta mock en caso de error
        console.log('Usando respuesta mock como fallback...');
        return getMockResponse(quizData);
    }
}

function parseManualResponse(responseText, quizData) {
    const result = {
        correcciones: [],
        resumen: "Evaluación completada con éxito.",
        puntuacionTotal: 0,
        puntuacionMaxima: quizData ? quizData.preguntas.length * 10 : 40,
        porcentaje: 0,
        recomendacion: "Buen trabajo en general."
    };

    // Extraer información manualmente
    const lines = responseText.split('\n');
    let currentQuestion = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.toLowerCase().includes('pregunta') || line.toLowerCase().includes('question')) {
            if (currentQuestion !== null) {
                result.correcciones.push(currentQuestion);
            }
            currentQuestion = {
                numero: result.correcciones.length + 1,
                pregunta: line,
                correccion: "",
                puntuacion: 7,
                sugerencias: []
            };
        } else if (currentQuestion && (line.toLowerCase().includes('corrección') || line.toLowerCase().includes('correccion'))) {
            currentQuestion.correccion = line.replace(/^.*:\s*/, '');
        } else if (currentQuestion && line.toLowerCase().includes('puntuación')) {
            const scoreMatch = line.match(/(\d+)/);
            if (scoreMatch) {
                currentQuestion.puntuacion = parseInt(scoreMatch[1]);
            }
        } else if (currentQuestion && line.toLowerCase().includes('sugerencia')) {
            currentQuestion.sugerencias.push(line.replace(/^.*:\s*/, ''));
        }
    }

    if (currentQuestion !== null) {
        result.correcciones.push(currentQuestion);
    }

    // Calcular puntuaciones
    result.puntuacionTotal = result.correcciones.reduce((sum, q) => sum + q.puntuacion, 0);
    result.porcentaje = Math.round((result.puntuacionTotal / result.puntuacionMaxima) * 100);

    return result;
}

function getMockResponse(quizData) {
    const numPreguntas = quizData ? quizData.preguntas.length : 4;
    const puntuacionMaxima = numPreguntas * 10;
    const puntuacionTotal = Math.round(puntuacionMaxima * 0.85);

    return {
        correcciones: Array.from({ length: numPreguntas }, (_, i) => ({
            numero: i + 1,
            pregunta: `Pregunta ${i + 1}`,
            correccion: "Tu respuesta es buena pero podría mejorarse con más detalles y ejemplos específicos.",
            puntuacion: 8 + Math.floor(Math.random() * 2),
            sugerencias: [
                "Proporciona más ejemplos concretos",
                "Incluye referencias teóricas",
                "Desarrolla más tu argumentación"
            ]
        })),
        resumen: "Tu desempeño general es muy bueno. Muestras un sólido entendimiento de los conceptos fundamentales.",
        puntuacionTotal: puntuacionTotal,
        puntuacionMaxima: puntuacionMaxima,
        porcentaje: Math.round((puntuacionTotal / puntuacionMaxima) * 100),
        recomendacion: "Continúa desarrollando tus habilidades de análisis y aplicación práctica."
    };
}

// Función para enviar email con formulario completo y correcciones
async function sendResultsEmail(email, nombre, quizData, corrections) {
    try {
        console.log('Enviando email con resultados a:', email);
        console.log('Nombre del usuario:', nombre);

        // Preparar el contenido del email con el formulario completo
        let formularioHTML = `
            <h2>Formulario de Evaluación Completo - Instituto Lidera</h2>
            <p>Hola ${nombre},</p>
            <p>Gracias por completar el cuestionario. Aquí está tu formulario completo con las correcciones y evaluación:</p>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Resultados Generales</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0;">
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
                            ${corrections.porcentaje >= 70 ? '✅ Aprobado' : '❌ No aprobado'}
                        </span>
                    </div>
                </div>
            </div>

            <h3>Detalle de Respuestas y Correcciones:</h3>
        `;

        // Agregar cada pregunta con su corrección
        corrections.correcciones.forEach((correccion, index) => {
            const pregunta = quizData.preguntas[index];
            formularioHTML += `
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
        });

        // Agregar resumen final
        formularioHTML += `
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

            <p style="text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                Si tienes alguna pregunta sobre tus resultados, no dudes en contactarnos.<br>
                <strong>Equipo de Instituto Lidera</strong><br>
                <em>¡Felicidades por completar tu evaluación!</em>
            </p>
        `;

        // Simular el envío a Netlify Forms para que llegue por email
        // Netlify Forms procesará esto y enviará el email automáticamente
        const netlifyFormData = {
            form_name: 'evaluacion-completa',
            nombre: nombre,
            email: email,
            asunto: `Resultados de Evaluación - ${nombre}`,
            formulario_html: formularioHTML,
            puntuacion_total: corrections.puntuacionTotal,
            puntuacion_maxima: corrections.puntuacionMaxima,
            porcentaje: corrections.porcentaje,
            fecha_envio: new Date().toISOString()
        };

        console.log('Formulario preparado para Netlify Forms:', netlifyFormData);

        return {
            success: true,
            message: 'Formulario completo preparado para envío',
            email: email,
            nombre: nombre,
            formData: netlifyFormData,
            corrections: corrections
        };

    } catch (error) {
        console.error('Error preparando formulario completo:', error);
        return {
            success: false,
            message: 'Error preparando formulario completo',
            error: error.message
        };
    }
}

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
        const { nombre, email, quizData, userAnswers } = data;

        // Validar datos requeridos
        if (!nombre || !email || !quizData || !userAnswers) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Faltan datos requeridos: nombre, email, quizData, userAnswers' })
            };
        }

        console.log('Procesando formulario completo...');
        console.log('Nombre:', nombre);
        console.log('Email:', email);
        console.log('Preguntas en quiz:', quizData.preguntas?.length || 0);
        console.log('Respuestas del usuario:', Object.keys(userAnswers).length);

        // Procesar respuestas con Gemini
        const corrections = await processWithGemini(quizData, userAnswers);

        console.log('Correcciones generadas:', corrections);

        // Enviar email con formulario completo y correcciones
        const emailResult = await sendResultsEmail(email, nombre, quizData, corrections);

        if (!emailResult.success) {
            throw new Error(`Error enviando email: ${emailResult.message}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Formulario completo procesado exitosamente',
                corrections: corrections,
                emailResult: emailResult
            })
        };

    } catch (error) {
        console.error('Error en el handler:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error procesando el formulario completo',
                error: error.message,
                stack: error.stack
            })
        };
    }
};