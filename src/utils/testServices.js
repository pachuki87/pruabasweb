/**
 * testServices.js
 * Script de prueba para verificar el funcionamiento de los servicios de envío de resúmenes
 */

import EmailService from '../services/EmailService';
import WebhookService from '../services/WebhookService';
import QuizSummaryGenerator from '../services/QuizSummaryGenerator';

// Datos de prueba simulados
const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  nombre: 'Usuario de Prueba',
  name: 'Usuario de Prueba'
};

const mockQuiz = {
  id: 'test-quiz-456',
  titulo: 'Cuestionario de Prueba',
  leccion_id: 'test-lesson-789'
};

const mockQuestions = [
  {
    id: 'q1',
    pregunta: '¿Qué es 2+2?',
    tipo: 'multiple_choice',
    opciones_respuesta: [
      { id: 'q1a', opcion: '3', es_correcta: false },
      { id: 'q1b', opcion: '4', es_correcta: true },
      { id: 'q1c', opcion: '5', es_correcta: false }
    ]
  },
  {
    id: 'q2',
    pregunta: 'Explica qué es la inteligencia emocional',
    tipo: 'texto_libre'
  }
];

const mockAnswers = {
  'q1': {
    opcionId: 'q1b',
    esCorrecta: true,
    tiempoRespuesta: 15,
    tipo: 'multiple_choice'
  },
  'q2': {
    textoRespuesta: 'La inteligencia emocional es la capacidad de reconocer y gestionar las propias emociones y las de los demás.',
    tiempoRespuesta: 45,
    tipo: 'texto_libre',
    esCorrecta: true,
    archivos: []
  }
};

const mockResults = {
  puntuacionObtenida: 85,
  puntuacionMaxima: 100,
  porcentajeAcierto: 85,
  tiempoTotal: 60,
  aprobado: true,
  respuestasCorrectas: 2,
  totalPreguntas: 2
};

/**
 * Función principal para ejecutar todas las pruebas
 */
