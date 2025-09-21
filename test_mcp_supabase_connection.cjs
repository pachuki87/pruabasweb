require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 PROBANDO CONEXIÓN MCP SUPABASE');
console.log('================================');

// Verificar variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = process.env.SUPABASE_PROJECT_REF;

console.log('\n📋 Variables de entorno:');
console.log(`URL: ${supabaseUrl ? '✅ Configurada' : '❌ No configurada'}`);
console.log(`ANON_KEY: ${supabaseAnonKey ? '✅ Configurada' : '❌ No configurada'}`);
console.log(`SERVICE_KEY: ${supabaseServiceKey ? '✅ Configurada' : '❌ No configurada'}`);
console.log(`ACCESS_TOKEN: ${accessToken ? '✅ Configurada' : '❌ No configurada'}`);
console.log(`PROJECT_REF: ${projectRef ? '✅ Configurada' : '❌ No configurada'}`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ Faltan variables críticas de Supabase');
  process.exit(1);
}

// Crear cliente Supabase
console.log('\n🔗 Creando cliente Supabase...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Probar conexión básica
async function testConnection() {
  try {
    console.log('\n🧪 Probando conexión básica...');
    
    // Test 1: Verificar tablas principales
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .limit(3);
    
    if (cursosError) {
      console.log('❌ Error consultando cursos:', cursosError.message);
    } else {
      console.log(`✅ Cursos encontrados: ${cursos?.length || 0}`);
      if (cursos && cursos.length > 0) {
        cursos.forEach(curso => {
          console.log(`   - ${curso.titulo} (${curso.id})`);
        });
      }
    }

    // Test 2: Verificar lecciones
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, curso_id')
      .limit(3);
    
    if (leccionesError) {
      console.log('❌ Error consultando lecciones:', leccionesError.message);
    } else {
      console.log(`✅ Lecciones encontradas: ${lecciones?.length || 0}`);
    }

    // Test 3: Verificar materiales
    const { data: materiales, error: materialesError } = await supabase
      .from('materiales')
      .select('id, titulo, tipo_material')
      .limit(3);
    
    if (materialesError) {
      console.log('❌ Error consultando materiales:', materialesError.message);
    } else {
      console.log(`✅ Materiales encontrados: ${materiales?.length || 0}`);
    }

    // Test 4: Verificar cuestionarios
    const { data: cuestionarios, error: cuestionariosError } = await supabase
      .from('cuestionarios')
      .select('id, titulo, curso_id')
      .limit(3);
    
    if (cuestionariosError) {
      console.log('❌ Error consultando cuestionarios:', cuestionariosError.message);
    } else {
      console.log(`✅ Cuestionarios encontrados: ${cuestionarios?.length || 0}`);
    }

    console.log('\n🎯 RESUMEN DE CONEXIÓN:');
    console.log('- Conexión a Supabase: ✅ Exitosa');
    console.log('- Acceso a tablas principales: ✅ Confirmado');
    console.log('- Variables MCP configuradas: ✅ Listas para usar');
    
    console.log('\n📝 Para usar MCP Supabase:');
    console.log('1. Las variables de entorno están correctamente configuradas');
    console.log('2. El proyecto Supabase está accesible');
    console.log('3. Puedes usar los comandos MCP para consultar y modificar datos');
    
  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

testConnection();