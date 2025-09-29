const http = require('http');
const url = require('url');

const PORT = 3001;

const server = http.createServer((req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  
  if (req.method === 'POST' && parsedUrl.pathname === '/webhook-test') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        
        console.log('\n=== WEBHOOK TEST RECIBIDO ===');
        console.log('Timestamp:', new Date().toISOString());
        console.log('Datos recibidos:');
        console.log(JSON.stringify(data, null, 2));
        console.log('================================\n');
        
        // Simular respuesta exitosa de n8n
        const response = {
          success: true,
          message: 'Datos recibidos correctamente en webhook de prueba',
          timestamp: new Date().toISOString(),
          receivedData: data
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
        
      } catch (error) {
        console.error('Error procesando webhook:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'JSON inválido',
          message: error.message 
        }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Webhook de prueba ejecutándose en http://localhost:${PORT}/webhook-test`);
  console.log('Esperando datos del cuestionario...\n');
});

server.on('error', (error) => {
  console.error('Error en el servidor webhook:', error);
});