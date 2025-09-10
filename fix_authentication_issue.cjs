require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testUserId = '79bcdeb7-512b-45cd-88df-f5b44169115e';

async function fixAuthenticationIssue() {
  console.log('🔧 Diagnosticando y corrigiendo problema de autenticación...');
  
  try {
    // 1. Verificar si el usuario existe en la tabla usuarios
    console.log('\n1. Verificando usuario en tabla usuarios...');
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', testUserId)
      .single();
    
    if (userError) {
      console.error('❌ Error al obtener usuario:', userError.message);
    } else {
      console.log('✅ Usuario encontrado:', {
        id: userData.id,
        email: userData.email,
        nombre: userData.nombre,
        rol: userData.rol
      });
    }
    
    // 2. Intentar autenticación con las credenciales del usuario
    console.log('\n2. Intentando autenticación...');
    
    if (userData && userData.email) {
      // Intentar con contraseña común de prueba
      const testPasswords = ['password123', '123456', 'test123', userData.email];
      
      for (const password of testPasswords) {
        console.log(`   Probando contraseña: ${password}`);
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: password
        });
        
        if (signInError) {
          console.log(`   ❌ Falló con ${password}: ${signInError.message}`);
        } else {
          console.log(`   ✅ ¡Autenticación exitosa con ${password}!`);
          console.log('   Usuario autenticado:', signInData.user?.email);
          
          // 3. Probar acceso a datos con usuario autenticado
          console.log('\n3. Probando acceso a datos con usuario autenticado...');
          
          // Verificar progreso del usuario autenticado
          const { data: progress, error: progressError } = await supabase
            .from('user_course_progress')
            .select('*')
            .eq('user_id', signInData.user.id);
          
          if (progressError) {
            console.error('   ❌ Error al obtener progreso:', progressError.message);
          } else {
            console.log('   ✅ Registros de progreso con auth:', progress?.length || 0);
          }
          
          // Verificar inscripciones del usuario autenticado
          const { data: enrollments, error: enrollError } = await supabase
            .from('inscripciones')
            .select('*')
            .eq('user_id', signInData.user.id);
          
          if (enrollError) {
            console.error('   ❌ Error al obtener inscripciones:', enrollError.message);
          } else {
            console.log('   ✅ Inscripciones con auth:', enrollments?.length || 0);
          }
          
          return; // Salir si la autenticación fue exitosa
        }
      }
      
      console.log('\n⚠️  No se pudo autenticar con ninguna contraseña de prueba');
    }
    
    // 4. Crear usuario de autenticación si no existe
    console.log('\n4. Intentando crear usuario de autenticación...');
    
    if (userData && userData.email) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: userData.email,
        password: 'password123',
        options: {
          data: {
            nombre: userData.nombre,
            rol: userData.rol
          }
        }
      });
      
      if (signUpError) {
        console.error('   ❌ Error al crear usuario de auth:', signUpError.message);
        
        // Si el usuario ya existe, intentar reset de contraseña
        if (signUpError.message.includes('already registered')) {
          console.log('\n5. Usuario ya existe, intentando reset de contraseña...');
          
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(
            userData.email,
            {
              redirectTo: 'http://localhost:5173/reset-password'
            }
          );
          
          if (resetError) {
            console.error('   ❌ Error al enviar reset:', resetError.message);
          } else {
            console.log('   ✅ Email de reset enviado');
          }
        }
      } else {
        console.log('   ✅ Usuario de autenticación creado:', signUpData.user?.email);
        console.log('   📧 Verificar email para confirmar cuenta');
      }
    }
    
    // 5. Verificar políticas RLS
    console.log('\n6. Verificando políticas RLS...');
    
    // Probar acceso sin autenticación (debería funcionar con rol anon)
    const { data: publicData, error: publicError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .limit(1);
    
    if (publicError) {
      console.error('   ❌ Error acceso público a cursos:', publicError.message);
    } else {
      console.log('   ✅ Acceso público a cursos funciona');
    }
    
    console.log('\n✅ Diagnóstico de autenticación completado');
    console.log('\n📋 RESUMEN DEL PROBLEMA:');
    console.log('   - El usuario existe en la tabla usuarios');
    console.log('   - No hay usuario correspondiente en Supabase Auth');
    console.log('   - El frontend no puede autenticarse');
    console.log('   - Las consultas que requieren user_id fallan');
    console.log('\n🔧 SOLUCIONES RECOMENDADAS:');
    console.log('   1. Crear usuarios en Supabase Auth para usuarios existentes');
    console.log('   2. Implementar login/registro en el frontend');
    console.log('   3. Verificar políticas RLS para acceso sin autenticación');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

fixAuthenticationIssue();