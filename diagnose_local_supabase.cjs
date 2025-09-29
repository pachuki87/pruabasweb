require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function diagnoseSupabaseLocal() {
  console.log('🔍 DIAGNÓSTICO DE SUPABASE - ENTORNO LOCAL');
  console.log('=' .repeat(50));
  
  // 1. Verificar variables de entorno
  console.log('\n1. VERIFICANDO VARIABLES DE ENTORNO:');
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  console.log(`URL: ${supabaseUrl ? '✅ Configurada' : '❌ No encontrada'}`);
  console.log(`ANON_KEY: ${supabaseKey ? '✅ Configurada' : '❌ No encontrada'}`);
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Variables de entorno faltantes. Verifica tu archivo .env');
    return;
  }
  
  // 2. Crear cliente Supabase
  console.log('\n2. CREANDO CLIENTE SUPABASE:');
  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Cliente creado');
  
  // 3. Probar conectividad básica
  console.log('\n3. PROBANDO CONECTIVIDAD BÁSICA:');
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.log(`❌ Error de conectividad: ${error.message}`);
    } else {
      console.log('✅ Conectividad básica OK');
    }
  } catch (err) {
    console.log(`❌ Error de red: ${err.message}`);
  }
  
  // 4. Verificar autenticación del usuario específico
  console.log('\n4. VERIFICANDO USUARIO ESPECÍFICO:');
  const userId = '79bcdeb7-512b-45cd-88df-f5b44169115e';
  
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.log(`❌ Error al obtener perfil: ${profileError.message}`);
    } else {
      console.log(`✅ Perfil encontrado: ${profile.email || 'Sin email'}`);
    }
  } catch (err) {
    console.log(`❌ Error al verificar usuario: ${err.message}`);
  }
  
  // 5. Probar endpoints específicos que fallan
  console.log('\n5. PROBANDO ENDPOINTS ESPECÍFICOS:');
  const courseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';
  
  // Inscripciones
  try {
    const { data: inscripciones, error: inscError } = await supabase
      .from('inscripciones')
      .select('*')
      .eq('user_id', userId)
      .limit(5);
      
    if (inscError) {
      console.log(`❌ Inscripciones: ${inscError.message}`);
    } else {
      console.log(`✅ Inscripciones: ${inscripciones.length} encontradas`);
    }
  } catch (err) {
    console.log(`❌ Error inscripciones: ${err.message}`);
  }
  
  // Lecciones
  try {
    const { data: lecciones, error: lecError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseId)
      .limit(5);
      
    if (lecError) {
      console.log(`❌ Lecciones: ${lecError.message}`);
    } else {
      console.log(`✅ Lecciones: ${lecciones.length} encontradas`);
    }
  } catch (err) {
    console.log(`❌ Error lecciones: ${err.message}`);
  }
  
  // Cuestionarios
  try {
    const { data: cuestionarios, error: cuestionError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('curso_id', courseId)
      .limit(5);
      
    if (cuestionError) {
      console.log(`❌ Cuestionarios: ${cuestionError.message}`);
    } else {
      console.log(`✅ Cuestionarios: ${cuestionarios.length} encontrados`);
    }
  } catch (err) {
    console.log(`❌ Error cuestionarios: ${err.message}`);
  }
  
  // Respuestas texto libre
  try {
    const { data: respuestas, error: respError } = await supabase
      .from('respuestas_texto_libre')
      .select('*')
      .or(`user_id.eq.${userId},user_id.eq.anonymous`)
      .limit(5);
      
    if (respError) {
      console.log(`❌ Respuestas texto libre: ${respError.message}`);
    } else {
      console.log(`✅ Respuestas texto libre: ${respuestas.length} encontradas`);
    }
  } catch (err) {
    console.log(`❌ Error respuestas: ${err.message}`);
  }
  
  // 6. Verificar permisos RLS
  console.log('\n6. VERIFICANDO PERMISOS RLS:');
  const tables = ['inscripciones', 'lecciones', 'cuestionarios', 'respuestas_texto_libre'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
        
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Permisos OK`);
      }
    } catch (err) {
      console.log(`❌ ${table}: Error de red - ${err.message}`);
    }
  }
  
  // 7. Verificar estado de autenticación
  console.log('\n7. VERIFICANDO ESTADO DE AUTENTICACIÓN:');
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log(`❌ Error de autenticación: ${authError.message}`);
    } else if (session) {
      console.log(`✅ Usuario autenticado: ${session.user.email}`);
    } else {
      console.log('⚠️ No hay sesión activa (usuario anónimo)');
    }
  } catch (err) {
    console.log(`❌ Error al verificar sesión: ${err.message}`);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 DIAGNÓSTICO COMPLETADO');
}

diagnoseSupabaseLocal().catch(console.error);