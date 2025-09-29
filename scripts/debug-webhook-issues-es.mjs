import axios from 'axios';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración
const WEBHOOK_URL = 'https://n8n.srv1024767.hstgr.cloud/webhook-test/fbdc5d15-3435-42f9-8047-891869aa9f7e';
const NETLIFY_FUNCTION_URL = 'https://pruebapresupuesto.netlify.app/.netlify/functions/send-corrections';

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testDirectWebhook() {
  log('🔍 Prueba 1: Conectividad directa con n8n webhook', 'cyan');

  const testData = {
    type: 'test-connection',
    timestamp: new Date().toISOString(),
    source: 'instituto-lidera-elearning-diagnostic',
    testId: `test-${Date.now()}`,
    message: 'Prueba de diagnóstico directa',
    debug: true
  };

  try {
    const response = await axios.post(WEBHOOK_URL, testData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Instituto-Lidera-Diagnostic/1.0',
        'X-Test-Request': 'true',
        'X-Request-ID': testData.testId
      },
      timeout: 30000
    });

    log('✅ Prueba directa exitosa:', 'green');
    log(`   Status: ${response.status} ${response.statusText}`, 'green');
    log(`   Response Time: ${Date.now() - new Date(testData.timestamp).getTime()}ms`, 'green');
    return { success: true, response: response.data };
  } catch (error) {
    log('❌ Prueba directa fallida:', 'red');
    log(`   Error: ${error.message}`, 'red');
    log(`   Code: ${error.code}`, 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    }
    return { success: false, error };
  }
}

async function testNetlifyFunction() {
  log('\n🔍 Prueba 2: Función Netlify send-corrections', 'cyan');

  const testPayload = {
    action: 'test-webhook',
    timestamp: new Date().toISOString(),
    source: 'diagnostic-test'
  };

  try {
    const response = await axios.post(NETLIFY_FUNCTION_URL, testPayload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Instituto-Lidera-Diagnostic/1.0'
      },
      timeout: 30000
    });

    log('✅ Función Netlify responde:', 'green');
    log(`   Status: ${response.status} ${response.statusText}`, 'green');
    log(`   Response: ${JSON.stringify(response.data, null, 2)}`, 'blue');
    return { success: true, response: response.data };
  } catch (error) {
    log('❌ Función Netlify fallida:', 'red');
    log(`   Error: ${error.message}`, 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    }
    return { success: false, error };
  }
}

async function testCompleteFlow() {
  log('\n🔍 Prueba 3: Flujo completo con datos de quiz', 'cyan');

  const quizData = {
    nombre: 'Pablo Cardona',
    email: 'pablocardonafeliu@gmail.com',
    userId: '83508eb3-e26e-4312-90f7-9a06901d4126',
    cuestionario_id: '1e9291a8-cc44-4d8c-bfbf-3aea525ed4fe',
    titulo_cuestionario: 'Cuestionario: Conceptos básicos de adicción',
    leccion_id: '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44',
    curso_id: 'b5ef8c64-fe26-4f20-8221-80a1bf475b05',
    puntuacion: 156,
    puntuacion_maxima: 1500,
    porcentaje: 10.4,
    aprobado: true,
    tiempo_transcurrido: 30,
    intento_numero: 1,
    fechaEnvio: new Date().toISOString(),
    userAnswers: {
      '26b8bf92-d7dc-4bbb-aeae-dea5f67171c8': {
        opcionId: 'b',
        esCorrecta: true,
        tiempoRespuesta: 2,
        textoRespuesta: 'La pérdida de control y uso compulsivo'
      }
    },
    respuestas_guardadas: {
      'ef41ccd8-113e-46ef-86fb-ef829131bc73': {
        es_correcta: true,
        tiempo_respuesta: 3
      }
    }
  };

  try {
    const response = await axios.post(NETLIFY_FUNCTION_URL, quizData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Instituto-Lidera-Diagnostic/1.0'
      },
      timeout: 30000
    });

    log('✅ Flujo completo exitoso:', 'green');
    log(`   Status: ${response.status} ${response.statusText}`, 'green');
    log(`   Email enviado: ${quizData.email}`, 'green');
    log(`   Response: ${JSON.stringify(response.data, null, 2)}`, 'blue');
    return { success: true, response: response.data };
  } catch (error) {
    log('❌ Flujo completo fallido:', 'red');
    log(`   Error: ${error.message}`, 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    }
    return { success: false, error };
  }
}

