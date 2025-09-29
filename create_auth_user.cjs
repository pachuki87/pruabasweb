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

const testUserId = '79bcdeb7-512b-45cd-88df-f5b44169115e';

async function createAuthUser() {
  console.log('🔧 Creando usuario de autenticación...');
  
  try {
    // 1. Obtener y limpiar datos del usuario
    console.log('\n1. Obteniendo datos del usuario...');
    const { data: userData, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('id', testUserId)
      .single();
    
    if (userError) {
      console.error('❌ Error al obtener usuario:', userError.message);
      return;
    }
    
    // Limpiar el email removiendo caracteres de control
    const cleanEmail = userData.email.trim().replace(/[\r\n]/g, '');
    console.log('✅ Usuario encontrado:', {
      id: userData.id,
      email_original: userData.email,
      email_limpio: cleanEmail,
      nombre: userData.nombre,
      rol: userData.rol
    });
    
    // 2. Actualizar el email en la base de datos
    console.log('\n2. Actualizando email en la base de datos...');
    const { error: updateError } = await supabaseAdmin
      .from('usuarios')
      .update({ email: cleanEmail })
      .eq('id', testUserId);
    
    if (updateError) {
      console.error('❌ Error al actualizar email:', updateError.message);
    } else {
      console.log('✅ Email actualizado correctamente');
    }
    
    // 3. Crear usuario en Supabase Auth usando Admin API
    console.log('\n3. Creando usuario en Supabase Auth...');
    const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password: 'password123',
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        nombre: userData.nombre,
        rol: userData.rol
      }
    });
    
    if (createError) {
      console.error('❌ Error al crear usuario de auth:', createError.message);
      
      // Si el usuario ya existe, intentar obtenerlo
      if (createError.message.includes('already registered')) {
        console.log('\n4. Usuario ya existe, obteniendo datos...');
        const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (listError) {
          console.error('❌ Error al listar usuarios:', listError.message);
        } else {
          const existingUser = existingUsers.users.find(u => u.email === cleanEmail);
          if (existingUser) {
            console.log('✅ Usuario de auth encontrado:', {
              id: existingUser.id,
              email: existingUser.email,
              created_at: existingUser.created_at
            });
            
            // Actualizar el ID en la tabla usuarios si es diferente
            if (existingUser.id !== testUserId) {
              console.log('\n5. Actualizando ID en tabla usuarios...');
              const { error: updateIdError } = await supabaseAdmin
                .from('usuarios')
                .update({ id: existingUser.id })
                .eq('email', cleanEmail);
              
              if (updateIdError) {
                console.error('❌ Error al actualizar ID:', updateIdError.message);
              } else {
                console.log('✅ ID actualizado en tabla usuarios');
              }
            }
          }
        }
      }
    } else {
      console.log('✅ Usuario de autenticación creado exitosamente:', {
        id: authUser.user.id,
        email: authUser.user.email,
        created_at: authUser.user.created_at
      });
      
      // Actualizar el ID en la tabla usuarios si es diferente
      if (authUser.user.id !== testUserId) {
        console.log('\n4. Actualizando ID en tabla usuarios...');
        const { error: updateIdError } = await supabaseAdmin
          .from('usuarios')
          .update({ id: authUser.user.id })
          .eq('email', cleanEmail);
        
        if (updateIdError) {
          console.error('❌ Error al actualizar ID:', updateIdError.message);
        } else {
          console.log('✅ ID actualizado en tabla usuarios');
          
          // También actualizar las inscripciones y progreso
          console.log('\n5. Actualizando inscripciones...');
          const { error: updateInscripcionesError } = await supabaseAdmin
            .from('inscripciones')
            .update({ user_id: authUser.user.id })
            .eq('user_id', testUserId);
          
          if (updateInscripcionesError) {
            console.error('❌ Error al actualizar inscripciones:', updateInscripcionesError.message);
          } else {
            console.log('✅ Inscripciones actualizadas');
          }
          
          console.log('\n6. Actualizando progreso...');
          const { error: updateProgressError } = await supabaseAdmin
            .from('user_course_progress')
            .update({ user_id: authUser.user.id })
            .eq('user_id', testUserId);
          
          if (updateProgressError) {
            console.error('❌ Error al actualizar progreso:', updateProgressError.message);
          } else {
            console.log('✅ Progreso actualizado');
          }
        }
      }
    }
    
    // 6. Probar autenticación
    console.log('\n7. Probando autenticación...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: 'password123'
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
      const { data: enrollments, error: enrollError } = await supabase
        .from('inscripciones')
        .select('*')
        .eq('user_id', signInData.user.id);
      
      if (enrollError) {
        console.error('❌ Error al obtener inscripciones:', enrollError.message);
      } else {
        console.log('✅ Inscripciones obtenidas:', enrollments?.length || 0);
      }
    }
    
    console.log('\n✅ Proceso completado');
    console.log('\n📋 INSTRUCCIONES PARA EL FRONTEND:');
    console.log(`   Email: ${cleanEmail}`);
    console.log('   Contraseña: password123');
    console.log('   Ahora el usuario puede autenticarse en el frontend');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

createAuthUser();