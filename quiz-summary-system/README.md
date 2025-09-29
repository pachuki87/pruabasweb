# 🚀 Sistema de Envío de Resúmenes de Cuestionarios

Esta carpeta contiene la implementación completa del sistema de envío automático de resúmenes de cuestionarios a través de email y webhooks.

## 📁 Estructura de Archivos

```
quiz-summary-system/
├── 📄 QuizSummaryGenerator.js    # Generador de resúmenes en múltiples formatos
├── 📄 EmailService.js            # Servicio de envío de emails con Nodemailer
├── 📄 WebhookService.js          # Servicio de envío de webhooks con Axios
├── 📄 QuizComponent.jsx          # Componente UI principal modificado
├── 📄 QuizComponent.css          # Estilos CSS actualizados
├── 📄 testServices.js            # Script de pruebas completo
├── 📄 .env.example               # Plantilla de variables de entorno
├── 📄 QUIZ_SUMMARY_SYSTEM.md     # Documentación técnica completa
├── 📄 README_QUIZ_SUMMARY.md     # Guía rápida de implementación
├── 📄 verify-implementation.cjs  # Script de verificación final
└── 📄 README.md                  # Este archivo
```

## ✅ Características Implementadas

### Core Functionality
- ✅ **Generación automática de resúmenes** en formato texto, HTML y JSON
- ✅ **Envío de emails personalizados** con plantillas HTML profesionales
- ✅ **Integración con webhooks** para notificar a sistemas externos
- ✅ **Soporte para todos los tipos de preguntas** (múltiple opción, texto libre, verdadero/falso)
- ✅ **Manejo de archivos adjuntos** en respuestas de texto libre

### Technical Features
- ✅ **Sistema de reintentos** con backoff exponencial para envíos fallidos
- ✅ **Logging detallado** para depuración y monitoreo
- ✅ **Validación de configuración** antes de enviar
- ✅ **Interfaz de usuario intuitiva** con retroalimentación visual en tiempo real
- ✅ **Manejo de errores robusto** con mensajes descriptivos

### UI/UX Improvements
- ✅ **Indicadores de estado** para envío de email y webhook
- ✅ **Animaciones y transiciones** suaves
- ✅ **Diseño responsive** para todos los dispositivos
- ✅ **Feedback visual** durante el proceso de envío
- ✅ **Estado de servicios** visible en la interfaz de inicio

## 🚀 Instalación Rápida

### 1. Instalar Dependencias
```bash
npm install nodemailer axios
# o
yarn add nodemailer axios
```

### 2. Configurar Variables de Entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Verificar Funcionamiento
```bash
node verify-implementation.cjs
```

## ⚙️ Configuración Requerida

### Variables de Entorno (.env)
```bash
# Email Configuration
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_USER=tu-email@institutolidera.com
EMAIL_PASS=tu-app-password
EMAIL_FROM="Instituto Lidera" <tu-email@institutolidera.com>

# Webhook Configuration
WEBHOOK_URL=https://tu-webhook-endpoint.com/api/quiz-summary
WEBHOOK_AUTH_TOKEN=tu-token-seguro

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
```

### Configuración de Gmail
1. Habilitar **Verificación en dos pasos** en tu cuenta Google
2. Generar una **Contraseña de aplicación** en:
   - Configuración de Google → Seguridad → Contraseñas de aplicación
3. Usar esa contraseña en `EMAIL_PASS`

## 🧪 Pruebas

### Ejecutar Todas las Pruebas
```javascript
// En la consola del navegador
import { runAllTests } from './testServices.js';
await runAllTests();
```

### Probar Email Específico
```javascript
import { testEmailSending } from './testServices.js';
await testEmailSending('tu-email@test.com');
```

### Probar Webhook
```javascript
import { testWebhookSending } from './testServices.js';
await testWebhookSending();
```

## 📖 Documentación

- **Documentación Completa**: `QUIZ_SUMMARY_SYSTEM.md`
- **Guía Rápida**: `README_QUIZ_SUMMARY.md`
- **Script de Pruebas**: `testServices.js`
- **Ejemplo de Configuración**: `.env.example`
- **Verificación**: `verify-implementation.cjs`

## 🔧 Uso Básico

