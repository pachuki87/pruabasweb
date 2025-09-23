/**
 * WebhookService.js
 * Servicio para enviar resúmenes de cuestionarios a webhooks
 */

import axios from 'axios';

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

  /**
   * Configura interceptores de Axios para logging y manejo de errores
   */
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

  /**
   * Envía datos de resumen de cuestionario al webhook con múltiples estrategias
   * @param {Object} payload - Datos a enviar al webhook
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendQuizWebhook(payload, options = {}) {
    try {
      if (!this.webhookUrl) {
        throw new Error('La URL del webhook no está configurada');
      }

      // Validar payload
      if (!this.validatePayload(payload)) {
        throw new Error('El payload no es válido');
      }

      // Resetear estrategias intentadas
      this.serverOptions.strategiesTried = [];

      // Estrategia 1: Usar hostname original
      console.log('🔄 Estrategia 1: Intentando con hostname original...');
      const hostnameResult = await this.tryHostnameStrategy(payload, options);
      if (hostnameResult.success) {
        return hostnameResult;
      }

      // Estrategia 2: Usar IP directa
      console.log('🔄 Estrategia 2: Intentando con IP directa...');
      const ipResult = await this.tryDirectIPStrategy(payload, options);
      if (ipResult.success) {
        return ipResult;
      }

      // Estrategia 3: Usar proxy CORS
      if (this.corsOptions.enabled && this.corsOptions.useProxy) {
        console.log('🔄 Estrategia 3: Intentando con proxy CORS...');
        this.metrics.corsErrors++;
        const proxyResult = await this.tryProxyStrategy(payload, options);
        if (proxyResult.success) {
          return proxyResult;
        }
      }

      // Estrategia 4: Usar tunnel n8n (si está configurado)
      if (this.serverOptions.n8nTunnelUrl) {
        console.log('🔄 Estrategia 4: Intentando con tunnel n8n...');
        const tunnelResult = await this.tryTunnelStrategy(payload, options);
        if (tunnelResult.success) {
          return tunnelResult;
        }
      }

      // Si todas las estrategias fallaron, retornar el último error
      const lastError = this.serverOptions.strategiesTried[this.serverOptions.strategiesTried.length - 1];
      return {
        success: false,
        error: `Todas las estrategias fallaron. Último error: ${lastError?.error || 'Desconocido'}`,
        strategiesTried: this.serverOptions.strategiesTried,
        timestamp: new Date().toISOString(),
        webhookUrl: this.webhookUrl,
        metrics: { ...this.metrics }
      };

    } catch (error) {
      // Actualizar métricas de fallo
      this.metrics.failed++;

      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        timestamp: new Date().toISOString(),
        webhookUrl: this.webhookUrl,
        details: this.getErrorDetails(error),
        metrics: { ...this.metrics }
      };
    }
  }

  /**
   * Envía webhook directamente (sin proxy)
   * @param {Object} payload - Datos a enviar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendDirectWebhook(payload, options = {}) {
    try {
      const config = {
        url: this.webhookUrl,
        method: 'POST',
        headers: this.getHeaders(options.headers || {}),
        data: payload,
        timeout: options.timeout || 30000,
        ...options.axiosConfig
      };

      // Actualizar métricas
      this.metrics.sent++;

      const response = await this.axiosInstance(config);

      // Actualizar métricas de éxito
      this.metrics.successful++;

      return {
        success: true,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        timestamp: new Date().toISOString(),
        webhookUrl: this.webhookUrl,
        metrics: { ...this.metrics },
        usedProxy: false
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        timestamp: new Date().toISOString(),
        webhookUrl: this.webhookUrl,
        details: this.getErrorDetails(error),
        metrics: { ...this.metrics },
        usedProxy: false
      };
    }
  }

  /**
   * Envía webhook usando proxy CORS
   * @param {Object} payload - Datos a enviar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendProxyWebhook(payload, options = {}) {
    const proxyUrls = this.corsOptions.proxyUrls;
    let lastError = null;

    // Intentar con cada proxy disponible
    for (let i = 0; i < proxyUrls.length; i++) {
      const proxyUrl = proxyUrls[this.corsOptions.currentProxyIndex];
      this.corsOptions.currentProxyIndex = (this.corsOptions.currentProxyIndex + 1) % proxyUrls.length;

      try {
        const fullProxyUrl = this.getProxyUrl(proxyUrl, this.webhookUrl);
        
        console.log(`Intentando con proxy: ${proxyUrl}`);

        const config = {
          url: fullProxyUrl,
          method: 'POST',
          headers: this.getHeaders(options.headers || {}),
          data: payload,
          timeout: options.timeout || 45000, // Timeout más largo para proxy
          ...options.axiosConfig
        };

        const response = await this.axiosInstance(config);

        // Actualizar métricas de proxy
        this.metrics.proxyRequests++;
        this.metrics.successful++;

        return {
          success: true,
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          timestamp: new Date().toISOString(),
          webhookUrl: this.webhookUrl,
          proxyUsed: proxyUrl,
          metrics: { ...this.metrics },
          usedProxy: true
        };

      } catch (error) {
        lastError = error;
        console.warn(`Falló proxy ${proxyUrl}:`, error.message);
        continue;
      }
    }

    // Si todos los proxies fallaron
    this.metrics.failed++;
    this.metrics.proxyRequests++;

    return {
      success: false,
      error: `Todos los proxies CORS fallaron. Último error: ${lastError?.message}`,
      timestamp: new Date().toISOString(),
      webhookUrl: this.webhookUrl,
      metrics: { ...this.metrics },
      usedProxy: true,
      proxyError: true
    };
  }

  /**
   * Envía datos con sistema de reintentos
   * @param {Object} payload - Datos a enviar
   * @param {Object} retryOptions - Opciones de reintentos
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendWithRetry(payload, retryOptions = {}) {
    const {
      maxRetries = 3,
      retryDelay = 1000,
      backoffFactor = 2,
      ...options
    } = retryOptions;

    let lastError = null;
    let attempt = 0;

    while (attempt <= maxRetries) {
      attempt++;
      
      try {
        const result = await this.sendQuizWebhook(payload, options);
        
        if (result.success) {
          return {
            ...result,
            attempts: attempt,
            retries: attempt - 1
          };
        }
        
        lastError = new Error(result.error);
        
        // Verificar si el error es reintentable
        if (!this.isRetryableError(result)) {
          break;
        }
        
      } catch (error) {
        lastError = error;
        
        // Verificar si el error es reintentable
        if (!this.isRetryableError(error)) {
          break;
        }
      }

      // Si no es el último intento, esperar antes de reintentar
      if (attempt <= maxRetries) {
        const delay = retryDelay * Math.pow(backoffFactor, attempt - 1);
        console.log(`Reintentando webhook en ${delay}ms (intento ${attempt} de ${maxRetries})`);
        
        await this.sleep(delay);
        
        // Actualizar métricas de reintentos
        this.metrics.retries++;
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Máximo de reintentos alcanzado',
      attempts: attempt,
      retries: attempt - 1,
      timestamp: new Date().toISOString(),
      webhookUrl: this.webhookUrl,
      metrics: { ...this.metrics }
    };
  }

  /**
   * Envía datos a múltiples webhooks (si se necesita)
   * @param {Array} webhookUrls - Lista de URLs de webhooks
   * @param {Object} payload - Datos a enviar
   * @returns {Promise<Array>} - Resultados de cada envío
   */
  async sendToMultipleWebhooks(webhookUrls, payload) {
    const results = [];
    
    for (const url of webhookUrls) {
      try {
        // Validar URL antes de enviar
        if (!this.validateWebhookUrl(url)) {
          results.push({
            url,
            success: false,
            error: 'URL de webhook inválida',
            timestamp: new Date().toISOString()
          });
          continue;
        }
        
        const originalUrl = this.webhookUrl;
        this.webhookUrl = url;
        
        const result = await this.sendQuizWebhook(payload);
        results.push({ url, ...result });
        
        // CORREGIR BUG: Restaurar URL original correctamente
        this.webhookUrl = originalUrl;
        
      } catch (error) {
        results.push({
          url,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        
        // CORREGIR BUG: Restaurar URL original correctamente
        this.webhookUrl = originalUrl;
      }
    }
    
    return results;
  }

  /**
   * Envía un webhook de prueba para verificar la configuración
   * @param {string} testUrl - URL del webhook para prueba (opcional)
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendTestWebhook(testUrl = null) {
    const testPayload = {
      type: 'test',
      message: 'Webhook de prueba - Instituto Lidera',
      timestamp: new Date().toISOString(),
      service: 'quiz-summary-webhook',
      version: '1.0.0',
      config: {
        webhookUrl: testUrl || this.webhookUrl,
        hasAuthToken: !!this.authToken,
        timestamp: new Date().toISOString()
      }
    };

    const url = testUrl || this.webhookUrl;
    const originalUrl = this.webhookUrl;
    
    if (testUrl) {
      this.webhookUrl = testUrl;
    }

    try {
      const result = await this.sendQuizWebhook(testPayload);
      
      return {
        ...result,
        test: true,
        payload: testPayload
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        test: true,
        payload: testPayload,
        timestamp: new Date().toISOString()
      };

    } finally {
      if (testUrl) {
        this.webhookUrl = originalUrl;
      }
    }
  }

  /**
   * Genera headers para la request
   * @param {Object} additionalHeaders - Headers adicionales
   * @returns {Object} - Headers completos
   */
  getHeaders(additionalHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...additionalHeaders };
    
    // Añadir token de autenticación si existe
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  /**
   * Obtiene detalles del error para mejor logging
   * @param {Error} error - Error capturado
   * @returns {Object} - Detalles del error
   */
  getErrorDetails(error) {
    const details = {
      message: error.message,
      code: error.code,
      stack: error.stack
    };

    if (error.response) {
      details.response = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      };
    }

    if (error.request) {
      details.request = {
        method: error.request?.method,
        url: error.request?.url,
        headers: error.request?.headers
      };
    }

    return details;
  }

  /**
   * Función de utilidad para esperar (sleep)
   * @param {number} ms - Milisegundos a esperar
   * @returns {Promise} - Promesa que se resuelve después del tiempo especificado
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Verifica si el servicio de webhook está configurado correctamente
   * @returns {boolean} - True si está configurado, false si no
   */
  isConfigured() {
    return !!(
      this.webhookUrl &&
      this.webhookUrl.startsWith('http')
    );
  }

  /**
   * Obtiene el estado actual del servicio de webhook
   * @returns {Object} - Estado del servicio
   */
  getStatus() {
    return {
      configured: this.isConfigured(),
      webhookUrl: this.webhookUrl || 'No configurado',
      hasAuthToken: !!this.authToken,
      defaultHeaders: this.defaultHeaders
    };
  }

  /**
   * Actualiza la URL del webhook dinámicamente
   * @param {string} newUrl - Nueva URL del webhook
   */
  setWebhookUrl(newUrl) {
    this.webhookUrl = newUrl;
    console.log('URL del webhook actualizada:', newUrl);
  }

  /**
   * Actualiza el token de autenticación dinámicamente
   * @param {string} newToken - Nuevo token de autenticación
   */
  setAuthToken(newToken) {
    this.authToken = newToken;
    console.log('Token de autenticación del webhook actualizado');
  }

  /**
   * Valida una URL de webhook
   * @param {string} url - URL a validar
   * @returns {boolean} - True si es válida, false si no
   */
  validateWebhookUrl(url) {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  }

  /**
   * Envía un webhook asíncrono (sin esperar respuesta)
   * @param {Object} payload - Datos a enviar
   * @returns {Promise<void>} - No espera respuesta
   */
  async sendAsync(payload) {
    try {
      // Validar payload antes de enviar
      if (!this.validatePayload(payload)) {
        console.error('Payload inválido para webhook asíncrono');
        return;
      }

      // Verdadero asíncrono: no esperamos respuesta
      this.axiosInstance.post(this.webhookUrl, payload, {
        headers: this.getHeaders()
      }).catch(error => {
        console.error('Error en webhook asíncrono:', error);
        this.metrics.failed++;
      });
      
    } catch (error) {
      console.error('Error al iniciar webhook asíncrono:', error);
    }
  }

  /**
   * Valida el payload del webhook
   * @param {Object} payload - Payload a validar
   * @returns {boolean} - True si es válido, false si no
   */
  validatePayload(payload) {
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    // Validar que tenga campos básicos para chatbot
    if (!payload.type && !payload.message && !payload.data) {
      return false;
    }

    // Validar que no sea demasiado grande
    const payloadSize = JSON.stringify(payload).length;
    if (payloadSize > 1024 * 1024) { // 1MB
      console.error('Payload demasiado grande:', payloadSize, 'bytes');
      return false;
    }

    return true;
  }

  /**
   * Determina si un error es reintentable
   * @param {Object|Error} error - Error a evaluar
   * @returns {boolean} - True si es reintentable, false si no
   */
  isRetryableError(error) {
    // Errores de red o timeout
    if (error.code === 'ECONNREFUSED' || 
        error.code === 'ETIMEDOUT' || 
        error.code === 'ENOTFOUND' ||
        error.code === 'ECONNRESET') {
      return true;
    }

    // Errores HTTP reintentables
    if (error.response) {
      const status = error.response.status;
      return status === 429 || // Too Many Requests
             status === 500 || // Internal Server Error
             status === 502 || // Bad Gateway
             status === 503 || // Service Unavailable
             status === 504;   // Gateway Timeout
    }

    // Errores de resultado
    if (error.status) {
      return error.status === 429 || 
             error.status === 500 || 
             error.status === 502 || 
             error.status === 503 || 
             error.status === 504;
    }

    // No reintentar errores de autenticación o permisos
    return false;
  }

  /**
   * Métodos específicos para chatbot
   */

  /**
   * Envía mensaje de chatbot
   * @param {string} message - Mensaje a enviar
   * @param {Object} context - Contexto de la conversación
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendChatbotMessage(message, context = {}) {
    const payload = {
      type: 'chatbot_message',
      message: message,
      context: context,
      timestamp: new Date().toISOString(),
      service: 'chatbot-webhook'
    };

    return await this.sendQuizWebhook(payload);
  }

  /**
   * Envía evento de conversación de chatbot
   * @param {string} eventType - Tipo de evento
   * @param {Object} eventData - Datos del evento
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendChatbotEvent(eventType, eventData = {}) {
    const payload = {
      type: 'chatbot_event',
      eventType: eventType,
      eventData: eventData,
      timestamp: new Date().toISOString(),
      service: 'chatbot-webhook'
    };

    return await this.sendQuizWebhook(payload);
  }

  /**
   * Envía actualización de estado del chatbot
   * @param {string} status - Estado del chatbot
   * @param {Object} statusData - Datos del estado
   * @returns {Promise<Object>} - Resultado del envío
   */
  async sendChatbotStatus(status, statusData = {}) {
    const payload = {
      type: 'chatbot_status',
      status: status,
      statusData: statusData,
      timestamp: new Date().toISOString(),
      service: 'chatbot-webhook'
    };

    return await this.sendQuizWebhook(payload);
  }

  /**
   * Obtiene métricas del servicio
   * @returns {Object} - Métricas actuales
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Reinicia métricas
   */
  resetMetrics() {
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

  /**
   * Métodos para manejo de CORS
   */

  /**
   * Detecta si un error es de CORS
   * @param {Object} result - Resultado de la petición
   * @returns {boolean} - True si es error de CORS, false si no
   */
  isCORSError(result) {
    // Errores típicos de CORS en el navegador
    const corsMessages = [
      'cors',
      'cross-origin',
      'access-control-allow-origin',
      'blocked by cors policy',
      'no access-control-allow-origin header'
    ];

    const errorMessage = (result.error || '').toLowerCase();
    const errorDetails = result.details;
    
    // Verificar mensaje de error
    if (corsMessages.some(msg => errorMessage.includes(msg))) {
      return true;
    }

    // Verificar si es un error de red sin respuesta (típico de CORS)
    if (errorDetails && !errorDetails.response && errorDetails.request) {
      return true;
    }

    // Verificar código de error específico
    if (errorDetails && errorDetails.code === 'ERR_NETWORK') {
      return true;
    }

    return false;
  }

  /**
   * Construye URL con proxy CORS
   * @param {string} proxyUrl - URL base del proxy
   * @param {string} targetUrl - URL destino
   * @returns {string} - URL completa con proxy
   */
  getProxyUrl(proxyUrl, targetUrl) {
    // Eliminar trailing slash del proxy si existe
    const cleanProxyUrl = proxyUrl.endsWith('/') ? proxyUrl.slice(0, -1) : proxyUrl;
    
    // Codificar la URL target para uso en proxy
    const encodedTargetUrl = encodeURIComponent(targetUrl);
    
    // Construir URL final según el tipo de proxy
    if (cleanProxyUrl.includes('allorigins.win')) {
      return `${cleanProxyUrl}${encodedTargetUrl}`;
    } else if (cleanProxyUrl.includes('corsproxy.io')) {
      return `${cleanProxyUrl}${encodedTargetUrl}`;
    } else if (cleanProxyUrl.includes('cors-anywhere')) {
      return `${cleanProxyUrl}${targetUrl}`;
    }
    
    // Por defecto, asumir que el proxy espera la URL codificada como parámetro
    return `${cleanProxyUrl}${encodedTargetUrl}`;
  }

  /**
   * Habilita el modo CORS
   * @param {boolean} useProxy - Si se debe usar proxy (default: true)
   */
  enableCORSMode(useProxy = true) {
    this.corsOptions.enabled = true;
    this.corsOptions.useProxy = useProxy;
    console.log('Modo CORS habilitado, uso de proxy:', useProxy);
  }

  /**
   * Deshabilita el modo CORS
   */
  disableCORSMode() {
    this.corsOptions.enabled = false;
    this.corsOptions.useProxy = false;
    console.log('Modo CORS deshabilitado');
  }

  /**
   * Habilita el modo no-CORS
   */
  enableNoCorsMode() {
    this.corsOptions.noCorsMode = true;
    console.log('Modo no-CORS habilitado');
  }

  /**
   * Deshabilita el modo no-CORS
   */
  disableNoCorsMode() {
    this.corsOptions.noCorsMode = false;
    console.log('Modo no-CORS deshabilitado');
  }

  /**
   * Agrega URLs de proxy CORS
   * @param {Array<string>} proxyUrls - URLs de proxy a agregar
   */
  addProxyUrls(proxyUrls) {
    this.corsOptions.proxyUrls.push(...proxyUrls);
    console.log('Proxy URLs agregadas:', proxyUrls);
  }

  /**
   * Establece URLs de proxy CORS (reemplaza las existentes)
   * @param {Array<string>} proxyUrls - URLs de proxy a establecer
   */
  setProxyUrls(proxyUrls) {
    this.corsOptions.proxyUrls = proxyUrls;
    this.corsOptions.currentProxyIndex = 0;
    console.log('Proxy URLs establecidas:', proxyUrls);
  }

  /**
   * Obtiene el estado actual de CORS
   * @returns {Object} - Estado de CORS
   */
  getCORSStatus() {
    return {
      enabled: this.corsOptions.enabled,
      useProxy: this.corsOptions.useProxy,
      noCorsMode: this.corsOptions.noCorsMode,
      proxyUrls: this.corsOptions.proxyUrls,
      currentProxyIndex: this.corsOptions.currentProxyIndex,
      currentProxy: this.corsOptions.proxyUrls[this.corsOptions.currentProxyIndex],
      corsErrors: this.metrics.corsErrors,
      proxyRequests: this.metrics.proxyRequests
    };
  }

  /**
   * Prueba la conexión con un proxy específico
   * @param {string} proxyUrl - URL del proxy a probar
   * @param {string} testUrl - URL de prueba (opcional, usa la webhookUrl actual)
   * @returns {Promise<Object>} - Resultado de la prueba
   */
  async testProxy(proxyUrl, testUrl = null) {
    const targetUrl = testUrl || this.webhookUrl;
    const testPayload = {
      type: 'proxy_test',
      message: 'Prueba de proxy CORS',
      timestamp: new Date().toISOString(),
      proxy: proxyUrl
    };

    try {
      const fullProxyUrl = this.getProxyUrl(proxyUrl, targetUrl);
      
      const config = {
        url: fullProxyUrl,
        method: 'POST',
        headers: this.getHeaders(),
        data: testPayload,
        timeout: 30000
      };

      const response = await this.axiosInstance(config);

      return {
        success: true,
        proxy: proxyUrl,
        status: response.status,
        statusText: response.statusText,
        responseTime: response.headers['x-response-time'] || 'N/A',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        proxy: proxyUrl,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Prueba todos los proxies disponibles
   * @param {string} testUrl - URL de prueba (opcional)
   * @returns {Promise<Array>} - Resultados de las pruebas
   */
  async testAllProxies(testUrl = null) {
    const results = [];
    
    for (const proxyUrl of this.corsOptions.proxyUrls) {
      const result = await this.testProxy(proxyUrl, testUrl);
      results.push(result);
    }
    
    return results;
  }

  /**
   * Métodos para estrategias múltiples de conexión
   */

  /**
   * Estrategia 1: Usar hostname original
   * @param {Object} payload - Datos a enviar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} - Resultado del envío
   */
  async tryHostnameStrategy(payload, options = {}) {
    try {
      this.serverOptions.currentStrategy = 'hostname';
      this.metrics.hostnameRequests++;
      
      const originalUrl = this.webhookUrl;
      const result = await this.sendDirectWebhook(payload, options);
      
      // Restaurar URL original si fue modificada
      this.webhookUrl = originalUrl;
      
      // Registrar estrategia intentada
      this.serverOptions.strategiesTried.push({
        strategy: 'hostname',
        success: result.success,
        error: result.error,
        url: originalUrl
      });

      if (result.success) {
        console.log('✅ Estrategia hostname exitosa');
        return {
          ...result,
          strategy: 'hostname',
          strategyUsed: 'hostname'
        };
      }

      console.log('❌ Estrategia hostname fallida:', result.error);
      return result;

    } catch (error) {
      console.log('❌ Estrategia hostname con error:', error.message);
      this.serverOptions.strategiesTried.push({
        strategy: 'hostname',
        success: false,
        error: error.message,
        url: this.webhookUrl
      });
      throw error;
    }
  }

  /**
   * Estrategia 2: Usar IP directa
   * @param {Object} payload - Datos a enviar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} - Resultado del envío
   */
  async tryDirectIPStrategy(payload, options = {}) {
    try {
      this.serverOptions.currentStrategy = 'directIP';
      this.metrics.directIPRequests++;
      
      const originalUrl = this.webhookUrl;
      
      // Reemplazar hostname con IP directa
      const ipUrl = originalUrl.replace(
        this.serverOptions.hostname, 
        this.serverOptions.directIP
      );
      
      console.log('🔗 Intentando con IP directa:', ipUrl);
      this.webhookUrl = ipUrl;
      
      const result = await this.sendDirectWebhook(payload, options);
      
      // Restaurar URL original
      this.webhookUrl = originalUrl;
      
      // Registrar estrategia intentada
      this.serverOptions.strategiesTried.push({
        strategy: 'directIP',
        success: result.success,
        error: result.error,
        url: ipUrl
      });

      if (result.success) {
        console.log('✅ Estrategia IP directa exitosa');
        return {
          ...result,
          strategy: 'directIP',
          strategyUsed: 'directIP',
          usedDirectIP: true
        };
      }

      console.log('❌ Estrategia IP directa fallida:', result.error);
      return result;

    } catch (error) {
      console.log('❌ Estrategia IP directa con error:', error.message);
      this.serverOptions.strategiesTried.push({
        strategy: 'directIP',
        success: false,
        error: error.message,
        url: this.webhookUrl
      });
      throw error;
    }
  }

  /**
   * Estrategia 3: Usar proxy CORS
   * @param {Object} payload - Datos a enviar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} - Resultado del envío
   */
  async tryProxyStrategy(payload, options = {}) {
    try {
      this.serverOptions.currentStrategy = 'proxy';
      
      const result = await this.sendProxyWebhook(payload, options);
      
      // Registrar estrategia intentada
      this.serverOptions.strategiesTried.push({
        strategy: 'proxy',
        success: result.success,
        error: result.error,
        url: this.webhookUrl
      });

      if (result.success) {
        console.log('✅ Estrategia proxy exitosa');
        return {
          ...result,
          strategy: 'proxy',
          strategyUsed: 'proxy'
        };
      }

      console.log('❌ Estrategia proxy fallida:', result.error);
      return result;

    } catch (error) {
      console.log('❌ Estrategia proxy con error:', error.message);
      this.serverOptions.strategiesTried.push({
        strategy: 'proxy',
        success: false,
        error: error.message,
        url: this.webhookUrl
      });
      throw error;
    }
  }

  /**
   * Estrategia 4: Usar tunnel n8n
   * @param {Object} payload - Datos a enviar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} - Resultado del envío
   */
  async tryTunnelStrategy(payload, options = {}) {
    try {
      this.serverOptions.currentStrategy = 'tunnel';
      this.metrics.tunnelRequests++;
      
      if (!this.serverOptions.n8nTunnelUrl) {
        throw new Error('URL de tunnel n8n no configurada');
      }
      
      const originalUrl = this.webhookUrl;
      const tunnelUrl = this.serverOptions.n8nTunnelUrl;
      
      console.log('🚇 Intentando con tunnel n8n:', tunnelUrl);
      this.webhookUrl = tunnelUrl;
      
      const result = await this.sendDirectWebhook(payload, options);
      
      // Restaurar URL original
      this.webhookUrl = originalUrl;
      
      // Registrar estrategia intentada
      this.serverOptions.strategiesTried.push({
        strategy: 'tunnel',
        success: result.success,
        error: result.error,
        url: tunnelUrl
      });

      if (result.success) {
        console.log('✅ Estrategia tunnel exitosa');
        return {
          ...result,
          strategy: 'tunnel',
          strategyUsed: 'tunnel',
          usedTunnel: true
        };
      }

      console.log('❌ Estrategia tunnel fallida:', result.error);
      return result;

    } catch (error) {
      console.log('❌ Estrategia tunnel con error:', error.message);
      this.serverOptions.strategiesTried.push({
        strategy: 'tunnel',
        success: false,
        error: error.message,
        url: this.webhookUrl
      });
      throw error;
    }
  }

  /**
   * Métodos de configuración del servidor
   */

  /**
   * Establece la IP directa del servidor
   * @param {string} ip - IP del servidor
   */
  setServerIP(ip) {
    this.serverOptions.directIP = ip;
    console.log('IP del servidor actualizada:', ip);
  }

  /**
   * Habilita el uso de IP directa
   * @param {boolean} enabled - Si se debe usar IP directa
   */
  enableDirectIP(enabled = true) {
    this.serverOptions.useDirectIP = enabled;
    console.log('Uso de IP directa:', enabled);
  }

  /**
   * Establece la URL del tunnel n8n
   * @param {string} tunnelUrl - URL del tunnel
   */
  setN8nTunnelUrl(tunnelUrl) {
    this.serverOptions.n8nTunnelUrl = tunnelUrl;
    console.log('URL de tunnel n8n actualizada:', tunnelUrl);
  }

  /**
   * Establece el hostname del servidor
   * @param {string} hostname - Hostname del servidor
   */
  setServerHostname(hostname) {
    this.serverOptions.hostname = hostname;
    console.log('Hostname del servidor actualizado:', hostname);
  }

  /**
   * Obtiene el estado de las estrategias del servidor
   * @returns {Object} - Estado de las estrategias
   */
  getServerStrategyStatus() {
    return {
      hostname: this.serverOptions.hostname,
      directIP: this.serverOptions.directIP,
      useDirectIP: this.serverOptions.useDirectIP,
      n8nTunnelUrl: this.serverOptions.n8nTunnelUrl,
      currentStrategy: this.serverOptions.currentStrategy,
      strategyOrder: this.serverOptions.strategyOrder,
      strategiesTried: this.serverOptions.strategiesTried,
      metrics: {
        hostnameRequests: this.metrics.hostnameRequests,
        directIPRequests: this.metrics.directIPRequests,
        proxyRequests: this.metrics.proxyRequests,
        tunnelRequests: this.metrics.tunnelRequests
      }
    };
  }

  /**
   * Diagnóstico completo de conexión
   * @returns {Promise<Object>} - Resultados del diagnóstico
   */
  async diagnoseConnection() {
    console.log('🔍 Iniciando diagnóstico completo de conexión...');
    
    const testPayload = {
      type: 'diagnosis',
      message: 'Prueba de diagnóstico de conexión',
      timestamp: new Date().toISOString(),
      service: 'webhook-diagnosis'
    };

    const results = {};
    
    // Probar estrategia hostname
    console.log('📡 Probando estrategia hostname...');
    try {
      const hostnameResult = await this.tryHostnameStrategy(testPayload);
      results.hostname = hostnameResult;
    } catch (error) {
      results.hostname = {
        success: false,
        error: error.message,
        strategy: 'hostname'
      };
    }

    // Probar estrategia IP directa
    console.log('📡 Probando estrategia IP directa...');
    try {
      const ipResult = await this.tryDirectIPStrategy(testPayload);
      results.directIP = ipResult;
    } catch (error) {
      results.directIP = {
        success: false,
        error: error.message,
        strategy: 'directIP'
      };
    }

    // Probar estrategia proxy
    console.log('📡 Probando estrategia proxy...');
    try {
      const proxyResult = await this.tryProxyStrategy(testPayload);
      results.proxy = proxyResult;
    } catch (error) {
      results.proxy = {
        success: false,
        error: error.message,
        strategy: 'proxy'
      };
    }

    // Probar estrategia tunnel si está configurada
    if (this.serverOptions.n8nTunnelUrl) {
      console.log('📡 Probando estrategia tunnel...');
      try {
        const tunnelResult = await this.tryTunnelStrategy(testPayload);
        results.tunnel = tunnelResult;
      } catch (error) {
        results.tunnel = {
          success: false,
          error: error.message,
          strategy: 'tunnel'
        };
      }
    } else {
      results.tunnel = {
        success: false,
        error: 'Tunnel no configurado',
        strategy: 'tunnel'
      };
    }

    // Analizar resultados y dar recomendaciones
    const successfulStrategies = Object.entries(results)
      .filter(([_, result]) => result.success)
      .map(([strategy, _]) => strategy);

    const diagnosis = {
      timestamp: new Date().toISOString(),
      webhookUrl: this.webhookUrl,
      serverConfig: {
        hostname: this.serverOptions.hostname,
        directIP: this.serverOptions.directIP,
        n8nTunnelUrl: this.serverOptions.n8nTunnelUrl
      },
      results: results,
      successfulStrategies: successfulStrategies,
      recommendation: this.generateDiagnosisRecommendation(results, successfulStrategies),
      metrics: this.getMetrics()
    };

    console.log('🔍 Diagnóstico completado');
    return diagnosis;
  }

  /**
   * Genera recomendación basada en resultados del diagnóstico
   * @param {Object} results - Resultados de las pruebas
   * @param {Array<string>} successfulStrategies - Estrategias exitosas
   * @returns {string} - Recomendación
   */
  generateDiagnosisRecommendation(results, successfulStrategies) {
    if (successfulStrategies.length > 0) {
      return `✅ Conexión exitosa usando estrategia(es): ${successfulStrategies.join(', ')}. 
Se recomienda usar la estrategia ${successfulStrategies[0]} como principal.`;
    }

    // Analizar errores para dar recomendaciones específicas
    const errors = Object.values(results).map(r => r.error || '');
    
    if (errors.some(e => e.includes('CORS') || e.includes('cross-origin'))) {
      return '🔧 Se detectan errores de CORS. Recomendaciones:\n' +
             '1. Configurar CORS en el servidor n8n\n' +
             '2. Usar proxy CORS (ya habilitado)\n' +
             '3. Configurar Nginx como proxy reverso\n' +
             '4. Habilitar webhook tunneling en n8n';
    }

    if (errors.some(e => e.includes('ENOTFOUND') || e.includes('ECONNREFUSED'))) {
      return '🔧 Se detectan errores de red/DNS. Recomendaciones:\n' +
             '1. Verificar que el servidor n8n está en línea\n' +
             '2. Comprobar configuración de firewall\n' +
             '3. Verificar resolución DNS\n' +
             '4. Probar con IP directa';
    }

    if (errors.some(e => e.includes('timeout') || e.includes('ETIMEDOUT'))) {
      return '🔧 Se detectan errores de timeout. Recomendaciones:\n' +
             '1. Aumentar timeout de la conexión\n' +
             '2. Verificar rendimiento del servidor\n' +
             '3. Comprobar carga del servidor n8n\n' +
             '4. Usar estrategia con timeout más largo';
    }

    return '🔧 No se pudo determinar la causa exacta. Recomendaciones:\n' +
           '1. Verificar configuración del servidor n8n\n' +
           '2. Comprobar conectividad de red\n' +
           '3. Revisar logs del servidor\n' +
           '4. Contactar al administrador del servidor';
  }
}

export default new WebhookService();
