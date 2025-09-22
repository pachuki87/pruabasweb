# Guía Paso a Paso: Configurar Variables en el Dashboard de Netlify

## 🚨 SOLUCIÓN INMEDIATA AL ERROR "supabaseUrl is required"

Este error aparece porque las variables de entorno no están configuradas en Netlify. Sigue estos pasos exactos:

---

## 📋 PASO 1: Acceder al Dashboard de Netlify

1. Ve a [https://app.netlify.com/](https://app.netlify.com/)
2. Inicia sesión con tu cuenta
3. Busca tu sitio en la lista (probablemente algo como "aesthetic-bubblegum-2dbfa8" o similar)
4. **Haz clic en el nombre de tu sitio**

---

## ⚙️ PASO 2: Navegar a Variables de Entorno

1. Una vez dentro de tu sitio, busca en el menú lateral:
   - **Site settings** (Configuración del sitio)
2. Haz clic en **Site settings**
3. En el menú lateral izquierdo, busca:
   - **Environment variables** (Variables de entorno)
4. Haz clic en **Environment variables**

---

## ➕ PASO 3: Agregar la Primera Variable

### Variable 1: VITE_SUPABASE_URL

1. Haz clic en el botón **"Add variable"** (Agregar variable)
2. En el campo **"Key"** (Clave), escribe exactamente:
   ```
   VITE_SUPABASE_URL
   ```
3. En el campo **"Value"** (Valor), copia y pega exactamente:
   ```
   https://lyojcqiiixkqqtpoejdo.supabase.co
   ```
4. **NO marques** "Same value for all deploy contexts" (a menos que sepas lo que haces)
5. Haz clic en **"Create variable"** (Crear variable)

---

## ➕ PASO 4: Agregar la Segunda Variable

### Variable 2: VITE_SUPABASE_ANON_KEY

1. Haz clic nuevamente en **"Add variable"**
2. En el campo **"Key"**, escribe exactamente:
   ```
   VITE_SUPABASE_ANON_KEY
   ```
3. En el campo **"Value"**, copia y pega exactamente:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc
   ```
4. Haz clic en **"Create variable"**

---

## 🔄 PASO 5: Redesplegar el Sitio

**⚠️ CRÍTICO: Las variables no tendrán efecto hasta que redespliegues**

### Opción A: Trigger Deploy (Más Rápido)
1. Ve a la pestaña **"Deploys"** (Despliegues)
2. Haz clic en **"Trigger deploy"** (Activar despliegue)
3. Selecciona **"Deploy site"** (Desplegar sitio)
4. Espera a que termine el despliegue (aparecerá "Published" cuando esté listo)

### Opción B: Push al Repositorio
1. Haz cualquier cambio pequeño en tu código
2. Haz commit y push a tu repositorio
3. Netlify automáticamente desplegará

---

## ✅ PASO 6: Verificar que Funciona

1. Una vez que el despliegue esté completo, ve a tu sitio web
2. Abre las **Herramientas de Desarrollador** (F12)
3. Ve a la pestaña **"Console"** (Consola)
4. Recarga la página (F5)
5. Deberías ver:
   ```
   ✅ Supabase configuration loaded successfully
   ```
6. **Si NO ves errores de "supabaseUrl is required", ¡está funcionando!**

---

## 🔍 SOLUCIÓN DE PROBLEMAS

### ❌ Aún veo "Error: supabaseUrl is required"

**Posibles causas:**
1. **No redespliegaste** → Ve al Paso 5
2. **Nombres incorrectos** → Verifica que sean exactamente `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. **Valores incorrectos** → Copia y pega exactamente los valores del Paso 3 y 4
4. **Caché del navegador** → Presiona Ctrl+F5 para recargar sin caché

### ❌ No encuentro "Environment variables"

1. Asegúrate de estar en **Site settings** (no en Team settings)
2. Busca en el menú lateral izquierdo
3. Puede aparecer como "Build & deploy" > "Environment variables"

### ❌ Las variables no aparecen después de crearlas

1. Refresca la página del dashboard
2. Verifica que estés en el sitio correcto
3. Las variables deberían aparecer en la lista

---

## 📞 VERIFICACIÓN FINAL

Ejecuta este comando en tu terminal local para verificar:
```bash
node verify-env-vars.js
```

**Nota:** Este comando solo funciona localmente. En producción, las variables se verifican automáticamente.

---

## 🎯 RESUMEN RÁPIDO

1. **Netlify Dashboard** → **Tu sitio** → **Site settings** → **Environment variables**
2. **Add variable**: `VITE_SUPABASE_URL` = `https://lyojcqiiixkqqtpoejdo.supabase.co`
3. **Add variable**: `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. **Deploys** → **Trigger deploy** → **Deploy site**
5. **Verificar** que no hay errores en la consola del navegador

¡Eso es todo! El error debería desaparecer después del redespliegue.