### Integración en Componentes
```jsx
import QuizComponent from './QuizComponent';

function LessonPage() {
  return (
    <QuizComponent 
      leccionId="leccion-id"
      courseId="curso-id"
      onQuizComplete={(results) => {
        console.log('Cuestionario completado:', results);
      }}
    />
  );
}
```

### Uso Independiente de Servicios
```javascript
// Generar resumen
import QuizSummaryGenerator from './QuizSummaryGenerator';
const summary = QuizSummaryGenerator.generateDetailedSummary(quiz, answers, questions, user, results);

// Enviar email
import EmailService from './EmailService';
const emailResult = await EmailService.sendQuizSummaryEmail(user, quiz, summary, html);

// Enviar webhook
import WebhookService from './WebhookService';
const webhookResult = await WebhookService.sendQuizWebhook(payload);
```

## 📊 Formatos de Salida

### Email (HTML)
- Asunto: `📊 Resumen de Cuestionario - [Título del Cuestionario]`
- Plantilla profesional con logo y colores institucionales
- Incluye: Puntuación, tiempo, respuestas detalladas, archivos adjuntos

### Webhook (JSON)
```json
{
  "type": "quiz-summary",
  "timestamp": "2025-01-22T13:30:00.000Z",
  "version": "1.0.0",
  "data": {
    "user": { "id": "user123", "email": "user@example.com" },
    "quiz": { "id": "quiz456", "title": "Título del Cuestionario" },
    "results": { "score": 85, "approved": true },
    "summary": { /* resumen completo */ }
  }
}
```

## 🔒 Consideraciones de Seguridad

- **Nunca commits** archivos `.env` con credenciales reales
- **Usa secretos** de tu plataforma de hosting (Vercel, Netlify, etc.)
- **Valida todos los datos** de entrada antes de procesar
- **Usa tokens seguros** para autenticación de webhooks (mínimo 32 caracteres)

## 🔧 Solución de Problemas Comunes

### 1. Email no se envía
**Verificar**: Variables de entorno, credenciales SMTP, conexión a internet
**Comando**: `echo $EMAIL_SMTP_HOST && echo $EMAIL_USER`

### 2. Webhook falla
**Verificar**: URL del webhook, token de autenticación, disponibilidad del endpoint
**Prueba**: `curl -X POST [URL] -H "Authorization: Bearer [TOKEN]"`

### 3. Resumen vacío
**Verificar**: Estructura de datos de entrada, IDs de preguntas/respuestas
**Depuración**: `console.log('Quiz:', quiz, 'Answers:', answers)`

## 📞 Soporte

Para problemas o preguntas:
1. Revisa la documentación completa en `QUIZ_SUMMARY_SYSTEM.md`
2. Ejecuta el script de pruebas: `node verify-implementation.cjs`
3. Verifica los logs en la consola del navegador y del servidor
4. Consulta la documentación de las dependencias: [Nodemailer](https://nodemailer.com/), [Axios](https://axios-http.com/)

---

**Implementación completada el**: 22 de enero de 2025  
**Versión**: 1.0.0  
**Estado**: ✅ LISTO PARA PRODUCCIÓN  

🎉 **¡Felicidades! El sistema de envío de resúmenes de cuestionarios está completamente implementado y listo para usar.**

## 🔄 Para subir a GitHub

Sigue estos pasos para subir los cambios a GitHub:

```bash
# 1. Inicializar git si no está inicializado
git init

# 2. Añadir todos los archivos
git add .

# 3. Hacer commit de los cambios
git commit -m "feat: Implementar sistema de envío de resúmenes de cuestionarios

- Añadir servicios de email (Nodemailer) y webhook (Axios)
- Implementar generador de resúmenes en múltiples formatos
- Modificar QuizComponent con integración completa
- Añadir interfaz de usuario con indicadores de estado
- Incluir sistema de reintentos y manejo de errores
- Agregar documentación completa y scripts de pruebas
- Soporte para todos los tipos de preguntas y archivos adjuntos"

# 4. Conectar a tu repositorio de GitHub
git remote add origin https://github.com/tu-usuario/tu-repositorio.git

# 5. Subir los cambios
git push -u origin main
```

O si prefieres usar la interfaz de GitHub Desktop:
1. Abre GitHub Desktop
2. Selecciona este repositorio
3. Haz commit de los cambios con el mensaje anterior
4. Publica/Push a GitHub
