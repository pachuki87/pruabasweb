const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuración de Supabase desde variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

const USER_ID = '79bcdeb7-512b-45cd-88df-f5b44169115e';
const COURSE_ID = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';

console.log('🔍 DIAGNÓSTICO DEL ENTORNO LOCAL');
console.log('================================');

async function diagnoseLocalEnvironment() {
  // 1. Verificar variables de entorno
  console.log('\n1. 📋 VERIFICANDO VARIABLES DE ENTORNO:');
  console.log(`   VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Configurada' : '❌ Faltante'}`);
  console.log(`   VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Configurada' : '❌ Faltante'}`);
  console.log(`   VITE_SUPABASE_SERVICE_KEY: ${supabaseServiceKey ? '✅ Configurada' : '❌ Faltante'}`);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('\n❌ ERROR: Variables de entorno faltantes. Verifica tu archivo .env');
    return;
  }

  // 2. Crear clientes de Supabase
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

  console.log('\n2. 🔗 PROBANDO CONECTIVIDAD BÁSICA:');
  
  try {
    // Test básico de conectividad
    const { data, error } = await supabase.from('cursos').select('count').limit(1);
    if (error) {
      console.log(`   ❌ Error de conectividad: ${error.message}`);
      return;
    }
    console.log('   ✅ Conectividad básica OK');
  } catch (err) {
    console.log(`   ❌ Error de red: ${err.message}`);
    return;
  }

  // 3. Verificar autenticación del usuario
  console.log('\n3. 👤 VERIFICANDO USUARIO:');
  
  try {
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser.user) {
      console.log('   ⚠️  Usuario no autenticado en el cliente');
      
      // Verificar si el usuario existe en auth.users usando admin
      if (supabaseAdmin) {
        const { data: adminUsers, error: adminError } = await supabaseAdmin.auth.admin.listUsers();
        if (!adminError && adminUsers.users) {
          const userExists = adminUsers.users.find(u => u.id === USER_ID);
          console.log(`   ${userExists ? '✅' : '❌'} Usuario ${USER_ID} ${userExists ? 'existe' : 'no existe'} en auth.users`);
        }
      }
    } else {
      console.log(`   ✅ Usuario autenticado: ${authUser.user.email}`);
    }
  } catch (err) {
    console.log(`   ❌ Error verificando usuario: ${err.message}`);
  }

  // 4. Probar endpoints individuales con delays
  console.log('\n4. 🔍 PROBANDO ENDPOINTS INDIVIDUALES:');
  
  const endpoints = [
    { name: 'inscripciones', query: () => supabase.from('inscripciones').select('*').eq('user_id', USER_ID) },
    { name: 'lecciones', query: () => supabase.from('lecciones').select('*').eq('curso_id', COURSE_ID) },
    { name: 'cuestionarios', query: () => supabase.from('cuestionarios').select('*').eq('curso_id', COURSE_ID) },
    { name: 'respuestas_texto_libre', query: () => supabase.from('respuestas_texto_libre').select('*').or(`user_id.eq.${USER_ID},user_id.eq.anonymous`) }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`   🔄 Probando ${endpoint.name}...`);
      const { data, error, count } = await endpoint.query();
      
      if (error) {
        console.log(`   ❌ ${endpoint.name}: ${error.message}`);
        if (error.code === 'PGRST116') {
          console.log(`      💡 Posible problema de permisos RLS`);
        }
      } else {
        console.log(`   ✅ ${endpoint.name}: ${data ? data.length : 0} registros`);
      }
      
      // Delay entre requests para evitar cancelaciones
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      console.log(`   ❌ ${endpoint.name}: Error de red - ${err.message}`);
    }
  }

  // 5. Verificar permisos RLS
  console.log('\n5. 🔐 VERIFICANDO PERMISOS RLS:');
  
  if (supabaseAdmin) {
    try {
      const { data: policies, error: policiesError } = await supabaseAdmin
        .from('information_schema.role_table_grants')
        .select('*')
        .in('grantee', ['anon', 'authenticated'])
        .in('table_name', ['inscripciones', 'lecciones', 'cuestionarios', 'respuestas_texto_libre']);
      
      if (!policiesError && policies) {
        console.log(`   ✅ Encontrados ${policies.length} permisos de tabla`);
        
        const tables = ['inscripciones', 'lecciones', 'cuestionarios', 'respuestas_texto_libre'];
        tables.forEach(table => {
          const tablePerms = policies.filter(p => p.table_name === table);
          const anonPerms = tablePerms.filter(p => p.grantee === 'anon');
          const authPerms = tablePerms.filter(p => p.grantee === 'authenticated');
          
          console.log(`   📋 ${table}:`);
          console.log(`      - anon: ${anonPerms.length > 0 ? '✅' : '❌'} permisos`);
          console.log(`      - authenticated: ${authPerms.length > 0 ? '✅' : '❌'} permisos`);
        });
      } else {
        console.log(`   ⚠️  No se pudieron verificar permisos: ${policiesError?.message}`);
      }
    } catch (err) {
      console.log(`   ❌ Error verificando permisos: ${err.message}`);
    }
  } else {
    console.log('   ⚠️  No se puede verificar permisos (falta SERVICE_KEY)');
  }

  // 6. Recomendaciones para el frontend
  console.log('\n6. 💡 RECOMENDACIONES PARA EL FRONTEND:');
  console.log('   📝 Para evitar ERR_ABORTED en localhost:');
  console.log('   1. Implementar debounce en useProgress (500ms)');
  console.log('   2. Cancelar requests anteriores antes de nuevos');
  console.log('   3. Usar AbortController para control de requests');
  console.log('   4. Implementar retry con backoff exponencial');
  console.log('   5. Evitar múltiples useEffect simultáneos');
  
  console.log('\n   🔧 Código de ejemplo para el frontend:');
  console.log(`
   const abortControllerRef = useRef<AbortController | null>(null);
   
   const fetchWithRetry = async (queryFn, retries = 3) => {
     // Cancelar request anterior
     if (abortControllerRef.current) {
       abortControllerRef.current.abort();
     }
     
     abortControllerRef.current = new AbortController();
     
     for (let i = 0; i < retries; i++) {
       try {
         const result = await queryFn(abortControllerRef.current.signal);
         return result;
       } catch (error) {
         if (error.name === 'AbortError') throw error;
         if (i === retries - 1) throw error;
         await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
       }
     }
   };
   `);

  console.log('\n✅ DIAGNÓSTICO COMPLETADO');
}

diagnoseLocalEnvironment().catch(console.error);