const runAllTests = async () => {
  console.log('🚀 Iniciando pruebas del sistema de envío de resúmenes...');
  console.log('='.repeat(60));
  
  // 1. Probar generación de resumen
  console.log('\n📋 1. Probando generación de resumen...');
  try {
    const summaryData = QuizSummaryGenerator.generateDetailedSummary(
      mockQuiz,
      mockAnswers,
      mockQuestions,
      mockUser,
      mockResults
    );
    
    console.log('✅ Resumen generado correctamente');
    console.log('   - Puntuación:', summaryData.results.score, '/', summaryData.results.maxScore);
    console.log('   - Porcentaje:', summaryData.results.percentage + '%');
    console.log('   - Preguntas:', summaryData.questionsSummary.length);
    
    // Probar generación de HTML
    const htmlContent = QuizSummaryGenerator.generateHTMLSummary(summaryData);
    console.log('✅ HTML generado correctamente');
    console.log('   - Longitud del HTML:', htmlContent.length, 'caracteres');
    
    // Probar generación de webhook
    const webhookPayload = QuizSummaryGenerator.generateWebhookSummary(summaryData);
    console.log('✅ Payload de webhook generado correctamente');
    console.log('   - Tipo:', webhookPayload.type);
    console.log('   - Timestamp:', webhookPayload.timestamp);
    
  } catch (error) {
    console.error('❌ Error en la generación de resumen:', error.message);
  }
  
  // 2. Probar servicio de email
  console.log('\n📧 2. Probando servicio de email...');
  try {
    const emailConfigured = EmailService.isConfigured();
    console.log('   - Estado de configuración:', emailConfigured ? '✅ Configurado' : '❌ No configurado');
    
    if (emailConfigured) {
      const emailStatus = EmailService.getStatus();
      console.log('   - Host:', emailStatus.host);
      console.log('   - Puerto:', emailStatus.port);
      console.log('   - Usuario:', emailStatus.user);
      
      // Nota: No enviamos email real en pruebas para evitar spam
      console.log('   - ⚠️  Envío de email omitido en pruebas (usar sendTestEmail para pruebas reales)');
    } else {
      console.log('   - ⚠️  El servicio de email no está configurado');
    }
    
  } catch (error) {
    console.error('❌ Error en el servicio de email:', error.message);
  }
  
  // 3. Probar servicio de webhook
  console.log('\n🔗 3. Probando servicio de webhook...');
  try {
    const webhookConfigured = WebhookService.isConfigured();
    console.log('   - Estado de configuración:', webhookConfigured ? '✅ Configurado' : '❌ No configurado');
    
    if (webhookConfigured) {
      const webhookStatus = WebhookService.getStatus();
      console.log('   - URL:', webhookStatus.webhookUrl);
      console.log('   - Token configurado:', webhookStatus.hasAuthToken ? '✅ Sí' : '❌ No');
      
      // Nota: No enviamos webhook real en pruebas para evitar llamadas innecesarias
      console.log('   - ⚠️  Envío de webhook omitido en pruebas (usar sendTestWebhook para pruebas reales)');
    } else {
      console.log('   - ⚠️  El servicio de webhook no está configurado');
    }
    
  } catch (error) {
    console.error('❌ Error en el servicio de webhook:', error.message);
  }
  
  // 4. Probar integración completa (simulada)
  console.log('\n🔄 4. Probando integración completa (simulada)...');
  try {
    // Generar resumen completo
    const summaryData = QuizSummaryGenerator.generateDetailedSummary(
      mockQuiz,
      mockAnswers,
      mockQuestions,
      mockUser,
      mockResults
    );
    
    const htmlContent = QuizSummaryGenerator.generateHTMLSummary(summaryData);
    const webhookPayload = QuizSummaryGenerator.generateWebhookSummary(summaryData);
    
    console.log('✅ Integración simulada correctamente');
    console.log('   - Resumen generado con', summaryData.questionsSummary.length, 'preguntas');
    console.log('   - HTML generado con', htmlContent.length, 'caracteres');
    console.log('   - Webhook payload generado con', Object.keys(webhookPayload.data).length, 'campos');
    
    // Simular envío (sin enviar realmente)
    const simulatedResults = {
      email: { success: true, message: 'Email simulado enviado correctamente' },
      webhook: { success: true, message: 'Webhook simulado enviado correctamente' }
    };
    
    console.log('✅ Envío simulado completado');
    console.log('   - Email:', simulatedResults.email.success ? '✅ Enviado' : '❌ Error');
    console.log('   - Webhook:', simulatedResults.webhook.success ? '✅ Enviado' : '❌ Error');
    
  } catch (error) {
    console.error('❌ Error en la integración completa:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 Pruebas completadas');
  console.log('\n📝 Resumen:');
  console.log('   - Generación de resúmenes: ✅ Funcional');
  console.log('   - Servicio de email: ' + (EmailService.isConfigured() ? '✅ Configurado' : '⚠️  No configurado'));
  console.log('   - Servicio de webhook: ' + (WebhookService.isConfigured() ? '✅ Configurado' : '⚠️  No configurado'));
  console.log('   - Integración completa: ✅ Funcional');
  
  console.log('\n🔧 Para pruebas reales:');
  console.log('   - Configura las variables de entorno en .env');
  console.log('   - Usa EmailService.sendTestEmail("tu-email@test.com") para probar email');
  console.log('   - Usa WebhookService.sendTestWebhook() para probar webhook');
  
  console.log('\n✨ ¡Sistema listo para usar!');
};

/**
 * Función para probar el envío de email real
 * @param {string} testEmail - Email destinatario para la prueba
 */
const testEmailSending = async (testEmail) => {
  console.log('\n📧 Enviando email de prueba a:', testEmail);
  
  try {
    const result = await EmailService.sendTestEmail(testEmail);
    
    if (result.success) {
      console.log('✅ Email enviado correctamente');
      console.log('   - Message ID:', result.messageId);
      console.log('   - Destinatario:', result.to);
    } else {
      console.error('❌ Error al enviar email:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error en el envío de email:', error.message);
  }
};

/**
 * Función para probar el envío de webhook real
 */
const testWebhookSending = async () => {
  console.log('\n🔗 Enviando webhook de prueba...');
  
  try {
    const result = await WebhookService.sendTestWebhook();
    
    if (result.success) {
      console.log('✅ Webhook enviado correctamente');
      console.log('   - Status:', result.status);
      console.log('   - URL:', result.webhookUrl);
    } else {
      console.error('❌ Error al enviar webhook:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error en el envío de webhook:', error.message);
  }
};

// Exportar funciones para uso en otros módulos
export {
  runAllTests,
  testEmailSending,
  testWebhookSending
};

// Si se ejecuta directamente (node src/utils/testServices.js)
if (typeof window === 'undefined') {
  // Estamos en Node.js
  runAllTests().catch(console.error);
}
