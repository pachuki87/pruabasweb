require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function getExistingRecord() {
  console.log('🔍 Obteniendo registro existente de user_course_summary...');
  
  try {
    // Obtener el registro existente para ver su estructura
    const { data: existing, error: existingError } = await supabase
      .from('user_course_summary')
      .select('*')
      .limit(1);
    
    if (existingError) {
      console.error('❌ Error al obtener registro existente:', existingError);
    } else if (existing && existing.length > 0) {
      console.log('✅ Registro existente encontrado:');
      console.log('📋 Estructura completa:', JSON.stringify(existing[0], null, 2));
      console.log('🔑 Columnas disponibles:', Object.keys(existing[0]));
      
      // Intentar insertar un registro usando la misma estructura
      const existingStructure = existing[0];
      const newRecord = { ...existingStructure };
      
      // Cambiar los IDs para crear un nuevo registro
      newRecord.user_id = '83508eb3-e26e-4312-90f7-9a06901d4126'; // Pablo's ID
      newRecord.curso_id = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836'; // Course ID
      
      // Actualizar valores de progreso
      if ('porcentaje_progreso' in newRecord) {
        newRecord.porcentaje_progreso = 0;
      }
      if ('progreso_porcentaje' in newRecord) {
        newRecord.progreso_porcentaje = 0;
      }
      if ('overall_progress' in newRecord) {
        newRecord.overall_progress = 0;
      }
      if ('progress_percentage' in newRecord) {
        newRecord.progress_percentage = 0;
      }
      
      // Remover el ID para que se genere uno nuevo
      delete newRecord.id;
      
      console.log('\n🔄 Intentando insertar registro con la misma estructura...');
      console.log('📝 Datos a insertar:', JSON.stringify(newRecord, null, 2));
      
      const { data: insertResult, error: insertError } = await supabase
        .from('user_course_summary')
        .insert(newRecord)
        .select();
      
      if (insertError) {
        console.error('❌ Error al insertar:', insertError);
      } else {
        console.log('✅ Inserción exitosa:', insertResult);
      }
    } else {
      console.log('⚠️ No hay registros existentes en la tabla');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

getExistingRecord();