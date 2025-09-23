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

const userEmail = 'teststudent@gmail.com';
const password = 'test123456';

async function confirmTestUserEmail() {
  console.log('🔧 Confirmando email del usuario de prueba...');
  
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
      email_confirmed_at: authUser.email_confirmed_at,
      created_at: authUser.created_at
    });
    
    // 2. Confirmar email usando Admin API
    console.log('\n2. Confirmando email...');
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      authUser.id,
      {
        email_confirm: true, // Confirmar email automáticamente
        password: password // Asegurar que la contraseña esté correcta
      }
    );
    
    if (updateError) {
      console.error('❌ Error al confirmar email:', updateError.message);
      return;
    }
    
    console.log('✅ Email confirmado exitosamente');
    
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
      
      // Verificar que los IDs coincidan
      if (userData.id === authUser.id) {
        console.log('✅ Los IDs coinciden entre Auth y tabla usuarios');
      } else {
        console.log('⚠️ Los IDs NO coinciden:');
        console.log('  Auth ID:', authUser.id);
        console.log('  Tabla ID:', userData.id);
      }
    }
    
    console.log('\n✅ Proceso completado. El usuario puede iniciar sesión ahora.');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

confirmTestUserEmail();