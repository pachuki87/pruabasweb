const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Usar service role para ver todos los usuarios
);

async function verifyTestUser() {
  const testEmail = 'teststudent@gmail.com';
  
  console.log('🔍 Verificando usuario de prueba...');
  console.log('Email a buscar:', testEmail);
  
  try {
    // Buscar en la tabla usuarios
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', testEmail);
    
    if (usuariosError) {
      console.error('❌ Error al buscar en tabla usuarios:', usuariosError.message);
    } else {
      console.log('\n📊 Resultados en tabla usuarios:');
      if (usuarios && usuarios.length > 0) {
        console.log('✅ Usuario encontrado en tabla usuarios:');
        usuarios.forEach(user => {
          console.log('  - ID:', user.id);
          console.log('  - Email:', user.email);
          console.log('  - Nombre:', user.nombre || 'No definido');
          console.log('  - Rol:', user.rol);
          console.log('  - Creado:', user.creado_en);
          console.log('  - Última conexión:', user.ultima_conexion || 'Nunca');
        });
      } else {
        console.log('❌ Usuario NO encontrado en tabla usuarios');
      }
    }
    
    // Buscar inscripciones del usuario
    if (usuarios && usuarios.length > 0) {
      const userId = usuarios[0].id;
      
      const { data: inscripciones, error: inscripcionesError } = await supabase
        .from('inscripciones')
        .select(`
          *,
          cursos (
            id,
            nombre,
            descripcion
          )
        `)
        .eq('usuario_id', userId);
      
      if (inscripcionesError) {
        console.error('❌ Error al buscar inscripciones:', inscripcionesError.message);
      } else {
        console.log('\n📚 Inscripciones del usuario:');
        if (inscripciones && inscripciones.length > 0) {
          inscripciones.forEach(inscripcion => {
            console.log('  - Curso:', inscripcion.cursos?.nombre || 'Curso no encontrado');
            console.log('  - Estado:', inscripcion.estado);
            console.log('  - Fecha inscripción:', inscripcion.fecha_inscripcion);
            console.log('  - Progreso:', inscripcion.progreso || 0, '%');
            console.log('  ---');
          });
        } else {
          console.log('❌ No se encontraron inscripciones para este usuario');
        }
      }
    }
    
    // Intentar autenticar con las credenciales conocidas
    console.log('\n🔐 Probando autenticación...');
    
    const passwords = ['123456789', 'test123456'];
    
    for (const password of passwords) {
      console.log(`\n🔑 Probando contraseña: ${password}`);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: password,
      });
      
      if (authError) {
        console.log('❌ Fallo con contraseña:', password, '- Error:', authError.message);
      } else {
        console.log('✅ ¡Autenticación exitosa con contraseña:', password, '!');
        console.log('  - Usuario ID:', authData.user?.id);
        console.log('  - Email confirmado:', authData.user?.email_confirmed_at ? 'Sí' : 'No');
        console.log('  - Último login:', authData.user?.last_sign_in_at);
        
        // Cerrar sesión para no interferir
        await supabase.auth.signOut();
        break;
      }
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

verifyTestUser();