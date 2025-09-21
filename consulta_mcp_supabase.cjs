require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 CONSULTA MCP SUPABASE - ANÁLISIS COMPLETO DE CURSOS');
console.log('=====================================================');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Variables de entorno de Supabase no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function consultaMCPSupabase() {
  try {
    console.log('\n📚 CONSULTANDO INFORMACIÓN DE CURSOS...\n');

    // 1. Obtener todos los cursos
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('*')
      .order('creado_en', { ascending: true });

    if (cursosError) {
      console.log('❌ Error consultando cursos:', cursosError.message);
      return;
    }

    console.log(`✅ Cursos encontrados: ${cursos.length}\n`);

    // 2. Para cada curso, obtener estadísticas detalladas
    for (const curso of cursos) {
      console.log(`📖 CURSO: ${curso.titulo}`);
      console.log(`   ID: ${curso.id}`);
      console.log(`   Descripción: ${curso.descripcion?.substring(0, 100)}...`);
      console.log(`   Creado: ${new Date(curso.creado_en).toLocaleDateString('es-ES')}`);
      
      // Contar lecciones
      const { data: lecciones, error: leccionesError } = await supabase
        .from('lecciones')
        .select('id, titulo, orden, duracion_estimada, tiene_cuestionario')
        .eq('curso_id', curso.id)
        .order('orden', { ascending: true });

      if (!leccionesError && lecciones) {
        console.log(`   📝 Lecciones: ${lecciones.length}`);
        
        // Mostrar algunas lecciones
        if (lecciones.length > 0) {
          console.log(`   📋 Primeras lecciones:`);
          lecciones.slice(0, 3).forEach(leccion => {
            console.log(`      ${leccion.orden}. ${leccion.titulo} ${leccion.tiene_cuestionario ? '📝' : ''}`);
          });
          if (lecciones.length > 3) {
            console.log(`      ... y ${lecciones.length - 3} más`);
          }
        }

        // Contar lecciones con cuestionarios
        const leccionesConQuiz = lecciones.filter(l => l.tiene_cuestionario).length;
        console.log(`   🧪 Lecciones con cuestionario: ${leccionesConQuiz}`);
      }

      // Contar materiales
      const { data: materiales, error: materialesError } = await supabase
        .from('materiales')
        .select('id, titulo, tipo_material')
        .eq('curso_id', curso.id);

      if (!materialesError && materiales) {
        console.log(`   📎 Materiales: ${materiales.length}`);
        
        // Agrupar por tipo
        const tiposMateriales = materiales.reduce((acc, material) => {
          acc[material.tipo_material] = (acc[material.tipo_material] || 0) + 1;
          return acc;
        }, {});
        
        Object.entries(tiposMateriales).forEach(([tipo, cantidad]) => {
          console.log(`      ${tipo}: ${cantidad}`);
        });
      }

      // Contar cuestionarios
      const { data: cuestionarios, error: cuestionariosError } = await supabase
        .from('cuestionarios')
        .select('id, titulo')
        .eq('curso_id', curso.id);

      if (!cuestionariosError && cuestionarios) {
        console.log(`   📊 Cuestionarios: ${cuestionarios.length}`);
      }

      // Contar inscripciones
      const { data: inscripciones, error: inscripcionesError } = await supabase
        .from('inscripciones')
        .select('user_id')
        .eq('curso_id', curso.id);

      if (!inscripcionesError && inscripciones) {
        console.log(`   👥 Estudiantes inscritos: ${inscripciones.length}`);
      }

      console.log('   ' + '─'.repeat(50));
    }

    // 3. Estadísticas generales
    console.log('\n📊 ESTADÍSTICAS GENERALES:');
    
    const { data: totalLecciones } = await supabase
      .from('lecciones')
      .select('id', { count: 'exact', head: true });
    
    const { data: totalMateriales } = await supabase
      .from('materiales')
      .select('id', { count: 'exact', head: true });
    
    const { data: totalCuestionarios } = await supabase
      .from('cuestionarios')
      .select('id', { count: 'exact', head: true });

    const { data: totalInscripciones } = await supabase
      .from('inscripciones')
      .select('user_id', { count: 'exact', head: true });

    console.log(`📚 Total de cursos: ${cursos.length}`);
    console.log(`📝 Total de lecciones: ${totalLecciones?.length || 0}`);
    console.log(`📎 Total de materiales: ${totalMateriales?.length || 0}`);
    console.log(`📊 Total de cuestionarios: ${totalCuestionarios?.length || 0}`);
    console.log(`👥 Total de inscripciones: ${totalInscripciones?.length || 0}`);

    // 4. Consulta avanzada: Lecciones más populares (con más materiales)
    console.log('\n🏆 LECCIONES CON MÁS MATERIALES:');
    
    const { data: leccionesPopulares, error: popularesError } = await supabase
      .from('lecciones')
      .select(`
        id,
        titulo,
        curso_id,
        cursos!inner(titulo),
        materiales(id)
      `)
      .limit(5);

    if (!popularesError && leccionesPopulares) {
      leccionesPopulares
        .sort((a, b) => (b.materiales?.length || 0) - (a.materiales?.length || 0))
        .slice(0, 3)
        .forEach((leccion, index) => {
          console.log(`${index + 1}. ${leccion.titulo}`);
          console.log(`   Curso: ${leccion.cursos.titulo}`);
          console.log(`   Materiales: ${leccion.materiales?.length || 0}`);
        });
    }

    console.log('\n✅ Consulta MCP completada exitosamente!');
    console.log('\n💡 Esta consulta demuestra las capacidades de MCP Supabase:');
    console.log('   - Consultas complejas con joins');
    console.log('   - Agregaciones y conteos');
    console.log('   - Filtrado y ordenamiento');
    console.log('   - Análisis de datos relacionales');

  } catch (error) {
    console.log('❌ Error en la consulta MCP:', error.message);
  }
}

// Ejecutar la consulta
consultaMCPSupabase();