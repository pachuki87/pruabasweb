#!/bin/bash

# Script para desplegar el sistema de formularios

echo "=== Deploy de Netlify Forms - Instituto Lidera ==="

# Verificar si estamos en el directorio correcto
if [ ! -f "formulario-preguntas-abiertas.html" ]; then
    echo "Error: No se encuentra el formulario en el directorio actual"
    exit 1
fi

# Verificar configuración de Netlify
if ! command -v netlify &> /dev/null; then
    echo "Instalando Netlify CLI..."
    npm install -g netlify-cli
fi

# Iniciar sesión en Netlify si no estamos logueados
echo "Verificando sesión de Netlify..."
netlify status

# Build del proyecto
echo "Building the project..."
npm run build

# Deploy a Netlify
echo "Deploying to Netlify..."
netlify deploy --prod

echo "=== Deploy completado ==="
echo "No olvides configurar las variables de entorno en el dashboard de Netlify:"
echo "  - ZAI_API_KEY=nfp_rVfRcr4gHR1s3jjq9b5ujYCHcGiqNqpkc9e4"
echo "  - ZAI_API_URL=https://api.zai.ai/v1/chat/completions"
echo "  - ZAI_MODEL=glm[G"
echo ""
echo "Además, configura las notificaciones de email en Netlify Forms:"
echo "  1. Ve a Forms → Form settings"
echo "  2. Selecciona el formulario 'preguntas-abiertas'"
echo "  3. Configura las notificaciones por email"
echo ""
echo "Revisa la documentación en NETLIFY_FORMS_CONFIG.md para más detalles"