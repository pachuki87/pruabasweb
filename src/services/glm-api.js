import axios from 'axios';

class GLMApiService {
    constructor() {
        this.apiKey = process.env.VITE_GLM_API_KEY;
        this.baseUrl = process.env.VITE_GLM_API_URL || 'https://api.x.ai/v1/chat/completions';
        this.model = process.env.VITE_GLM_MODEL || 'grok-beta';
    }

    async evaluateAnswers(answers) {
        try {
            const prompt = this.buildEvaluationPrompt(answers);

            const response = await axios.post(
                this.baseUrl,
                {
                    model: this.model,
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
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return this.parseGLMResponse(response.data.choices[0].message.content);

        } catch (error) {
            console.error('Error calling GLM API:', error);
            throw new Error('Error al procesar las respuestas con la API de GLM');
        }
    }

    buildEvaluationPrompt(answers) {
        return `
        Eres un experto en psicología y adicciones. Evalúa y proporciona retroalimentación constructiva sobre las siguientes respuestas:

        Pregunta 1: ¿Qué significa para usted ser adicto y cuáles considera que son las principales características de una conducta adictiva?
        Respuesta del estudiante: "${answers.pregunta1}"

        Pregunta 2: Describa las principales consecuencias que las adicciones pueden tener en la vida de una persona y su entorno familiar.
        Respuesta del estudiante: "${answers.pregunta2}"

        Pregunta 3: ¿Qué role considera que juega la familia en el proceso de recuperación de una persona con adicciones?
        Respuesta del estudiante: "${answers.pregunta3}"

        Pregunta 4: Explique cómo el mindfulness puede ser una herramienta útil en el tratamiento de conductas adictivas.
        Respuesta del estudiante: "${answers.pregunta4}"

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
    }

    parseGLMResponse(response) {
        try {
            // Intentar parsear directamente como JSON
            const parsed = JSON.parse(response);
            return parsed;
        } catch (parseError) {
            console.log('No se pudo parsear como JSON, intentando extraer información...');

            // Si no es JSON válido, intentar extraer la información del texto
            const result = {
                pregunta1: { correccion: '', puntuacion: 7, sugerencias: [] },
                pregunta2: { correccion: '', puntuacion: 7, sugerencias: [] },
                pregunta3: { correccion: '', puntuacion: 7, sugerencias: [] },
                pregunta4: { correccion: '', puntuacion: 7, sugerencias: [] },
                resumen: response
            };

            // Intentar extraer puntuaciones y correcciones usando regex
            const puntuaciones = response.match(/puntuación[:\s]*(\d+)/gi);
            if (puntuaciones) {
                result.pregunta1.puntuacion = parseInt(puntuaciones[0]?.match(/\d+/)?.[0] || 7);
                result.pregunta2.puntuacion = parseInt(puntuaciones[1]?.match(/\d+/)?.[0] || 7);
                result.pregunta3.puntuacion = parseInt(puntuaciones[2]?.match(/\d+/)?.[0] || 7);
                result.pregunta4.puntuacion = parseInt(puntuaciones[3]?.match(/\d+/)?.[0] || 7);
            }

            return result;
        }
    }

    async testConnection() {
        try {
            const response = await axios.post(
                this.baseUrl,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: 'Hola, ¿estás funcionando correctamente?'
                        }
                    ],
                    max_tokens: 50
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                success: true,
                message: 'Conexión establecida correctamente',
                response: response.data.choices[0].message.content
            };

        } catch (error) {
            return {
                success: false,
                message: 'Error al conectar con la API de GLM',
                error: error.message
            };
        }
    }
}

export default new GLMApiService();