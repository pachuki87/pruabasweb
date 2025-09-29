#!/usr/bin/env node
/**
 * Script para probar la conexión con el servidor MCP de Supabase
 * Este script utiliza el servidor MCP oficial de Supabase
 */

const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testSupabaseMCP() {
  log('🔧 Probando conexión con el servidor MCP de Supabase...\n', 'cyan');
  
  // Verificar variables de entorno necesarias
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    log(`❌ Variables de entorno faltantes: ${missingVars.join(', ')}`, 'red');
    log('   Asegúrate de tener un archivo .env con las credenciales de Supabase', 'yellow');
    return;
  }
  
  log('✅ Variables de entorno encontradas:', 'green');
  log(`   📋 Proyecto: ${process.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'N/A'}`);
  log(`   🌐 URL: ${process.env.VITE_SUPABASE_URL}`);
  
  // Configuración del servidor MCP
  const mcpConfig = {
    command: 'npx',
    args: ['-y', '@supabase-community/supabase-mcp'],
    env: {
      ...process.env,
      SUPABASE_PROJECT_REF: process.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] || '',
      SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      SUPABASE_REGION: 'us-east-1'
    }
  };
  
  log('\n🚀 Iniciando servidor MCP de Supabase...', 'blue');
  log('   (Esto puede tomar unos segundos la primera vez)', 'yellow');
  
  // Spawn del proceso MCP
  const mcpProcess = spawn(mcpConfig.command, mcpConfig.args, {
    env: mcpConfig.env,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let hasOutput = false;
  let timeout;
  
  // Timeout para evitar espera infinita
  timeout = setTimeout(() => {
    log('\n⏰ Timeout alcanzado (30 segundos)', 'yellow');
    if (!hasOutput) {
      log('   El servidor MCP puede estar iniciándose correctamente en segundo plano', 'cyan');
    }
    mcpProcess.kill();
  }, 30000);
  
  mcpProcess.stdout.on('data', (data) => {
    hasOutput = true;
    const output = data.toString().trim();
    if (output) {
      log(`📤 STDOUT: ${output}`, 'green');
    }
  });
  
  mcpProcess.stderr.on('data', (data) => {
    hasOutput = true;
    const error = data.toString().trim();
    if (error && !error.includes('npm WARN')) {
      log(`📥 STDERR: ${error}`, 'red');
    }
  });
  
  mcpProcess.on('close', (code) => {
    clearTimeout(timeout);
    log(`\n🏁 Proceso MCP terminado con código: ${code}`, code === 0 ? 'green' : 'red');
    
    if (code === 0) {
      log('✅ El servidor MCP de Supabase se ejecutó correctamente', 'green');
    } else {
      log('❌ Hubo un problema con el servidor MCP', 'red');
    }
    
    log('\n📝 Próximos pasos:', 'cyan');
    log('   1. Si el servidor se ejecutó correctamente, puedes configurarlo en tu IDE');
    log('   2. Para Claude Desktop: Agrega la configuración a claude_desktop_config.json');
    log('   3. Para VS Code con Cline: Agrega la configuración a cline_mcp_settings.json');
    log('   4. Reinicia tu IDE para que reconozca el servidor MCP');
  });
  
  mcpProcess.on('error', (error) => {
    clearTimeout(timeout);
    log(`\n❌ Error al iniciar el proceso MCP: ${error.message}`, 'red');
    
    if (error.code === 'ENOENT') {
      log('   💡 Asegúrate de tener Node.js y npm instalados', 'yellow');
      log('   💡 Verifica que npx esté disponible en tu PATH', 'yellow');
    }
  });
  
  // Enviar un mensaje de inicialización simple
  setTimeout(() => {
    if (!mcpProcess.killed) {
      const initMessage = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: {
            name: 'test-client',
            version: '1.0.0'
          }
        }
      }) + '\n';
      
      log('\n📨 Enviando mensaje de inicialización...', 'blue');
      mcpProcess.stdin.write(initMessage);
    }
  }, 2000);
}

if (require.main === module) {
  testSupabaseMCP();
}

module.exports = { testSupabaseMCP };