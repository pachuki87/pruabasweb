import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  webhookUrl?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ 
  webhookUrl = import.meta.env.VITE_WEBHOOK_URL || 'https://n8n.srv1024767.hstgr.cloud/webhook-test/fbdc5d15-3435-42f9-8047-891869aa9f7e'
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

  const sendMessageToWebhook = async (message: string): Promise<string> => {
    const maxRetries = 3;
    const timeoutMs = 10000; // 10 segundos timeout
    const retryDelays = [2000, 4000, 8000]; // Exponential backoff: 2s, 4s, 8s
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🚀 Enviando mensaje al webhook (intento ${attempt + 1}/${maxRetries + 1}):`, {
          url: webhookUrl,
          message: message,
          timestamp: new Date().toISOString(),
          attempt: attempt + 1
        });

        // Crear AbortController para timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Instituto-Lidera-ChatBot/1.0'
          },
          body: JSON.stringify({
            message: message,
            timestamp: new Date().toISOString(),
            source: 'chatbot',
            user_context: 'instituto_lidera_student',
            attempt: attempt + 1
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('📡 Respuesta del webhook:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          attempt: attempt + 1
        });

        // Verificar si la respuesta es exitosa (2xx)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        // Validar que la respuesta sea JSON válido
        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          console.warn('⚠️ Respuesta no es JSON válido, usando respuesta por defecto');
          data = { response: 'Mensaje recibido correctamente.' };
        }

        console.log('✅ Datos recibidos del webhook:', data);
        
        // Validar estructura de respuesta
        const botResponse = data.response || data.message || data.reply || 'Gracias por tu mensaje. Te responderé pronto.';
        
        if (typeof botResponse !== 'string') {
          console.warn('⚠️ Respuesta del webhook no es string, convirtiendo...');
          return String(botResponse);
        }
        
        return botResponse;

      } catch (error: any) {
        console.error(`❌ Error en intento ${attempt + 1}:`, {
          error: error.message,
          name: error.name,
          webhookUrl: webhookUrl,
          attempt: attempt + 1
        });

        // Si es el último intento, devolver mensaje de error
        if (attempt === maxRetries) {
          console.error('💥 Todos los intentos fallaron, devolviendo mensaje de error');
          
          // Determinar tipo de error para mensaje más específico
          if (error.name === 'AbortError') {
            return 'Lo siento, el servicio está tardando demasiado en responder. Por favor, inténtalo de nuevo más tarde.';
          } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            return 'Lo siento, hay un problema de conexión. Verifica tu conexión a internet e inténtalo de nuevo.';
          } else if (error.message.includes('500')) {
            return 'Lo siento, hay un problema temporal en nuestro servidor. Por favor, inténtalo de nuevo en unos minutos.';
          } else {
            return 'Lo siento, hay un problema técnico. Por favor, inténtalo de nuevo más tarde.';
          }
        }

        // Esperar antes del siguiente intento (exponential backoff)
        if (attempt < maxRetries) {
          const delay = retryDelays[attempt];
          console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // Este punto nunca debería alcanzarse, pero por seguridad
    return 'Lo siento, hay un problema técnico. Por favor, inténtalo de nuevo más tarde.';
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
      const botResponse = await sendMessageToWebhook(currentMessage);
      
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