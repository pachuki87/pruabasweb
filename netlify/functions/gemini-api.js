exports.handler = async (event, context) => {
  // Configurar CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const { messages, systemInstruction, max_tokens = 1000, temperature = 0.7 } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'El parámetro "messages" es requerido y debe ser un array' })
      };
    }

    // Obtener la API key desde las variables de entorno de Netlify
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key de Gemini no configurada' })
      };
    }

    // Construir el prompt para Gemini
    let prompt = '';
    if (systemInstruction) {
      prompt += systemInstruction + '\n\n';
    }

    messages.forEach(msg => {
      if (msg.role === 'user') {
        prompt += `Human: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        prompt += `Assistant: ${msg.content}\n`;
      }
    });
    prompt += 'Assistant:';

    // Importar fetch dinámicamente
    const nodeFetch = await import('node-fetch');
    const fetch = nodeFetch.default;

    // Llamar a la API de Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: temperature,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: max_tokens,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error de Gemini API:', response.status, errorData);

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: 'Error en la API de Gemini',
          details: errorData
        })
      };
    }

    const data = await response.json();

    // Extraer la respuesta de Gemini
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        choices: [{
          message: {
            content: generatedText
          }
        }]
      })
    };

  } catch (error) {
    console.error('Error en la función de Gemini:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error interno del servidor',
        details: error.message
      })
    };
  }
};