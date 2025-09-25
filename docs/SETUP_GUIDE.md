# Guía Rápida de Configuración para Solución de Webhook

## 🚀 Pasos Inmediatos para Solucionar el Problema

### 1. Reemplazar Archivos Críticos

**Copia estos archivos mejorados a tu proyecto:**

```bash
# Función de Netlify mejorada
cp netlify/functions/send-corrections.js netlify/functions/send-corrections.js.backup
# (Aquí iría tu archivo mejorado)

# Componente frontend mejorado
cp src/components/QuizComponent.jsx src/components/QuizComponent.jsx.backup
# (Aquí iría tu archivo mejorado)
```

### 2. Configurar Variables de Entorno en Netlify

**Ve al dashboard de Netlify → Site settings → Build & deploy → Environment:**

```bash
N8N_WEBHOOK_URL=https://n8n.srv1024767.hstgr.cloud/webhook/fbdc5d15-3435-42f9-8047-891869aa9f7e
MAX_RETRIES=3
WEBHOOK_TIMEOUT=30000
DEBUG_MODE=true
```

### 3. Ejecutar Diagnóstico Inmediato

**Desde la raíz de tu proyecto:**

```bash
# Test rápido de conectividad
node scripts/test-webhook-connectivity.js

# Diagnóstico completo
node scripts/debug-webhook-issues.js
```

### 4. Verificar en la Aplicación

**Pasos para probar:**

1. Abre la aplicación en el navegador
2. Completa un cuestionario
3. Envía el formulario
4. Observa los mensajes de respuesta:
   - ✅ **Éxito**: "¡Formulario enviado exitosamente!"
   - ⚠️ **Parcial**: "Tu formulario se guardó pero hubo problemas..."
   - ❌ **Error**: Mensaje específico del error

### 5. Revisar Logs en Netlify

**En Netlify dashboard:**

1. Functions → send-corrections
2. Busca logs con timestamps recientes
3. Busca los Request IDs (formato: `req-xxxxxxxxx`)
4. Verifica que no aparezcan errores

## 🔍 Si Sigues Teniendo Problemas

### Caso 1: La aplicación muestra éxito pero n8n no recibe nada

**Ejecuta este comando:**
```bash
node scripts/debug-webhook-issues.js
```

**Busca en el output:**
- Si "Prueba directa" falla → Problema con n8n
- Si "Prueba de función Netlify" falla → Problema con Netlify
- Si "Flujo completo" falla → Problema con el payload

### Caso 2: La aplicación muestra errores

**Revisa los mensajes de error:**
- Si dice "Conexión rechazada" → n8n está caído
- Si dice "Timeout" → n8n no responde
- Si dice "Error HTTP 404" → URL del webhook incorrecta

### Caso 3: No sabes qué está pasando

**Revisa los logs de Netlify:**
1. Netlify dashboard → Functions
2. Click en "send-corrections"
3. Busca errores con detalles

## 📞 Acciones de Emergencia

### Si n8n no responde:
```bash
# Verificar si n8n está accesible
curl -I https://n8n.srv1024767.hstgr.cloud
```

### Si la función Netlify falla:
```bash
# Redesplegar la función
netlify deploy --prod
```

### Si nada funciona:
1. Revisa que la URL del webhook sea correcta
2. Contacta al administrador de n8n
3. Verifica la configuración de red

## 🎯 Checklist Rápido

- [ ] Archivos actualizados en el proyecto
- [ ] Variables de entorno configuradas en Netlify
- [ ] Diagnóstico ejecutado sin errores
- [ ] Aplicación probada con un cuestionario real
- [ ] n8n recibe los datos correctamente

---

**¡Importante!** Después de hacer estos cambios, espera 2-3 minutos para que Netlify actualice la función, luego prueba nuevamente.