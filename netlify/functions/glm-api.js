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
    const apiKey = process.env.ZAI_API_KEY;

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
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Test different endpoints in case one fails
    const endpoints = [
      'https://api.z.ai/api/paas/v4/chat/completions'
    ];

    console.log(`Endpoint to try: ${endpoints[0]}`);

    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        console.log(`API Key length: ${apiKey ? apiKey.length : 0}`);

        const response = await axios.post(endpoint, requestBody, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'Accept-Language': 'en-US,en',
            'User-Agent': 'Instituto-Lidera-Netlify-Function/1.0'
          },
          timeout: 60000,
          validateStatus: function (status) {
            return status === 200; // Only resolve on success
          }
        });

        // If we get a successful response, return it
        if (response.status === 200) {
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify(response.data)
          };
        }

        // If we get an error response, store it and try next endpoint
        lastError = {
          endpoint,
          status: response.status,
          data: response.data
        };
        console.log(`Endpoint ${endpoint} returned status ${response.status}`);

      } catch (endpointError) {
        console.log(`Endpoint ${endpoint} failed:`, endpointError.message);
        console.log(`Error details:`, endpointError.code, endpointError.response?.status, endpointError.response?.data);
        lastError = {
          endpoint,
          error: endpointError.message,
          code: endpointError.code,
          status: endpointError.response?.status,
          data: endpointError.response?.data
        };
      }
    }

    // If all endpoints failed, return the last error
    console.error('All endpoints failed:', lastError);

    return {
      statusCode: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        error: 'All GLM API endpoints failed',
        details: lastError,
        message: 'Please check the API key and endpoint configuration',
        debug: {
          apiKeyLength: apiKey ? apiKey.length : 0,
          apiKeyPreview: apiKey ? apiKey.substring(0, 10) + '...' : 'N/A',
          endpoint: endpoints[0],
          requestBody: requestBody
        }
      })
    };

  } catch (error) {
    console.error('Function error:', error);

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
          error: 'GLM API request failed',
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
          error: 'No response from GLM API',
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