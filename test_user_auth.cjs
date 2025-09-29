require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testUserAuth() {
  console.log('🧪 PROBANDO AUTENTICACIÓN DE USUARIO ESPECÍFICO');
  console.log('=' .repeat(55));
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.VITE_SUPABASE_SERVICE_KEY;
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  const supabaseAdmin = createClient(supabaseUrl, serviceKey);
  
  const userId = '79bcdeb7-512b-45cd-88df-f5b44169115e';
  const courseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';
  
  console.log('\n1. VERIFICANDO TABLA PROFILES:');
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.log(`❌ Error obteniendo perfil: ${profileError.message}`);
    } else {
      console.log(`✅ Perfil encontrado: ${profile.email} (${profile.role})`);
    }
  } catch (err) {
    console.log(`❌ Error: ${err.message}`);
  }
  
  console.log('\n2. SIMULANDO AUTENTICACIÓN DE USUARIO:');
  
  // Obtener datos del usuario desde auth
  try {
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (authError) {
      console.log(`❌ Usuario no encontrado: ${authError.message}`);
      return;
    }
    
    console.log(`✅ Usuario autenticado: ${authUser.user.email}`);
    
    // Simular sesión de usuario autenticado
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: authUser.user.email
    });
    
    if (sessionError) {
      console.log(`⚠️ No se pudo generar link de sesión: ${sessionError.message}`);
    } else {
      console.log('✅ Capacidad de autenticación verificada');
    }
  } catch (err) {
    console.log(`❌ Error en autenticación: ${err.message}`);
  }
  
  console.log('\n3. PROBANDO ENDPOINTS QUE FALLAN:');
  
  // Test inscripciones
  try {
    const { data: inscripciones, error: inscError } = await supabase
      .from('inscripciones')
      .select('*')
      .eq('user_id', userId);
      
    if (inscError) {
      console.log(`❌ Inscripciones: ${inscError.message}`);
    } else {
      console.log(`✅ Inscripciones: ${inscripciones.length} encontradas`);
      if (inscripciones.length > 0) {
        console.log(`   - Curso ID: ${inscripciones[0].curso_id}`);
        console.log(`   - Fecha: ${inscripciones[0].fecha_inscripcion}`);
      }
    }
  } catch (err) {
    console.log(`❌ Error inscripciones: ${err.message}`);
  }
  
  // Test lecciones
  try {
    const { data: lecciones, error: lecError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', courseId);
      
    if (lecError) {
      console.log(`❌ Lecciones: ${lecError.message}`);
    } else {
      console.log(`✅ Lecciones: ${lecciones.length} encontradas`);
    }
  } catch (err) {
    console.log(`❌ Error lecciones: ${err.message}`);
  }
  
  // Test cuestionarios
  try {
    const { data: cuestionarios, error: cuestionError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('curso_id', courseId);
      
    if (cuestionError) {
      console.log(`❌ Cuestionarios: ${cuestionError.message}`);
    } else {
      console.log(`✅ Cuestionarios: ${cuestionarios.length} encontrados`);
    }
  } catch (err) {
    console.log(`❌ Error cuestionarios: ${err.message}`);
  }
  
  // Test respuestas_texto_libre
  try {
    const { data: respuestas, error: respError } = await supabase
      .from('respuestas_texto_libre')
      .select('*')
      .or(`user_id.eq.${userId},user_id.eq.anonymous`);
      
    if (respError) {
      console.log(`❌ Respuestas texto libre: ${respError.message}`);
    } else {
      console.log(`✅ Respuestas texto libre: ${respuestas.length} encontradas`);
    }
  } catch (err) {
    console.log(`❌ Error respuestas: ${err.message}`);
  }
  
  console.log('\n4. VERIFICANDO PROGRESO DEL CURSO:');
  
  try {
    const { data: progreso, error: progresoError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('curso_id', courseId);
      
    if (progresoError) {
      console.log(`❌ Error progreso: ${progresoError.message}`);
    } else {
      console.log(`✅ Registros de progreso: ${progreso.length}`);
      if (progreso.length > 0) {
        const totalProgress = progreso.reduce((sum, p) => sum + p.progreso, 0) / progreso.length;
        console.log(`   - Progreso promedio: ${totalProgress.toFixed(1)}%`);
      }
    }
  } catch (err) {
    console.log(`❌ Error verificando progreso: ${err.message}`);
  }
  
  console.log('\n5. RECOMENDACIONES PARA EL FRONTEND:');
  console.log('📋 Para evitar errores ERR_ABORTED:');
  console.log('   1. Implementar autenticación automática al cargar la app');
  console.log('   2. Usar onAuthStateChange para manejar cambios de sesión');
  console.log('   3. Implementar retry logic para requests fallidos');
  console.log('   4. Considerar modo offline/cache para datos críticos');
  console.log('   5. Verificar que RLS policies permitan acceso anónimo donde sea necesario');
  
  console.log('\n' + '='.repeat(55));
  console.log('🏁 PRUEBA DE AUTENTICACIÓN COMPLETADA');
}

testUserAuth().catch(console.error);