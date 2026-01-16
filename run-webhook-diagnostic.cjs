/**
 * Ejecutor de diagnóstico de webhook
 *
 * Uso: node run-webhook-diagnostic.js [options]
 *
 * Options:
 *   --url <url>       URL personalizada del webhook
 *   --timeout <ms>    Timeout personalizado en milisegundos
 *   --debug           Modo debug activado
 *   --output <file>   Guardar resultado en archivo
 *   --summary         Mostrar solo resumen
 */

const { WebhookDiagnostic } = require('./webhook-diagnostic.cjs');

// Parsear argumentos de línea de comandos
const args = process.argv.slice(2);
const options = {
    url: null,
    timeout: null,
    debug: false,
    outputFile: null,
    summaryOnly: false
};

for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
        case '--url':
            options.url = args[++i];
            break;
        case '--timeout':
            options.timeout = parseInt(args[++i]);
            break;
        case '--debug':
            options.debug = true;
            break;
        case '--output':
            options.outputFile = args[++i];
            break;
        case '--summary':
            options.summaryOnly = true;
            break;
        case '--help':
        case '-h':
            console.log(`
Uso: node run-webhook-diagnostic.js [options]

Options:
  --url <url>       URL personalizada del webhook
  --timeout <ms>    Timeout personalizado en milisegundos (default: 30000)
  --debug           Modo debug activado
  --output <file>   Guardar resultado en archivo JSON
  --summary         Mostrar solo resumen ejecutivo
  --help, -h        Mostrar esta ayuda

Examples:
  node run-webhook-diagnostic.js
  node run-webhook-diagnostic.js --url https://my-webhook.example.com/test
  node run-webhook-diagnostic.js --debug --output report.json
  node run-webhook-diagnostic.js --summary
            `);
            process.exit(0);
    }
}

// Aplicar opciones al entorno si se especificaron
if (options.url) {
    process.env.N8N_WEBHOOK_URL = options.url;
}
if (options.timeout) {
    process.env.WEBHOOK_TIMEOUT = options.timeout;
}
if (options.debug) {
    process.env.DEBUG_MODE = 'true';
}

console.log('🚀 Iniciando diagnóstico de webhook...');
console.log('=====================================');

if (options.url) {
    console.log(`📡 URL: ${options.url}`);
}
if (options.timeout) {
    console.log(`⏱️ Timeout: ${options.timeout}ms`);
}
if (options.debug) {
    console.log(`🐛 Debug: ${options.debug}`);
}

console.log('');

// Ejecutar diagnóstico
async function main() {
    try {
        const diagnostic = new WebhookDiagnostic();

        if (options.url) {
            diagnostic.url = options.url;
        }
        if (options.timeout) {
            diagnostic.timeout = options.timeout;
        }
        if (options.debug) {
            diagnostic.debug = options.debug;
        }

        const report = await diagnostic.runFullDiagnostic();

        // Mostrar resultados
        if (options.summaryOnly) {
            console.log('\n📊 RESUMEN EJECUTIVO');
            console.log('====================');
            console.log(`Test ID: ${report.testId}`);
            console.log(`Estado General: ${report.overallStatus}`);
            console.log(`Tiempo Total: ${report.totalTestTime}`);
            console.log(`URL: ${report.webhookUrl}`);

            console.log('\n📈 Resultados:');
            Object.entries(report.summary).forEach(([key, value]) => {
                console.log(`  ${value}`);
            });

            if (report.recommendations && report.recommendations.length > 0) {
                console.log('\n💡 Recomendaciones:');
                report.recommendations.forEach(rec => console.log(`  ${rec}`));
            }
        } else {
            console.log('\n📋 REPORTE COMPLETO DE DIAGNÓSTICO');
            console.log('===================================');
            console.log(JSON.stringify(report, null, 2));
        }

        // Guardar en archivo si se especificó
        if (options.outputFile) {
            const fs = require('fs');
            fs.writeFileSync(options.outputFile, JSON.stringify(report, null, 2));
            console.log(`\n💾 Reporte guardado en: ${options.outputFile}`);
        }

        // Salir con código apropiado
        if (report.overallStatus === 'HEALTHY') {
            console.log('\n✅ El webhook está funcionando correctamente');
            process.exit(0);
        } else if (report.overallStatus === 'DEGRADED') {
            console.log('\n⚠️ El webhook funciona con limitaciones');
            process.exit(1);
        } else {
            console.log('\n❌ El webhook tiene problemas graves');
            process.exit(2);
        }

    } catch (error) {
        console.error('\n❌ Error fatal en diagnóstico:', error.message);

        if (options.debug) {
            console.error(error.stack);
        }

        process.exit(3);
    }
}

main();