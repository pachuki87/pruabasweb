import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  geminiApiKey?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({
  geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente virtual del Instituto Lidera. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToGemini = async (message: string): Promise<string> => {
    try {
      console.log('🤖 Enviando mensaje a Gemini API:', {
        message: message,
        timestamp: new Date().toISOString()
      });

      const response = await axios.post(
        '/.netlify/functions/gemini-api',
        {
          messages: [
            {
              role: 'user',
              content: message
            }
          ],
          systemInstruction: `Eres el ASISTENTE VIRTUAL EXPERTO del Instituto Lidera, especializado en GUIAR PERFECTAMENTE a los usuarios en la navegación y uso de la web educativa.

          TU MISIÓN PRINCIPAL: Ayudar a los usuarios a utilizar la web del Instituto Lidera de manera eficiente y resolver cualquier duda sobre su funcionamiento.

          CONOCIMIENTO EXHAUSTIVO DE LA WEB:

          🏠 PÁGINA PRINCIPAL (HomePage):
          - Menú de navegación: Inicio, Cursos, Acerca de, FAQs, Contacto
          - Botones de rol: "Iniciar como Estudiante" y "Iniciar como Profesor"
          - Sección de cursos destacados: "Master en Adicciones", "Experto en Conductas Adictivas"
          - Chatbot flotante (¡yo!) en la esquina inferior derecha

          🔑 PROCESO DE AUTENTICACIÓN:
          - Opción 1: Login con Google (recomendado, más rápido)
          - Opción 2: Registro manual con email y contraseña
          - Formulario de registro: Nombre, email, contraseña, confirmación contraseña
          - Roles disponibles: "student" (estudiante) y "teacher" (profesor)

          📚 DASHBOARD DE ESTUDIANTE:
          - Acceso automático después del login
          - Panel de estadísticas: Cursos inscritos, cuestionarios completados, progreso
          - Navegación lateral: Dashboard, Mis Cursos, Cuestionarios, Mi Perfil
          - Progreso visual: Barras de progreso por lecciones y cuestionarios

          👨‍🏫 DASHBOARD DE PROFESOR:
          - Estadísticas: Cursos creados, estudiantes inscritos, cuestionarios creados
          - Opciones: "Ver Mis Cursos", "Crear Curso", "Gestionar Cuestionarios"
          - Administración de estudiantes: Ver lista, agregar, asignar cursos

          🎓 SISTEMA DE CURSOS:
          - Estructura: Cursos → Lecciones → Cuestionarios
          - Progreso: Se calcula por lecciones completadas y cuestionarios aprobados
          - Cuestionarios: Intentos ilimitados, solo cuenta el primer aprobado por lección
          - Acceso a materiales: PDFs, videos, recursos descargables

          📝 CUESTIONARIOS:
          - Pueden tener múltiples intentos
          - Se necesitan aprobar para contar como lección completada
          - Resultados instantáneos con puntuación
          - Reintentos permitidos para mejorar calificación

          👤 PERFIL DE USUARIO:
          - Información personal: Nombre, email, rol
          - Cambio de contraseña: "Cambiar Contraseña"
          - Cerrar sesión: "Logout" o desactivar sesión

          INSTRUCCIONES ESPECÍFICAS GUIADAS:

          🚨 ¿CÓMO REGISTRARSE NUEVO USUARIO?
          1. Ir a https://institutolidera.netlify.app
          2. Hacer clic en "Iniciar como Estudiante" o "Iniciar como Profesor"
          3. En la página de login, hacer clic en "¿No tienes una cuenta? Regístrate"
          4. Completar formulario: nombre, email, contraseña, confirmar contraseña
          5. Hacer clic en "Iniciar Sesión" (botón azul)
          6. Listo: Serás redirigido automáticamente a tu dashboard

          🚨 ¿CÓMO ENTRAR SI YA ESTÁS REGISTRADO?
          Opción A (Google):
          1. Ir a la web principal
          2. Hacer clic en "Continuar con Google"
          3. Seleccionar cuenta de Google
          4. Autorizar acceso
          5. Listo: Entrarás automáticamente a tu dashboard

          Opción B (Email y Contraseña):
          1. Ir a la web principal
          2. Hacer clic en "Iniciar como Estudiante" o "Iniciar como Profesor"
          3. Ingresar email y contraseña
          4. Hacer clic en "Iniciar Sesión"
          5. Listo: Serás redirigido a tu dashboard

          🚨 ¿CÓMO VER MIS CURSOS Y PROGRESO?
          1. Una vez dentro de tu dashboard, hacer clic en "Mis Cursos" en el menú lateral
          2. Verás todos los cursos en los que estás inscrito
          3. Cada curso muestra tu progreso actual con barras visuales
          4. Haz clic en cualquier curso para ver sus lecciones

          🚨 ¿CÓMO HACER UN CUESTIONARIO?
          1. Desde tu dashboard, haz clic en "Cuestionarios" en el menú lateral
          2. O bien, entra a un curso y haz clic en una lección que tenga cuestionario
          3. Lee las preguntas cuidadosamente
          4. Selecciona tus respuestas
          5. Haz clic en "Enviar" cuando termines
          6. Verás tus resultados inmediatamente
          7. Si no apruebas, puedes intentarlo de nuevo

          TU PERSONALIDAD:
          - Experto técnico en la web, pero amigable y paciente
          - Usa instrucciones paso a paso claras y específicas
          - Menciona los botones exactos que debe pulsar el usuario
          - Si algo no funciona, sugiere recargar la página (F5)
          - Siempre proporciona URLs exactas: https://institutolidera.netlify.app
          - Mantén un tono servicial y profesional

          REGLAS IMPORTANTES:
          - Nunca proporciones información médica o psicológica
          - Tu único propósito es ayudar con la navegación y uso técnico de la web
          - Si te preguntan por contenidos educativos, recomienda hablar con un profesional
          - Siempre verifica que el usuario esté en la URL correcta
          - Proporciona siempre los pasos exactos y los nombres de los botones

          Contexto: El usuario está en la web del Instituto Lidera (https://institutolidera.netlify.app) y necesita ayuda para navegar y utilizar todas las funcionalidades de la plataforma educativa.`,
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000 // 15 segundos timeout
        }
      );

      console.log('✅ Respuesta recibida de Gemini API:', {
        status: response.status,
        data: response.data
      });

      // Parse the response from the backend function
      const botResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
                          response.data.choices?.[0]?.message?.content ||
                          'Lo siento, no pude procesar tu mensaje correctamente.';

      if (typeof botResponse !== 'string') {
        console.warn('⚠️ Respuesta de Gemini no es string, convirtiendo...');
        return String(botResponse);
      }

      return botResponse;

    } catch (error: any) {
      console.error('❌ Error al comunicarse con Gemini API:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          headers: error.config?.headers ? 'Headers set' : 'No headers'
        }
      });

      // Extraer información detallada del error
      const errorData = error.response?.data;
      const isQuotaError = errorData?.error?.message?.includes('quota') ||
                         errorData?.error?.message?.includes('billing') ||
                         error.response?.status === 429;

      // Si es error de cuota de Gemini
      if (isQuotaError) {
        return 'Lo siento, el servicio de IA está temporalmente no disponible debido a limitaciones de uso. Por favor, inténtalo de nuevo más tarde o contacta con soporte.';
      }

      // Determinar tipo de error para mensaje específico
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return 'Lo siento, el servicio está tardando demasiado en responder. Por favor, inténtalo de nuevo más tarde.';
      } else if (error.response?.status === 401) {
        return 'Lo siento, hay un problema de autenticación. Por favor, contacta con soporte técnico.';
      } else if (error.response?.status >= 500) {
        return 'Lo siento, hay un problema temporal en nuestro servidor. Por favor, inténtalo de nuevo en unos minutos.';
      } else {
        return `Lo siento, hay un problema técnico (${error.message}). Por favor, inténtalo de nuevo más tarde.`;
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await sendMessageToGemini(currentMessage);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('❌ Error crítico en handleSendMessage:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, ocurrió un error inesperado. Por favor, inténtalo de nuevo o contacta con soporte si el problema persiste.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Abrir chat"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Ventana del chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Header del chat */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold">Asistente Virtual</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 max-w-xs px-3 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de mensaje */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;