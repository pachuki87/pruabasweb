# Página de Contacto - Netlify Forms

## 📋 Descripción

Se ha implementado una página de contacto con detección automática de Netlify Forms para probar la funcionalidad antes de adaptar los cuestionarios.

## 🚀 Características

### ✅ Formulario de Contacto (`/contacto.html`)
- **Detección automática**: Usa `data-netlify="true"` para que Netlify detecte el formulario
- **Honeypot anti-spam**: Campo oculto para prevenir bots
- **Validación completa**: Campos requeridos y validación de email
- **Diseño responsive**: Interfaz móvil-friendly con Tailwind CSS
- **Notificaciones automáticas**: Netlify envía emails por cada submission
- **Experiencia de usuario**: Mensajes de éxito y manejo de errores

### 🔧 Configuración Técnica

```html
<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="contact" />
    <!-- Campos del formulario -->
</form>
```

## 📝 Campos del Formulario

1. **Nombre Completo** (requerido)
2. **Correo Electrónico** (requerido)
3. **Teléfono** (opcional)
4. **Asunto** (requerido, dropdown)
   - Solicitud de información
   - Información sobre cursos
   - Soporte técnico
   - Propuesta de colaboración
   - Otro
5. **Mensaje** (requerido)
6. **Aceptación de privacidad** (requerido)

## 🧪 Pruebas

### Prueba Local
1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre `http://localhost:5173/contacto.html`

3. Completa el formulario y envía

### Prueba en Producción
1. Despliega a Netlify:
   ```bash
   npm run build
   netlify deploy --prod
   ```

2. Verifica que Netlify detecte el formulario en el dashboard

3. Prueba el envío y verifica las notificaciones por email

## 📧 Notificaciones de Netlify

Netlify automáticamente:
- ✅ Detecta el formulario durante el build
- ✅ Almacena los submissions en el dashboard
- ✅ Envía emails a los administradores configurados
- ✅ Filtra spam con honeypot
- ✅ Proporciona UI para gestionar submissions

## 🎯 Próximos Pasos

1. **Probar el formulario básico** - Verificar que funciona correctamente
2. **Analizar resultados** - Revisar submissions y emails recibidos
3. **Adaptar cuestionarios** - Aplicar el mismo patrón a los formularios de quizzes
4. **Integrar con process-form.js** - Mantener el procesamiento con IA

## 🔍 Integración con Cuestionarios

El siguiente paso será crear un blueprint estático para los cuestionarios:

```html
<!-- Blueprint oculto para Netlify -->
<form name="quiz-blueprint" data-netlify="true" hidden>
    <input type="text" name="nombre" required>
    <input type="email" name="email" required>
    <textarea name="pregunta1"></textarea>
    <textarea name="pregunta2"></textarea>
    <textarea name="pregunta3"></textarea>
    <textarea name="pregunta4"></textarea>
</form>
```

Esto permitirá que Netlify detecte la estructura mientras mantenemos la funcionalidad React dinámica.