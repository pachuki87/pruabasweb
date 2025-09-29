require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function populateUserCourseSummary() {
  try {
    console.log('🔄 Conectando a Supabase...');
    
    // Verificar datos existentes en user_course_progress
    const { data: progressData, error: progressError } = await supabase
      .from('user_course_progress')
      .select('*');
    
    if (progressError) {
      console.error('❌ Error al obtener user_course_progress:', progressError);
      return;
    }
    
    console.log(`📊 Registros en user_course_progress: ${progressData?.length || 0}`);
    
    if (!progressData || progressData.length === 0) {
      console.log('⚠️ No hay datos en user_course_progress para migrar');
      return;
    }
    
    // Verificar datos existentes en user_course_summary
    const { data: summaryData, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('*');
    
    if (summaryError) {
      console.error('❌ Error al obtener user_course_summary:', summaryError);
      return;
    }
    
    console.log(`📊 Registros existentes en user_course_summary: ${summaryData?.length || 0}`);
    
    // Agrupar datos por user_id y course_id
    const summaryMap = new Map();
    
    progressData.forEach(record => {
      const key = `${record.user_id}-${record.course_id}`;
      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          user_id: record.user_id,
          course_id: record.course_id,
          total_lessons: 0,
          completed_lessons: 0,
          progress_percentage: 0,
          last_accessed: record.updated_at || record.created_at,
          created_at: record.created_at,
          updated_at: record.updated_at || record.created_at
        });
      }
      
      const summary = summaryMap.get(key);
      summary.total_lessons++;
      
      if (record.completed) {
        summary.completed_lessons++;
      }
      
      // Actualizar última fecha de acceso
      if (record.updated_at && new Date(record.updated_at) > new Date(summary.last_accessed)) {
        summary.last_accessed = record.updated_at;
      }
    });
    
    // Calcular porcentajes
    const summaryRecords = Array.from(summaryMap.values()).map(summary => {
      summary.progress_percentage = summary.total_lessons > 0 
        ? Math.round((summary.completed_lessons / summary.total_lessons) * 100)
        : 0;
      return summary;
    });
    
    console.log(`🔄 Preparando ${summaryRecords.length} registros para insertar...`);
    
    // Insertar datos en lotes
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < summaryRecords.length; i += batchSize) {
      const batch = summaryRecords.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('user_course_summary')
        .upsert(batch, { 
          onConflict: 'user_id,course_id',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error(`❌ Error al insertar lote ${Math.floor(i/batchSize) + 1}:`, error);
      } else {
        insertedCount += batch.length;
        console.log(`✅ Lote ${Math.floor(i/batchSize) + 1} insertado: ${batch.length} registros`);
      }
    }
    
    console.log(`🎉 Proceso completado. ${insertedCount} registros procesados`);
    
    // Verificar resultado final
    const { data: finalData, error: finalError } = await supabase
      .from('user_course_summary')
      .select('*');
    
    if (!finalError) {
      console.log(`📊 Total de registros en user_course_summary: ${finalData?.length || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

populateUserCourseSummary();