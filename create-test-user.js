import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTgwMzAsImV4cCI6MjA2MzA3NDAzMH0._7ODHgTZbdP_k3PjYNIcx1j42xKWBRa3lZ-P-0BBBPc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
  const testEmail = 'teststudent@gmail.com';
  const testPassword = 'test123456';
  
  console.log('🔐 Creando usuario de prueba...');
  console.log('Email:', testEmail);
  console.log('Password:', testPassword);
  
  try {
    // Intentar registrar el usuario
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('✅ El usuario ya existe, intentando iniciar sesión...');
        
        // Si ya existe, intentar iniciar sesión
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        });

        if (signInError) {
          console.error('❌ Error al iniciar sesión:', signInError.message);
          return;
        }

        console.log('✅ Sesión iniciada exitosamente');
        console.log('Usuario ID:', signInData.user?.id);
        console.log('Email:', signInData.user?.email);
        
      } else {
        console.error('❌ Error al registrar usuario:', signUpError.message);
        return;
      }
    } else {
      console.log('✅ Usuario registrado exitosamente');
      console.log('Usuario ID:', signUpData.user?.id);
      console.log('Email:', signUpData.user?.email);
      
      if (signUpData.user && !signUpData.session) {
        console.log('📧 Se requiere confirmación por email. Intentando iniciar sesión...');
        
        // Intentar iniciar sesión inmediatamente
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        });

        if (signInError) {
          console.error('❌ Error al iniciar sesión después del registro:', signInError.message);
        } else {
          console.log('✅ Sesión iniciada después del registro');
        }
      }
    }

    // Verificar el estado actual de la sesión
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error al obtener sesión:', sessionError.message);
    } else if (sessionData.session) {
      console.log('\n🎉 ¡Sesión activa!');
      console.log('Usuario autenticado:', sessionData.session.user.email);
      console.log('ID:', sessionData.session.user.id);
      console.log('\n🎯 Ahora puedes probar el cuestionario en:');
      console.log('http://localhost:5173/student/quizzes/attempt/1e9291a8-cc44-4d8c-bfbf-3aea525ed4fe');
    } else {
      console.log('\n⚠️  No hay sesión activa. Puede que necesites confirmar el email.');
      console.log('\n📝 Credenciales para usar en el frontend:');
      console.log('Email:', testEmail);
      console.log('Password:', testPassword);
    }

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

createTestUser();