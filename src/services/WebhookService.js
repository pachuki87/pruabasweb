/**
 * WebhookService.js
 * Servicio para enviar resúmenes de cuestionarios a webhooks
 *
 * NOTA: Este servicio está temporalmente deshabilitado.
 * El chatbot ahora usa directamente n8n webhooks.
 */

// import axios from 'axios';

/*
class WebhookService {
  constructor() {
    this.webhookUrl = process.env.WEBHOOK_URL || '';
    this.authToken = process.env.WEBHOOK_AUTH_TOKEN || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': 'Instituto-Lidera-Webhook-Client/1.0'
    };

    // Crear instancia dedicada de axios para webhooks
    this.axiosInstance = axios.create({
      timeout: 30000,
      headers: this.defaultHeaders
    });

    // Configurar interceptor para logging solo para esta instancia
    this.setupInterceptors();

    // Métricas básicas
    this.metrics = {
      sent: 0,
      successful: 0,
      failed: 0,
      retries: 0,
      corsErrors: 0,
      proxyRequests: 0,
      directIPRequests: 0,
      tunnelRequests: 0,
      hostnameRequests: 0
    };

    // Configuración CORS
    this.corsOptions = {
      enabled: process.env.CORS_ENABLED !== 'false', // Habilitado por defecto
      useProxy: process.env.CORS_USE_PROXY !== 'false', // Usar proxy por defecto
      proxyUrls: [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/'
      ],
      currentProxyIndex: 0,
      noCorsMode: false
    };

    // Configuración del servidor n8n
    this.serverOptions = {
      hostname: 'srv1024767.hstgr.cloud',
      directIP: '72.60.130.27',
      useDirectIP: process.env.USE_DIRECT_IP === 'true',
      n8nTunnelUrl: process.env.N8N_TUNNEL_URL || '',
      strategyOrder: ['hostname', 'directIP', 'proxy', 'tunnel'],
      currentStrategy: 'hostname',
      strategiesTried: []
    };
  }
*/

  /*
  setupInterceptors() {
    // Interceptor para request
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log('Enviando webhook:', {
          url: config.url,
          method: config.method,
          data: config.data
        });
        return config;
      },
      (error) => {
        console.error('Error en request de webhook:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para response
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log('Webhook enviado exitosamente:', {
          url: response.config.url,
          status: response.status,
          statusText: response.statusText
        });
        return response;
      },
      (error) => {
        console.error('Error en response de webhook:', {
          url: error.config?.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message
        });
        return Promise.reject(error);
      }
    );
  }

  sendQuizWebhook(payload, options = {}) {
    // MÉTODO COMPLETO COMENTADO - EL CHATBOT USA DIRECTAMENTE n8n webhooks
    console.log('WebhookService está deshabilitado. El chatbot usa n8n webhooks directamente.');
    return Promise.resolve({
      success: false,
      error: 'WebhookService temporalmente deshabilitado',
      timestamp: new Date().toISOString()
    });
  }

  sendDirectWebhook(payload, options = {}) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado. El chatbot usa n8n webhooks directamente.');
    return Promise.resolve({
      success: false,
      error: 'WebhookService temporalmente deshabilitado',
      timestamp: new Date().toISOString()
    });
  }

  sendProxyWebhook(payload, options = {}) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado. El chatbot usa n8n webhooks directamente.');
    return Promise.resolve({
      success: false,
      error: 'WebhookService temporalmente deshabilitado',
      timestamp: new Date().toISOString()
    });
  }

  sendWithRetry(payload, retryOptions = {}) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado. El chatbot usa n8n webhooks directamente.');
    return Promise.resolve({
      success: false,
      error: 'WebhookService temporalmente deshabilitado',
      timestamp: new Date().toISOString()
    });
  }

  sendToMultipleWebhooks(webhookUrls, payload) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado. El chatbot usa n8n webhooks directamente.');
    return Promise.resolve([]);
  }

  sendTestWebhook(testUrl = null) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado. El chatbot usa n8n webhooks directamente.');
    return Promise.resolve({
      success: false,
      error: 'WebhookService temporalmente deshabilitado',
      timestamp: new Date().toISOString()
    });
  }

  getHeaders(additionalHeaders = {}) {
    // MÉTODO COMPLETO COMENTADO
    return { ...this.defaultHeaders, ...additionalHeaders };
  }

  getErrorDetails(error) {
    // MÉTODO COMPLETO COMENTADO
    const details = {
      message: error.message,
      code: error.code,
      stack: error.stack
    };
    return details;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isConfigured() {
    // MÉTODO COMPLETO COMENTADO
    return false;
  }

  getStatus() {
    // MÉTODO COMPLETO COMENTADO
    return {
      configured: false,
      webhookUrl: 'Deshabilitado',
      hasAuthToken: false,
      defaultHeaders: {}
    };
  }

  setWebhookUrl(newUrl) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado.');
  }

  setAuthToken(newToken) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado.');
  }

  validateWebhookUrl(url) {
    // MÉTODO COMPLETO COMENTADO
    return false;
  }

  sendAsync(payload) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado. El chatbot usa n8n webhooks directamente.');
  }

  validatePayload(payload) {
    // MÉTODO COMPLETO COMENTADO
    return false;
  }

  isRetryableError(error) {
    // MÉTODO COMPLETO COMENTADO
    return false;
  }

  sendChatbotMessage(message, context = {}) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado. El chatbot usa n8n webhooks directamente.');
    return Promise.resolve({
      success: false,
      error: 'WebhookService temporalmente deshabilitado',
      timestamp: new Date().toISOString()
    });
  }

  sendChatbotEvent(eventType, eventData = {}) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado. El chatbot usa n8n webhooks directamente.');
    return Promise.resolve({
      success: false,
      error: 'WebhookService temporalmente deshabilitado',
      timestamp: new Date().toISOString()
    });
  }

  sendChatbotStatus(status, statusData = {}) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado. El chatbot usa n8n webhooks directamente.');
    return Promise.resolve({
      success: false,
      error: 'WebhookService temporalmente deshabilitado',
      timestamp: new Date().toISOString()
    });
  }

  getMetrics() {
    // MÉTODO COMPLETO COMENTADO
    return { ...this.metrics };
  }

  resetMetrics() {
    // MÉTODO COMPLETO COMENTADO
    this.metrics = {
      sent: 0,
      successful: 0,
      failed: 0,
      retries: 0,
      corsErrors: 0,
      proxyRequests: 0,
      directIPRequests: 0,
      tunnelRequests: 0,
      hostnameRequests: 0
    };
  }

  isCORSError(result) {
    // MÉTODO COMPLETO COMENTADO
    return false;
  }

  getProxyUrl(proxyUrl, targetUrl) {
    // MÉTODO COMPLETO COMENTADO
    return '';
  }

  enableCORSMode(useProxy = true) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado.');
  }

  disableCORSMode() {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado.');
  }

  enableNoCorsMode() {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado.');
  }

  disableNoCorsMode() {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado.');
  }

  addProxyUrls(proxyUrls) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado.');
  }

  setProxyUrls(proxyUrls) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado.');
  }

  getCORSStatus() {
    // MÉTODO COMPLETO COMENTADO
    return {
      enabled: false,
      useProxy: false,
      noCorsMode: false,
      proxyUrls: [],
      currentProxyIndex: 0,
      currentProxy: null,
      corsErrors: 0,
      proxyRequests: 0
    };
  }

  testProxy(proxyUrl, testUrl = null) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado.');
    return Promise.resolve({
      success: false,
      proxy: proxyUrl,
      error: 'WebhookService temporalmente deshabilitado',
      timestamp: new Date().toISOString()
    });
  }

  testAllProxies(testUrl = null) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado.');
    return Promise.resolve([]);
  }

  tryHostnameStrategy(payload, options = {}) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado. El chatbot usa n8n webhooks directamente.');
    return Promise.resolve({
      success: false,
      error: 'WebhookService temporalmente deshabilitado',
      timestamp: new Date().toISOString()
    });
  }

  tryDirectIPStrategy(payload, options = {}) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado. El chatbot usa n8n webhooks directamente.');
    return Promise.resolve({
      success: false,
      error: 'WebhookService temporalmente deshabilitado',
      timestamp: new Date().toISOString()
    });
  }

  tryProxyStrategy(payload, options = {}) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado. El chatbot usa n8n webhooks directamente.');
    return Promise.resolve({
      success: false,
      error: 'WebhookService temporalmente deshabilitado',
      timestamp: new Date().toISOString()
    });
  }

  tryTunnelStrategy(payload, options = {}) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado. El chatbot usa n8n webhooks directamente.');
    return Promise.resolve({
      success: false,
      error: 'WebhookService temporalmente deshabilitado',
      timestamp: new Date().toISOString()
    });
  }

  setServerIP(ip) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado.');
  }

  enableDirectIP(enabled = true) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado.');
  }

  setN8nTunnelUrl(tunnelUrl) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado.');
  }

  setServerHostname(hostname) {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado.');
  }

  getServerStrategyStatus() {
    // MÉTODO COMPLETO COMENTADO
    return {
      hostname: '',
      directIP: '',
      useDirectIP: false,
      n8nTunnelUrl: '',
      currentStrategy: 'disabled',
      strategyOrder: [],
      strategiesTried: [],
      metrics: {
        hostnameRequests: 0,
        directIPRequests: 0,
        proxyRequests: 0,
        tunnelRequests: 0
      }
    };
  }

  diagnoseConnection() {
    // MÉTODO COMPLETO COMENTADO
    console.log('WebhookService está deshabilitado. El chatbot usa n8n webhooks directamente.');
    return Promise.resolve({
      timestamp: new Date().toISOString(),
      webhookUrl: 'Deshabilitado',
      serverConfig: {
        hostname: '',
        directIP: '',
        n8nTunnelUrl: ''
      },
      results: {},
      successfulStrategies: [],
      recommendation: 'WebhookService está deshabilitado. Use n8n webhooks directamente.',
      metrics: this.getMetrics()
    });
  }

  generateDiagnosisRecommendation(results, successfulStrategies) {
    // MÉTODO COMPLETO COMENTADO
    return 'WebhookService está deshabilitado. Use n8n webhooks directamente.';
  }
}
*/

// Exportar un objeto vacío para mantener compatibilidad de importación
const DisabledWebhookService = {
  sendQuizWebhook: () => Promise.resolve({ success: false, error: 'WebhookService deshabilitado' }),
  sendChatbotMessage: () => Promise.resolve({ success: false, error: 'WebhookService deshabilitado' }),
  sendChatbotEvent: () => Promise.resolve({ success: false, error: 'WebhookService deshabilitado' }),
  sendChatbotStatus: () => Promise.resolve({ success: false, error: 'WebhookService deshabilitado' }),
  isConfigured: () => false,
  getStatus: () => ({ configured: false, webhookUrl: 'Deshabilitado' }),
  getMetrics: () => ({ sent: 0, successful: 0, failed: 0 }),
  diagnoseConnection: () => Promise.resolve({ recommendation: 'WebhookService deshabilitado' })
};

export default DisabledWebhookService;
