#!/usr/bin/env node

/**
 * Script de diagnóstico para problemas de webhook con n8n
 *
 * Este script ayuda a identificar problemas de conectividad, configuración
 * y comunicación entre la aplicación web y el webhook de n8n.
 *
 * Uso: node debug-webhook-issues.js [options]
 */

const axios = require('axios');

// Configuración
const WEBHOOK_URL = 'https://n8n.srv1024767.hstgr.cloud/webhook/fbdc5d15-3435-42f9-8047-891869aa9f7e';
const NETLIFY_FUNCTION_URL = 'http://localhost:9000/.netlify/functions/send-corrections'; // Para testing local
const TIMEOUT = 30000;

// Colores para la consola
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    bright: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    log(`\n${'='.repeat(60)}`, 'cyan');
    log(`${title}`, 'bright');
    log(`${'='.repeat(60)}`, 'cyan');
}

async function testDirectWebhook() {
    logSection('1. Prueba Directa del Webhook n8n');

    const testPayload = {
        type: 'test-connection',
        timestamp: new Date().toISOString(),
        source: 'debug-script',
        testId: `debug-${Date.now()}`,
        message: 'Prueba de conectividad directa'
    };

    try {
        log(`Enviando prueba directa a: ${WEBHOOK_URL}`, 'blue');
        log(`Payload: ${JSON.stringify(testPayload, null, 2)}`, 'yellow');

        const startTime = Date.now();
        const response = await axios.post(WEBHOOK_URL, testPayload, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Debug-Script/1.0',
                'X-Debug-Test': 'true'
            },
            timeout: 15000
        });

        const responseTime = Date.now() - startTime;

        log(`✅ Prueba directa exitosa!`, 'green');
        log(`   Status: ${response.status} ${response.statusText}`, 'green');
        log(`   Response Time: ${responseTime}ms`, 'green');
        log(`   Response Data:`, 'cyan');
        log(JSON.stringify(response.data, null, 2), 'cyan');

        return {
            success: true,
            status: response.status,
            responseTime,
            data: response.data
        };

    } catch (error) {
        log(`❌ Error en prueba directa: ${error.message}`, 'red');

        // Análisis detallado del error
        if (error.code === 'ECONNREFUSED') {
            log(`   Tipo de error: Conexión rechazada`, 'yellow');
            log(`   Solución: Verificar que el servidor n8n esté activo`, 'yellow');
        } else if (error.code === 'ENOTFOUND') {
            log(`   Tipo de error: DNS no encontrado`, 'yellow');
            log(`   Solución: Verificar la URL del webhook`, 'yellow');
        } else if (error.code === 'ETIMEDOUT') {
            log(`   Tipo de error: Timeout`, 'yellow');
            log(`   Solución: El servidor no respondió a tiempo`, 'yellow');
        } else if (error.response) {
            log(`   Status HTTP: ${error.response.status}`, 'yellow');
            log(`   Response Data:`, 'yellow');
            log(JSON.stringify(error.response.data, null, 2), 'yellow');
        }

        return {
            success: false,
            error: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data
        };
    }
}

async function testNetlifyFunction() {
    logSection('2. Prueba de la Función de Netlify');

    const testPayload = {
        action: 'test-webhook'
    };

    try {
        log(`Enviando prueba a función Netlify...`, 'blue');

        const response = await fetch('/.netlify/functions/send-corrections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testPayload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            log(`✅ Prueba de función Netlify exitosa!`, 'green');
            log(`   Status: ${response.status}`, 'green');
            log(`   Response Time: ${result.responseTime || 'N/A'}ms`, 'green');
            if (result.n8nResponse) {
                log(`   n8n Response:`, 'cyan');
                log(JSON.stringify(result.n8nResponse, null, 2), 'cyan');
            }
            return { success: true, result };
        } else {
            log(`❌ Prueba de función Netlify fallida`, 'red');
            log(`   Status: ${response.status}`, 'red');
            log(`   Error: ${result.error || 'Unknown error'}`, 'red');
            if (result.errorSolution) {
                log(`   Solución: ${result.errorSolution}`, 'yellow');
            }
            return { success: false, result };
        }

    } catch (error) {
        log(`❌ Error en prueba de función Netlify: ${error.message}`, 'red');
        return { success: false, error: error.message };
    }
}

