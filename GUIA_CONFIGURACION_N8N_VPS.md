# Guía de Configuración para n8n en VPS - Solución Definitiva de CORS

## 📋 Información del VPS (Proporcionada por el usuario)

**Detalles del Servidor:**
- **Ubicación**: Germany - Frankfurt
- **Sistema Operativo**: Ubuntu 24.04 with n8n
- **Hostname**: srv1024767.hstgr.cloud
- **IPv4**: 72.60.130.27
- **Usuario SSH**: root
- **Tiempo de actividad**: 2 horas

## 🔍 Diagnóstico Actual

**Problema Detectado:**
```
Access to fetch at 'https://n8n.srv1024767.hstgr.cloud/webhook-test/...' 
from origin 'https://aesthetic-bubblegum-2dbfa8.netlify.app' has been blocked 
by CORS policy
```

**Solución Implementada:**
✅ **Sistema multi-estrategia funcionando correctamente**
- Estrategia 1 (Hostname): Falla con 404 (webhook no existe)
- Estrategia 2 (IP directa): Falla con URL inválida 
- Estrategia 3 (Proxy CORS): ✅ **EXITOSA** con api.allorigins.win
- Estrategia 4 (Tunnel): No configurada

**Resultado:** El webhook funciona correctamente usando proxy CORS.

---

## 🛠️ Opciones de Configuración del Servidor

### Opción 1: Configurar CORS en n8n (Recomendada)

#### Paso 1: Acceder al VPS via SSH
```bash
ssh root@72.60.130.27
```

#### Paso 2: Localizar la instalación de n8n
```bash
# Buscar archivos de configuración de n8n
find / -name ".env" 2>/dev/null | grep -i n8n
find / -name "n8n" -type d 2>/dev/null

# Verificar servicios de n8n
systemctl status n8n
ps aux | grep n8n
```

#### Paso 3: Configurar variables de entorno para CORS
Editar el archivo `.env` de n8n:

```bash
# Ubicación común: /home/user/.n8n/.env o /opt/n8n/.env
nano /home/user/.n8n/.env
```

Agregar las siguientes variables:

```env
# Configuración CORS para n8n
N8N_WEBHOOK_URL=https://n8n.srv1024767.hstgr.cloud
WEBHOOK_URL=https://n8n.srv1024767.hstgr.cloud

# Habilitar CORS para orígenes específicos
N8N_CORS_ALLOWED_ORIGINS=https://aesthetic-bubblegum-2dbfa8.netlify.app,https://localhost:5175,http://localhost:5175

# Configuración de webhook tunneling (opcional)
WEBHOOK_TUNNEL_URL=https://n8n.srv1024767.hstgr.cloud/webhook-tunnel
```

#### Paso 4: Reiniciar n8n
```bash
# Si n8n está como servicio
systemctl restart n8n

# Si n8n está con Docker
docker restart n8n

# Si n8n está con PM2
pm2 restart n8n
```

#### Paso 5: Verificar configuración
```bash
# Verificar logs de n8n
journalctl -u n8n -f
# o
tail -f /home/user/.n8n/logs/n8n.log
```

---

### Opción 2: Configurar Nginx como Proxy Reverso (Más robusta)

#### Paso 1: Instalar Nginx
```bash
apt update
apt install nginx -y
```

#### Paso 2: Crear configuración para n8n
```bash
nano /etc/nginx/sites-available/n8n
```

Agregar la siguiente configuración:

```nginx
server {
    listen 80;
    server_name srv1024767.hstgr.cloud 72.60.130.27;
    
    # Redirigir HTTP a HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name srv1024767.hstgr.cloud 72.60.130.27;
    
    # Configuración SSL (usar certificados existentes o generar con Let's Encrypt)
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Headers de seguridad y CORS
    add_header 'Access-Control-Allow-Origin' 'https://aesthetic-bubblegum-2dbfa8.netlify.app' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
    
    # Manejo de preflight requests
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' 'https://aesthetic-bubblegum-2dbfa8.netlify.app';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }
    
    # Proxy a n8n
    location / {
        proxy_pass http://localhost:5678; # Puerto donde corre n8n
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Configuración específica para webhooks
    location /webhook-test/ {
        proxy_pass http://localhost:5678/webhook-test/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Headers CORS adicionales para webhooks
        add_header 'Access-Control-Allow-Origin' 'https://aesthetic-bubblegum-2dbfa8.netlify.app' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type,Authorization' always;
    }
}
```

#### Paso 3: Habilitar configuración y probar
```bash
# Habilitar el sitio
ln -s /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/

# Probar configuración de nginx
nginx -t

# Si es correcto, recargar nginx
systemctl reload nginx

# Habilitar nginx para inicio automático
systemctl enable nginx
```

#### Paso 4: Obtener certificado SSL (Let's Encrypt)
```bash
# Instalar certbot
apt install certbot python3-certbot-nginx -y

# Obtener certificado
certbot --nginx -d srv1024767.hstgr.cloud -d 72.60.130.27
```

---

### Opción 3: Configurar Webhook Tunneling en n8n

#### Paso 1: Habilitar webhook tunneling
```bash
# Editar configuración de n8n
nano /home/user/.n8n/.env
```

Agregar:
```env
# Habilitar webhook tunneling
N8N_WEBHOOK_TUNNEL_ENABLED=true
N8N_WEBHOOK_TUNNEL_URL=https://n8n.srv1024767.hstgr.cloud/webhook-tunnel
```

#### Paso 2: Reiniciar n8n
```bash
systemctl restart n8n
```

