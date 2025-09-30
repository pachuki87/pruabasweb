#!/usr/bin/env python3
"""
Procesador de Preguntas Abiertas (texto_libre) para Instituto Lidera
-------------------------------------------------------------
Este script recibe datos del webhook de n8n, filtra solo las preguntas
de tipo 'texto_libre' y las procesa para corrección o almacenamiento.

Requisitos:
- Python 3.8+
- FastAPI (pip install fastapi)
- Uvicorn (pip install uvicorn) para ejecutar el servidor

Ejecutar:
- uvicorn procesador_preguntas_libres:app --host 0.0.0.0 --port 8000 --reload
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import json
import logging

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Inicializar FastAPI
app = FastAPI(
    title="Procesador de Preguntas Abiertas - Instituto Lidera",
    description="API para procesar preguntas de tipo texto_libre desde el sistema e-learning",
    version="1.0.0"
)

# Modelos de datos Pydantic para validación
class StudentInfo(BaseModel):
    """Modelo para información del estudiante"""
    name: str = Field(..., description="Nombre del estudiante")
    email: str = Field(..., description="Email del estudiante")
    userId: Optional[str] = Field(None, description="ID del usuario")
    quizId: Optional[str] = Field(None, description="ID del cuestionario")
    submittedAt: str = Field(..., description="Fecha de envío")

class QuizInfo(BaseModel):
    """Modelo para información del cuestionario"""
    title: str = Field(..., description="Título del cuestionario")
    lessonId: Optional[str] = Field(None, description="ID de la lección")
    courseId: Optional[str] = Field(None, description="ID del curso")
    totalQuestions: int = Field(..., description="Total de preguntas")
    score: int = Field(..., description="Puntuación obtenida")
    maxScore: int = Field(..., description="Puntuación máxima")
    percentage: float = Field(..., description="Porcentaje de aciertos")
    passed: bool = Field(..., description="Si aprobó el cuestionario")
    timeSpent: int = Field(..., description="Tiempo empleado en segundos")
    attemptNumber: int = Field(1, description="Número de intento")

class Question(BaseModel):
    """Modelo para preguntas individuales"""
    questionId: str = Field(..., description="ID de la pregunta")
    questionText: str = Field(..., description="Texto de la pregunta")
    questionType: str = Field(..., description="Tipo de pregunta")
    userAnswer: str = Field(..., description="Respuesta del usuario")
    isCorrect: Optional[bool] = Field(None, description="Si es correcta (para preguntas con respuesta única)")
    timeSpent: int = Field(0, description="Tiempo empleado en la pregunta")
    points: Optional[float] = Field(None, description="Puntos de la pregunta")

class OpenQuestion(Question):
    """Modelo específico para preguntas abiertas (texto_libre)"""
    needsEvaluation: bool = Field(True, description="Si necesita evaluación manual")
    evaluationStatus: str = Field("pending", description="Estado de evaluación: pending, evaluated, rejected")
    feedback: Optional[str] = Field(None, description="Feedback del evaluador")
    correctedAnswer: Optional[str] = Field(None, description="Respuesta corregida")
    score: Optional[float] = Field(None, description="Puntuación asignada")

class WebhookPayload(BaseModel):
    """Modelo principal para el payload del webhook"""
    type: str = Field("quiz-responses", description="Tipo de payload")
    timestamp: str = Field(..., description="Timestamp del envío")
    source: str = Field("instituto-lidera-elearning", description="Fuente de los datos")
    studentInfo: StudentInfo = Field(..., description="Información del estudiante")
    quizInfo: QuizInfo = Field(..., description="Información del cuestionario")
    responses: List[Dict[str, Any]] = Field(default_factory=list, description="Respuestas procesadas")
    questions: List[Dict[str, Any]] = Field(default_factory=list, description="Preguntas originales")

class ProcessingResult(BaseModel):
    """Modelo para resultados del procesamiento"""
    success: bool
    message: str
    processed_at: str
    total_questions: int
    open_questions_found: int
    open_questions_processed: List[OpenQuestion]
    student_info: Dict[str, Any]
    quiz_info: Dict[str, Any]

# Función para filtrar preguntas de tipo texto_libre
def filter_open_questions(questions: List[Dict[str, Any]]) -> List[OpenQuestion]:
    """
    Filtra solo las preguntas de tipo texto_libre o similar y las convierte al modelo OpenQuestion
    """
    open_questions = []

    for i, question in enumerate(questions):
        question_type = question.get('questionType', question.get('tipo', '')).lower()

        # Verificar si es una pregunta abierta
        if any(indicator in question_type for indicator in ['texto_libre', 'texto_libre_open', 'open', 'text', 'libre']):
            try:
                open_question = OpenQuestion(
                    questionId=question.get('questionId', f"question_{i}"),
                    questionText=question.get('question', question.get('questionText', '')),
                    questionType=question_type,
                    userAnswer=question.get('userAnswer', question.get('respuestaUsuario', '')),
                    isCorrect=question.get('isCorrect', None),
                    timeSpent=question.get('timeSpent', 0),
                    points=question.get('points', question.get('puntos', None)),
                    needsEvaluation=True,
                    evaluationStatus="pending"
                )
                open_questions.append(open_question)
                logger.info(f"Pregunta abierta encontrada: {open_question.questionText[:50]}...")
            except Exception as e:
                logger.error(f"Error procesando pregunta {i}: {e}")

    return open_questions

# Función para procesar preguntas abiertas
def process_open_questions(open_questions: List[OpenQuestion]) -> List[OpenQuestion]:
    """
    Procesa las preguntas abiertas (aquí puedes añadir lógica de IA, análisis, etc.)
    """
    processed_questions = []

    for question in open_questions:
        try:
            # Aquí puedes añadir lógica de procesamiento:
            # - Análisis de texto
            # - Corrección automática básica
            # - Detección de keywords
            # - Evaluación por IA

            # Por ahora, solo marcamos la pregunta como procesada
            question.evaluationStatus = "processed"

            # Ejemplo de lógica simple basada en longitud de respuesta
            if len(question.userAnswer.strip()) < 10:
                question.feedback = "Respuesta muy corta. Por favor, elabora más."
                question.evaluationStatus = "needs_review"
            elif len(question.userAnswer.strip()) > 500:
                question.feedback = "Respuesta completa y detallada."
                question.evaluationStatus = "evaluated"
                question.score = question.points or 1.0
            else:
                question.feedback = "Respuesta recibida. Pendiente de evaluación manual."
                question.evaluationStatus = "pending_review"

            processed_questions.append(question)
            logger.info(f"Pregunta procesada: {question.questionId}")

        except Exception as e:
            logger.error(f"Error procesando pregunta {question.questionId}: {e}")
            # Añadir la pregunta sin procesar si hay error
            processed_questions.append(question)

    return processed_questions

# Endpoint principal para recibir webhooks
@app.post("/webhook/open-questions")
async def receive_webhook_data(payload: WebhookPayload, request: Request):
    """
    Endpoint principal que recibe datos del webhook y procesa solo preguntas abiertas
    """
    try:
        logger.info(f"Recibiendo datos del webhook para estudiante: {payload.studentInfo.email}")
        logger.info(f"Total de preguntas recibidas: {len(payload.questions)}")

        # Filtrar solo preguntas de tipo texto_libre
        open_questions = filter_open_questions(payload.questions)

        logger.info(f"Preguntas abiertas encontradas: {len(open_questions)}")

        if not open_questions:
            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "message": "No se encontraron preguntas abiertas para procesar",
                    "processed_at": datetime.now().isoformat(),
                    "total_questions": len(payload.questions),
                    "open_questions_found": 0,
                    "open_questions_processed": [],
                    "student_info": payload.studentInfo.dict(),
                    "quiz_info": payload.quizInfo.dict()
                }
            )

        # Procesar las preguntas abiertas
        processed_questions = process_open_questions(open_questions)

        # Preparar resultado
        result = ProcessingResult(
            success=True,
            message=f"Procesadas {len(processed_questions)} preguntas abiertas",
            processed_at=datetime.now().isoformat(),
            total_questions=len(payload.questions),
            open_questions_found=len(open_questions),
            open_questions_processed=processed_questions,
            student_info=payload.studentInfo.dict(),
            quiz_info=payload.quizInfo.dict()
        )

        logger.info(f"Procesamiento completado para {payload.studentInfo.email}")

        return JSONResponse(
            status_code=200,
            content=result.dict()
        )

    except Exception as e:
        logger.error(f"Error procesando webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error procesando los datos: {str(e)}")

# Endpoint de salud para verificar que el servicio está funcionando
@app.get("/health")
async def health_check():
    """Endpoint para verificar que el servicio está funcionando"""
    return {
        "status": "healthy",
        "service": "Procesador de Preguntas Abiertas",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

# Endpoint para probar el formato
@app.get("/test-format")
async def test_format():
    """Endpoint que muestra el formato esperado de datos"""
    example_payload = {
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
            "passed": True,
            "timeSpent": 208872,
            "attemptNumber": 1
        },
        "questions": [
            {
                "questionId": "q1",
                "question": "¿Qué es la terapia cognitivo-conductual?",
                "questionType": "texto_libre",
                "userAnswer": "La terapia cognitivo-conductual es un enfoque...",
                "isCorrect": None,
                "timeSpent": 120,
                "points": 2
            },
            {
                "questionId": "q2",
                "question": "¿Verdadero o Falso: La terapia es efectiva?",
                "questionType": "multiple_choice",
                "userAnswer": "Verdadero",
                "isCorrect": True,
                "timeSpent": 30,
                "points": 1
            }
        ]
    }

    return {
        "message": "Formato esperado de datos para el webhook",
        "example": example_payload,
        "open_questions_filter": ["texto_libre", "texto_libre_open", "open", "text", "libre"]
    }

# Middleware para logging de solicitudes
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Middleware para registrar todas las solicitudes"""
    start_time = datetime.now()

    # Registrar información de la solicitud
    logger.info(f"Solicitud {request.method} a {request.url}")

    response = await call_next(request)

    # Calcular tiempo de procesamiento
    process_time = (datetime.now() - start_time).total_seconds()

    logger.info(f"Solicitud procesada en {process_time:.3f} segundos")

    return response

# Evento de startup
@app.on_event("startup")
async def startup_event():
    """Evento que se ejecuta al iniciar el servidor"""
    logger.info("🚀 Iniciando Procesador de Preguntas Abiertas")
    logger.info("📡 Servidor listo para recibir webhooks")

# Evento de shutdown
@app.on_event("shutdown")
async def shutdown_event():
    """Evento que se ejecuta al detener el servidor"""
    logger.info("🛑 Deteniendo Procesador de Preguntas Abiertas")

if __name__ == "__main__":
    # Instrucciones para ejecución local
    print("🚀 Procesador de Preguntas Abiertas - Instituto Lidera")
    print("=" * 50)
    print("Para ejecutar este servidor:")
    print("uvicorn procesador_preguntas_libres:app --host 0.0.0.0 --port 8000 --reload")
    print("=" * 50)
    print("\nEndpoints disponibles:")
    print("• POST /webhook/open-questions - Recibir datos del webhook")
    print("• GET /health - Verificar estado del servicio")
    print("• GET /test-format - Ver formato esperado")
    print("• GET /docs - Documentación interactiva (Swagger)")
    print("=" * 50)