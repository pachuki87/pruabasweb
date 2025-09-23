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
      retries: 0
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
   * Envía datos de resumen de cuestionario al webhook
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

      const config = {
        url: this.webhookUrl,
        method: 'POST',
        headers: this.getHeaders(options.headers || {}),
        data: payload,
        timeout: options.timeout || 30000, // 30 segundos timeout
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
      retries: 0
    };
  }
}

export default new WebhookService();
