require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findPabloUser() {
  console.log('🔍 Buscando usuario Pablo...');
  
  try {
    // 1. Buscar en la tabla auth.users (si tenemos acceso)
    console.log('\n👤 Buscando usuarios con nombre Pablo...');
    
    // 2. Buscar todos los usuarios
    console.log('\n👤 Verificando todos los usuarios...');
    const { data: todosUsuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*');
    
    if (usuariosError) {
      console.error('❌ Error al obtener usuarios:', usuariosError);
    } else {
      console.log('✅ Total usuarios encontrados:', todosUsuarios.length);
      todosUsuarios.forEach((usuario, index) => {
        console.log(`   Usuario ${index + 1}: ${usuario.id}`);
        console.log(`     - Email: ${usuario.email}`);
        console.log(`     - Nombre: ${usuario.nombre || usuario.name || 'Sin nombre'}`);
      });
    }

    // 3. Buscar progreso de cursos
    console.log('\n📊 Verificando progreso de cursos...');
    const { data: todoProgreso, error: progresoError } = await supabase
      .from('user_course_progress')
      .select('*');
    
    if (progresoError) {
      console.error('❌ Error al obtener progreso:', progresoError);
    } else {
      console.log('✅ Total registros de progreso encontrados:', todoProgreso.length);
      
      const usuariosConProgreso = [...new Set(todoProgreso.map(prog => prog.user_id))];
      console.log('👥 Usuarios únicos con progreso:', usuariosConProgreso.length);
      
      usuariosConProgreso.forEach((userId, index) => {
        const progresoUsuario = todoProgreso.filter(prog => prog.user_id === userId);
        const usuario = todosUsuarios?.find(u => u.id === userId);
        console.log(`\n   Usuario ${index + 1}: ${userId}`);
        console.log(`     - Nombre: ${usuario?.nombre || usuario?.name || 'Sin nombre'}`);
        progresoUsuario.forEach(prog => {
          console.log(`     - Curso ID: ${prog.curso_id}, Progreso: ${prog.progreso_porcentaje}%`);
        });
      });
    }

    // 3. Verificar respuestas de texto libre
    console.log('\n📝 Verificando todas las respuestas...');
    const { data: todasRespuestas, error: respuestasError } = await supabase
      .from('respuestas_texto_libre')
      .select('*');
    
    if (respuestasError) {
      console.error('❌ Error al obtener respuestas:', respuestasError);
    } else {
      console.log('✅ Total respuestas encontradas:', todasRespuestas.length);
      
      const usuariosConRespuestas = [...new Set(todasRespuestas.map(resp => resp.user_id))];
      console.log('👥 Usuarios únicos con respuestas:', usuariosConRespuestas.length);
      
      usuariosConRespuestas.forEach((userId, index) => {
        const respuestasUsuario = todasRespuestas.filter(resp => resp.user_id === userId);
        console.log(`\n   Usuario ${index + 1}: ${userId}`);
        console.log(`     - Total respuestas: ${respuestasUsuario.length}`);
        console.log(`     - Completadas: ${respuestasUsuario.filter(r => r.completado).length}`);
      });
    }

    // 4. Verificar intentos de cuestionarios
    console.log('\n🎯 Verificando todos los intentos...');
    const { data: todosIntentos, error: intentosError } = await supabase
      .from('intentos_cuestionario')
      .select('*');
    
    if (intentosError) {
      console.error('❌ Error al obtener intentos:', intentosError);
    } else {
      console.log('✅ Total intentos encontrados:', todosIntentos.length);
      
      const usuariosConIntentos = [...new Set(todosIntentos.map(intento => intento.user_id))];
      console.log('👥 Usuarios únicos con intentos:', usuariosConIntentos.length);
      
      usuariosConIntentos.forEach((userId, index) => {
        const intentosUsuario = todosIntentos.filter(intento => intento.user_id === userId);
        console.log(`\n   Usuario ${index + 1}: ${userId}`);
        console.log(`     - Total intentos: ${intentosUsuario.length}`);
        console.log(`     - Aprobados: ${intentosUsuario.filter(i => i.aprobado).length}`);
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

findPabloUser();