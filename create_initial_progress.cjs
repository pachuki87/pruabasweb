require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createInitialProgress() {
  try {
    console.log('🔄 Conectando a Supabase...');
    console.log('🔍 Verificando estructura de user_course_summary...\n');
    
    // Primero verificar la estructura de la tabla
    const { data: testData, error: testError } = await supabase
      .from('user_course_summary')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error al verificar tabla:', testError);
      return;
    }
    
    console.log('✅ Tabla user_course_summary accesible');
    
    // Obtener todas las inscripciones
    const { data: inscripciones, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('user_id, curso_id');
    
    if (inscripcionesError) {
      console.error('❌ Error al obtener inscripciones:', inscripcionesError);
      return;
    }
    
    console.log(`📊 Inscripciones encontradas: ${inscripciones?.length || 0}`);
    
    if (!inscripciones || inscripciones.length === 0) {
      console.log('⚠️ No hay inscripciones para procesar');
      return;
    }
    
    // Obtener información de cursos y sus lecciones
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select(`
        id,
        titulo,
        lecciones(id)
      `);
    
    if (cursosError) {
      console.error('❌ Error al obtener cursos:', cursosError);
      return;
    }
    
    console.log(`📚 Cursos encontrados: ${cursos?.length || 0}`);
    
    // Crear mapa de cursos con conteo de lecciones
    const cursosMap = new Map();
    cursos?.forEach(curso => {
      cursosMap.set(curso.id, {
        titulo: curso.titulo,
        total_lessons: curso.lecciones?.length || 0
      });
    });
    
    // Crear registros de user_course_summary con estructura básica
    const summaryRecords = [];
    const now = new Date().toISOString();
    
    inscripciones.forEach(inscripcion => {
      const cursoInfo = cursosMap.get(inscripcion.curso_id);
      if (cursoInfo) {
        summaryRecords.push({
          user_id: inscripcion.user_id,
          course_id: inscripcion.curso_id,
          total_lessons: cursoInfo.total_lessons,
          completed_lessons: 0,
          progress_percentage: 0,
          created_at: now,
          updated_at: now
        });
      }
    });
    
    console.log(`🔄 Preparando ${summaryRecords.length} registros de progreso...`);
    
    if (summaryRecords.length > 0) {
      // Insertar registros uno por uno para mejor control de errores
      let successCount = 0;
      let errorCount = 0;
      
      for (const record of summaryRecords) {
        const { data, error } = await supabase
          .from('user_course_summary')
          .upsert([record], { 
            onConflict: 'user_id,course_id',
            ignoreDuplicates: false 
          });
        
        if (error) {
          console.error(`❌ Error al insertar registro para usuario ${record.user_id}:`, error);
          errorCount++;
        } else {
          console.log(`✅ Registro creado para usuario ${record.user_id}, curso ${record.course_id}`);
          successCount++;
        }
      }
      
      console.log(`\n📊 Resumen: ${successCount} exitosos, ${errorCount} errores`);
    }
    
    // Verificar resultado
    const { data: finalData, error: finalError } = await supabase
      .from('user_course_summary')
      .select('*');
    
    if (!finalError) {
      console.log(`📊 Total de registros en user_course_summary: ${finalData?.length || 0}`);
      
      if (finalData && finalData.length > 0) {
        console.log('\n📝 Muestra de datos creados:');
        finalData.forEach((record, index) => {
          if (index < 3) {
            const cursoInfo = cursosMap.get(record.course_id);
            console.log(`   - Usuario: ${record.user_id}`);
            console.log(`     Curso: ${record.course_id} (${cursoInfo?.titulo || 'N/A'})`);
            console.log(`     Lecciones: ${record.completed_lessons}/${record.total_lessons}`);
            console.log(`     Progreso: ${record.progress_percentage}%\n`);
          }
        });
      }
    }
    
    console.log('🏁 Proceso completado');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createInitialProgress();