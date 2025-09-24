const axios = require('axios');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle OPTIONS requests for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);

    console.log('Request received:', {
      body: requestBody,
      headers: event.headers,
      httpMethod: event.httpMethod
    });

    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    console.log(`API Key configured: ${apiKey ? 'YES' : 'NO'}`);
    console.log(`API Key length: ${apiKey ? apiKey.length : 0}`);
    console.log(`API Key preview: ${apiKey ? apiKey.substring(0, 10) + '...' : 'N/A'}`);

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: 'Gemini API key not configured' })
      };
    }

    // Convert the chat messages to Gemini format
    const geminiContents = [];

    // Add system message as the first user message with context
    if (requestBody.systemInstruction) {
      geminiContents.push({
        role: 'user',
        parts: [{ text: requestBody.systemInstruction }]
      });
      geminiContents.push({
        role: 'model',
        parts: [{ text: 'Entendido. Soy tu asistente virtual del Instituto Lidera, especializado en educación sobre adicciones, psicología y salud mental. ¿En qué puedo ayudarte hoy?' }]
      });
    }

    // Add conversation history
    if (requestBody.messages && Array.isArray(requestBody.messages)) {
      for (const message of requestBody.messages) {
        if (message.role === 'user') {
          geminiContents.push({
            role: 'user',
            parts: [{ text: message.content }]
          });
        } else if (message.role === 'assistant' || message.role === 'model') {
          geminiContents.push({
            role: 'model',
            parts: [{ text: message.content }]
          });
        }
      }
    }

    // If no messages, add the user message directly
    if (geminiContents.length === 0 && requestBody.message) {
      geminiContents.push({
        role: 'user',
        parts: [{ text: requestBody.message }]
      });
    }

    const geminiRequest = {
      contents: geminiContents,
      generationConfig: {
        temperature: requestBody.temperature || 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: requestBody.max_tokens || 1000,
        responseMimeType: 'text/plain'
      }
    };

    console.log(`Sending request to Gemini API with ${geminiContents.length} messages`);

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      geminiRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
          'x-goog-api-client': 'Instituto-Lidera-Netlify-Function/1.0'
        },
        timeout: 60000,
        validateStatus: function (status) {
          return status === 200; // Only resolve on success
        }
      }
    );

    console.log('Gemini API response received:', {
      status: response.status,
      hasCandidates: response.data.candidates && response.data.candidates.length > 0
    });

    if (response.data.candidates && response.data.candidates.length > 0) {
      const candidate = response.data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        const botResponse = candidate.content.parts[0].text;

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'POST, OPTIONS'
          },
          body: JSON.stringify({
            choices: [{
              message: {
                role: 'assistant',
                content: botResponse
              }
            }],
            model: 'gemini-2.5-flash',
            usage: response.data.usageMetadata || {}
          })
        };
      }
    }

    throw new Error('No valid response from Gemini API');

  } catch (error) {
    console.error('Gemini API error:', error);

    // Handle axios errors specifically
    if (error.response) {
      // The API responded with an error status
      return {
        statusCode: error.response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({
          error: 'Gemini API request failed',
          status: error.response.status,
          statusText: error.response.statusText,
          details: error.response.data
        })
      };
    } else if (error.request) {
      // No response received
      return {
        statusCode: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({
          error: 'No response from Gemini API',
          message: error.message
        })
      };
    } else {
      // Other errors
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({
          error: 'Internal server error',
          message: error.message
        })
      };
    }
  }
};