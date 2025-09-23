# Instrucciones para Implementar los Cambios de Supabase

## 🚨 **IMPORTANTE: Pasos Requeridos**

Los cambios que hemos realizado no se aplicarán automáticamente. Debes seguir estos pasos:

---

## 🔧 **1. Verificar Archivos Modificados**

Los siguientes archivos han sido modificados y necesitan ser implementados:

### **Archivos Críticos:**
- ✅ `src/lib/supabase.ts` - Configuración principal de Supabase
- ✅ `src/vite-env.d.ts` - Tipos de TypeScript para variables de entorno
- ✅ `.env` - Variables de entorno (ya estaba configurado)

### **Archivos de Diagnóstico:**
- 📝 `diagnostico-env.js` - Para diagnosticar problemas
- 📝 `test-supabase-config.js` - Para probar la configuración

---

## 🔄 **2. Pasos para Implementación**

### **Opción A: Entorno de Desarrollo Local**

```bash
# 1. Detener el servidor de desarrollo si está corriendo
# (Ctrl+C en la terminal donde se ejecuta npm run dev)

# 2. Limpiar caché de Vite
npm run build -- --force
# o si usas yarn
yarn build --force

# 3. Reiniciar el servidor de desarrollo
npm run dev
# o
yarn dev
```

### **Opción B: Entorno de Producción (Vercel/Netlify)**

```bash
# 1. Commit todos los cambios
git add .
git commit -m "Fix: Configuración Supabase y solución error supabaseUrl"

# 2. Subir cambios al repositorio
git push origin main
# o
git push origin master

# 3. El despliegue automático se activará en Vercel/Netlify
```

### **Opción C: Si usas Docker**

```bash
# 1. Reconstruir la imagen
docker build -t tu-app .

# 2. Reiniciar el contenedor
docker-compose down
docker-compose up --build
```

---

## 🧪 **3. Verificar que Funciona**

### **En el Navegador (Consola):**
Deberías ver estos mensajes al cargar la aplicación:

```
🔍 DIAGNÓSTICO DE CONFIGURACIÓN SUPABASE:
Variables de entorno VITE_ disponibles:
  VITE_SUPABASE_URL: ✅ CONFIGURADA
    Valor: https://lyojcqiiixkqqtpoejdo.supabase.co
  VITE_SUPABASE_ANON_KEY: ✅ CONFIGURADA
    Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ Variables de entorno validadas correctamente
📡 URL de Supabase: https://lyojcqiiixkqqtpoejdo.supabase.co
🔑 Clave anónima: Configurada
✅ Cliente Supabase creado exitosamente
✅ Configuración de Supabase completada exitosamente
```

### **Si el error persiste:**
1. Abre `diagnostico-env.js` en el navegador
2. Ejecuta el script en la consola
3. Revisa los mensajes de diagnóstico

---

## 🚨 **4. Problemas Comunes y Soluciones**

### **Problema: "Variables de entorno no cargan"**
```bash
# Solución: Verificar que el archivo .env esté en la raíz del proyecto
ls -la .env
# Debe mostrar: -rw-r--r-- 1 user group 1234 Oct 22 19:30 .env
```

### **Problema: "Error de TypeScript"**
```bash
# Solución: Limpiar caché de TypeScript
rm -rf node_modules/.vite
npm install
```

### **Problema: "Error en producción"**
```bash
# Solución: Verificar variables de entorno en la plataforma de despliegue
# En Vercel: Project Settings > Environment Variables
# En Netlify: Site Settings > Build & deploy > Environment
```

---

## ✅ **5. Prueba Final**

Una vez implementados los cambios, prueba los cuestionarios:

1. **Accede a una lección con cuestionario**
2. **Debería cargar el cuestionario sin errores**
3. **Completa algunas preguntas**
4. **Verifica que los resultados se guarden correctamente**

### **URLs de Prueba:**
- `http://localhost:5174/cursos/[curso-id]/lecciones/[leccion-id]`
- Reemplaza `[curso-id]` y `[leccion-id]` con IDs válidos

---

## 📞 **6. Soporte**

Si después de seguir estos pasos el error persiste:

1. **Revisa la consola del navegador** para mensajes de error detallados
2. **Ejecuta el script de diagnóstico** (`diagnostico-env.js`)
3. **Verifica las variables de entorno** en tu plataforma de despliegue
4. **Contacta al equipo de desarrollo** con los mensajes de error exactos

---

## 🎯 **Resumen de Cambios**

| Archivo | Cambio | Propósito |
|---------|--------|-----------|
| `src/lib/supabase.ts` | ✅ Mejorado | Manejo robusto de errores y diagnóstico |
| `src/vite-env.d.ts` | ✅ Actualizado | Tipos TypeScript para variables de entorno |
| `.env` | ✅ Verificado | Variables de entorno correctas |

**El error `supabaseUrl is required` debería estar resuelto después de implementar estos cambios.**
