require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

// Configuración local
const localConfig = {
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.VITE_SUPABASE_SERVICE_KEY
};

console.log('🔍 Diagnóstico de configuración Netlify vs Local');
console.log('=' .repeat(50));

// Función para hacer peticiones HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function diagnoseNetlifyConfig() {
  console.log('\n1️⃣ Configuración Local:');
  console.log(`   Supabase URL: ${localConfig.supabaseUrl}`);
  console.log(`   Anon Key: ${localConfig.supabaseAnonKey ? localConfig.supabaseAnonKey.substring(0, 20) + '...' : 'NO ENCONTRADA'}`);
  console.log(`   Service Key: ${localConfig.supabaseServiceKey ? localConfig.supabaseServiceKey.substring(0, 20) + '...' : 'NO ENCONTRADA'}`);
  
  // Verificar conectividad local con Supabase
  console.log('\n2️⃣ Verificando conectividad local con Supabase...');
  try {
    const supabase = createClient(localConfig.supabaseUrl, localConfig.supabaseAnonKey);
    const { data, error } = await supabase.from('cursos').select('id, titulo').limit(1);
    
    if (error) {
      console.log(`   ❌ Error local: ${error.message}`);
    } else {
      console.log(`   ✅ Conectividad local OK - Curso encontrado: ${data[0]?.titulo || 'Sin título'}`);
    }
  } catch (error) {
    console.log(`   ❌ Error de conexión local: ${error.message}`);
  }
  
  // Verificar progreso local
  console.log('\n3️⃣ Verificando progreso local...');
  try {
    const supabase = createClient(localConfig.supabaseUrl, localConfig.supabaseServiceKey);
    const { data: progressData, error: progressError } = await supabase
      .from('user_course_progress')
      .select('progreso_porcentaje')
      .eq('user_id', '79bcdeb7-512b-45cd-88df-f5b44169115e')
      .eq('curso_id', 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836');
    
    if (progressError) {
      console.log(`   ❌ Error obteniendo progreso: ${progressError.message}`);
    } else {
      const avgProgress = progressData.length > 0 
        ? progressData.reduce((sum, p) => sum + (p.progreso_porcentaje || 0), 0) / progressData.length
        : 0;
      console.log(`   📊 Progreso promedio local: ${avgProgress.toFixed(1)}%`);
    }
  } catch (error) {
    console.log(`   ❌ Error verificando progreso: ${error.message}`);
  }
  
  // Verificar URLs de Netlify
  console.log('\n4️⃣ Verificando URLs de Netlify...');
  const netlifyUrls = [
    'https://institutoooo.netlify.app',
    'https://institutoooo.netlify.app/_redirects',
    'https://institutoooo.netlify.app/api/health'
  ];
  
  for (const url of netlifyUrls) {
    try {
      console.log(`   🔗 Verificando: ${url}`);
      const response = await makeRequest(url);
      console.log(`   📡 Status: ${response.statusCode}`);
      
      if (response.statusCode === 200) {
        console.log(`   ✅ URL accesible`);
      } else {
        console.log(`   ⚠️ Status no esperado: ${response.statusCode}`);
      }
    } catch (error) {
      console.log(`   ❌ Error accediendo a ${url}: ${error.message}`);
    }
  }
  
  // Verificar variables de entorno esperadas en Netlify
  console.log('\n5️⃣ Variables de entorno requeridas en Netlify:');
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_SUPABASE_SERVICE_KEY'
  ];
  
  console.log('   📋 Variables que deben estar configuradas en Netlify:');
  requiredEnvVars.forEach(varName => {
    const localValue = process.env[varName];
    console.log(`   • ${varName}: ${localValue ? '✅ Configurada localmente' : '❌ NO configurada localmente'}`);
    if (localValue) {
      console.log(`     Valor: ${localValue.substring(0, 30)}...`);
    }
  });
  
  // Instrucciones para Netlify
  console.log('\n6️⃣ Instrucciones para configurar Netlify:');
  console.log('   1. Ir a https://app.netlify.com/sites/institutoooo/settings/deploys');
  console.log('   2. Scroll hasta "Environment variables"');
  console.log('   3. Agregar las siguientes variables:');
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`      • ${varName} = ${value}`);
    }
  });
  console.log('   4. Hacer un nuevo deploy después de configurar las variables');
  
  // Verificar build de Netlify
  console.log('\n7️⃣ Verificación de build:');
  console.log('   📦 Comando de build: npm run build');
  console.log('   📁 Directorio de publicación: dist');
  console.log('   🔄 Después de configurar variables, ejecutar nuevo deploy');
  
  console.log('\n🏁 Diagnóstico completado');
  console.log('\n💡 Próximos pasos:');
  console.log('   1. Configurar variables de entorno en Netlify');
  console.log('   2. Hacer nuevo deploy');
  console.log('   3. Verificar que el progreso se muestre correctamente');
}

diagnoseNetlifyConfig().catch(error => {
  console.error('💥 Error en diagnóstico:', error.message);
});