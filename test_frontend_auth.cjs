require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFrontendAuth() {
  console.log('🔍 Probando autenticación y acceso a datos desde el frontend...');
  console.log('URL:', supabaseUrl);
  console.log('Anon Key:', supabaseAnonKey.substring(0, 20) + '...');
  
  try {
    // 1. Verificar estado de autenticación
    console.log('\n1. Verificando estado de autenticación...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Error de autenticación:', authError.message);
    } else if (!user) {
      console.log('⚠️  Usuario no autenticado');
      
      // Intentar autenticación con credenciales de prueba
      console.log('\n🔐 Intentando autenticación con usuario de prueba...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123'
      });
      
      if (signInError) {
        console.error('❌ Error al autenticar:', signInError.message);
        console.log('\n⚠️  Continuando sin autenticación...');
      } else {
        console.log('✅ Usuario autenticado:', signInData.user?.email);
      }
    } else {
      console.log('✅ Usuario autenticado:', user.email);
    }
    
    // 2. Probar acceso a tabla inscripciones
    console.log('\n2. Probando acceso a tabla inscripciones...');
    const { data: inscripciones, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('*')
      .limit(5);
    
    if (inscripcionesError) {
      console.error('❌ Error al acceder a inscripciones:', inscripcionesError.message);
    } else {
      console.log('✅ Inscripciones obtenidas:', inscripciones?.length || 0);
    }
    
    // 3. Probar acceso a tabla lecciones
    console.log('\n3. Probando acceso a tabla lecciones...');
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .limit(5);
    
    if (leccionesError) {
      console.error('❌ Error al acceder a lecciones:', leccionesError.message);
    } else {
      console.log('✅ Lecciones obtenidas:', lecciones?.length || 0);
    }
    
    // 4. Probar acceso a tabla cuestionarios
    console.log('\n4. Probando acceso a tabla cuestionarios...');
    const { data: cuestionarios, error: cuestionariosError } = await supabase
      .from('cuestionarios')
      .select('*')
      .limit(5);
    
    if (cuestionariosError) {
      console.error('❌ Error al acceder a cuestionarios:', cuestionariosError.message);
    } else {
      console.log('✅ Cuestionarios obtenidos:', cuestionarios?.length || 0);
    }
    
    // 5. Probar acceso a tabla respuestas_texto_libre
    console.log('\n5. Probando acceso a tabla respuestas_texto_libre...');
    const { data: respuestas, error: respuestasError } = await supabase
      .from('respuestas_texto_libre')
      .select('*')
      .limit(5);
    
    if (respuestasError) {
      console.error('❌ Error al acceder a respuestas_texto_libre:', respuestasError.message);
    } else {
      console.log('✅ Respuestas obtenidas:', respuestas?.length || 0);
    }
    
    // 6. Probar acceso a tabla usuarios
    console.log('\n6. Probando acceso a tabla usuarios...');
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .limit(5);
    
    if (usuariosError) {
      console.error('❌ Error al acceder a usuarios:', usuariosError.message);
    } else {
      console.log('✅ Usuarios obtenidos:', usuarios?.length || 0);
    }
    
    console.log('\n✅ Prueba de frontend completada');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testFrontendAuth();