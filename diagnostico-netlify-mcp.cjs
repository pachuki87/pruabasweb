/**
 * DIAGNÓSTICO COMPLETO DE CONEXIÓN NETLIFY MCP
 * ============================================
 * 
 * Este script verifica la conexión real a Netlify MCP API
 * usando las credenciales del proyecto.
 */

const https = require('https');

// Configuración de Netlify MCP desde .env.example
const NETLIFY_CONFIG = {
    API_KEY: 'nfp_rVfRcr4gHR1s3jjq9b5ujYCHcGiqNqpkc9e4',
    BASE_URL: 'https://api.netlify.com/api/v1',
    TIMEOUT: 10000
};

/**
 * Función para hacer peticiones HTTP
 */
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const requestOptions = {
            method: options.method || 'GET',
            headers: {
                'Authorization': `Bearer ${NETLIFY_CONFIG.API_KEY}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Instituto-Lidera-Diagnostico/1.0',
                ...options.headers
            },
            timeout: NETLIFY_CONFIG.TIMEOUT
        };

        const req = https.request(url, requestOptions, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = data ? JSON.parse(data) : {};
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: jsonData
                    });
                } catch (error) {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: data,
                        parseError: error.message
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }

        req.end();
    });
}

/**
 * Test 1: Verificar autenticación y información del usuario
 */
async function testAuthentication() {
    console.log('\n🔐 TEST 1: Verificando autenticación...');
    
    try {
        const response = await makeRequest(`${NETLIFY_CONFIG.BASE_URL}/user`);
        
        if (response.status === 200) {
            console.log('✅ Autenticación exitosa');
            console.log(`   Usuario: ${response.data.full_name || response.data.email || 'N/A'}`);
            console.log(`   Email: ${response.data.email || 'N/A'}`);
            console.log(`   ID: ${response.data.id || 'N/A'}`);
            return { success: true, data: response.data };
        } else {
            console.log(`❌ Error de autenticación: ${response.status}`);
            console.log(`   Respuesta: ${JSON.stringify(response.data, null, 2)}`);
            return { success: false, error: response.data };
        }
    } catch (error) {
        console.log(`❌ Error de conexión: ${error.message}`);
        return { success: false, error: error.message };
    }
}

/**
 * Test 2: Listar cuentas disponibles
 */
async function testAccounts() {
    console.log('\n🏢 TEST 2: Verificando cuentas disponibles...');
    
    try {
        const response = await makeRequest(`${NETLIFY_CONFIG.BASE_URL}/accounts`);
        
        if (response.status === 200) {
            console.log('✅ Cuentas obtenidas exitosamente');
            if (Array.isArray(response.data) && response.data.length > 0) {
                response.data.forEach((account, index) => {
                    console.log(`   Cuenta ${index + 1}:`);
                    console.log(`     Nombre: ${account.name || 'N/A'}`);
                    console.log(`     ID: ${account.id || 'N/A'}`);
                    console.log(`     Tipo: ${account.type_name || 'N/A'}`);
                });
            } else {
                console.log('   No se encontraron cuentas');
            }
            return { success: true, data: response.data };
        } else {
            console.log(`❌ Error al obtener cuentas: ${response.status}`);
            console.log(`   Respuesta: ${JSON.stringify(response.data, null, 2)}`);
            return { success: false, error: response.data };
        }
    } catch (error) {
        console.log(`❌ Error de conexión: ${error.message}`);
        return { success: false, error: error.message };
    }
}

/**
 * Test 3: Listar sitios web
 */
async function testSites() {
    console.log('\n🌐 TEST 3: Verificando sitios web...');
    
    try {
        const response = await makeRequest(`${NETLIFY_CONFIG.BASE_URL}/sites`);
        
        if (response.status === 200) {
            console.log('✅ Sitios obtenidos exitosamente');
            if (Array.isArray(response.data) && response.data.length > 0) {
                console.log(`   Total de sitios: ${response.data.length}`);
                response.data.slice(0, 3).forEach((site, index) => {
                    console.log(`   Sitio ${index + 1}:`);
                    console.log(`     Nombre: ${site.name || 'N/A'}`);
                    console.log(`     URL: ${site.url || 'N/A'}`);
                    console.log(`     Estado: ${site.state || 'N/A'}`);
                    console.log(`     ID: ${site.id || 'N/A'}`);
                });
                if (response.data.length > 3) {
                    console.log(`   ... y ${response.data.length - 3} sitios más`);
                }
            } else {
                console.log('   No se encontraron sitios');
            }
            return { success: true, data: response.data };
        } else {
            console.log(`❌ Error al obtener sitios: ${response.status}`);
            console.log(`   Respuesta: ${JSON.stringify(response.data, null, 2)}`);
            return { success: false, error: response.data };
        }
    } catch (error) {
        console.log(`❌ Error de conexión: ${error.message}`);
        return { success: false, error: error.message };
    }
}

/**
 * Test 4: Verificar límites de API
 */
async function testApiLimits() {
    console.log('\n📊 TEST 4: Verificando límites de API...');
    
    try {
        const response = await makeRequest(`${NETLIFY_CONFIG.BASE_URL}/user`);
        
        if (response.status === 200) {
            const rateLimitRemaining = response.headers['x-ratelimit-remaining'];
            const rateLimitLimit = response.headers['x-ratelimit-limit'];
            const rateLimitReset = response.headers['x-ratelimit-reset'];
            
            console.log('✅ Información de límites obtenida');
            console.log(`   Límite total: ${rateLimitLimit || 'N/A'}`);
            console.log(`   Requests restantes: ${rateLimitRemaining || 'N/A'}`);
            console.log(`   Reset en: ${rateLimitReset || 'N/A'}`);
            
            return { 
                success: true, 
                data: {
                    limit: rateLimitLimit,
                    remaining: rateLimitRemaining,
                    reset: rateLimitReset
                }
            };
        } else {
            console.log(`❌ Error al verificar límites: ${response.status}`);
            return { success: false, error: response.data };
        }
    } catch (error) {
        console.log(`❌ Error de conexión: ${error.message}`);
        return { success: false, error: error.message };
    }
}

/**
 * Test 5: Verificar funciones de Netlify (si existen)
 */
async function testFunctions() {
    console.log('\n⚡ TEST 5: Verificando funciones de Netlify...');
    
    try {
        // Primero obtenemos los sitios para buscar funciones
        const sitesResponse = await makeRequest(`${NETLIFY_CONFIG.BASE_URL}/sites`);
        
        if (sitesResponse.status === 200 && Array.isArray(sitesResponse.data) && sitesResponse.data.length > 0) {
            // Tomamos el primer sitio para verificar funciones
            const firstSite = sitesResponse.data[0];
            const functionsResponse = await makeRequest(`${NETLIFY_CONFIG.BASE_URL}/sites/${firstSite.id}/functions`);
            
            if (functionsResponse.status === 200) {
                console.log('✅ Funciones verificadas exitosamente');
                if (Array.isArray(functionsResponse.data) && functionsResponse.data.length > 0) {
                    console.log(`   Total de funciones: ${functionsResponse.data.length}`);
                    functionsResponse.data.slice(0, 3).forEach((func, index) => {
                        console.log(`   Función ${index + 1}:`);
                        console.log(`     Nombre: ${func.name || 'N/A'}`);
                        console.log(`     Estado: ${func.state || 'N/A'}`);
                    });
                } else {
                    console.log('   No se encontraron funciones');
                }
                return { success: true, data: functionsResponse.data };
            } else {
                console.log(`❌ Error al obtener funciones: ${functionsResponse.status}`);
                return { success: false, error: functionsResponse.data };
            }
        } else {
            console.log('⚠️  No se pueden verificar funciones: no hay sitios disponibles');
            return { success: false, error: 'No sites available' };
        }
    } catch (error) {
        console.log(`❌ Error de conexión: ${error.message}`);
        return { success: false, error: error.message };
    }
}

/**
 * Función principal de diagnóstico
 */
async function runDiagnostic() {
    console.log('🔍 DIAGNÓSTICO COMPLETO DE NETLIFY MCP');
    console.log('=====================================');
    console.log(`🔑 API Key: ${NETLIFY_CONFIG.API_KEY.substring(0, 10)}...`);
    console.log(`🌐 Base URL: ${NETLIFY_CONFIG.BASE_URL}`);
    console.log(`⏱️  Timeout: ${NETLIFY_CONFIG.TIMEOUT}ms`);

    const results = {
        authentication: null,
        accounts: null,
        sites: null,
        apiLimits: null,
        functions: null
    };

    // Ejecutar todos los tests
    results.authentication = await testAuthentication();
    results.accounts = await testAccounts();
    results.sites = await testSites();
    results.apiLimits = await testApiLimits();
    results.functions = await testFunctions();

    // Resumen final
    console.log('\n📋 RESUMEN DEL DIAGNÓSTICO');
    console.log('==========================');
    
    const tests = [
        { name: 'Autenticación', result: results.authentication },
        { name: 'Cuentas', result: results.accounts },
        { name: 'Sitios', result: results.sites },
        { name: 'Límites API', result: results.apiLimits },
        { name: 'Funciones', result: results.functions }
    ];

    let successCount = 0;
    tests.forEach(test => {
        const status = test.result?.success ? '✅' : '❌';
        console.log(`${status} ${test.name}: ${test.result?.success ? 'OK' : 'FALLO'}`);
        if (test.result?.success) successCount++;
    });

    console.log(`\n🎯 RESULTADO FINAL: ${successCount}/${tests.length} tests exitosos`);
    
    if (successCount === tests.length) {
        console.log('🎉 ¡NETLIFY MCP ESTÁ COMPLETAMENTE FUNCIONAL!');
        console.log('   ✅ Conexión establecida correctamente');
        console.log('   ✅ Autenticación válida');
        console.log('   ✅ API accesible y funcional');
    } else if (successCount > 0) {
        console.log('⚠️  NETLIFY MCP PARCIALMENTE FUNCIONAL');
        console.log('   ✅ Conexión básica establecida');
        console.log('   ⚠️  Algunas funcionalidades pueden tener problemas');
    } else {
        console.log('❌ NETLIFY MCP NO FUNCIONAL');
        console.log('   ❌ No se pudo establecer conexión');
        console.log('   ❌ Verificar credenciales y configuración');
    }

    return results;
}

// Ejecutar diagnóstico si se llama directamente
if (require.main === module) {
    runDiagnostic().catch(console.error);
}

module.exports = { runDiagnostic, NETLIFY_CONFIG };