/**
 * Diagnóstico Completo del Webhook usando Context7 MCP
 *
 * Este script realiza un diagnóstico exhaustivo del webhook configurado
 * utilizando mejores prácticas de bibliotecas como Svix y httpx
 */

const axios = require('axios');

// Configuración desde variables de entorno
const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://n8n.srv1024767.hstgr.cloud/webhook-test/fbdc5d15-3435-42f9-8047-891869aa9f7e';
const FALLBACK_WEBHOOK_URL = process.env.FALLBACK_WEBHOOK_URL || '/.netlify/functions/test-webhook';
const TIMEOUT = process.env.WEBHOOK_TIMEOUT || 30000;
const DEBUG_MODE = process.env.DEBUG_MODE === 'true';

class WebhookDiagnostic {
    constructor() {
        this.url = WEBHOOK_URL;
        this.timeout = TIMEOUT;
        this.debug = DEBUG_MODE;
        this.results = {
            connectivity: {},
            performance: {},
            reliability: {},
            security: {},
            configuration: {}
        };
        this.testId = `diag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Método 1: Prueba básica de conectividad (inspirado en Svix)
    async testBasicConnectivity() {
        console.log(`🔍 [${this.testId}] Iniciando prueba básica de conectividad...`);

        const startTime = Date.now();
        try {
            const response = await axios.post(this.url, {
                type: 'health-check',
                timestamp: new Date().toISOString(),
                source: 'webhook-diagnostic',
                testId: this.testId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Instituto-Lidera-Diagnostic/1.0',
                    'X-Test-Type': 'connectivity'
                },
                timeout: this.timeout
            });

            const responseTime = Date.now() - startTime;

            this.results.connectivity = {
                success: true,
                status: response.status,
                statusText: response.statusText,
                responseTime: `${responseTime}ms`,
                server: response.headers?.server || 'unknown',
                contentType: response.headers?.['content-type'] || 'unknown',
                contentLength: JSON.stringify(response.data).length,
                headers: response.headers
            };

            console.log(`✅ [${this.testId}] Conectividad básica exitosa:`, {
                status: response.status,
                responseTime: `${responseTime}ms`,
                server: response.headers?.server
            });

            return this.results.connectivity;

        } catch (error) {
            const errorTime = Date.now();
            this.results.connectivity = {
                success: false,
                error: error.message,
                code: error.code,
                status: error.response?.status,
                responseTime: `${errorTime - startTime}ms`,
                url: this.url,
                timestamp: errorTime
            };

            this.analyzeConnectivityError(error);
            return this.results.connectivity;
        }
    }

    // Método 2: Análisis de rendimiento (inspirado en httpx)
    async testPerformance() {
        console.log(`⚡ [${this.testId}] Iniciando pruebas de rendimiento...`);

        const tests = [
            { name: 'small-payload', size: 1024 },
            { name: 'medium-payload', size: 10240 },
            { name: 'large-payload', size: 102400 }
        ];

        const performanceResults = [];

        for (const test of tests) {
            const payload = this.generateTestPayload(test.size);
            const startTime = Date.now();

            try {
                const response = await axios.post(this.url, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Test-Type': test.name
                    },
                    timeout: this.timeout
                });

                const responseTime = Date.now() - startTime;

                performanceResults.push({
                    test: test.name,
                    success: true,
                    responseTime: `${responseTime}ms`,
                    payloadSize: test.size,
                    status: response.status,
                    throughput: `${(test.size / (responseTime / 1000)).toFixed(2)} bytes/sec`
                });

            } catch (error) {
                performanceResults.push({
                    test: test.name,
                    success: false,
                    error: error.message,
                    responseTime: `${Date.now() - startTime}ms`,
                    payloadSize: test.size
                });
            }

            // Pequeña pausa entre pruebas
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        this.results.performance = {
            tests: performanceResults,
            averageResponseTime: this.calculateAverageResponseTime(performanceResults),
            throughput: this.calculateThroughput(performanceResults)
        };

        console.log(`⚡ [${this.testId}] Pruebas de rendimiento completadas`);
        return this.results.performance;
    }

    // Método 3: Prueba de fiabilidad con reintentos
    async testReliability() {
        console.log(`🔄 [${this.testId}] Iniciando pruebas de fiabilidad...`);

        const retryTests = [];
        const maxRetries = 3;

        for (let i = 0; i < 5; i++) {
            let attempt = 0;
            let success = false;
            let totalAttempts = 0;

            while (attempt <= maxRetries && !success) {
                attempt++;
                totalAttempts++;

                try {
                    const response = await axios.post(this.url, {
                        type: 'reliability-test',
                        testId: this.testId,
                        attempt: i + 1,
                        retryAttempt: attempt,
                        timestamp: new Date().toISOString()
                    }, {
                        headers: {
                            'X-Test-Number': i + 1,
                            'X-Retry-Attempt': attempt
                        },
                        timeout: this.timeout
                    });

                    success = true;
                    retryTests.push({
                        test: i + 1,
                        success: true,
                        attempts: attempt,
                        totalAttempts,
                        status: response.status
                    });

                } catch (error) {
                    if (attempt === maxRetries) {
                        retryTests.push({
                            test: i + 1,
                            success: false,
                            attempts: maxRetries,
                            totalAttempts,
                            error: error.message,
                            status: error.response?.status
                        });
                    }

                    // Exponential backoff
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
                }
            }
        }

        this.results.reliability = {
            tests: retryTests,
            successRate: `${(retryTests.filter(t => t.success).length / retryTests.length * 100).toFixed(1)}%`,
            averageAttempts: retryTests.reduce((sum, t) => sum + t.attempts, 0) / retryTests.length
        };

        console.log(`🔄 [${this.testId}] Pruebas de fiabilidad completadas`);
        return this.results.reliability;
    }

    // Método 4: Análisis de seguridad
    async testSecurity() {
        console.log(`🔒 [${this.testId}] Iniciando análisis de seguridad...`);

        const securityTests = [
            {
                name: 'https-check',
                url: this.url.startsWith('https://'),
                description: 'Verificar uso de HTTPS'
            },
            {
                name: 'authentication-test',
                test: async () => {
                    try {
                        const response = await axios.post(this.url, {
                            type: 'auth-test'
                        }, {
                            headers: {
                                'Authorization': 'Bearer invalid-token'
                            }
                        });
                        return { requiresAuth: false, status: response.status };
                    } catch (error) {
                        return {
                            requiresAuth: true,
                            status: error.response?.status,
                            authMethod: 'Bearer Token'
                        };
                    }
                }
            },
            {
                name: 'cors-test',
                test: async () => {
                    try {
                        const response = await axios.options(this.url);
                        return {
                            corsEnabled: true,
                            headers: response.headers
                        };
                    } catch (error) {
                        return {
                            corsEnabled: false,
                            error: error.message
                        };
                    }
                }
            }
        ];

        const securityResults = {};

        for (const test of securityTests) {
            if (typeof test.url !== 'undefined') {
                securityResults[test.name] = {
                    description: test.description,
                    result: test.url,
                    passed: test.url
                };
            } else if (typeof test.test === 'function') {
                try {
                    const result = await test.test();
                    securityResults[test.name] = {
                        description: test.description || 'Security test',
                        result,
                        passed: true
                    };
                } catch (error) {
                    securityResults[test.name] = {
                        description: test.description || 'Security test',
                        error: error.message,
                        passed: false
                    };
                }
            }
        }

        this.results.security = securityResults;
        console.log(`🔒 [${this.testId}] Análisis de seguridad completado`);
        return this.results.security;
    }

    // Método 5: Análisis de configuración
    analyzeConfiguration() {
        console.log(`⚙️ [${this.testId}] Analizando configuración...`);

        const config = {
            webhookUrl: this.url,
            timeout: this.timeout,
            debugMode: this.debug,
            environment: process.env.NODE_ENV || 'unknown',
            hasFallbackWebhook: !!FALLBACK_WEBHOOK_URL,
            fallbackWebhookUrl: FALLBACK_WEBHOOK_URL,
            timestamp: new Date().toISOString()
        };

        // Validaciones
        const validations = {
            hasValidUrl: this.url && this.url.startsWith('http'),
            hasHttps: this.url.startsWith('https://'),
            hasReasonableTimeout: this.timeout >= 5000 && this.timeout <= 60000,
            hasFallback: !!FALLBACK_WEBHOOK_URL,
            urlStructure: this.validateUrlStructure()
        };

        this.results.configuration = {
            config,
            validations,
            recommendations: this.generateRecommendations(validations)
        };

        console.log(`⚙️ [${this.testId}] Análisis de configuración completado`);
        return this.results.configuration;
    }

    // Método principal: ejecutar diagnóstico completo
    async runFullDiagnostic() {
        console.log(`🚀 [${this.testId}] Iniciando diagnóstico completo del webhook...`);
        console.log(`🚀 [${this.testId}] URL: ${this.url}`);
        console.log(`🚀 [${this.testId}] Timeout: ${this.timeout}ms`);

        const startTime = Date.now();

        try {
            // Ejecutar todas las pruebas en secuencia
            await this.testBasicConnectivity();
            await this.testPerformance();
            await this.testReliability();
            await this.testSecurity();
            this.analyzeConfiguration();

            const totalTime = Date.now() - startTime;

            // Generar reporte final
            const report = {
                testId: this.testId,
                timestamp: new Date().toISOString(),
                webhookUrl: this.url,
                totalTestTime: `${totalTime}ms`,
                overallStatus: this.calculateOverallStatus(),
                results: this.results,
                summary: this.generateSummary(),
                recommendations: this.generateRecommendations()
            };

            console.log(`✅ [${this.testId}] Diagnóstico completado en ${totalTime}ms`);
            console.log(`📊 [${this.testId}] Estado general: ${report.overallStatus}`);

            return report;

        } catch (error) {
            console.error(`❌ [${this.testId}] Error en diagnóstico:`, error);
            return {
                testId: this.testId,
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Métodos auxiliares
    generateTestPayload(size) {
        const data = {
            type: 'performance-test',
            testId: this.testId,
            timestamp: new Date().toISOString(),
            payload: 'x'.repeat(size - 200) // Ajustar tamaño del payload
        };
        return data;
    }

    calculateAverageResponseTime(tests) {
        const successfulTests = tests.filter(t => t.success && t.responseTime);
        if (successfulTests.length === 0) return 'N/A';

        const totalTime = successfulTests.reduce((sum, t) =>
            sum + parseInt(t.responseTime.replace('ms', '')), 0);
        return `${Math.round(totalTime / successfulTests.length)}ms`;
    }

    calculateThroughput(tests) {
        const successfulTests = tests.filter(t => t.success && t.throughput);
        if (successfulTests.length === 0) return 'N/A';

        const avgThroughput = successfulTests.reduce((sum, t) =>
            sum + parseFloat(t.throughput.replace(' bytes/sec', '')), 0) / successfulTests.length;
        return `${Math.round(avgThroughput)} bytes/sec`;
    }

    analyzeConnectivityError(error) {
        if (error.code === 'ECONNREFUSED') {
            this.results.connectivity.solution = 'El servidor no está respondiendo. Verifique que el servicio n8n esté activo.';
        } else if (error.code === 'ENOTFOUND') {
            this.results.connectivity.solution = 'No se puede resolver el dominio. Verifique la URL del webhook.';
        } else if (error.code === 'ETIMEDOUT') {
            this.results.connectivity.solution = 'El servidor tardó demasiado en responder. Aumente el timeout.';
        } else if (error.response?.status === 404) {
            this.results.connectivity.solution = 'El webhook no existe. Verifique la URL del webhook en n8n.';
        } else if (error.response?.status >= 500) {
            this.results.connectivity.solution = 'Error del servidor n8n. Contacte al administrador.';
        }
    }

    validateUrlStructure() {
        try {
            const url = new URL(this.url);
            return {
                valid: true,
                protocol: url.protocol,
                hostname: url.hostname,
                port: url.port,
                path: url.pathname
            };
        } catch (error) {
            return {
                valid: false,
                error: error.message
            };
        }
    }

    calculateOverallStatus() {
        const connectivity = this.results.connectivity?.success || false;
        const performance = this.results.performance?.tests?.some(t => t.success) || false;
        const reliability = this.results.reliability?.successRate?.includes('100') || false;

        if (connectivity && performance && reliability) {
            return 'HEALTHY';
        } else if (connectivity) {
            return 'DEGRADED';
        } else {
            return 'UNHEALTHY';
        }
    }

    generateSummary() {
        return {
            connectivity: this.results.connectivity?.success ? '✅ Conectividad OK' : '❌ Problemas de conectividad',
            performance: this.results.performance?.averageResponseTime || 'No medido',
            reliability: this.results.reliability?.successRate || 'No medido',
            security: this.results.security ? '✅ Analizado' : '❌ No analizado',
            configuration: this.results.configuration?.validations?.hasValidUrl ? '✅ Configuración OK' : '❌ Problemas de configuración'
        };
    }

    generateRecommendations(validations = null) {
        const recommendations = [];

        if (validations) {
            if (!validations.hasHttps) {
                recommendations.push('🔒 Usa HTTPS para mayor seguridad');
            }
            if (!validations.hasReasonableTimeout) {
                recommendations.push('⏱️ Ajusta el timeout a un valor razonable (5-60 segundos)');
            }
            if (!validations.hasFallback) {
                recommendations.push('🔄 Configura un webhook fallback para mayor fiabilidad');
            }
        }

        if (!this.results.connectivity?.success) {
            recommendations.push('🔧 Soluciona los problemas de conectividad antes de continuar');
        }

        if (this.results.performance?.averageResponseTime &&
            parseInt(this.results.performance.averageResponseTime) > 5000) {
            recommendations.push('⚡ Optimiza el rendimiento del webhook');
        }

        if (this.results.reliability?.successRate &&
            !this.results.reliability.successRate.includes('100')) {
            recommendations.push('🔄 Implementa mejor lógica de reintentos');
        }

        return recommendations;
    }
}

// Función para ejecutar diagnóstico
async function runWebhookDiagnostic() {
    const diagnostic = new WebhookDiagnostic();
    return await diagnostic.runFullDiagnostic();
}

module.exports = { WebhookDiagnostic, runWebhookDiagnostic };

// Si se ejecuta directamente
if (require.main === module) {
    runWebhookDiagnostic()
        .then(report => {
            console.log('\n📋 REPORTE FINAL DE DIAGNÓSTICO:');
            console.log('=====================================');
            console.log(JSON.stringify(report, null, 2));

            if (report.overallStatus === 'HEALTHY') {
                console.log('\n✅ El webhook está funcionando correctamente');
                process.exit(0);
            } else {
                console.log('\n⚠️ El webhook necesita atención');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('\n❌ Error fatal en diagnóstico:', error);
            process.exit(1);
        });
}