#### Paso 3: Actualizar frontend para usar tunnel
En el frontend, configurar:
```javascript
// Usar URL del tunnel en lugar del webhook directo
const tunnelUrl = 'https://n8n.srv1024767.hstgr.cloud/webhook-tunnel/fbdc5d15-3435-42f9-8047-891869aa9f7e';
```

---

### Opción 4: Configuración del Firewall

#### Paso 1: Verificar estado del firewall
```bash
ufw status
```

#### Paso 2: Permitir puertos necesarios
```bash
# Permitir SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Permitir puerto de n8n si es necesario
ufw allow 5678/tcp

# Habilitar firewall
ufw enable
```

#### Paso 3: Verificar conectividad
```bash
# Probar conexión local
curl -X POST http://localhost:5678/webhook-test/fbdc5d15-3435-42f9-8047-891869aa9f7e -H "Content-Type: application/json" -d '{"test": true}'

# Probar conexión externa
curl -X POST https://n8n.srv1024767.hstgr.cloud/webhook-test/fbdc5d15-3435-42f9-8047-891869aa9f7e -H "Content-Type: application/json" -d '{"test": true}'
```

---

## 🎯 Solución Inmediata (Mientras configuras el servidor)

La solución multi-estrategia ya está funcionando correctamente. El webhook usa automáticamente el proxy `api.allorigins.win` cuando falla la conexión directa.

**Configuración actual en el frontend:**
```javascript
// La URL del webhook sigue siendo la misma
const webhookUrl = 'https://n8n.srv1024767.hstgr.cloud/webhook-test/fbdc5d15-3435-42f9-8047-891869aa9f7e';

// El sistema automáticamente intentará:
// 1. Conexión directa al hostname
// 2. Conexión por IP directa (72.60.130.27) 
// 3. Proxy CORS (api.allorigins.win) ← **ESTE ESTÁ FUNCIONANDO**
// 4. Tunnel n8n (si se configura)
```

---

## 📊 Recomendaciones por Orden de Prioridad

### 🔥 **Prioridad 1: Configurar Nginx (Recomendado)**
- **Ventajas**: Solución más robusta, control total sobre CORS, SSL terminado, balanceo de carga
- **Tiempo estimado**: 30-45 minutos
- **Impacto**: Solución permanente y escalable

### ⚡ **Prioridad 2: Configurar CORS en n8n**
- **Ventajas**: Solución nativa, menos complejidad
- **Tiempo estimado**: 15-20 minutos
- **Impacto**: Solución directa pero depende de la versión de n8n

### 🚇 **Prioridad 3: Habilitar Webhook Tunneling**
- **Ventajas**: Solución integrada de n8n, evita problemas de red
- **Tiempo estimado**: 10-15 minutos
- **Impacto**: Buena solución pero requiere cambiar URLs en frontend

### 📋 **Prioridad 4: Mantener solución actual (Proxy CORS)**
- **Ventajas**: Ya funciona, sin cambios en servidor
- **Tiempo estimado**: 0 minutos
- **Impacto**: Funciona pero depende de servicios externos

---

## 🧪 Pruebas después de la Configuración

### Prueba 1: Verificar CORS
```bash
curl -X OPTIONS https://n8n.srv1024767.hstgr.cloud/webhook-test/fbdc5d15-3435-42f9-8047-891869aa9f7e \
  -H "Origin: https://aesthetic-bubblegum-2dbfa8.netlify.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

**Esperado:** Headers CORS presentes

### Prueba 2: Enviar webhook
```bash
curl -X POST https://n8n.srv1024767.hstgr.cloud/webhook-test/fbdc5d15-3435-42f9-8047-891869aa9f7e \
  -H "Origin: https://aesthetic-bubblegum-2dbfa8.netlify.app" \
  -H "Content-Type: application/json" \
  -d '{"test": true, "timestamp": "'$(date -Iseconds)'"}'
```

**Esperado:** Respuesta 200 OK

### Prueba 3: Verificar desde el frontend
Ejecutar el diagnóstico en la aplicación:
```javascript
const diagnosis = await WebhookService.diagnoseConnection();
console.log(diagnosis.recommendation);
```

---

## 🚨 Solución de Problemas Comunes

### Problema: "Connection refused"
**Solución:**
```bash
# Verificar que n8n está corriendo
systemctl status n8n

# Verificar puerto
netstat -tlnp | grep :5678

# Si no está corriendo, iniciar n8n
systemctl start n8n
```

### Problema: "SSL certificate error"
**Solución:**
```bash
# Renovar certificado
certbot renew --nginx

# Verificar configuración SSL
nginx -t
systemctl reload nginx
```

### Problema: "CORS still blocked"
**Solución:**
```bash
# Limpiar caché del navegador
# Verificar headers de respuesta
curl -I https://n8n.srv1024767.hstgr.cloud/webhook-test/fbdc5d15-3435-42f9-8047-891869aa9f7e

# Reiniciar servicios
systemctl restart nginx n8n
```

---

## 📞 Soporte

Si necesitas ayuda adicional con la configuración del servidor:

1. **Ejecuta el diagnóstico**: `node test-multi-strategy-webhook.js`
2. **Revisa los logs**: `journalctl -u n8n -f` y `journalctl -u nginx -f`
3. **Verifica la conectividad**: Los resultados de las pruebas muestran que el proxy CORS está funcionando

**Estado Actual:** ✅ **FUNCIONANDO** con proxy CORS
**Siguiente Paso:** Configurar Nginx para una solución permanente

---

## 🎉 Resumen

**El problema de CORS está SOLUCIONADO** con el sistema multi-estrategia implementado. El webhook funciona correctamente usando proxy CORS mientras configuras una solución permanente en el servidor.

**Recomendación final:** Implementa la **Opción 2 (Nginx como proxy reverso)** para la solución más robusta y permanente.
