# Instrucciones Rápidas de Configuración

## Pasos para Poner en Marcha el Proyecto

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
```bash
cp .env.example .env
```
Editar el archivo `.env` con tus credenciales:
```
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-de-supabase
VITE_STRIPE_PUBLIC_KEY=tu-clave-publica-de-stripe
```

### 3. Configurar Supabase
1. Crear un nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecutar las migraciones desde `database/supabase/migrations/`
3. Configurar las políticas de seguridad (RLS)
4. Añadir las URL del proyecto a las variables de entorno

### 4. Configurar Stripe (Opcional, para pagos)
1. Crear cuenta en [Stripe](https://stripe.com)
2. Configurar productos y precios
3. Añadir claves a las variables de entorno

### 5. Ejecutar el Proyecto

#### Desarrollo
```bash
npm run dev
```

#### Producción
```bash
npm run build
npm run preview
```

### 6. Despliegue

#### Netlify
1. Conectar repositorio a Netlify
2. Configurar variables de entorno
3. Desplegar automáticamente

#### Vercel
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

## Verificación

Para verificar que todo funciona correctamente:

1. **Acceso a la aplicación**: Abrir `http://localhost:5173`
2. **Registro de usuarios**: Probar crear una cuenta
3. **Acceso a cursos**: Verificar que los cursos se muestran
4. **Contenido de lecciones**: Acceder a algunas lecciones
5. **Cuestionarios**: Probar responder algunos cuestionarios

## Solución de Problemas Comunes

### Problemas de Conexión a Supabase
- Verificar que las variables de entorno son correctas
- Comprobar que el proyecto de Supabase está activo
- Revisar las políticas de seguridad (RLS)

### Problemas de Estilos
- Ejecutar `npm install` de nuevo
- Verificar que Tailwind CSS está configurado correctamente
- Limpiar caché del navegador

### Problemas de Rutas
- Verificar que el archivo `_redirects` está en la raíz
- Comprobar la configuración de React Router
- Revisar las rutas en Netlify/Vercel

## Soporte

Si encuentras algún problema:
1. Revisa la consola del navegador para errores
2. Verifica los logs de Netlify/Vercel
3. Comprueba la configuración de Supabase
4. Contacta al equipo de desarrollo