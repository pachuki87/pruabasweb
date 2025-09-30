const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🔍 VERIFICACIÓN DE CONEXIÓN A SUPABASE');
console.log('=====================================\n');

// Función para mostrar el estado de una verificación
function mostrarEstado(titulo, exito, detalles = '') {
  const icono = exito ? '✅' : '❌';
  console.log(`${icono} ${titulo}`);
  if (detalles) {
    console.log(`   ${detalles}`);
  }
  console.log('');
}

async function verificarConexionSupabase() {
  let conexionExitosa = false;
  let clienteSupabase = null;

  try {
    // 1. VERIFICAR VARIABLES DE ENTORNO
    console.log('📋 1. VERIFICANDO VARIABLES DE ENTORNO');
    console.log('--------------------------------------');
    
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    mostrarEstado(
      'URL de Supabase', 
      !!supabaseUrl, 
      supabaseUrl ? `URL: ${supabaseUrl}` : 'Variable VITE_SUPABASE_URL no encontrada'
    );
    
    mostrarEstado(
      'Clave Anónima', 
      !!supabaseAnonKey, 
      supabaseAnonKey ? `Clave: ${supabaseAnonKey.substring(0, 20)}...` : 'Variable VITE_SUPABASE_ANON_KEY no encontrada'
    );
    
    mostrarEstado(
      'Clave de Servicio', 
      !!supabaseServiceKey, 
      supabaseServiceKey ? `Clave: ${supabaseServiceKey.substring(0, 20)}...` : 'Variable SUPABASE_SERVICE_ROLE_KEY no configurada (opcional)'
    );

    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('❌ ERROR: Variables de entorno requeridas no encontradas');
      console.log('   Asegúrate de que el archivo .env existe y contiene:');
      console.log('   - VITE_SUPABASE_URL');
      console.log('   - VITE_SUPABASE_ANON_KEY');
      return false;
    }

    // 2. CREAR CLIENTE DE SUPABASE
    console.log('🔗 2. CREANDO CLIENTE DE SUPABASE');
    console.log('----------------------------------');
    
    try {
      clienteSupabase = createClient(supabaseUrl, supabaseAnonKey);
      mostrarEstado('Cliente creado', true, 'Cliente de Supabase inicializado correctamente');
    } catch (error) {
      mostrarEstado('Cliente creado', false, `Error: ${error.message}`);
      return false;
    }

    // 3. PROBAR CONEXIÓN A LA BASE DE DATOS
    console.log('🌐 3. PROBANDO CONEXIÓN A LA BASE DE DATOS');
    console.log('-------------------------------------------');
    
    try {
      // Hacer una consulta simple para probar la conexión
      const { data, error } = await clienteSupabase
        .from('cursos')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        mostrarEstado('Conexión a BD', false, `Error: ${error.message}`);
        return false;
      } else {
        mostrarEstado('Conexión a BD', true, 'Conexión exitosa a la base de datos');
        conexionExitosa = true;
      }
    } catch (error) {
      mostrarEstado('Conexión a BD', false, `Error de conexión: ${error.message}`);
      return false;
    }

    // 4. VERIFICAR ACCESO A TABLAS PRINCIPALES
    console.log('📊 4. VERIFICANDO ACCESO A TABLAS PRINCIPALES');
    console.log('----------------------------------------------');
    
    const tablasImportantes = [
      'cursos',
      'lecciones', 
      'materiales',
      'cuestionarios',
      'preguntas',
      'respuestas_usuario',
      'progreso_usuario'
    ];

    let tablasAccesibles = 0;
    
    for (const tabla of tablasImportantes) {
      try {
        const { data, error } = await clienteSupabase
          .from(tabla)
          .select('count', { count: 'exact', head: true });
        
        if (error) {
          mostrarEstado(`Tabla: ${tabla}`, false, `Error: ${error.message}`);
        } else {
          mostrarEstado(`Tabla: ${tabla}`, true, `Acceso correcto (${data?.length || 0} registros)`);
          tablasAccesibles++;
        }
      } catch (error) {
        mostrarEstado(`Tabla: ${tabla}`, false, `Error: ${error.message}`);
      }
    }

    // 5. INFORMACIÓN ADICIONAL DEL PROYECTO
    console.log('ℹ️  5. INFORMACIÓN DEL PROYECTO SUPABASE');
    console.log('----------------------------------------');
    
    try {
      // Obtener información básica del proyecto
      const { data: cursosData } = await clienteSupabase
        .from('cursos')
        .select('id, titulo')
        .limit(3);
      
      if (cursosData && cursosData.length > 0) {
        mostrarEstado('Datos de ejemplo', true, `Encontrados ${cursosData.length} cursos en la base de datos`);
        cursosData.forEach((curso, index) => {
          console.log(`   ${index + 1}. ${curso.titulo} (ID: ${curso.id})`);
        });
        console.log('');
      }
    } catch (error) {
      mostrarEstado('Datos de ejemplo', false, `No se pudieron obtener datos de ejemplo: ${error.message}`);
    }

    // 6. RESUMEN FINAL
    console.log('📋 6. RESUMEN DE LA VERIFICACIÓN');
    console.log('--------------------------------');
    
    const estadoGeneral = conexionExitosa && tablasAccesibles >= 5;
    
    console.log(`Estado general: ${estadoGeneral ? '✅ CONEXIÓN EXITOSA' : '❌ PROBLEMAS DETECTADOS'}`);
    console.log(`Tablas accesibles: ${tablasAccesibles}/${tablasImportantes.length}`);
    console.log(`URL del proyecto: ${supabaseUrl}`);
    console.log(`Fecha de verificación: ${new Date().toLocaleString('es-ES')}`);
    
    if (estadoGeneral) {
      console.log('\n🎉 ¡La conexión a Supabase está funcionando correctamente!');
      console.log('   Puedes usar la base de datos sin problemas.');
    } else {
      console.log('\n⚠️  Se detectaron algunos problemas en la conexión.');
      console.log('   Revisa los errores mostrados arriba para solucionarlos.');
    }

    return estadoGeneral;

  } catch (error) {
    console.log('❌ ERROR GENERAL EN LA VERIFICACIÓN:');
    console.log(`   ${error.message}`);
    console.log(`   Stack: ${error.stack}`);
    return false;
  }
}

// Ejecutar la verificación
if (require.main === module) {
  verificarConexionSupabase()
    .then((exito) => {
      process.exit(exito ? 0 : 1);
    })
    .catch((error) => {
      console.error('Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { verificarConexionSupabase };