async function testFullWorkflow() {
    logSection('3. Prueba del Flujo Completo');

    const testQuizData = {
        nombre: 'Usuario de Prueba',
        email: 'test@example.com',
        quizData: {
            id: 'test-quiz-123',
            titulo: 'Cuestionario de Prueba',
            leccion_id: 'test-lesson-123',
            curso_id: 'test-course-123',
            preguntas: [
                {
                    id: 'q1',
                    pregunta: '¿Cuál es la capital de Francia?',
                    tipo: 'multiple_choice',
                    opciones_respuesta: [
                        { id: 'a', opcion: 'Madrid', es_correcta: false },
                        { id: 'b', opcion: 'París', es_correcta: true },
                        { id: 'c', opcion: 'Londres', es_correcta: false }
                    ]
                }
            ]
        },
        userAnswers: {
            'q1': {
                opcionId: 'b',
                esCorrecta: true,
                tiempoRespuesta: 5000,
                tipo: 'multiple_choice'
            }
        }
    };

    try {
        log(`Enviando datos de prueba completos...`, 'blue');
        log(`Tamaño del payload: ${JSON.stringify(testQuizData).length} bytes`, 'yellow');

        const response = await fetch('/.netlify/functions/send-corrections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testQuizData)
        });

        const result = await response.json();

        log(`Response Status: ${response.status}`, 'cyan');
        log(`Response Body:`, 'cyan');
        log(JSON.stringify(result, null, 2), 'cyan');

        if (response.ok && result.success) {
            log(`✅ Flujo completado exitosamente!`, 'green');
            log(`   Webhook Status: ${result.webhookStatus}`, 'green');
            if (result.performance) {
                log(`   Performance:`, 'cyan');
                log(`     - Attempts: ${result.performance.attempt || 1}`, 'cyan');
                log(`     - Response Time: ${result.performance.responseTime || 'N/A'}ms`, 'cyan');
                log(`     - Request ID: ${result.performance.requestId || 'N/A'}`, 'cyan');
            }
            return { success: true, result };
        } else {
            log(`❌ Flujo fallido`, 'red');
            log(`   Success: ${result.success}`, 'red');
            log(`   Webhook Status: ${result.webhookStatus}`, 'red');
            if (result.errorType) {
                log(`   Error Type: ${result.errorType}`, 'yellow');
            }
            if (result.errorSolution) {
                log(`   Solution: ${result.errorSolution}`, 'yellow');
            }
            return { success: false, result };
        }

    } catch (error) {
        log(`❌ Error en flujo completo: ${error.message}`, 'red');
        return { success: false, error: error.message };
    }
}

async function checkEnvironmentVariables() {
    logSection('4. Verificación de Variables de Entorno');

    const envVars = [
        'N8N_WEBHOOK_URL',
        'MAX_RETRIES',
        'WEBHOOK_TIMEOUT',
        'DEBUG_MODE'
    ];

    log('Variables de entorno relevantes:', 'blue');
    envVars.forEach(varName => {
        const value = process.env[varName];
        if (value) {
            log(`   ${varName}: ${value}`, 'green');
        } else {
            log(`   ${varName}: No configurada (usando valor por defecto)`, 'yellow');
        }
    });
}

async function generateReport() {
    logSection('5. Generando Reporte de Diagnóstico');

    const report = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        tests: {
            directWebhook: await testDirectWebhook(),
            netlifyFunction: await testNetlifyFunction(),
            fullWorkflow: await testFullWorkflow()
        },
        environmentVariables: {
            N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL || 'Not set',
            MAX_RETRIES: process.env.MAX_RETRIES || '3 (default)',
            WEBHOOK_TIMEOUT: process.env.WEBHOOK_TIMEOUT || '30000 (default)',
            DEBUG_MODE: process.env.DEBUG_MODE || 'false (default)'
        }
    };

    log('Reporte completo de diagnóstico:', 'cyan');
    log(JSON.stringify(report, null, 2), 'cyan');

    // Generar recomendaciones
    logSection('6. Recomendaciones');

    const recommendations = [];

    if (!report.tests.directWebhook.success) {
        recommendations.push({
            priority: 'HIGH',
            issue: 'Problema de conectividad directa con n8n',
            solution: 'Verificar que el servidor n8n esté activo y la URL sea correcta'
        });
    }

    if (!report.tests.netlifyFunction.success) {
        recommendations.push({
            priority: 'HIGH',
            issue: 'La función de Netlify no responde correctamente',
            solution: 'Verificar los logs de Netlify Functions y la configuración del despliegue'
        });
    }

    if (!report.tests.fullWorkflow.success) {
        recommendations.push({
            priority: 'MEDIUM',
            issue: 'El flujo completo está fallando',
            solution: 'Revisar el formato del payload y la lógica de procesamiento'
        });
    }

    if (report.tests.directWebhook.success && !report.tests.fullWorkflow.success) {
        recommendations.push({
            priority: 'MEDIUM',
            issue: 'El webhook funciona pero el flujo no',
            solution: 'Revisar la lógica de la función Netlify y el formato del payload'
        });
    }

    if (recommendations.length === 0) {
        log('✅ Todas las pruebas pasaron correctamente!', 'green');
    } else {
        recommendations.forEach((rec, index) => {
            log(`${index + 1}. [${rec.priority}] ${rec.issue}`, 'yellow');
            log(`   Solución: ${rec.solution}`, 'cyan');
        });
    }

    return report;
}

// Función principal
async function main() {
    log('🔍 Iniciando Diagnóstico de Webhook n8n', 'bright');
    log(`Fecha: ${new Date().toLocaleString()}`, 'cyan');
    log(`Node.js: ${process.version}`, 'cyan');

    try {
        await checkEnvironmentVariables();
        const report = await generateReport();

        // Guardar reporte en archivo
        const fs = require('fs');
        const reportFile = `webhook-diagnostic-${Date.now()}.json`;
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        log(`\nReporte guardado en: ${reportFile}`, 'green');

        log('\n🎯 Diagnóstico completado!', 'bright');

    } catch (error) {
        log(`\n❌ Error en diagnóstico: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Ejecutar diagnóstico
if (require.main === module) {
    main();
}

module.exports = {
    testDirectWebhook,
    testNetlifyFunction,
    testFullWorkflow,
    checkEnvironmentVariables,
    generateReport
};