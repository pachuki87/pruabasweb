# Sistema de Envío de Resúmenes de Cuestionarios

## 📋 Tabla de Contenido

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Componentes Principales](#componentes-principales)
4. [Configuración](#configuración)
5. [Guía de Instalación](#guía-de-instalación)
6. [Uso del Sistema](#uso-del-sistema)
7. [Pruebas y Depuración](#pruebas-y-depuración)
8. [Mantenimiento y Solución de Problemas](#mantenimiento-y-solución-de-problemas)
9. [Consideraciones de Seguridad](#consideraciones-de-seguridad)
10. [Mejoras Futuras](#mejoras-futuras)

## 📖 Descripción General

El Sistema de Envío de Resúmenes de Cuestionarios es una solución integral que permite enviar automáticamente resúmenes detallados de los cuestionarios completados por los usuarios a través de email y webhooks. Este sistema está diseñado para proporcionar retroalimentación inmediata a los estudiantes y notificar a los sistemas externos sobre el progreso académico.

### Características Principales

- ✅ **Generación automática de resúmenes** en formato texto, HTML y JSON
- ✅ **Envío de emails personalizados** con plantillas HTML profesionales
- ✅ **Integración con webhooks** para notificar a sistemas externos
- ✅ **Soporte para múltiples tipos de preguntas** (opción múltiple, texto libre, verdadero/falso)
- ✅ **Manejo de archivos adjuntos** en respuestas de texto libre
- ✅ **Sistema de reintentos** para envíos fallidos
- ✅ **Logging detallado** para depuración y monitoreo
- ✅ **Interfaz de usuario intuitiva** con retroalimentación visual

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   QuizComponent │────│ QuizSummaryGenerator│────│   EmailService  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌──────────────────┐              │
         │              │   WebhookService  │              │
         │              └──────────────────┘              │
         │                       │                       │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   UI/UX        │    │   Data Processing │    │ External Services│
│   - Results    │    │   - Summary Gen  │    │   - SMTP Server  │
│   - Status     │    │   - HTML Gen     │    │   - Webhook URL │
│   - Loading    │    │   - JSON Gen     │    │   - APIs        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Flujo de Datos

1. **Usuario completa cuestionario** → `QuizComponent`
2. **Generación de resumen** → `QuizSummaryGenerator`
3. **Envío paralelo** → `EmailService` + `WebhookService`
4. **Notificación de resultados** → UI + Sistemas externos

## 🔧 Componentes Principales

### 1. QuizSummaryGenerator (`src/services/QuizSummaryGenerator.js`)

**Responsabilidad**: Generar resúmenes detallados en diferentes formatos.

#### Métodos Principales:

- `generateDetailedSummary(quiz, answers, questions, user, results)` - Genera resumen completo
- `generateHTMLSummary(summaryData)` - Genera HTML para email
- `generateWebhookSummary(summaryData)` - Genera payload para webhook
- `generateQuestionsSummary(questions, answers)` - Genera resumen de preguntas
- `generatePerformanceMetrics(answers, results)` - Calcula métricas de rendimiento

#### Formatos de Salida:

- **Texto**: Resumen estructurado para logs y almacenamiento
- **HTML**: Email profesional con estilos CSS inline
- **JSON**: Payload estandarizado para webhooks

### 2. EmailService (`src/services/EmailService.js`)

**Responsabilidad**: Enviar resúmenes por email usando Nodemailer.

#### Características:

- Configuración SMTP flexible
- Plantillas HTML personalizables
- Sistema de reintentos con backoff exponencial
- Validación de direcciones email
- Logging detallado

#### Métodos Principales:

- `sendQuizSummaryEmail(user, quiz, summaryData, htmlContent)` - Envía resumen por email
- `sendTestEmail(to)` - Envía email de prueba
- `isConfigured()` - Verifica si el servicio está configurado
- `getStatus()` - Obtiene estado actual del servicio

### 3. WebhookService (`src/services/WebhookService.js`)

**Responsabilidad**: Enviar datos a webhooks externos usando Axios.

#### Características:

- Envío HTTP POST con JSON
- Soporte para autenticación Bearer Token
- Sistema de reintentos configurable
- Interceptors para logging
- Validación de URLs

#### Métodos Principales:

- `sendQuizWebhook(payload, options)` - Envía datos al webhook
- `sendWithRetry(payload, retryOptions)` - Envía con sistema de reintentos
- `sendTestWebhook(testUrl)` - Envía webhook de prueba
- `isConfigured()` - Verifica si el servicio está configurado

### 4. QuizComponent (`src/components/QuizComponent.jsx`)

**Responsabilidad**: Componente UI principal que integra todos los servicios.

#### Características:

- Interfaz completa para cuestionarios
- Manejo de diferentes tipos de preguntas
- Subida de archivos para respuestas de texto libre
- Visualización de resultados y estado de envío
- Retroalimentación visual en tiempo real

#### Estados Principales:

- `emailStatus` - Estado del envío de email
- `webhookStatus` - Estado del envío de webhook
- `sendingSummary` - Indicador de envío en progreso
- `servicesStatus` - Estado de configuración de servicios

## ⚙️ Configuración

### Variables de Entorno

Copia `.env.example` a `.env` y configura las siguientes variables:

```bash
# Configuración de Email
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_USER=tu-email@institutolidera.com
EMAIL_PASS=tu-contraseña-o-app-password
EMAIL_FROM="Instituto Lidera" <tu-email@institutolidera.com>

# Configuración de Webhook
WEBHOOK_URL=https://tu-webhook-endpoint.com/api/quiz-summary
WEBHOOK_AUTH_TOKEN=tu-token-de-autenticacion

# Configuración de Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima

# Configuración de la Aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Configuración de Gmail

1. **Habilitar 2FA**: Ve a la configuración de tu cuenta Google → Seguridad → Verificación en dos pasos
2. **Generar App Password**:
   - Ve a la configuración de tu cuenta Google → Seguridad
   - Selecciona "Contraseñas de aplicación"
   - Genera una nueva contraseña para "Aplicación personalizada"
   - Usa esta contraseña en `EMAIL_PASS`

### Configuración de Webhook

El endpoint del webhook debe:

- Aceptar peticiones `POST` con `Content-Type: application/json`
- Manejar el siguiente formato de payload:
```json
{
  "type": "quiz-summary",
  "timestamp": "2025-01-22T13:30:00.000Z",
  "version": "1.0.0",
  "data": {
    "user": { /* datos del usuario */ },
    "quiz": { /* datos del cuestionario */ },
    "results": { /* resultados del cuestionario */ },
    "summary": { /* resumen detallado */ }
  }
}
```

## 🚀 Guía de Instalación

### 1. Instalar Dependencias

```bash
npm install nodemailer axios
# o
yarn add nodemailer axios
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3. Verificar Instalación

```bash
# Ejecutar script de pruebas
node src/utils/testServices.js
```

### 4. Probar Servicios Individualmente

```javascript
// En la consola del navegador o en un script
import { testEmailSending, testWebhookSending } from './utils/testServices';

// Probar email
await testEmailSending('tu-email@test.com');

// Probar webhook
await testWebhookSending();
```

## 📖 Uso del Sistema

### Integración en Componentes

```jsx
import React from 'react';
import QuizComponent from './components/QuizComponent';

function App() {
  return (
    <div className="App">
      <QuizComponent 
        leccionId="tu-leccion-id"
        courseId="tu-curso-id"
        onQuizComplete={(results) => {
          console.log('Cuestionario completado:', results);
        }}
      />
    </div>
  );
}
```

### Uso de los Servicios Independientemente

#### Generar Resumen

```javascript
import QuizSummaryGenerator from './services/QuizSummaryGenerator';

const summary = QuizSummaryGenerator.generateDetailedSummary(
  quiz,
  answers,
  questions,
  user,
  results
);
```

#### Enviar Email

```javascript
import EmailService from './services/EmailService';

const result = await EmailService.sendQuizSummaryEmail(
  user,
  quiz,
  summaryData,
  htmlContent
);
```

#### Enviar Webhook

```javascript
import WebhookService from './services/WebhookService';

const payload = QuizSummaryGenerator.generateWebhookSummary(summaryData);
const result = await WebhookService.sendQuizWebhook(payload);
```

## 🧪 Pruebas y Depuración

### Script de Pruebas

El sistema incluye un script de pruebas completo en `src/utils/testServices.js`:

```javascript
import { runAllTests, testEmailSending, testWebhookSending } from './utils/testServices';

// Ejecutar todas las pruebas
await runAllTests();

// Probar email específico
await testEmailSending('test@example.com');

// Probar webhook
await testWebhookSending();
```

### Pruebas Manuales

#### 1. Probar Generación de Resumen

```javascript
const mockData = {
  quiz: { id: 'test', titulo: 'Test Quiz' },
  answers: { 'q1': { esCorrecta: true, tiempoRespuesta: 30 } },
  questions: [{ id: 'q1', pregunta: 'Test question' }],
  user: { id: 'user1', email: 'test@example.com' },
  results: { puntuacionObtenida: 100, aprobado: true }
};

const summary = QuizSummaryGenerator.generateDetailedSummary(
  mockData.quiz,
  mockData.answers,
  mockData.questions,
  mockData.user,
  mockData.results
);

console.log('Resumen generado:', summary);
```

#### 2. Probar Email

```javascript
const emailResult = await EmailService.sendTestEmail('your-email@example.com');
console.log('Resultado email:', emailResult);
```

#### 3. Probar Webhook

```javascript
const webhookResult = await WebhookService.sendTestWebhook();
console.log('Resultado webhook:', webhookResult);
```

### Logging y Depuración

El sistema incluye logging detallado:

```javascript
// Habilitar logging en consola
console.log('Email Service Status:', EmailService.getStatus());
console.log('Webhook Service Status:', WebhookService.getStatus());

// Los servicios muestran logs automáticos:
// - "Enviando email..."
// - "Email enviado exitosamente..."
// - "Enviando webhook..."
// - "Webhook enviado exitosamente..."
```

## 🔧 Mantenimiento y Solución de Problemas

### Problemas Comunes y Soluciones

#### 1. Email no se envía

**Síntomas**: `EmailService.isConfigured()` retorna `false`

**Causas posibles**:
- Variables de entorno no configuradas
- Credenciales SMTP incorrectas
- Firewall bloqueando puerto SMTP

**Soluciones**:
```bash
# Verificar variables de entorno
echo $EMAIL_SMTP_HOST
echo $EMAIL_SMTP_PORT
echo $EMAIL_USER

# Probar conexión SMTP
telnet smtp.gmail.com 587
```

#### 2. Webhook falla

**Síntomas**: Error de conexión o timeout

**Causas posibles**:
- URL de webhook incorrecta
- Problemas de red
- Endpoint no disponible

**Soluciones**:
```javascript
// Probar con herramienta como curl
curl -X POST https://tu-webhook.com/api/quiz-summary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu-token" \
  -d '{"test": true}'
```

#### 3. Resumen vacío o incompleto

**Síntomas**: El resumen generado falta información

**Causas posibles**:
- Datos de entrada incompletos
- Estructura de datos incorrecta

**Soluciones**:
```javascript
// Verificar estructura de datos
console.log('Quiz:', quiz);
console.log('Answers:', answers);
console.log('Questions:', questions);
console.log('User:', user);
console.log('Results:', results);
```

### Monitoreo y Mantenimiento

#### 1. Monitorear Estado de Servicios

```javascript
// Verificar estado periódicamente
const emailStatus = EmailService.getStatus();
const webhookStatus = WebhookService.getStatus();

if (!emailStatus.configured) {
  console.warn('Email service not configured');
}

if (!webhookStatus.configured) {
  console.warn('Webhook service not configured');
}
```

#### 2. Actualizar Dependencias

```bash
# Verificar actualizaciones
npm outdated nodemailer axios

# Actualizar
npm update nodemailer axios
```

#### 3. Limpiar Logs

Los servicios incluyen logging automático. Para producción:

```javascript
// Configurar nivel de logging
if (process.env.NODE_ENV === 'production') {
  // Reducir verbosidad de logs
  console.log = () => {};
}
```

## 🔒 Consideraciones de Seguridad

### 1. Variables de Entorno

- **Nunca commits** archivos `.env` con credenciales reales
- **Usa secretos** de tu plataforma de hosting (Vercel, Netlify, etc.)
- **Rota credenciales** periódicamente

### 2. Validación de Datos

```javascript
// Validar email antes de enviar
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

if (!isValidEmail(user.email)) {
  throw new Error('Invalid email address');
}
```

### 3. Autenticación Webhook

```javascript
// Usar tokens seguros
const webhookToken = process.env.WEBHOOK_AUTH_TOKEN;
if (!webhookToken || webhookToken.length < 32) {
  throw new Error('Invalid webhook token');
}
```

### 4. Manejo de Errores

```javascript
// Nunca exponer información sensible en errores
try {
  await EmailService.sendQuizSummaryEmail(...);
} catch (error) {
  console.error('Email sending failed:', error.message);
  // No exponer credenciales o detalles internos
  throw new Error('Failed to send email');
}
```

## 🔮 Mejoras Futuras

### Planeadas

1. **Sistema de Plantillas**
   - Soporte para múltiples plantillas de email
   - Personalización por curso/lección
   - Editor visual de plantillas

2. **Analytics y Reportes**
   - Dashboard de envíos
   - Tasa de éxito/fallo
   - Tiempos de respuesta

3. **Cola de Envío**
   - Sistema de cola para envíos masivos
   - Priorización de envíos
   - Procesamiento asíncrono

4. **Soporte para Múltiples Proveedores**
   - Soporte para SendGrid, Mailgun, etc.
   - Fallback automático entre proveedores
   - Balanceo de carga

### Opcionales

1. **Adjuntos en Email**
   - Incluir archivos subidos por usuarios
   - Generación de PDFs con resúmenes
   - Compresión de archivos

2. **Localización**
   - Soporte para múltiples idiomas
   - Formatos de fecha/hora locales
   - Plantillas traducidas

3. **WebSockets para Actualizaciones en Tiempo Real**
   - Notificaciones instantáneas
   - Actualizaciones de progreso
   - Chat en vivo para soporte

## 📞 Soporte

Para problemas o preguntas:

1. **Revisa este documento** - La mayoría de las preguntas están respondidas aquí
2. **Ejecuta el script de pruebas** - `node src/utils/testServices.js`
3. **Verifica los logs** - Los servicios incluyen logging detallado
4. **Consulta la documentación de las dependencias**:
   - [Nodemailer Documentation](https://nodemailer.com/documentation/)
   - [Axios Documentation](https://axios-http.com/docs/intro)

## 📄 Licencia

Este proyecto es parte del Instituto Lidera y está sujeto a los términos y condiciones de la organización.

---

**Última actualización**: 22 de enero de 2025
**Versión**: 1.0.0
**Autores**: Equipo de Desarrollo del Instituto Lidera
