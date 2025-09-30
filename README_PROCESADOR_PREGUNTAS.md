# Procesador de Preguntas Abiertas - Instituto Lidera

## 📝 Descripción

Este servicio Python está diseñado para integrarse con n8n y procesar automáticamente solo las preguntas de tipo `texto_libre` (preguntas abiertas) del sistema e-learning de Instituto Lidera.

## 🎯 Funcionalidades

- **Filtrado automático**: Recibe todos los datos del cuestionario pero procesa solo preguntas de tipo `texto_libre`
- **Validación de datos**: Usa Pydantic para validar la estructura de los datos recibidos
- **Procesamiento inteligente**: Analiza las respuestas abiertas y proporciona feedback básico
- **Registro completo**: Logging detallado de todas las operaciones
- **API documentada**: Documentación interactiva con Swagger UI
- **Escalable**: Basado en FastAPI para alto rendimiento

## 🚀 Instalación

### 1. Requisitos previos
- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### 2. Clonar o copiar los archivos
Asegúrate de tener los siguientes archivos en tu directorio:
- `procesador_preguntas_libres.py` - Aplicación principal
- `requirements.txt` - Dependencias de Python
- `iniciar_servidor.py` - Script para iniciar el servidor

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

## 🔧 Configuración

### Variables de entorno (opcional)
Puedes configurar estas variables de entorno:

```bash
# Para producción
export ENVIRONMENT=production
export LOG_LEVEL=INFO

# Para desarrollo
export ENVIRONMENT=development
export LOG_LEVEL=DEBUG
```

## 🏃‍♂️ Ejecución

### Método 1: Usar el script de inicio (recomendado)
```bash
python iniciar_servidor.py
```

### Método 2: Ejecutar directamente con uvicorn
```bash
uvicorn procesador_preguntas_libres:app --host 0.0.0.0 --port 8000 --reload
```

### Método 3: Para producción
```bash
uvicorn procesador_preguntas_libres:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🌐 Endpoints

### Principal (Webhook)
- **POST** `/webhook/open-questions` - Recibe y procesa datos del cuestionario

### Utilidad
- **GET** `/health` - Verifica que el servicio está funcionando
- **GET** `/test-format` - Muestra el formato esperado de datos
- **GET** `/docs` - Documentación interactiva (Swagger UI)
- **GET** `/redoc` - Documentación alternativa (ReDoc)

## 📊 Formato de Datos

El webhook espera datos en este formato:

```json
{
  "type": "quiz-responses",
  "timestamp": "2025-09-29T20:02:49.881Z",
  "source": "instituto-lidera-elearning",
  "studentInfo": {
    "name": "Pablo Cardona Feliu",
    "email": "pablocardonafeliu@gmail.com",
    "userId": "user123",
    "quizId": "quiz456",
    "submittedAt": "2025-09-29T20:02:49.030Z"
  },
  "quizInfo": {
    "title": "FUNDAMENTOS P TERAPEUTICO",
    "lessonId": "lesson789",
    "courseId": "course101",
    "totalQuestions": 15,
    "score": 13,
    "maxScore": 15,
    "percentage": 87,
    "passed": true,
    "timeSpent": 208872,
    "attemptNumber": 1
  },
  "questions": [
    {
      "questionId": "q1",
      "question": "¿Qué es la terapia cognitivo-conductual?",
      "questionType": "texto_libre",
      "userAnswer": "La terapia cognitivo-conductual es un enfoque...",
      "isCorrect": null,
      "timeSpent": 120,
      "points": 2
    }
  ]
}
```

## 🔍 Filtrado de Preguntas

El sistema filtra automáticamente las preguntas que contienen estos indicadores en el campo `questionType`:
- `texto_libre`
- `texto_libre_open`
- `open`
- `text`
- `libre`

## 📈 Respuesta del Servicio

### Ejemplo de respuesta exitosa:
```json
{
  "success": true,
  "message": "Procesadas 2 preguntas abiertas",
  "processed_at": "2025-09-29T20:15:30.123Z",
  "total_questions": 15,
  "open_questions_found": 2,
  "open_questions_processed": [
    {
      "questionId": "q1",
      "questionText": "¿Qué es la terapia cognitivo-conductual?",
      "questionType": "texto_libre",
      "userAnswer": "La terapia cognitivo-conductual es un enfoque...",
      "needsEvaluation": true,
      "evaluationStatus": "processed",
      "feedback": "Respuesta recibida. Pendiente de evaluación manual.",
      "score": null
    }
  ],
  "student_info": {...},
  "quiz_info": {...}
}
```

## 🔧 Integración con n8n

### 1. Configurar el nodo HTTP Request en n8n
- **Method**: POST
- **URL**: `http://localhost:8000/webhook/open-questions`
- **Headers**:
  - Content-Type: application/json
- **Body**: Raw JSON

### 2. Conectar después del webhook existente
Coloca este nodo después de tu webhook actual para procesar las preguntas abiertas.

## 🐛 Troubleshooting

### Problemas comunes:

1. **Error de dependencias**
   ```bash
   pip install -r requirements.txt
   ```

2. **Puerto ya en uso**
   ```bash
   # Cambia el puerto en el comando de ejecución
   uvicorn procesador_preguntas_libres:app --port 8001
   ```

3. **Error de validación de datos**
   - Verifica el formato del JSON enviado
   - Usa `/test-format` para ver el formato esperado

4. **Servidor no inicia**
   - Verifica que Python 3.8+ esté instalado
   - Ejecuta `python --version`

## 📝 Logs

El servicio genera logs detallados que puedes ver en la consola:
- `INFO`: Operaciones normales
- `ERROR`: Errores y problemas
- `DEBUG`: Información detallada (en modo desarrollo)

## 🔄 Desarrollo

### Para extender el servicio:

1. **Añadir más lógica de procesamiento**:
   Modifica la función `process_open_questions()` en `procesador_preguntas_libres.py`

2. **Añadir nuevos endpoints**:
   Usa los decoradores de FastAPI como `@app.get()` o `@app.post()`

3. **Modificar el modelo de datos**:
   Actualiza los modelos Pydantic al inicio del archivo

## 📊 Monitorización

### Health Check
```bash
curl http://localhost:8000/health
```

### Ver logs en tiempo real
Los logs se muestran directamente en la consola donde ejecutas el servidor.

## 🚀 Despliegue

### Para producción:

1. **Usar un servidor WSGI de producción**:
   ```bash
   pip install gunicorn
   gunicorn procesador_preguntas_libres:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

2. **Configurar un proxy reverso** (Nginx, Apache)

3. **Usar Docker** (opcional)
   ```dockerfile
   FROM python:3.9-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["uvicorn", "procesador_preguntas_libres:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

## 📞 Soporte

Si encuentras problemas o necesitas ayuda:
1. Revisa los logs del servidor
2. Visita `http://localhost:8000/docs` para ver la documentación
3. Verifica el formato de datos en `http://localhost:8000/test-format`

---

## 📋 Notas

- Este servicio está diseñado para ser ligero y rápido
- Solo procesa preguntas de tipo texto_libre, ignora otros tipos
- Incluye validación básica de calidad de respuestas
- Puede extenderse fácilmente para integrar IA o análisis avanzado