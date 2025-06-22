# Configuración de Google OAuth en Supabase

Para habilitar el registro e inicio de sesión con Google en tu aplicación, necesitas configurar Google OAuth en tu proyecto de Supabase.

## Pasos para configurar Google OAuth:

### 1. Configurar Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ (Google Plus API)
4. Ve a "Credenciales" en el menú lateral
5. Haz clic en "Crear credenciales" > "ID de cliente OAuth 2.0"
6. Configura la pantalla de consentimiento OAuth si es necesario
7. Selecciona "Aplicación web" como tipo de aplicación
8. Agrega las siguientes URLs autorizadas:
   - **Orígenes JavaScript autorizados**: `http://localhost:5173` (para desarrollo)
   - **URIs de redirección autorizados**: `https://tu-proyecto.supabase.co/auth/v1/callback`

### 2. Configurar Supabase

1. Ve a tu [panel de Supabase](https://app.supabase.com/)
2. Selecciona tu proyecto
3. Ve a "Authentication" > "Providers"
4. Encuentra "Google" en la lista de proveedores
5. Habilita Google OAuth
6. Ingresa tu **Client ID** y **Client Secret** de Google
7. Guarda la configuración

### 3. Actualizar variables de entorno

Actualiza tu archivo `.env` con el Client ID de Google:

```env
VITE_GOOGLE_CLIENT_ID=tu_google_client_id_aqui
```

### 4. Configurar URLs de redirección

En tu configuración de Supabase, asegúrate de que las siguientes URLs estén configuradas:

- **Site URL**: `http://localhost:5173` (desarrollo) / `https://tu-dominio.com` (producción)
- **Redirect URLs**: 
  - `http://localhost:5173/**` (desarrollo)
  - `https://tu-dominio.com/**` (producción)

## Funcionalidad implementada

✅ **LoginForm**: Botón "Continuar con Google" que permite iniciar sesión con Google
✅ **RegisterForm**: Botón "Continuar con Google" que permite registrarse con Google
✅ **Manejo automático de usuarios**: Los usuarios de Google se crean automáticamente en la tabla `usuarios`
✅ **Redirección**: Después del login/registro exitoso, los usuarios son redirigidos al dashboard correspondiente

## Notas importantes

- Los usuarios que se registren con Google tendrán su información básica (email, nombre) guardada automáticamente
- El campo `name` se obtiene del `full_name` de Google o del email si no está disponible
- Los usuarios pueden alternar entre login tradicional y Google OAuth
- La autenticación con Google maneja automáticamente la verificación de email

## Solución de problemas

1. **Error "Invalid redirect URI"**: Verifica que las URLs de redirección estén correctamente configuradas en Google Cloud Console
2. **Error "Client ID not found"**: Asegúrate de que el Client ID esté correctamente configurado en Supabase
3. **Error de CORS**: Verifica que el origen esté autorizado en Google Cloud Console

## Testing

Para probar la funcionalidad:

1. Ve a la página de login o registro
2. Haz clic en "Continuar con Google"
3. Completa el flujo de autenticación de Google
4. Verifica que el usuario sea redirigido correctamente al dashboard
5. Confirma que el usuario aparezca en la tabla `usuarios` de Supabase