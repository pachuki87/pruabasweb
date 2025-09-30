const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🔍 VERIFICACIÓN DEL USUARIO VICENTE');
console.log('===================================\n');

async function verificarUsuarioVicente() {
  try {
    // Crear cliente de Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('❌ Variables de entorno no encontradas');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Cliente de Supabase creado\n');

    // 1. Verificar si existe la tabla usuarios
    console.log('📋 1. VERIFICANDO TABLA USUARIOS');
    console.log('--------------------------------');
    
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .limit(5);

    if (usuariosError) {
      console.log('❌ Error al acceder a la tabla usuarios:', usuariosError.message);
      return;
    }

    console.log(`✅ Tabla usuarios accesible (${usuarios.length} registros encontrados)`);
    
    if (usuarios.length > 0) {
      console.log('📊 Primeros usuarios en la tabla:');
      usuarios.forEach((usuario, index) => {
        console.log(`   ${index + 1}. Email: ${usuario.email}, Rol: ${usuario.rol}, ID: ${usuario.id}`);
      });
    }
    console.log('');

    // 2. Buscar específicamente el usuario Vicente
    console.log('🔍 2. BUSCANDO USUARIO VICENTE');
    console.log('------------------------------');
    
    const { data: vicente, error: vicenteError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', 'vicentemk87@gmail.com')
      .single();

    if (vicenteError) {
      if (vicenteError.code === 'PGRST116') {
        console.log('❌ Usuario Vicente NO encontrado en la base de datos');
        console.log('   Email buscado: vicentemk87@gmail.com');
      } else {
        console.log('❌ Error al buscar usuario Vicente:', vicenteError.message);
      }
    } else {
      console.log('✅ Usuario Vicente ENCONTRADO:');
      console.log(`   ID: ${vicente.id}`);
      console.log(`   Email: ${vicente.email}`);
      console.log(`   Rol: ${vicente.rol}`);
      console.log(`   Nombre: ${vicente.name || 'No especificado'}`);
    }
    console.log('');

    // 3. Listar todos los usuarios para debug
    console.log('📋 3. TODOS LOS USUARIOS EN LA BASE DE DATOS');
    console.log('--------------------------------------------');
    
    const { data: todosUsuarios, error: todosError } = await supabase
      .from('usuarios')
      .select('*');

    if (todosError) {
      console.log('❌ Error al obtener todos los usuarios:', todosError.message);
    } else {
      console.log(`📊 Total de usuarios: ${todosUsuarios.length}`);
      todosUsuarios.forEach((usuario, index) => {
        console.log(`   ${index + 1}. ${usuario.email} - Rol: ${usuario.rol} - ID: ${usuario.id}`);
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verificarUsuarioVicente();