async function main() {
  log('🚀 Iniciando diagnóstico completo del webhook', 'magenta');
  log('==============================================', 'magenta');
  log(`Timestamp: ${new Date().toISOString()}`, 'cyan');
  log(`Webhook URL: ${WEBHOOK_URL}`, 'cyan');
  log(`Netlify Function: ${NETLIFY_FUNCTION_URL}`, 'cyan');

  const results = {
    directWebhook: await testDirectWebhook(),
    netlifyFunction: await testNetlifyFunction(),
    completeFlow: await testCompleteFlow()
  };

  // Análisis final
  log('\n📊 Análisis de Resultados', 'magenta');
  log('==============================================', 'magenta');

  if (results.directWebhook.success) {
    log('✅ El webhook de n8n es accesible y funcional', 'green');
  } else {
    log('❌ El webhook de n8n no responde', 'red');
    log('   - Verifica la URL del webhook', 'yellow');
    log('   - Verifica que n8n esté funcionando', 'yellow');
  }

  if (results.netlifyFunction.success) {
    log('✅ La función Netlify está operativa', 'green');
  } else {
    log('❌ La función Netlify no responde', 'red');
    log('   - Verifica el despliegue en Netlify', 'yellow');
    log('   - Revisa los logs de la función', 'yellow');
  }

  if (results.completeFlow.success) {
    log('✅ El flujo completo funciona correctamente', 'green');
    log('   - Los datos del cuestionario se envían correctamente', 'green');
    log('   - El webhook debería recibir el email del usuario', 'green');
  } else {
    log('❌ El flujo completo presenta problemas', 'red');
    log('   - Revisa el formato de los datos enviados', 'yellow');
    log('   - Verifica la validación en la función Netlify', 'yellow');
  }

  // Guardar resultados
  const report = {
    timestamp: new Date().toISOString(),
    webhookUrl: WEBHOOK_URL,
    netlifyFunctionUrl: NETLIFY_FUNCTION_URL,
    results: results,
    summary: {
      webhookWorking: results.directWebhook.success,
      netlifyWorking: results.netlifyFunction.success,
      flowWorking: results.completeFlow.success
    }
  };

  try {
    const reportPath = join(__dirname, 'webhook-diagnostic-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log(`\n📄 Reporte guardado en: ${reportPath}`, 'cyan');
  } catch (error) {
    log(`\n⚠️  No se pudo guardar el reporte: ${error.message}`, 'yellow');
  }

  log('\n🎯 Próximos Pasos', 'magenta');
  log('==============================================', 'magenta');

  if (results.completeFlow.success) {
    log('✅ Todo funciona correctamente. El problema debe estar en:', 'green');
    log('   - El frontend no está enviando los datos correctos', 'yellow');
    log('   - El usuario no está completando el cuestionario correctamente', 'yellow');
  } else {
    log('🔧 Revisa los siguientes aspectos:', 'yellow');
    log('   - Logs de Netlify Functions para errores detallados', 'yellow');
    log('   - Validación de datos en la función send-corrections', 'yellow');
    log('   - Formato del payload enviado desde el frontend', 'yellow');
  }
}

// Ejecutar diagnóstico
main().catch(error => {
  log(`\n💥 Error fatal en el diagnóstico: ${error.message}`, 'red');
  process.exit(1);
});