require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('=== PRUEBA DE CONEXION A SUPABASE ===');
console.log('');

console.log('Variables de entorno:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY existe:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('');

// Crear cliente con service role
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('Cliente de Supabase creado');

(async () => {
  try {
    console.log('');
    console.log('1. Probando conexion basica...');
    
    // Probar una consulta simple
    const { data, error } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('Error en la conexion:', error.message);
      console.log('Detalles del error:', error);
    } else {
      console.log('Conexion exitosa');
      console.log('Datos recibidos:', data);
    }
    
    console.log('');
    console.log('2. Buscando usuario Pablo...');
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', 'pablocardonafeliu@gmail.com');
    
    if (userError) {
      console.log('Error al buscar usuario:', userError.message);
    } else {
      console.log('Usuario encontrado:', usuario?.length || 0, 'registros');
      if (usuario && usuario.length > 0) {
        console.log('Datos del usuario:', usuario[0]);
      }
    }
    
  } catch (error) {
    console.error('Error general:', error.message);
    console.error('Stack trace:', error.stack);
  }
  
  console.log('');
  console.log('=== PRUEBA COMPLETADA ===');
})();