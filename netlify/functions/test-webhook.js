// Webhook de prueba local para simular n8n
// Este webhook recibe los datos del cuestionario y los procesa localmente

exports.handler = async (event, context) => {
    console.log('🧪 Webhook de prueba local activado');
    console.log('Método HTTP:', event.httpMethod);
    console.log('Headers:', JSON.stringify(event.headers, null, 2));

    try {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                body: JSON.stringify({ 
                    error: 'Método no permitido',
                    allowedMethods: ['POST']
                })
            };
        }

        // Manejar preflight CORS
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                body: ''
            };
        }

        let data;
        try {
            data = JSON.parse(event.body);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: false,
                    error: 'JSON inválido',
                    details: parseError.message
                })
            };
        }

        console.log('📋 Datos recibidos en webhook de prueba:', JSON.stringify(data, null, 2));

        // Simular procesamiento de datos del cuestionario
        const processedData = {
            receivedAt: new Date().toISOString(),
            dataType: data.type || 'quiz-responses',
            studentInfo: data.studentInfo || {
                name: data.nombre || 'Estudiante de prueba',
                email: data.email || 'test@example.com'
            },
            quizInfo: data.quizInfo || {
                title: data.quizData?.titulo || 'Cuestionario de prueba',
                totalQuestions: data.quizData?.preguntas?.length || 0,
                score: data.results?.score || 0
            },
            responses: data.responses || [],
            rawDataSize: JSON.stringify(data).length,
            processingStatus: 'success'
        };

        // Simular tiempo de procesamiento
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('✅ Datos procesados exitosamente en webhook de prueba');
        console.log('📊 Resumen del procesamiento:', processedData);

        // Simular respuesta exitosa de n8n
        const response = {
            success: true,
            message: 'Datos recibidos y procesados correctamente por webhook de prueba',
            timestamp: new Date().toISOString(),
            webhookId: 'test-webhook-local',
            processedData: processedData,
            nextSteps: [
                'Datos guardados en sistema de prueba',
                'Email de confirmación simulado',
                'Correcciones IA generadas (simulado)'
            ]
        };

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify(response)
        };

    } catch (error) {
        console.error('❌ Error en webhook de prueba:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                error: 'Error interno del webhook de prueba',
                details: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};