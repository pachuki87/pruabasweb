# Configuración de Netlify Forms para Preguntas Abiertas

## Resumen
Este documento explica cómo configurar el sistema de formularios de preguntas abiertas del Instituto Lidera usando Netlify Forms, con procesamiento por IA usando Zai API y envío de resultados por email a través de la plataforma de Netlify.

## Archivos Principales

### 1. Formulario HTML
- **Archivo**: `formulario-preguntas-abiertas.html`
- **Función**: Formulario frontend con 4 preguntas abiertas sobre adicciones
- **Características**:
  - Diseño responsivo con Tailwind CSS
  - Validación de campos requeridos
  - Indicador de carga durante el procesamiento
  - Muestra de resultados y retroalimentación
  - Integración con Netlify Forms

### 2. Serverless Function
- **Archivo**: `netlify/functions/process-form.js`
- **Función**: Procesa las respuestas con Zai GLM API y prepara envío de emails
- **Características**:
  - Integración con Zai API (nfp_rVfRcr4gHR1s3jjq9b5ujYCHcGiqNqpkc9e4)
  - Modelo: glm[G
  - Preparación de emails para notificaciones
  - Manejo de errores y fallbacks
  - Respuestas en formato JSON estructurado

## Configuración de Variables de Entorno

### Variables Requeridas
Debes configurar estas variables en el panel de Netlify:

```bash
# Configuración de Zai API
ZAI_API_KEY=nfp_rVfRcr4gHR1s3jjq9b5ujYCHcGiqNqpkc9e4
ZAI_API_URL=https://api.zai.ai/v1/chat/completions
ZAI_MODEL=glm[G
```

### Cómo Configurar en Netlify:
1. Ve al dashboard de Netlify
2. Selecciona tu sitio "institutolidera"
3. Ve a "Site settings" → "Build & deploy" → "Environment"
4. Agrega las variables de entorno
5. Marca "Deploy without locking" para que se apliquen en el siguiente deploy

## Configuración de Emails con Netlify Forms

### Pasos para habilitar el envío de emails:
1. Ve a "Form settings" en el dashboard de Netlify
2. Selecciona tu formulario "preguntas-abiertas"
3. Configura las notificaciones por email
4. Añade los emails que recibirán las notificaciones
5. Netlify enviará automáticamente emails cuando se reciban nuevos formularios

## Funcionamiento del Sistema

### Flujo de Procesamiento:
1. **Envío del Formulario**: El usuario completa las 4 preguntas abiertas
2. **Netlify Forms**: Los datos se guardan automáticamente en Netlify Forms
3. **Procesamiento con IA**: La serverless function envía las respuestas a Zai GLM API
4. **Evaluación**: Zai GLM analiza y proporciona retroalimentación detallada
5. **Email de Resultados**: Netlify Forms envía un email con la evaluación al usuario
6. **Mostrar Resultados**: Se muestran los resultados en el frontend

### Estructura de la Respuesta de Zai GLM:
```json
{
  "pregunta1": {
    "correccion": "Retroalimentación detallada...",
    "puntuacion": 8,
    "sugerencias": ["Sugerencia 1", "Sugerencia 2"]
  },
  "pregunta2": {
    "correccion": "Retroalimentación detallada...",
    "puntuacion": 9,
    "sugerencias": ["Sugerencia 1", "Sugerencia 2"]
  },
  "resumen": "Resumen general del desempeño..."
}
```

## Despliegue

### Pasos para deployar:
1. **Configurar variables de entorno** en Netlify (ZAI_API_KEY)
2. **Hacer commit** de los cambios
3. **Deploy automático** a través de Git
4. **Probar el formulario** en el sitio deployed
5. **Configurar notificaciones de email** en Netlify Forms

### Comandos Útiles:
```bash
# Para deployar manualmente
npm run build
netlify deploy --prod

# Para probar localmente
netlify dev
```

## Monitoreo y Troubleshooting

### Verificar Form Submissions:
1. Ve a Netlify Dashboard
2. Selecciona tu sitio
3. Ve a "Forms" → "Form submissions"
4. Revisa los envíos recibidos

### Verificar Function Logs:
1. Ve a "Functions" en el dashboard
2. Selecciona "process-form"
3. Revisa los logs para identificar errores

### Configurar Notificaciones de Email:
1. Ve a "Forms" → "Form settings"
2. Selecciona el formulario "preguntas-abiertas"
3. Configura las notificaciones por email
4. Añade los emails que recibirán las notificaciones

### Problemas Comunes:
- **Error de Zai API**: Verifica la API key (nfp_rVfRcr4gHR1s3jjq9b5ujYCHcGiqNqpkc9e4) y el endpoint
- **Form no procesa**: Verifica que el form name coincida
- **Email no se envía**: Verifica la configuración de notificaciones en Netlify Forms
- **CORS errors**: Asegúrate de que el dominio esté configurado correctamente

## Personalización

### Agregar Nuevas Preguntas:
1. Modifica el HTML para agregar nuevos campos
2. Actualiza la serverless function para procesar los nuevos campos
3. Ajusta el prompt de GLM para incluir las nuevas preguntas

### Cambiar el Diseño:
- El formulario usa Tailwind CSS
- Los colores principales son: `#667eea` (azul) y `#764ba2` (púrpura)
- El diseño es totalmente responsivo

### Personalizar Email:
Modifica la plantilla HTML en la función `sendResultsEmail` en `process-form.js`

## Seguridad

### Medidas Implementadas:
- Validación de campos requeridos
- Manejo seguro de credenciales con variables de entorno
- Protección contra inyección de código
- Configuración de headers de seguridad

### Recomendaciones:
- Usar siempre variables de entorno para datos sensibles
- Rotar periódicamente las API keys
- Monitorear los form submissions para detectar spam
- Implementar rate limiting si es necesario

## Contacto y Soporte

Para problemas técnicos:
- Revisa los logs de Netlify Functions
- Verifica la configuración de variables de entorno
- Consulta la documentación de Netlify Forms
- Revisa la documentación de GLM API

## Actualizaciones

Mantener actualizados:
- Las dependencias del proyecto
- Las versiones de las APIs
- Las políticas de seguridad de Netlify