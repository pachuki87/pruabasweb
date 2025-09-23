import axios from 'axios';
import 'dotenv/config';

// Configuración de la API de Netlify MCP
const mcpConfig = {
    apiKey: process.env.VITE_NETLIFY_MCP_API_KEY || 'nfp_rVfRcr4gHR1s3jjq9b5ujYCHcGiqNqpkc9e4',
    baseUrl: process.env.VITE_NETLIFY_MCP_URL || 'https://api.netlify.com/api/v1',
    accountId: process.env.VITE_NETLIFY_ACCOUNT_ID
};

async function testNetlifyMCPConnection() {
    console.log('🧪 Probando conexión con Netlify MCP API...');
    console.log('📡 Configuración:', {
        baseUrl: mcpConfig.baseUrl,
        apiKey: mcpConfig.apiKey ? '***' + mcpConfig.apiKey.slice(-10) : 'No configurada',
        accountId: mcpConfig.accountId || 'No configurado'
    });

    try {
        // Test 1: Health check
        console.log('\n📋 Test 1: Health Check');
        const healthResponse = await axios.get(
            `${mcpConfig.baseUrl}/mcp/v1/health`,
            {
                headers: {
                    'Authorization': `Bearer ${mcpConfig.apiKey}`,
                    'Content-Type': 'application/json',
                    ...(mcpConfig.accountId && { 'X-Netlify-Account': mcpConfig.accountId })
                }
            }
        );

        console.log('✅ Health check exitoso');
        console.log('📋 Respuesta:', healthResponse.data);

        return {
            success: true,
            message: 'Conexión establecida correctamente',
            data: healthResponse.data
        };

    } catch (error) {
        console.error('❌ Error en health check:', error.response?.data || error.message);

        // Intentar con endpoints alternativos
        console.log('\n🔄 Intentando endpoints alternativos...');

        const endpoints = [
            '/mcp/v1/ping',
            '/api/v1/mcp/v1/status',
            '/mcp/status'
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await axios.get(
                    `${mcpConfig.baseUrl}${endpoint}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${mcpConfig.apiKey}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log(`✅ Endpoint alternativo funcionando: ${endpoint}`);
                console.log('📋 Respuesta:', response.data);

                return {
                    success: true,
                    message: `Conexión establecida vía endpoint alternativo: ${endpoint}`,
                    data: response.data
                };

            } catch (endpointError) {
                console.log(`❌ Endpoint ${endpoint} falló:`, endpointError.response?.status || endpointError.message);
            }
        }

        return {
            success: false,
            message: 'No se pudo establecer conexión con ningún endpoint',
            error: error.response?.data || error.message
        };
    }
}

async function testMCPFormSubmission() {
    console.log('\n📝 Test 2: Envío de formulario a MCP');

    const testFormData = {
        nombre: 'Juan Pérez',
        email: 'juan.perez@ejemplo.com',
        pregunta1: 'Ser adicto significa tener una dependencia física o psicológica de sustancias o actividades que afectan negativamente la vida.',
        pregunta2: 'Las consecuencias incluyen problemas de salud, deterioro de relaciones, problemas laborales y económicos.',
        pregunta3: 'La familia es fundamental para dar apoyo emocional y motivación en el proceso de recuperación.',
        pregunta4: 'El mindfulness ayuda a tomar conciencia de los pensamientos y emociones para controlar impulsos adictivos.'
    };

    try {
        const payload = {
            type: 'form_submission',
            data: {
                formName: 'preguntas-abiertas-mcp',
                timestamp: new Date().toISOString(),
                userData: {
                    nombre: testFormData.nombre,
                    email: testFormData.email
                },
                answers: {
                    pregunta1: testFormData.pregunta1,
                    pregunta2: testFormData.pregunta2,
                    pregunta3: testFormData.pregunta3,
                    pregunta4: testFormData.pregunta4
                },
                metadata: {
                    source: 'instituto-lidera-mcp-test',
                    version: '1.0.0'
                }
            }
        };

        const response = await axios.post(
            `${mcpConfig.baseUrl}/mcp/v1/forms/submit`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${mcpConfig.apiKey}`,
                    'Content-Type': 'application/json',
                    ...(mcpConfig.accountId && { 'X-Netlify-Account': mcpConfig.accountId })
                }
            }
        );

        console.log('✅ Formulario enviado exitosamente a MCP');
        console.log('📋 Respuesta:', response.data);

        return {
            success: true,
            message: 'Formulario enviado correctamente',
            data: response.data
        };

    } catch (error) {
        console.error('❌ Error enviando formulario:', error.response?.data || error.message);
        return {
            success: false,
            message: 'Error al enviar formulario',
            error: error.response?.data || error.message
        };
    }
}

async function testMCPAIProcessing() {
    console.log('\n🤖 Test 3: Procesamiento con IA vía MCP');

    const testAnswers = {
        pregunta1: 'Ser adicto significa tener una dependencia compulsiva que afecta la vida diaria.',
        pregunta2: 'Las adicciones causan problemas de salud, familiares y sociales.',
        pregunta3: 'La familia da apoyo emocional para la recuperación.',
        pregunta4: 'El mindfulness ayuda a controlar impulsos through conciencia plena.'
    };

    try {
        const payload = {
            type: 'ai_processing',
            task: 'evaluate_answers',
            data: {
                subject: 'psicologia_adicciones',
                answers: testAnswers,
                evaluationCriteria: {
                    content: true,
                    structure: true,
                    accuracy: true,
                    completeness: true
                }
            }
        };

        const response = await axios.post(
            `${mcpConfig.baseUrl}/mcp/v1/ai/process`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${mcpConfig.apiKey}`,
                    'Content-Type': 'application/json',
                    ...(mcpConfig.accountId && { 'X-Netlify-Account': mcpConfig.accountId })
                }
            }
        );

        console.log('✅ Procesamiento IA completado vía MCP');
        console.log('📋 Respuesta:', response.data);

        return {
            success: true,
            message: 'Procesamiento IA completado',
            data: response.data
        };

    } catch (error) {
        console.error('❌ Error en procesamiento IA:', error.response?.data || error.message);
        return {
            success: false,
            message: 'Error en procesamiento IA',
            error: error.response?.data || error.message
        };
    }
}

async function testMCPDataStorage() {
    console.log('\n💾 Test 4: Almacenamiento de datos en MCP');

    const testData = {
        nombre: 'María García',
        email: 'maria.garcia@ejemplo.com',
        timestamp: new Date().toISOString(),
        evaluation: {
            pregunta1: { puntuacion: 8, correccion: 'Buena respuesta' },
            pregunta2: { puntuacion: 9, correccion: 'Excelente análisis' },
            resumen: 'Desempeño general bueno'
        }
    };

    try {
        const payload = {
            type: 'data_store',
            collection: 'form_submissions',
            data: {
                ...testData,
                processedAt: new Date().toISOString(),
                status: 'processed'
            }
        };

        const response = await axios.post(
            `${mcpConfig.baseUrl}/mcp/v1/data/store`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${mcpConfig.apiKey}`,
                    'Content-Type': 'application/json',
                    ...(mcpConfig.accountId && { 'X-Netlify-Account': mcpConfig.accountId })
                }
            }
        );

        console.log('✅ Datos almacenados exitosamente en MCP');
        console.log('📋 Respuesta:', response.data);

        return {
            success: true,
            message: 'Datos almacenados correctamente',
            data: response.data
        };

    } catch (error) {
        console.error('❌ Error almacenando datos:', error.response?.data || error.message);
        return {
            success: false,
            message: 'Error al almacenar datos',
            error: error.response?.data || error.message
        };
    }
}

async function testMCPEmail() {
    console.log('\n📧 Test 5: Envío de correo vía MCP');

    try {
        const payload = {
            type: 'email_send',
            data: {
                to: 'test@ejemplo.com',
                subject: 'Test de correo desde Netlify MCP',
                html: `
                    <h1>Test de Correo</h1>
                    <p>Este es un correo de prueba enviado desde Netlify MCP.</p>
                    <p>Timestamp: ${new Date().toISOString()}</p>
                `,
                from: 'test@institutolidera.com'
            }
        };

        const response = await axios.post(
            `${mcpConfig.baseUrl}/mcp/v1/email/send`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${mcpConfig.apiKey}`,
                    'Content-Type': 'application/json',
                    ...(mcpConfig.accountId && { 'X-Netlify-Account': mcpConfig.accountId })
                }
            }
        );

        console.log('✅ Correo enviado exitosamente vía MCP');
        console.log('📋 Respuesta:', response.data);

        return {
            success: true,
            message: 'Correo enviado correctamente',
            data: response.data
        };

    } catch (error) {
        console.error('❌ Error enviando correo:', error.response?.data || error.message);
        return {
            success: false,
            message: 'Error al enviar correo',
            error: error.response?.data || error.message
        };
    }
}

async function main() {
    console.log('🚀 Iniciando pruebas de Netlify MCP API...\n');

    const results = {
        connection: await testNetlifyMCPConnection(),
        formSubmission: await testMCPFormSubmission(),
        aiProcessing: await testMCPAIProcessing(),
        dataStorage: await testMCPDataStorage(),
        email: await testMCPEmail()
    };

    console.log('\n📊 Resumen de pruebas:');
    console.log('====================');

    Object.entries(results).forEach(([test, result]) => {
        const status = result.success ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} ${test.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${result.message}`);
    });

    const passedTests = Object.values(results).filter(r => r.success).length;
    const totalTests = Object.keys(results).length;

    console.log(`\n🎯 Resultado: ${passedTests}/${totalTests} pruebas pasadas`);

    if (passedTests === totalTests) {
        console.log('🎉 ¡Todas las pruebas pasaron! El sistema Netlify MCP está funcionando correctamente.');
    } else if (passedTests > 0) {
        console.log('⚠️  Algunas pruebas pasaron. El sistema está parcialmente funcional.');
    } else {
        console.log('❌ Ninguna prueba pasó. Revisa la configuración de Netlify MCP.');
    }

    console.log('\n📝 Próximos pasos:');
    console.log('1. Verifica las variables de entorno en Netlify dashboard');
    console.log('2. Configura las funciones MCP en tu sitio Netlify');
    console.log('3. Prueba el formulario: formulario-mcp-integrado.html');
}

// Ejecutar pruebas
main().catch(console.error);