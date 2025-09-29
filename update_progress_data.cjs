require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProgressData() {
  try {
    console.log('🚀 Actualizando datos de progreso...');
    
    // 1. Obtener registros de progreso existentes
    console.log('📊 Obteniendo registros de progreso actuales...');
    const { data: progressRecords, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*')
      .limit(20);
    
    if (progressError) {
      console.error('Error obteniendo progreso:', progressError);
      return;
    }
    
    console.log(`📝 Registros de progreso encontrados: ${progressRecords?.length || 0}`);
    
    if (!progressRecords?.length) {
      console.log('⚠️ No hay registros de progreso para actualizar');
      return;
    }
    
    // 2. Actualizar algunos registros con progreso real
    let updatedCount = 0;
    
    for (let i = 0; i < Math.min(progressRecords.length, 10); i++) {
      const record = progressRecords[i];
      
      // Generar progreso aleatorio entre 25% y 100%
      const newProgress = Math.floor(Math.random() * 76) + 25; // 25-100%
      const isCompleted = newProgress >= 90;
      const studyTime = Math.floor(Math.random() * 120) + 15; // 15-135 minutos
      
      const updateData = {
        progreso_porcentaje: newProgress,
        tiempo_estudiado: studyTime,
        estado: isCompleted ? 'completado' : 'en_progreso',
        ultima_actividad: new Date().toISOString(),
        fecha_completado: isCompleted ? new Date().toISOString() : null
      };
      
      const { error: updateError } = await supabase
        .from('user_course_progress')
        .update(updateData)
        .eq('user_id', record.user_id)
        .eq('curso_id', record.curso_id)
        .eq('leccion_id', record.leccion_id);
      
      if (updateError) {
        console.log(`⚠️ Error actualizando registro ${i + 1}:`, updateError.message);
      } else {
        console.log(`✅ Actualizado: Usuario ${record.user_id.substring(0, 8)}... - ${newProgress}% - ${studyTime}min`);
        updatedCount++;
      }
    }
    
    console.log(`\n📊 Total de registros actualizados: ${updatedCount}`);
    
    // 3. Verificar los datos actualizados
    console.log('\n🔍 Verificando datos actualizados...');
    const { data: updatedProgress, error: verifyError } = await supabase
      .from('user_course_progress')
      .select('*')
      .gt('progreso_porcentaje', 0)
      .order('progreso_porcentaje', { ascending: false })
      .limit(10);
    
    if (verifyError) {
      console.error('Error verificando datos:', verifyError);
    } else {
      console.log(`📈 Registros con progreso > 0%: ${updatedProgress?.length || 0}`);
      
      updatedProgress?.forEach((p, index) => {
        console.log(`  ${index + 1}. Usuario ${p.user_id.substring(0, 8)}... - ${p.progreso_porcentaje}% - ${p.tiempo_estudiado}min - ${p.estado}`);
      });
    }
    
    // 4. Verificar la vista user_course_summary
    console.log('\n🔍 Verificando vista user_course_summary...');
    const { data: summaryData, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('*')
      .limit(5);
    
    if (summaryError) {
      console.error('Error obteniendo vista resumen:', summaryError);
    } else {
      console.log(`📊 Registros en vista resumen: ${summaryData?.length || 0}`);
      summaryData?.forEach((s, index) => {
        console.log(`  ${index + 1}. Usuario ${s.user_id?.substring(0, 8)}... - Curso: ${s.course_titulo || 'Sin título'} - Progreso: ${s.porcentaje_progreso || 0}%`);
      });
    }
    
    console.log('\n✅ Actualización de datos completada!');
    console.log('\n🔄 Recarga la página del dashboard para ver los cambios.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateProgressData();