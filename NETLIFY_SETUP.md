# Configuración de Variables de Entorno en Netlify

## Problema Común: "Error: supabaseUrl is required"

Este error ocurre cuando las variables de entorno no están configuradas correctamente en Netlify. Las variables que empiezan con `VITE_` deben estar disponibles durante el build y en tiempo de ejecución.

## Pasos para Configurar Variables de Entorno en Netlify

### 1. Acceder a la Configuración del Sitio

1. Ve a tu dashboard de Netlify
2. Selecciona tu sitio
3. Ve a **Site settings** > **Environment variables**

### 2. Agregar Variables Requeridas

Agrega las siguientes variables de entorno:

#### Variables Obligatorias:

```
VITE_SUPABASE_URL=https://lyojcqiiixkqqtpoejdo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc
```

#### Variables Opcionales:

```
VITE_APP_URL=https://tu-sitio.netlify.app
VITE_SUPABASE_SERVICE_KEY=tu-service-key (solo si es necesario)
NODE_ENV=production
```

### 3. Variables Específicas del Proyecto

**⚠️ IMPORTANTE: Usa exactamente estos valores para el proyecto institutolidera-elearning:**

- **VITE_SUPABASE_URL**: `https://lyojcqiiixkqqtpoejdo.supabase.co`
- **VITE_SUPABASE_ANON_KEY**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc`

### 4. Configurar en Netlify (PASOS EXACTOS)

**Variable 1:**
1. En Netlify, haz clic en **Add variable**
2. Key: `VITE_SUPABASE_URL`
3. Value: `https://lyojcqiiixkqqtpoejdo.supabase.co`
4. Haz clic en **Create variable**

**Variable 2:**
1. Haz clic en **Add variable** nuevamente
2. Key: `VITE_SUPABASE_ANON_KEY`
3. Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc`
4. Haz clic en **Create variable**

### 5. Redesplegar el Sitio

Después de agregar las variables:

1. Ve a **Deploys**
2. Haz clic en **Trigger deploy** > **Deploy site**
3. O haz un nuevo push a tu repositorio

## Verificación

Para verificar que las variables están configuradas correctamente:

1. Abre las herramientas de desarrollador en tu sitio desplegado
2. Ve a la consola
3. Deberías ver el mensaje: `✅ Supabase configuration loaded successfully`
4. Si ves errores, revisa que las variables estén configuradas correctamente

## Solución de Problemas

### Error: "VITE_SUPABASE_URL is missing"

- Verifica que la variable esté configurada en Netlify
- Asegúrate de que el nombre sea exactamente `VITE_SUPABASE_URL`
- Redesplega el sitio después de agregar la variable

### Error: "supabaseUrl is required"

- Este es el error original que indica que `VITE_SUPABASE_URL` no está disponible
- Sigue los pasos anteriores para configurar las variables

### Las variables no se cargan

- Las variables deben empezar con `VITE_` para estar disponibles en el frontend
- Netlify requiere un nuevo deploy después de cambiar variables de entorno
- Verifica que no haya espacios extra en los nombres o valores

## Notas Importantes

- ⚠️ Solo las variables que empiezan con `VITE_` están disponibles en el frontend
- 🔒 La clave `anon` de Supabase es segura para usar en el frontend
- 🚫 NUNCA expongas la `service_role` key en el frontend
- 🔄 Siempre redesplega después de cambiar variables de entorno

## Archivo de Referencia

Puedes usar el archivo `.env.example` como referencia para saber qué variables configurar.