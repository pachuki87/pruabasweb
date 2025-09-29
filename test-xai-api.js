import axios from 'axios';
import 'dotenv/config';

// Configuración de la API de XAI GLM
const glmConfig = {
    apiKey: process.env.VITE_GLM_API_KEY || 'a09bfaae5e404dcba0ce8e1abaeb90fe.fln78t0JDEIvA8K5',
    baseUrl: process.env.VITE_GLM_API_URL || 'https://api.x.ai/v1/chat/completions',
    model: process.env.VITE_GLM_MODEL || 'grok-beta'
};

async function testXAIAPI() {
    console.log('🧪 Probando conexión con XAI GLM API...');
    console.log('📡 Configuración:', {
        baseUrl: glmConfig.baseUrl,
        model: glmConfig.model,
        apiKey: glmConfig.apiKey ? '***' + glmConfig.apiKey.slice(-10) : 'No configurada'
    });

    try {
        const response = await axios.post(
            glmConfig.baseUrl,
            {
                model: glmConfig.model,
                messages: [
                    {
                        role: 'system',
                        content: 'Eres un experto en psicología y adicciones.'
                    },
                    {
                        role: 'user',
                        content: 'Hola, ¿puedes confirmar que estás funcionando correctamente? Por favor responde brevemente.'
                    }
                ],
                max_tokens: 100,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${glmConfig.apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Conexión exitosa con XAI GLM API');
        console.log('📋 Respuesta:', response.data.choices[0].message.content);
        console.log('📊 Modelo usado:', response.data.model);
        console.log('🔄 Tokens usados:', response.data.usage?.total_tokens || 'No disponible');

        return {
            success: true,
            message: 'Conexión establecida correctamente',
            response: response.data.choices[0].message.content
        };

    } catch (error) {
        console.error('❌ Error conectando con XAI GLM API:');
        console.error('🚨 Status:', error.response?.status);
        console.error('📄 Error details:', error.response?.data);
        console.error('💬 Message:', error.message);

        return {
            success: false,
            message: 'Error al conectar con la API de XAI GLM',
            error: error.response?.data || error.message
        };
    }
}

async function testEvaluationPrompt() {
    console.log('\n📝 Probando evaluación de respuestas...');

    const testAnswers = {
        pregunta1: "Ser adicto significa tener una dependencia física o psicológica de alguna sustancia o actividad que afecta negativamente la vida diaria.",
        pregunta2: "Las consecuencias incluyen problemas de salud, deterioro de relaciones familiares, pérdida de empleo y problemas económicos.",
        pregunta3: "La familia es crucial para dar apoyo emocional y motivación para la recuperación.",
        pregunta4: "El mindfulness ayuda a las personas a ser más conscientes de sus pensamientos y emociones, lo que ayuda a controlar los impulsos adictivos."
    };

    const prompt = `
    Eres un experto en psicología y adicciones. Evalúa y proporciona retroalimentación constructiva sobre las siguientes respuestas:

    Pregunta 1: ¿Qué significa para usted ser adicto y cuáles considera que son las principales características de una conducta adictiva?
    Respuesta del estudiante: "${testAnswers.pregunta1}"

    Pregunta 2: Describa las principales consecuencias que las adicciones pueden tener en la vida de una persona y su entorno familiar.
    Respuesta del estudiante: "${testAnswers.pregunta2}"

    Por favor, proporciona una corrección detallada y una puntuación del 1 al 10 para cada respuesta.
    Responde en formato JSON con la siguiente estructura:
    {
        "pregunta1": {"correccion": "...", "puntuacion": 8, "sugerencias": ["...", "..."]},
        "pregunta2": {"correccion": "...", "puntuacion": 9, "sugerencias": ["...", "..."]},
        "resumen": "..."
    }
    `;

    try {
        const response = await axios.post(
            glmConfig.baseUrl,
            {
                model: glmConfig.model,
                messages: [
                    {
                        role: 'system',
                        content: 'Eres un experto en psicología y adicciones con amplia experiencia en evaluación educativa.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${glmConfig.apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Evaluación completada');
        console.log('📋 Respuesta de evaluación:');
        console.log(response.data.choices[0].message.content);

        return {
            success: true,
            evaluation: response.data.choices[0].message.content
        };

    } catch (error) {
        console.error('❌ Error en evaluación:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data || error.message
        };
    }
}

async function main() {
    console.log('🚀 Iniciando pruebas de XAI GLM API...\n');

    // Test 1: Conexión básica
    const connectionTest = await testXAIAPI();

    if (!connectionTest.success) {
        console.log('\n❌ Las pruebas no pueden continuar debido a errores de conexión.');
        return;
    }

    // Test 2: Evaluación de respuestas
    const evaluationTest = await testEvaluationPrompt();

    console.log('\n📊 Resumen de pruebas:');
    console.log(`✅ Conexión: ${connectionTest.success ? 'OK' : 'FALLÓ'}`);
    console.log(`✅ Evaluación: ${evaluationTest.success ? 'OK' : 'FALLÓ'}`);

    if (connectionTest.success && evaluationTest.success) {
        console.log('\n🎉 ¡Todas las pruebas pasaron! El sistema está listo para usar.');
    } else {
        console.log('\n⚠️  Algunas pruebas fallaron. Revisa la configuración.');
    }
}

// Ejecutar pruebas
main().catch(console.error);