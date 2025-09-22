import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import QuizSummaryGenerator from '../services/QuizSummaryGenerator';
import EmailService from '../services/EmailService';
import WebhookService from '../services/WebhookService';
import './QuizComponent.css';

const QuizComponent = ({ leccionId, courseId, onQuizComplete }) => {
  const { user } = useAuth();
  const [cuestionarios, setCuestionarios] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [intentoId, setIntentoId] = useState(null);
  
  // Nuevos estados para el envío de resúmenes
  const [sendingSummary, setSendingSummary] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [webhookStatus, setWebhookStatus] = useState(null);

  // Cargar cuestionarios de la lección
  useEffect(() => {
    if (leccionId) {
      createTablesIfNotExist();
      loadCuestionarios();
    }
  }, [leccionId]);

  // Función para crear las tablas si no existen usando INSERT directo
  const createTablesIfNotExist = async () => {
    try {
      // Verificar si las tablas existen consultando information_schema
      const { data: respuestasTable } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'respuestas_usuario')
        .eq('table_schema', 'public')
        .single();

      const { data: intentosTable } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'intentos_cuestionario')
        .eq('table_schema', 'public')
        .single();

      // Si las tablas no existen, las creamos usando el service role
      if (!respuestasTable || !intentosTable) {
        console.log('Creando tablas del sistema de respuestas...');
        // Las tablas se crearán automáticamente en el primer uso
      }
    } catch (error) {
      console.log('Verificando tablas:', error.message);
    }
  };

  const loadCuestionarios = async () => {
    try {
      setLoading(true);
      
      // Si es la lección del MÓDULO 1, usar preguntas hardcodeadas
       if (leccionId === '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44') {
         const modulo1Quiz = {
           id: '1e9291a8-cc44-4d8c-bfbf-3aea525ed4fe',
           titulo: 'MÓDULO 1 – Fundamentos del programa terapéutico en adicciones',
           leccion_id: leccionId,
           preguntas: [
             {
               id: '11111111-1111-1111-1111-111111111111',
               pregunta: 'El uso de fármacos interdictores se emplea para facilitar la abstinencia.',
               tipo: 'verdadero_falso',
               orden: 1,
               opciones_respuesta: [
                 { id: '11111111-1111-1111-1111-111111111112', opcion: 'Verdadero', es_correcta: true },
                 { id: '11111111-1111-1111-1111-111111111113', opcion: 'Falso', es_correcta: false }
               ]
             },
             {
               id: '22222222-2222-2222-2222-222222222222',
               pregunta: 'El paciente no debe tener autonomía en entornos no supervisados.',
               tipo: 'verdadero_falso',
               orden: 2,
               opciones_respuesta: [
                 { id: '22222222-2222-2222-2222-222222222223', opcion: 'Verdadero', es_correcta: false },
                 { id: '22222222-2222-2222-2222-222222222224', opcion: 'Falso', es_correcta: true }
               ]
             },
             {
               id: '33333333-3333-3333-3333-333333333333',
               pregunta: 'Los programas terapéuticos deben incluir apoyo familiar.',
               tipo: 'verdadero_falso',
               orden: 3,
               opciones_respuesta: [
                 { id: '33333333-3333-3333-3333-333333333334', opcion: 'Verdadero', es_correcta: true },
                 { id: '33333333-3333-3333-3333-333333333335', opcion: 'Falso', es_correcta: false }
               ]
             },
             {
               id: '44444444-4444-4444-4444-444444444444',
               pregunta: 'La farmacoterapia de apoyo es opcional en todos los casos.',
               tipo: 'verdadero_falso',
               orden: 4,
               opciones_respuesta: [
                 { id: '44444444-4444-4444-4444-444444444445', opcion: 'Verdadero', es_correcta: false },
                 { id: '44444444-4444-4444-4444-444444444446', opcion: 'Falso', es_correcta: true }
               ]
             },
             {
               id: '55555555-5555-5555-5555-555555555555',
               pregunta: 'Los programas terapéuticos deben ser personalizados.',
               tipo: 'verdadero_falso',
               orden: 5,
               opciones_respuesta: [
                 { id: '55555555-5555-5555-5555-555555555556', opcion: 'Verdadero', es_correcta: true },
                 { id: '55555555-5555-5555-5555-555555555557', opcion: 'Falso', es_correcta: false }
               ]
             },
             {
               id: '66666666-6666-6666-6666-666666666666',
               pregunta: 'Define qué es un programa terapéutico en adicciones.',
               tipo: 'texto_libre',
               orden: 6
             },
             {
               id: '77777777-7777-7777-7777-777777777777',
               pregunta: 'Explica la importancia de la farmacoterapia de apoyo.',
               tipo: 'texto_libre',
               orden: 7
             },
             {
               id: '88888888-8888-8888-8888-888888888888',
               pregunta: 'Describe las características de un entorno terapéutico adecuado.',
               tipo: 'texto_libre',
               orden: 8
             },
             {
               id: '99999999-9999-9999-9999-999999999999',
               pregunta: 'Enumera los componentes esenciales de un programa terapéutico.',
               tipo: 'texto_libre',
               orden: 9
             },
             {
               id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
               pregunta: 'Analiza el papel de la familia en el proceso de recuperación.',
               tipo: 'texto_libre',
               orden: 10
             },
             {
               id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
               pregunta: 'Menciona ejemplos de fármacos utilizados en la farmacoterapia de apoyo.',
               tipo: 'texto_libre',
               orden: 11
             },
             {
               id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
               pregunta: 'Describe las fases de un programa terapéutico y ejemplifica cada una.',
               tipo: 'texto_libre',
               orden: 12
             },
             {
               id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
               pregunta: 'Explica cómo influye la familia y los amigos en el proceso de recuperación.',
               tipo: 'texto_libre',
               orden: 13
             },
             {
               id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
               pregunta: 'Haz un esquema de los fármacos de apoyo más utilizados y sus efectos.',
               tipo: 'texto_libre',
               orden: 14
             },
             {
               id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
               pregunta: 'Diseña un esquema de programa terapéutico para un paciente que inicia su recuperación.',
               tipo: 'texto_libre',
               orden: 15
             }
           ]
         };
        
        setCuestionarios([modulo1Quiz]);
        setCurrentQuiz(modulo1Quiz);
        setPreguntas(modulo1Quiz.preguntas);
        setLoading(false);
        return;
      }
      
      // Si es la lección del MÓDULO 2, usar preguntas hardcodeadas
      if (leccionId === 'e4546103-526d-42ff-a98b-0db4828caa44') {
        const modulo2Quiz = {
          id: '8bf3b75d-b048-4748-aa36-80896e7f6e5b',
          titulo: 'MÓDULO 2 – Terapia cognitiva de las drogodependencias',
          leccion_id: leccionId,
          preguntas: [
            {
              id: '10101010-1010-1010-1010-101010101010',
              pregunta: 'La Terapia Cognitivo-Conductual (TCC) es un enfoque central en adicciones.',
              tipo: 'verdadero_falso',
              orden: 1,
              opciones_respuesta: [
                { id: '10101010-1010-1010-1010-101010101011', opcion: 'Verdadero', es_correcta: true },
                { id: '10101010-1010-1010-1010-101010101012', opcion: 'Falso', es_correcta: false }
              ]
            },
            {
              id: '20202020-2020-2020-2020-202020202020',
              pregunta: 'El modelo transteórico del cambio incluye etapas como contemplación y acción.',
              tipo: 'verdadero_falso',
              orden: 2,
              opciones_respuesta: [
                { id: '20202020-2020-2020-2020-202020202021', opcion: 'Verdadero', es_correcta: true },
                { id: '20202020-2020-2020-2020-202020202022', opcion: 'Falso', es_correcta: false }
              ]
            },
            {
              id: '30303030-3030-3030-3030-303030303030',
              pregunta: 'La terapia de aceptación y compromiso (ACT) no se aplica en adicciones.',
              tipo: 'verdadero_falso',
              orden: 3,
              opciones_respuesta: [
                { id: '30303030-3030-3030-3030-303030303031', opcion: 'Verdadero', es_correcta: false },
                { id: '30303030-3030-3030-3030-303030303032', opcion: 'Falso', es_correcta: true }
              ]
            },
            {
              id: '40404040-4040-4040-4040-404040404040',
              pregunta: '¿Qué beneficios aporta Mindfulness en el tratamiento de adicciones?',
              tipo: 'texto_libre',
              orden: 4
            },
            {
              id: '50505050-5050-5050-5050-505050505050',
              pregunta: 'Explica las diferencias principales entre TCC y ACT en adicciones.',
              tipo: 'texto_libre',
              orden: 5
            },
            {
              id: '60606060-6060-6060-6060-606060606060',
              pregunta: '¿Por qué es útil el modelo de Prochaska y DiClemente en el abordaje de pacientes con adicciones?',
              tipo: 'texto_libre',
              orden: 6
            },
            {
              id: '70707070-7070-7070-7070-707070707070',
              pregunta: 'El Mindfulness en adicciones puede ayudar a:',
              tipo: 'multiple_choice',
              orden: 7,
              opciones_respuesta: [
                { id: '70707070-7070-7070-7070-707070707071', opcion: 'Reducir impulsividad', es_correcta: true },
                { id: '70707070-7070-7070-7070-707070707072', opcion: 'Aumentar la conciencia del momento presente', es_correcta: true },
                { id: '70707070-7070-7070-7070-707070707073', opcion: 'Incrementar el estrés', es_correcta: false },
                { id: '70707070-7070-7070-7070-707070707074', opcion: 'Favorecer la autorregulación emocional', es_correcta: true }
              ]
            }
          ]
        };
        
        setCuestionarios([modulo2Quiz]);
        setCurrentQuiz(modulo2Quiz);
        setPreguntas(modulo2Quiz.preguntas);
        setLoading(false);
        return;
      }
      
      const { data: cuestionariosData, error } = await supabase
        .from('cuestionarios')
        .select(`
          *,
          preguntas (
            *
          )
        `)
        .eq('leccion_id', leccionId)
        .order('creado_en');

      // Convertir las columnas de opciones a formato de opciones_respuesta
      if (cuestionariosData) {
        cuestionariosData.forEach(cuestionario => {
          if (cuestionario.preguntas) {
            cuestionario.preguntas.forEach(pregunta => {
              // Crear opciones_respuesta desde las columnas opcion_a, opcion_b, etc.
              pregunta.opciones_respuesta = [];
              
              if (pregunta.opcion_a) {
                pregunta.opciones_respuesta.push({
                  id: `${pregunta.id}_a`,
                  opcion: pregunta.opcion_a,
                  es_correcta: pregunta.respuesta_correcta === 'a'
                });
              }
              
              if (pregunta.opcion_b) {
                pregunta.opciones_respuesta.push({
                  id: `${pregunta.id}_b`,
                  opcion: pregunta.opcion_b,
                  es_correcta: pregunta.respuesta_correcta === 'b'
                });
              }
              
              if (pregunta.opcion_c) {
                pregunta.opciones_respuesta.push({
                  id: `${pregunta.id}_c`,
                  opcion: pregunta.opcion_c,
                  es_correcta: pregunta.respuesta_correcta === 'c'
                });
              }
              
              if (pregunta.opcion_d) {
                pregunta.opciones_respuesta.push({
                  id: `${pregunta.id}_d`,
                  opcion: pregunta.opcion_d,
                  es_correcta: pregunta.respuesta_correcta === 'd'
                });
              }
            });
          }
        });
      }

      if (error) throw error;

      setCuestionarios(cuestionariosData || []);
      
      if (cuestionariosData && cuestionariosData.length > 0) {
        setCurrentQuiz(cuestionariosData[0]);
        setPreguntas(cuestionariosData[0].preguntas || []);
      }
    } catch (error) {
      console.error('Error cargando cuestionarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    if (!user || !currentQuiz || !courseId) {
      console.error('Missing required data:', { user: !!user, currentQuiz: !!currentQuiz, courseId });
      alert('Error: Faltan datos necesarios para iniciar el cuestionario.');
      return;
    }

    try {
      // Crear un nuevo intento
      const { data: intentoData, error } = await supabase
        .from('intentos_cuestionario')
        .insert({
          user_id: user.id,
          cuestionario_id: currentQuiz.id,
          leccion_id: leccionId,
          curso_id: courseId,
          puntuacion_maxima: preguntas.length,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setIntentoId(intentoData.id);
      setStartTime(Date.now());
      setQuestionStartTime(Date.now());
      setQuizStarted(true);
      setCurrentQuestion(0);
      setRespuestas({});
      
      // Resetear estados de envío
      setEmailStatus(null);
      setWebhookStatus(null);
    } catch (error) {
      console.error('Error iniciando cuestionario:', error);
      alert('Error al iniciar el cuestionario. Por favor, intenta de nuevo.');
    }
  };

  const handleAnswerSelect = (preguntaId, opcionId, esCorrecta) => {
    const tiempoRespuesta = Math.floor((Date.now() - questionStartTime) / 1000);
    
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: {
        opcionId,
        esCorrecta,
        tiempoRespuesta,
        tipo: 'multiple_choice'
      }
    }));
  };

  const handleTextAnswerChange = (preguntaId, textoRespuesta) => {
    const tiempoRespuesta = Math.floor((Date.now() - questionStartTime) / 1000);
    
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: {
        textoRespuesta,
        tiempoRespuesta,
        tipo: 'texto_libre',
        esCorrecta: true, // Para texto libre, consideramos válida cualquier respuesta no vacía
        archivos: prev[preguntaId]?.archivos || [] // Mantener archivos existentes
      }
    }));
  };

  const handleFileUpload = (preguntaId, event) => {
    const files = Array.from(event.target.files);
    const tiempoRespuesta = Math.floor((Date.now() - questionStartTime) / 1000);
    
    // Validar tipos de archivo permitidos
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg'
    ];
    
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`El archivo ${file.name} no es un tipo permitido. Solo se aceptan PDF, Word y JPG.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB máximo
        alert(`El archivo ${file.name} es demasiado grande. El tamaño máximo es 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setRespuestas(prev => ({
        ...prev,
        [preguntaId]: {
          textoRespuesta: prev[preguntaId]?.textoRespuesta || '',
          tiempoRespuesta,
          tipo: 'texto_libre',
          esCorrecta: true,
          archivos: [...(prev[preguntaId]?.archivos || []), ...validFiles]
        }
      }));
    }
    
    // Limpiar el input para permitir subir el mismo archivo nuevamente
    event.target.value = '';
  };

  const removeFile = (preguntaId, fileIndex) => {
    setRespuestas(prev => {
      const respuestaActual = prev[preguntaId];
      if (!respuestaActual || !respuestaActual.archivos) return prev;
      
      const nuevosArchivos = respuestaActual.archivos.filter((_, index) => index !== fileIndex);
      
      return {
        ...prev,
        [preguntaId]: {
          ...respuestaActual,
          archivos: nuevosArchivos
        }
      };
    });
  };

  // Funciones para manejar arrastrar y soltar archivos
  const handleDragOver = (e, preguntaId) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Añadir clase visual de arrastre
    const uploadArea = document.querySelector(`#file-upload-${preguntaId}`).closest('.file-upload-area');
    if (uploadArea) {
      uploadArea.classList.add('drag-active');
    }
  };

  const handleDragLeave = (e, preguntaId) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remover clase visual de arrastre
    const uploadArea = document.querySelector(`#file-upload-${preguntaId}`).closest('.file-upload-area');
    if (uploadArea) {
      uploadArea.classList.remove('drag-active');
    }
  };

  const handleDrop = (e, preguntaId) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remover clase visual de arrastre
    const uploadArea = document.querySelector(`#file-upload-${preguntaId}`).closest('.file-upload-area');
    if (uploadArea) {
      uploadArea.classList.remove('drag-active');
    }
    
    const files = Array.from(e.dataTransfer.files);
    const tiempoRespuesta = Math.floor((Date.now() - questionStartTime) / 1000);
    
    // Validar tipos de archivo permitidos
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg'
    ];
    
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`El archivo ${file.name} no es un tipo permitido. Solo se aceptan PDF, Word y JPG.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB máximo
        alert(`El archivo ${file.name} es demasiado grande. El tamaño máximo es 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setRespuestas(prev => ({
        ...prev,
        [preguntaId]: {
          textoRespuesta: prev[preguntaId]?.textoRespuesta || '',
          tiempoRespuesta,
          tipo: 'texto_libre',
          esCorrecta: true,
          archivos: [...(prev[preguntaId]?.archivos || []), ...validFiles]
        }
      }));
    }
  };

  const nextQuestion = async () => {
    const preguntaActual = preguntas[currentQuestion];
    const respuestaActual = respuestas[preguntaActual.id];

    if (!respuestaActual) {
      alert('Por favor proporciona una respuesta antes de continuar.');
      return;
    }

    // Validar respuesta de texto libre
    if (preguntaActual.tipo === 'texto_libre' && (!respuestaActual.textoRespuesta || respuestaActual.textoRespuesta.trim() === '')) {
      alert('Por favor escribe una respuesta antes de continuar.');
      return;
    }

    // Guardar respuesta en localStorage como sistema de respaldo
    try {
      const respuestaKey = `respuesta_${user.id}_${preguntaActual.id}_${intentoId}`;
      const respuestaData = {
        user_id: user.id,
        cuestionario_id: currentQuiz.id,
        pregunta_id: preguntaActual.id,
        opcion_seleccionada_id: respuestaActual.opcionId,
        es_correcta: respuestaActual.esCorrecta,
        tiempo_respuesta_segundos: respuestaActual.tiempoRespuesta,
        intento_id: intentoId,
        respondido_en: new Date().toISOString()
      };
      
      localStorage.setItem(respuestaKey, JSON.stringify(respuestaData));
      console.log('Respuesta guardada localmente:', respuestaData);
    } catch (error) {
      console.error('Error guardando respuesta:', error);
    }

    if (currentQuestion < preguntas.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setQuestionStartTime(Date.now());
    } else {
      await finishQuiz();
    }
  };

  // Función para guardar intento del cuestionario (usando localStorage)
  const guardarIntento = async (cuestionarioId, puntuacion, totalPreguntas, respuestasCorrectas) => {
    try {
      const intentoKey = `intento_${user.id}_${cuestionarioId}_${intentoId}`;
      const intentoData = {
        user_id: user.id,
        cuestionario_id: cuestionarioId,
        intento_id: intentoId,
        puntuacion: puntuacion,
        total_preguntas: totalPreguntas,
        respuestas_correctas: respuestasCorrectas,
        estado: 'completado',
        iniciado_en: startTime,
        completado_en: new Date().toISOString()
      };
      
      localStorage.setItem(intentoKey, JSON.stringify(intentoData));
      console.log('Intento guardado localmente:', intentoData);
      
      // También guardar un resumen de todos los intentos del usuario
      const resumenKey = `intentos_resumen_${user.id}`;
      const resumenExistente = JSON.parse(localStorage.getItem(resumenKey) || '[]');
      resumenExistente.push({
        cuestionario_id: cuestionarioId,
        intento_id: intentoId,
        puntuacion: puntuacion,
        completado_en: new Date().toISOString()
      });
      localStorage.setItem(resumenKey, JSON.stringify(resumenExistente));
      
    } catch (error) {
      console.error('Error en guardarIntento:', error);
    }
  };

  // Nueva función para enviar resumen por email y webhook
  const sendQuizSummary = async (summaryData, htmlContent) => {
    setSendingSummary(true);
    
    try {
      // Enviar email
      let emailResult = { success: false, error: 'Email no configurado' };
      if (EmailService.isConfigured()) {
        console.log('Enviando resumen por email...');
        emailResult = await EmailService.sendQuizSummaryEmail(
          user,
          currentQuiz,
          summaryData,
          htmlContent
        );
        setEmailStatus(emailResult);
        console.log('Resultado del envío de email:', emailResult);
      } else {
        console.log('Servicio de email no configurado, omitiendo envío...');
        setEmailStatus({ success: false, error: 'Servicio de email no configurado' });
      }

      // Enviar webhook
      let webhookResult = { success: false, error: 'Webhook no configurado' };
      if (WebhookService.isConfigured()) {
        console.log('Enviando resumen por webhook...');
        const webhookPayload = QuizSummaryGenerator.generateWebhookSummary(summaryData);
        webhookResult = await WebhookService.sendQuizWebhook(webhookPayload);
        setWebhookStatus(webhookResult);
        console.log('Resultado del envío de webhook:', webhookResult);
      } else {
        console.log('Servicio de webhook no configurado, omitiendo envío...');
        setWebhookStatus({ success: false, error: 'Servicio de webhook no configurado' });
      }

      return {
        email: emailResult,
        webhook: webhookResult
      };

    } catch (error) {
      console.error('Error enviando resumen:', error);
      
      const errorResult = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      
      setEmailStatus(errorResult);
      setWebhookStatus(errorResult);
      
      return {
        email: errorResult,
        webhook: errorResult
      };
      
    } finally {
      setSendingSummary(false);
    }
  };

  const finishQuiz = async () => {
    setSubmitting(true);
    
    try {
      // Calcular resultados básicos
      const respuestasCorrectas = Object.values(respuestas).filter(r => r.esCorrecta).length;
      const porcentajeAcierto = (respuestasCorrectas / preguntas.length) * 100;
      const tiempoTotal = Math.floor((Date.now() - startTime) / 1000);
      
      // Sistema de puntuación avanzado
      let puntuacionBase = respuestasCorrectas * 10; // 10 puntos por respuesta correcta
      
      // Bonificación por tiempo (si completa rápido)
      const tiempoPromedioPorPregunta = tiempoTotal / preguntas.length;
      let bonificacionTiempo = 0;
      
      if (tiempoPromedioPorPregunta < 30) { // Menos de 30 segundos por pregunta
        bonificacionTiempo = respuestasCorrectas * 2; // 2 puntos extra por respuesta correcta
      } else if (tiempoPromedioPorPregunta < 60) { // Menos de 1 minuto por pregunta
        bonificacionTiempo = respuestasCorrectas * 1; // 1 punto extra por respuesta correcta
      }
      
      // Bonificación por excelencia (100% de aciertos)
      let bonificacionExcelencia = 0;
      if (porcentajeAcierto === 100) {
        bonificacionExcelencia = 20; // 20 puntos extra por perfección
      }
      
      // Puntuación final
      const puntuacionObtenida = puntuacionBase + bonificacionTiempo + bonificacionExcelencia;
      const puntuacionMaxima = (preguntas.length * 10) + (preguntas.length * 2) + 20; // Máximo posible
      
      const aprobado = porcentajeAcierto >= 70; // 70% para aprobar

      // Crear objeto con respuestas detalladas para guardar en Supabase
      const respuestasDetalladas = Object.keys(respuestas).reduce((acc, preguntaId) => {
        const respuesta = respuestas[preguntaId];
        acc[preguntaId] = {
          respuesta_seleccionada: respuesta.respuestaSeleccionada,
          es_correcta: respuesta.esCorrecta,
          tiempo_respuesta: respuesta.tiempoRespuesta || 0
        };
        return acc;
      }, {});

      // Guardar intento usando localStorage
      await guardarIntento(currentQuiz.id, puntuacionObtenida, preguntas.length, respuestasCorrectas);

      // Actualizar el intento en Supabase como respaldo
      try {
        const { error: updateError } = await supabase
          .from('intentos_cuestionario')
          .update({
            puntuacion: puntuacionObtenida,
            puntuacion_maxima: preguntas.length * 100, // puntuación máxima posible
            tiempo_transcurrido: Math.round(tiempoTotal), // tiempo en segundos
            estado: 'completado',
            aprobado: aprobado,
            fecha_completado: new Date().toISOString(),
            respuestas_guardadas: respuestasDetalladas || {}
          })
          .eq('id', intentoId);

        if (updateError) console.error('Error actualizando en Supabase:', updateError);
      } catch (supabaseError) {
        console.error('Error de conexión con Supabase:', supabaseError);
      }

      // Generar resumen detallado
      const resultsData = {
        puntuacionObtenida,
        puntuacionMaxima,
        puntuacionBase,
        bonificacionTiempo,
        bonificacionExcelencia,
        porcentajeAcierto: Math.round(porcentajeAcierto),
        tiempoTotal,
        tiempoPromedioPorPregunta: Math.round(tiempoPromedioPorPregunta),
        aprobado,
        respuestasCorrectas,
        totalPreguntas: preguntas.length
      };

      const summaryData = QuizSummaryGenerator.generateDetailedSummary(
        currentQuiz,
        respuestas,
        preguntas,
        user,
        resultsData
      );

      // Generar HTML para email
      const htmlContent = QuizSummaryGenerator.generateHTMLSummary(summaryData);

      // Enviar resumen por email y webhook
      console.log('Iniciando envío de resumen...');
      const sendResults = await sendQuizSummary(summaryData, htmlContent);
      console.log('Resultados del envío:', sendResults);

      // Mostrar resultados detallados
      setResultados(resultsData);
      setQuizCompleted(true);
      
      // Notificar al componente padre
      if (onQuizComplete) {
        onQuizComplete({
          aprobado,
          porcentajeAcierto,
          puntuacionObtenida,
          puntuacionMaxima: preguntas.length,
          summarySent: {
            email: sendResults.email.success,
            webhook: sendResults.webhook.success
          }
        });
      }
    } catch (error) {
      console.error('Error finalizando cuestionario:', error);
      alert('Error al finalizar el cuestionario. Por favor, intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setRespuestas({});
    setResultados(null);
    setStartTime(null);
    setQuestionStartTime(null);
    setIntentoId(null);
    setEmailStatus(null);
    setWebhookStatus(null);
  };

  const selectQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setPreguntas(quiz.preguntas || []);
    resetQuiz();
  };

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Cargando cuestionarios...</p>
      </div>
    );
  }

  if (!cuestionarios.length) {
    return (
      <div className="quiz-empty">
        <h3>No hay cuestionarios disponibles</h3>
        <p>Esta lección aún no tiene cuestionarios asignados.</p>
      </div>
    );
  }

  if (quizCompleted && resultados) {
    return (
      <div className="quiz-results">
        <div className="results-header">
          <h2>🎉 ¡Cuestionario Completado!</h2>
          <div className={`score-badge ${resultados.aprobado ? 'approved' : 'failed'}`}>
            {resultados.porcentajeAcierto}%
          </div>
        </div>
        
        <div className="results-details">
          <div className="result-item">
            <span className="label">Respuestas correctas:</span>
            <span className="value">{resultados.respuestasCorrectas} de {resultados.totalPreguntas}</span>
          </div>
          <div className="result-item">
            <span className="label">Tiempo total:</span>
            <span className="value">{Math.floor(resultados.tiempoTotal / 60)}:{(resultados.tiempoTotal % 60).toString().padStart(2, '0')} (promedio: {resultados.tiempoPromedioPorPregunta}s/pregunta)</span>
          </div>
          
          <div className="scoring-breakdown">
            <h4>📊 Desglose de Puntuación</h4>
            <div className="score-item">
              <span className="score-label">Puntuación base:</span>
              <span className="score-value">{resultados.puntuacionBase} pts</span>
            </div>
            {resultados.bonificacionTiempo > 0 && (
              <div className="score-item bonus">
                <span className="score-label">⚡ Bonificación por velocidad:</span>
                <span className="score-value">+{resultados.bonificacionTiempo} pts</span>
              </div>
            )}
            {resultados.bonificacionExcelencia > 0 && (
              <div className="score-item bonus">
                <span className="score-label">🏆 Bonificación por excelencia:</span>
                <span className="score-value">+{resultados.bonificacionExcelencia} pts</span>
              </div>
            )}
            <div className="score-item total">
              <span className="score-label">Puntuación final:</span>
              <span className="score-value">{resultados.puntuacionObtenida} / {resultados.puntuacionMaxima} pts</span>
            </div>
          </div>
          
          <div className="result-item">
            <span className="label">Estado:</span>
            <span className={`value ${resultados.aprobado ? 'approved' : 'failed'}`}>
              {resultados.aprobado ? '✅ Aprobado' : '❌ No aprobado'}
            </span>
          </div>
        </div>

        {/* Sección de estado de envío de resumen */}
        {(emailStatus || webhookStatus) && (
          <div className="summary-status">
            <h4>📤 Envío de Resumen</h4>
            
            {sendingSummary && (
              <div className="status-item sending">
                <span className="status-icon">⏳</span>
                <span className="status-text">Enviando resumen por email y webhook...</span>
              </div>
            )}
            
            {emailStatus && (
              <div className={`status-item ${emailStatus.success ? 'success' : 'error'}`}>
                <span className="status-icon">{emailStatus.success ? '✅' : '❌'}</span>
                <span className="status-text">
                  Email: {emailStatus.success ? 'Enviado correctamente' : emailStatus.error}
                </span>
              </div>
            )}
            
            {webhookStatus && (
              <div className={`status-item ${webhookStatus.success ? 'success' : 'error'}`}>
                <span className="status-icon">{webhookStatus.success ? '✅' : '❌'}</span>
                <span className="status-text">
                  Webhook: {webhookStatus.success ? 'Enviado correctamente' : webhookStatus.error}
                </span>
              </div>
            )}
          </div>
        )}
        
        <div className="results-actions">
          <button onClick={resetQuiz} className="btn-retry">
            🔄 Intentar de nuevo
          </button>
          {cuestionarios.length > 1 && (
            <button onClick={() => selectQuiz(cuestionarios.find(q => q.id !== currentQuiz.id))} className="btn-next-quiz">
              ➡️ Siguiente cuestionario
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="quiz-start">
        <div className="quiz-selector">
          <h2>Cuestionarios Disponibles</h2>
          {cuestionarios.map((quiz, index) => (
            <div 
              key={quiz.id} 
              className={`quiz-option ${currentQuiz?.id === quiz.id ? 'selected' : ''}`}
              onClick={() => selectQuiz(quiz)}
            >
              <h3>{quiz.titulo}</h3>
              <p>{quiz.preguntas?.length || 0} preguntas</p>
            </div>
          ))}
        </div>
        
        {currentQuiz && (
          <div className="quiz-info">
            <h3>{currentQuiz.titulo}</h3>
            <div className="quiz-details">
              <p><strong>Preguntas:</strong> {preguntas.length}</p>
              <p><strong>Tiempo estimado:</strong> {Math.ceil(preguntas.length * 1.5)} minutos</p>
              <p><strong>Puntuación mínima:</strong> 70% para aprobar</p>
              
              {/* Mostrar estado de los servicios */}
              <div className="services-status">
                <h5>Estado de Servicios:</h5>
                <div className={`service-status ${EmailService.isConfigured() ? 'configured' : 'not-configured'}`}>
                  📧 Email: {EmailService.isConfigured() ? 'Configurado' : 'No configurado'}
                </div>
                <div className={`service-status ${WebhookService.isConfigured() ? 'configured' : 'not-configured'}`}>
                  🔗 Webhook: {WebhookService.isConfigured() ? 'Configurado' : 'No configurado'}
                </div>
              </div>
            </div>
            
            <button onClick={startQuiz} className="btn-start" disabled={!user}>
              {!user ? 'Inicia sesión para comenzar' : '🚀 Comenzar Cuestionario'}
            </button>
          </div>
        )}
      </div>
    );
  }

  const preguntaActual = preguntas[currentQuestion];
  const respuestaSeleccionada = respuestas[preguntaActual?.id];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{currentQuiz.titulo}</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / preguntas.length) * 100}%` }}
          ></div>
        </div>
        <span className="question-counter">
          Pregunta {currentQuestion + 1} de {preguntas.length}
        </span>
      </div>

      {preguntaActual && (
        <div className="question-container">
          <h3 className="question-text">{preguntaActual.pregunta}</h3>
          
          {preguntaActual.tipo === 'texto_libre' ? (
            <div className="text-answer-container">
              <textarea
                className="text-answer-input"
                placeholder="Escribe tu respuesta aquí..."
                value={respuestaSeleccionada?.textoRespuesta || ''}
                onChange={(e) => handleTextAnswerChange(preguntaActual.id, e.target.value)}
                rows={6}
                maxLength={1000}
              />
              <div className="character-count">
                {(respuestaSeleccionada?.textoRespuesta || '').length}/1000 caracteres
              </div>
              
              {/* Componente de subida de archivos */}
              <div className="file-upload-container">
                <div className="file-upload-header">
                  <h4>📎 Adjuntar archivos (opcional)</h4>
                  <p>Puedes subir archivos PDF, Word (.doc, .docx) o imágenes JPG (máximo 10MB cada uno)</p>
                </div>
                
                <div 
                  className="file-upload-area"
                  onDragOver={(e) => handleDragOver(e, preguntaActual.id)}
                  onDragLeave={(e) => handleDragLeave(e, preguntaActual.id)}
                  onDrop={(e) => handleDrop(e, preguntaActual.id)}
                >
                  <input
                    type="file"
                    id={`file-upload-${preguntaActual.id}`}
                    className="file-upload-input"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload(preguntaActual.id, e)}
                  />
                  <label 
                    htmlFor={`file-upload-${preguntaActual.id}`}
                    className="file-upload-label"
                  >
                    <div className="upload-icon">📁</div>
                    <div className="upload-text">
                      <strong>Seleccionar archivos</strong>
                      <span>o arrástralos aquí</span>
                    </div>
                  </label>
                </div>
                
                {/* Lista de archivos subidos */}
                {respuestaSeleccionada?.archivos && respuestaSeleccionada.archivos.length > 0 && (
                  <div className="uploaded-files-list">
                    <h5>Archivos adjuntos:</h5>
                    {respuestaSeleccionada.archivos.map((file, index) => (
                      <div key={index} className="uploaded-file-item">
                        <div className="file-info">
                          <span className="file-icon">
                            {file.type.includes('pdf') ? '📄' : 
                             file.type.includes('word') ? '📝' : 
                             '🖼️'}
                          </span>
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => removeFile(preguntaActual.id, index)}
                          title="Eliminar archivo"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="options-container">
              {preguntaActual.opciones_respuesta?.map((opcion, index) => (
                <button
                  key={opcion.id}
                  className={`option-button ${
                    respuestaSeleccionada?.opcionId === opcion.id ? 'selected' : ''
                  }`}
                  onClick={() => handleAnswerSelect(
                    preguntaActual.id, 
                    opcion.id, 
                    opcion.es_correcta
                  )}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{opcion.opcion}</span>
                </button>
              ))}
            </div>
          )}
          
          <div className="question-actions">
            <button 
              onClick={nextQuestion}
              className="btn-next"
              disabled={!respuestaSeleccionada || submitting}
            >
              {submitting ? (
                '⏳ Procesando...'
              ) : currentQuestion === preguntas.length - 1 ? (
                '🏁 Finalizar'
              ) : (
                '➡️ Siguiente'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
