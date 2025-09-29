require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase con service role para operaciones admin
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const supabase = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY);

const userEmail = 'vicentemk87@gmail.com';
const newPassword = 'password123';

async function resetUserPassword() {
  console.log('🔧 Reseteando contraseña del usuario...');
  
  try {
    // 1. Buscar el usuario en Supabase Auth
    console.log('\n1. Buscando usuario en Supabase Auth...');
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error al listar usuarios:', listError.message);
      return;
    }
    
    const authUser = users.users.find(u => u.email === userEmail);
    
    if (!authUser) {
      console.error('❌ Usuario no encontrado en Supabase Auth');
      return;
    }
    
    console.log('✅ Usuario encontrado en Auth:', {
      id: authUser.id,
      email: authUser.email,
      created_at: authUser.created_at,
      last_sign_in_at: authUser.last_sign_in_at
    });
    
    // 2. Resetear contraseña usando Admin API
    console.log('\n2. Reseteando contraseña...');
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      authUser.id,
      {
        password: newPassword,
        email_confirm: true // Asegurar que el email esté confirmado
      }
    );
    
    if (updateError) {
      console.error('❌ Error al resetear contraseña:', updateError.message);
      return;
    }
    
    console.log('✅ Contraseña reseteada exitosamente');
    
    // 3. Verificar que el ID coincida con la tabla usuarios
    console.log('\n3. Verificando sincronización con tabla usuarios...');
    const { data: userData, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('email', userEmail)
      .single();
    
    if (userError) {
      console.error('❌ Error al obtener usuario de tabla usuarios:', userError.message);
    } else {
      console.log('Usuario en tabla usuarios:', {
        id: userData.id,
        email: userData.email,
        nombre: userData.nombre,
        rol: userData.rol
      });
      
      // Si los IDs no coinciden, actualizar la tabla usuarios
      if (userData.id !== authUser.id) {
        console.log('\n4. Actualizando ID en tabla usuarios...');
        const { error: updateIdError } = await supabaseAdmin
          .from('usuarios')
          .update({ id: authUser.id })
          .eq('email', userEmail);
        
        if (updateIdError) {
          console.error('❌ Error al actualizar ID:', updateIdError.message);
        } else {
          console.log('✅ ID actualizado en tabla usuarios');
          
          // Actualizar inscripciones
          console.log('\n5. Actualizando inscripciones...');
          const { error: updateInscripcionesError } = await supabaseAdmin
            .from('inscripciones')
            .update({ user_id: authUser.id })
            .eq('user_id', userData.id);
          
          if (updateInscripcionesError) {
            console.error('❌ Error al actualizar inscripciones:', updateInscripcionesError.message);
          } else {
            console.log('✅ Inscripciones actualizadas');
          }
          
          // Actualizar progreso
          console.log('\n6. Actualizando progreso...');
          const { error: updateProgressError } = await supabaseAdmin
            .from('user_course_progress')
            .update({ user_id: authUser.id })
            .eq('user_id', userData.id);
          
          if (updateProgressError) {
            console.error('❌ Error al actualizar progreso:', updateProgressError.message);
          } else {
            console.log('✅ Progreso actualizado');
          }
        }
      } else {
        console.log('✅ Los IDs ya coinciden');
      }
    }
    
    // 4. Probar autenticación
    console.log('\n7. Probando autenticación...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: newPassword
    });
    
    if (signInError) {
      console.error('❌ Error al autenticar:', signInError.message);
    } else {
      console.log('✅ ¡Autenticación exitosa!');
      console.log('Usuario autenticado:', {
        id: signInData.user.id,
        email: signInData.user.email
      });
      
      // Probar acceso a datos
      console.log('\n8. Probando acceso a datos con usuario autenticado...');
      
      // Inscripciones
      const { data: enrollments, error: enrollError } = await supabase
        .from('inscripciones')
        .select('*')
        .eq('user_id', signInData.user.id);
      
      if (enrollError) {
        console.error('❌ Error al obtener inscripciones:', enrollError.message);
      } else {
        console.log('✅ Inscripciones obtenidas:', enrollments?.length || 0);
      }
      
      // Progreso del curso
      const { data: progress, error: progressError } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', signInData.user.id);
      
      if (progressError) {
        console.error('❌ Error al obtener progreso:', progressError.message);
      } else {
        console.log('✅ Registros de progreso:', progress?.length || 0);
      }
      
      // Vista de resumen
      const { data: summary, error: summaryError } = await supabase
        .from('user_course_summary')
        .select('*')
        .eq('user_id', signInData.user.id);
      
      if (summaryError) {
        console.error('❌ Error al obtener resumen:', summaryError.message);
      } else {
        console.log('✅ Resumen del curso:', summary?.length || 0);
        if (summary && summary.length > 0) {
          console.log('Progreso del curso:', summary[0]);
        }
      }
    }
    
    console.log('\n✅ Proceso completado');
    console.log('\n📋 CREDENCIALES PARA EL FRONTEND:');
    console.log(`   Email: ${userEmail}`);
    console.log(`   Contraseña: ${newPassword}`);
    console.log('   El usuario ahora puede autenticarse correctamente en el frontend');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

resetUserPassword();