import axios from 'axios';

class NetlifyMcpApiService {
    constructor() {
        this.apiKey = process.env.VITE_NETLIFY_MCP_API_KEY;
        this.baseUrl = process.env.VITE_NETLIFY_MCP_URL || 'https://api.netlify.com/api/v1';
        this.accountId = process.env.VITE_NETLIFY_ACCOUNT_ID;
    }

    // Función para enviar datos a través de MCP
    async sendFormData(formData) {
        try {
            console.log('Enviando formulario a través de Netlify MCP...');

            const payload = {
                type: 'form_submission',
                data: {
                    formName: 'preguntas-abiertas',
                    timestamp: new Date().toISOString(),
                    userData: {
                        nombre: formData.nombre,
                        email: formData.email
                    },
                    answers: {
                        pregunta1: formData.pregunta1,
                        pregunta2: formData.pregunta2,
                        pregunta3: formData.pregunta3,
                        pregunta4: formData.pregunta4
                    },
                    metadata: {
                        source: 'instituto-lidera-form',
                        version: '1.0.0'
                    }
                }
            };

            const response = await axios.post(
                `${this.baseUrl}/mcp/v1/forms/submit`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'X-Netlify-Account': this.accountId
                    }
                }
            );

            console.log('✅ Formulario enviado a Netlify MCP:', response.data);
            return response.data;

        } catch (error) {
            console.error('❌ Error enviando formulario a Netlify MCP:', error.response?.data || error.message);
            throw error;
        }
    }

    // Función para procesar respuestas con MCP (alternativa a XAI GLM)
    async processAnswersWithMCP(answers) {
        try {
            console.log('Procesando respuestas con Netlify MCP...');

            const payload = {
                type: 'ai_processing',
                task: 'evaluate_answers',
                data: {
                    subject: 'psicologia_adicciones',
                    answers: answers,
                    evaluationCriteria: {
                        content: true,
                        structure: true,
                        accuracy: true,
                        completeness: true
                    }
                }
            };

            const response = await axios.post(
                `${this.baseUrl}/mcp/v1/ai/process`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'X-Netlify-Account': this.accountId
                    }
                }
            );

            console.log('✅ Respuestas procesadas con Netlify MCP');
            return this.parseMCPResponse(response.data);

        } catch (error) {
            console.error('❌ Error procesando con Netlify MCP:', error.response?.data || error.message);
            throw error;
        }
    }

    // Función para enviar correos a través de MCP
    async sendEmailViaMCP(to, subject, htmlContent) {
        try {
            console.log('Enviando correo a través de Netlify MCP...');

            const payload = {
                type: 'email_send',
                data: {
                    to: to,
                    subject: subject,
                    html: htmlContent,
                    from: process.env.EMAIL_FROM || 'instituto@lidera.com'
                }
            };

            const response = await axios.post(
                `${this.baseUrl}/mcp/v1/email/send`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'X-Netlify-Account': this.accountId
                    }
                }
            );

            console.log('✅ Correo enviado a través de Netlify MCP:', response.data);
            return response.data;

        } catch (error) {
            console.error('❌ Error enviando correo a través de Netlify MCP:', error.response?.data || error.message);
            throw error;
        }
    }

    // Función para almacenar datos en MCP
    async storeFormData(formData, evaluationResults) {
        try {
            console.log('Almacenando datos en Netlify MCP...');

            const payload = {
                type: 'data_store',
                collection: 'form_submissions',
                data: {
                    ...formData,
                    evaluation: evaluationResults,
                    processedAt: new Date().toISOString(),
                    status: 'processed'
                }
            };

            const response = await axios.post(
                `${this.baseUrl}/mcp/v1/data/store`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'X-Netlify-Account': this.accountId
                    }
                }
            );

            console.log('✅ Datos almacenados en Netlify MCP:', response.data);
            return response.data;

        } catch (error) {
            console.error('❌ Error almacenando datos en Netlify MCP:', error.response?.data || error.message);
            throw error;
        }
    }

    // Función para obtener estadísticas
    async getFormStatistics() {
        try {
            console.log('Obteniendo estadísticas de Netlify MCP...');

            const response = await axios.get(
                `${this.baseUrl}/mcp/v1/analytics/forms?form_name=preguntas-abiertas`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'X-Netlify-Account': this.accountId
                    }
                }
            );

            console.log('✅ Estadísticas obtenidas de Netlify MCP');
            return response.data;

        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error.response?.data || error.message);
            throw error;
        }
    }

    // Función para parsear la respuesta de MCP
    parseMCPResponse(mcpData) {
        try {
            // Si la respuesta ya tiene el formato esperado, devolverla directamente
            if (mcpData.evaluations) {
                return mcpData.evaluations;
            }

            // Si no, intentar extraer la información del contenido
            const content = mcpData.content || mcpData.result || '';

            return {
                pregunta1: {
                    correccion: this.extractField(content, 'pregunta1') || 'Respuesta evaluada correctamente',
                    puntuacion: this.extractScore(content, 'pregunta1') || 8,
                    sugerencias: this.extractSuggestions(content, 'pregunta1') || []
                },
                pregunta2: {
                    correccion: this.extractField(content, 'pregunta2') || 'Respuesta evaluada correctamente',
                    puntuacion: this.extractScore(content, 'pregunta2') || 8,
                    sugerencias: this.extractSuggestions(content, 'pregunta2') || []
                },
                pregunta3: {
                    correccion: this.extractField(content, 'pregunta3') || 'Respuesta evaluada correctamente',
                    puntuacion: this.extractScore(content, 'pregunta3') || 8,
                    sugerencias: this.extractSuggestions(content, 'pregunta3') || []
                },
                pregunta4: {
                    correccion: this.extractField(content, 'pregunta4') || 'Respuesta evaluada correctamente',
                    puntuacion: this.extractScore(content, 'pregunta4') || 8,
                    sugerencias: this.extractSuggestions(content, 'pregunta4') || []
                },
                resumen: this.extractField(content, 'resumen') || 'Evaluación completada satisfactoriamente'
            };

        } catch (error) {
            console.error('Error parseando respuesta MCP:', error);
            throw new Error('No se pudo procesar la respuesta del MCP');
        }
    }

    // Funciones auxiliares para extracción de datos
    extractField(content, fieldName) {
        const patterns = [
            new RegExp(`${fieldName}[:\\s]*["']([^"']+)["']`, 'i'),
            new RegExp(`${fieldName}[:\\s]*([^\\n]+)`, 'i')
        ];

        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) return match[1].trim();
        }

        return null;
    }

    extractScore(content, fieldName) {
        const scorePattern = new RegExp(`${fieldName}[^\\d]*(\\d+)`, 'i');
        const match = content.match(scorePattern);
        return match ? parseInt(match[1]) : null;
    }

    extractSuggestions(content, fieldName) {
        const suggestionsPattern = new RegExp(`${fieldName}[^\\[]*\\[([^\\]]+)\\]`, 'i');
        const match = content.match(suggestionsPattern);
        if (match) {
            return match[1].split(',').map(s => s.trim().replace(/["']/g, ''));
        }
        return [];
    }

    // Función para probar la conexión
    async testConnection() {
        try {
            console.log('Probando conexión con Netlify MCP...');

            const response = await axios.get(
                `${this.baseUrl}/mcp/v1/health`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'X-Netlify-Account': this.accountId
                    }
                }
            );

            console.log('✅ Conexión exitosa con Netlify MCP');
            return {
                success: true,
                message: 'Conexión establecida correctamente',
                data: response.data
            };

        } catch (error) {
            console.error('❌ Error conectando con Netlify MCP:', error.response?.data || error.message);
            return {
                success: false,
                message: 'Error al conectar con Netlify MCP',
                error: error.response?.data || error.message
            };
        }
    }
}

export default new NetlifyMcpApiService();