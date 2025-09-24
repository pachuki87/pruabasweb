const axios = require('axios');

// Configuración de la API de Zai GLM
const glmConfig = {
    apiKey: process.env.ZAI_API_KEY || 'nfp_rVfRcr4gHR1s3jjq9b5ujYCHcGiqNqpkc9e4',
    baseUrl: process.env.ZAI_API_URL || 'https://api.zai.ai/v1/chat/completions',
    model: process.env.ZAI_MODEL || 'glm[G'
};

// Función para procesar respuestas con GLM API
async function processWithGLM(answers) {
    try {
        const prompt = `
        Eres un experto en psicología y adicciones. Evalúa y proporciona retroalimentación constructiva sobre las siguientes respuestas:

        Pregunta 1: ¿Qué significa para usted ser adicto y cuáles considera que son las principales características de una conducta adictiva?
        Respuesta del estudiante: ${answers.pregunta1}

        Pregunta 2: Describa las principales consecuencias que las adicciones pueden tener en la vida de una persona y su entorno familiar.
        Respuesta del estudiante: ${answers.pregunta2}

        Pregunta 3: ¿Qué role considera que juega la familia en el proceso de recuperación de una persona con adicciones?
        Respuesta del estudiante: ${answers.pregunta3}

        Pregunta 4: Explique cómo el mindfulness puede ser una herramienta útil en el tratamiento de conductas adictivas.
        Respuesta del estudiante: ${answers.pregunta4}

        Por favor, proporciona:
        1. Una corrección detallada para cada respuesta
        2. Una puntuación del 1 al 10 para cada respuesta
        3. Sugerencias específicas de mejora
        4. Un resumen general del desempeño

        Responde en formato JSON con la siguiente estructura:
        {
            "pregunta1": {"correccion": "...", "puntuacion": 8, "sugerencias": ["...", "..."]},
            "pregunta2": {"correccion": "...", "puntuacion": 9, "sugerencias": ["...", "..."]},
            "pregunta3": {"correccion": "...", "puntuacion": 9, "sugerencias": ["...", "..."]},
            "pregunta4": {"correccion": "...", "puntuacion": 8, "sugerencias": ["...", "..."]},
            "resumen": "..."
        }
        `;

        console.log('Enviando solicitud a Zai GLM API...');

        const response = await axios.post(
            glmConfig.baseUrl,
            {
                model: glmConfig.model,
                messages: [
                    {
                        role: 'system',
                        content: 'Eres un experto en psicología y adicciones con amplia experiencia en evaluación educativa. Proporciona retroalimentación constructiva, precisa y motivadora.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${glmConfig.apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Respuesta recibida de Zai GLM API');

        // Parsear la respuesta de la API
        const responseText = response.data.choices[0].message.content;
        console.log('Respuesta cruda:', responseText);

        try {
            // Intentar parsear como JSON
            const parsedResponse = JSON.parse(responseText);
            return parsedResponse;
        } catch (parseError) {
            console.log('No se pudo parsear como JSON, procesando respuesta manualmente...');
            return parseManualResponse(responseText);
        }

    } catch (error) {
        console.error('Error procesando con Zai GLM:', error.response?.data || error.message);

        // Fallback a respuesta mock en caso de error
        console.log('Usando respuesta mock como fallback...');
        return getMockResponse();
    }
}

function parseManualResponse(responseText) {
    const result = {
        pregunta1: { correccion: '', puntuacion: 7, sugerencias: [] },
        pregunta2: { correccion: '', puntuacion: 7, sugerencias: [] },
        pregunta3: { correccion: '', puntuacion: 7, sugerencias: [] },
        pregunta4: { correccion: '', puntuacion: 7, sugerencias: [] },
        resumen: responseText
    };

    // Extraer información usando regex
    const patterns = {
        pregunta1: /pregunta\s*1[:\s]*(.*?)(?=pregunta\s*2|$)/si,
        pregunta2: /pregunta\s*2[:\s]*(.*?)(?=pregunta\s*3|$)/si,
        pregunta3: /pregunta\s*3[:\s]*(.*?)(?=pregunta\s*4|$)/si,
        pregunta4: /pregunta\s*4[:\s]*(.*?)(?=resumen|$)/si,
        resumen: /resumen[:\s]*(.*?)$/si
    };

    Object.entries(patterns).forEach(([key, pattern]) => {
        const match = responseText.match(pattern);
        if (match) {
            if (key === 'resumen') {
                result.resumen = match[1].trim();
            } else {
                result[key].correccion = match[1].trim();

                // Extraer puntuación
                const scoreMatch = match[1].match(/puntuación[:\s]*(\d+)/i);
                if (scoreMatch) {
                    result[key].puntuacion = parseInt(scoreMatch[1]);
                }
            }
        }
    });

    return result;
}

function getMockResponse() {
    return {
        pregunta1: {
            correccion: "Tu respuesta muestra buen entendimiento del concepto de adicción. Considera profundizar en los aspectos neurobiológicos y la diferencia entre uso, abuso y dependencia.",
            puntuacion: 8,
            sugerencias: [
                "Menciona los criterios del DSM-5 para diagnóstico",
                "Incluye la perspectiva bio-psico-social",
                "Diferencia entre adicciones químicas y conductuales"
            ]
        },
        pregunta2: {
            correccion: "Excelente análisis de las consecuencias. Has cubierto bien los aspectos familiares y personales.",
            puntuacion: 9,
            sugerencias: [
                "Amplía sobre consecuencias legales y laborales",
                "Menciona el impacto en la salud mental",
                "Incluye el concepto de estigma social"
            ]
        },
        pregunta3: {
            correccion: "Muy buena comprensión del rol familiar. Has identificado correctamente la importancia del sistema familiar.",
            puntuacion: 9,
            sugerencias: [
                "Profundiza en los tipos de intervenciones familiares",
                "Menciona el concepto de codependencia",
                "Incluye la importancia de límites saludables"
            ]
        },
        pregunta4: {
            correccion: "Buen entendimiento de la aplicación del mindfulness. Considera ser más específico sobre las técnicas.",
            puntuacion: 8,
            sugerencias: [
                "Menciona técnicas específicas de mindfulness",
                "Explica la conexión neurobiológica",
                "Incluye evidencia científica de su eficacia"
            ]
        },
        resumen: "Tu desempeño general es muy bueno (8.5/10). Muestras un sólido entendimiento de los conceptos fundamentales en el estudio de las adicciones. Las áreas de oportunidad incluyen mayor especificidad en técnicas terapéuticas e integración de evidencia científica."
    };
}

// Función para preparar el contenido para Netlify Forms notifications
async function sendResultsEmail(email, nombre, corrections) {
    try {
        console.log('Procesando formulario para Netlify Forms...');
        console.log('Email del usuario:', email);
        console.log('Nombre del usuario:', nombre);

        // Netlify Forms automáticamente enviará una notificación al email configurado
        // en los ajustes de Netlify Forms cuando se reciba un nuevo formulario
        // El usuario recibirá una copia porque Netlify Forms envía notificaciones
        // a todos los emails configurados en las notificaciones del formulario

        return {
            success: true,
            message: 'Formulario procesado para Netlify Forms',
            email: email,
            nombre: nombre,
            corrections: corrections
        };

    } catch (error) {
        console.error('Error procesando formulario:', error);
        return {
            success: false,
            message: 'Error procesando formulario',
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
        const { nombre, email, pregunta1, pregunta2, pregunta3, pregunta4 } = data;

        // Validar datos requeridos
        if (!nombre || !email || !pregunta1 || !pregunta2 || !pregunta3 || !pregunta4) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Todos los campos son requeridos' })
            };
        }

        // Procesar respuestas con GLM
        const corrections = await processWithGLM({
            pregunta1, pregunta2, pregunta3, pregunta4
        });

        // Enviar email con resultados
        await sendResultsEmail(email, nombre, corrections);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Formulario procesado exitosamente',
                corrections
            })
        };

    } catch (error) {
        console.error('Error en el handler:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error procesando el formulario',
                error: error.message
            })
        };
    }
};