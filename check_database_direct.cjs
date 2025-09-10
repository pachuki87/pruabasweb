const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarBaseDatos() {
  try {
    console.log('=== VERIFICACIÓN DIRECTA DE BASE DE DATOS ===\n');

    // 1. Verificar todos los registros en user_course_summary
    console.log('1. Consultando TODOS los registros en user_course_summary...');
    const { data: todosRegistros, error: allError } = await supabase
      .from('user_course_summary')
      .select('*');

    if (allError) {
      console.log('❌ Error al consultar todos los registros:', allError);
    } else {
      console.log(`📊 Total de registros en user_course_summary: ${todosRegistros?.length || 0}`);
      if (todosRegistros && todosRegistros.length > 0) {
        console.log('\n📋 TODOS LOS REGISTROS:');
        todosRegistros.forEach((registro, index) => {
          console.log(`\n${index + 1}. ID: ${registro.id}`);
          console.log(`   User ID: ${registro.user_id}`);
          console.log(`   Curso ID: ${registro.curso_id}`);
          console.log(`   Progreso: ${registro.porcentaje_progreso}%`);
          console.log(`   Lecciones: ${registro.lecciones_completadas}/${registro.total_lecciones}`);
          console.log(`   Tiempo: ${registro.tiempo_total_gastado} min`);
          console.log(`   Creado: ${registro.creado_en}`);
          console.log(`   Actualizado: ${registro.actualizado_en}`);
        });
      }
    }

    // 2. Buscar específicamente por Pablo
    console.log('\n2. Buscando específicamente registros de Pablo...');
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('id, nombre, email')
      .eq('email', 'pablocardonafeliu@gmail.com')
      .single();

    if (userError || !usuario) {
      console.log('❌ Error al buscar usuario Pablo:', userError);
      return;
    }

    console.log(`✅ Pablo encontrado - ID: ${usuario.id}`);

    const { data: pabloRegistros, error: pabloError } = await supabase
      .from('user_course_summary')
      .select('*')
      .eq('user_id', usuario.id);

    if (pabloError) {
      console.log('❌ Error al buscar registros de Pablo:', pabloError);
    } else {
      console.log(`📊 Registros de Pablo: ${pabloRegistros?.length || 0}`);
      if (pabloRegistros && pabloRegistros.length > 0) {
        console.log('\n📋 REGISTROS DE PABLO:');
        pabloRegistros.forEach((registro, index) => {
          console.log(`\n${index + 1}. ID: ${registro.id}`);
          console.log(`   Curso ID: ${registro.curso_id}`);
          console.log(`   Progreso: ${registro.porcentaje_progreso}%`);
          console.log(`   Lecciones: ${registro.lecciones_completadas}/${registro.total_lecciones}`);
          console.log(`   Tiempo: ${registro.tiempo_total_gastado} min`);
        });
      } else {
        console.log('❌ No se encontraron registros para Pablo');
      }
    }

    // 3. Verificar permisos de la tabla
    console.log('\n3. Verificando permisos de la tabla...');
    const { data: permisos, error: permisosError } = await supabase
      .rpc('check_table_permissions', { table_name: 'user_course_summary' })
      .single();

    if (permisosError) {
      console.log('ℹ️  No se pudo verificar permisos (función no disponible)');
    } else {
      console.log('✅ Permisos verificados:', permisos);
    }

    console.log('\n=== VERIFICACIÓN COMPLETADA ===');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar verificación
verificarBaseDatos();