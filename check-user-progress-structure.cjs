require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserProgressStructure() {
  try {
    console.log('🔍 Verificando estructura de la tabla user_course_progress...');
    
    // Intentar obtener un registro para ver la estructura
    const { data: sample, error: sampleError } = await supabase
      .from('user_course_progress')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.error('❌ Error al obtener muestra:', sampleError);
    } else {
      console.log('✅ Muestra de user_course_progress:', sample);
      if (sample && sample.length > 0) {
        console.log('📋 Columnas disponibles:', Object.keys(sample[0]));
        console.log('🔍 ¿Existe is_completed?', 'is_completed' in sample[0]);
      } else {
        console.log('📋 Tabla vacía, intentando insertar registro de prueba...');
        
        // Intentar insertar un registro de prueba para ver qué columnas acepta
        const testUserId = '98c473d9-011e-4a6b-a646-9c41b007d3ae';
        const testCourseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';
        const testChapterId = '12345678-1234-1234-1234-123456789012';
        
        const { data: insertData, error: insertError } = await supabase
          .from('user_course_progress')
          .insert({
            user_id: testUserId,
            course_id: testCourseId,
            chapter_id: testChapterId,
            progress_percentage: 50,
            is_completed: true,
            time_spent_minutes: 30
          })
          .select();
        
        if (insertError) {
          console.error('❌ Error al insertar registro de prueba:', insertError);
          
          // Intentar sin is_completed
          console.log('🔧 Intentando insertar sin is_completed...');
          const { data: insertData2, error: insertError2 } = await supabase
            .from('user_course_progress')
            .insert({
              user_id: testUserId,
              course_id: testCourseId,
              chapter_id: testChapterId,
              progress_percentage: 50,
              time_spent_minutes: 30
            })
            .select();
          
          if (insertError2) {
            console.error('❌ Error al insertar sin is_completed:', insertError2);
          } else {
            console.log('✅ Inserción exitosa sin is_completed:', insertData2);
            if (insertData2 && insertData2.length > 0) {
              console.log('📋 Columnas disponibles:', Object.keys(insertData2[0]));
            }
          }
        } else {
          console.log('✅ Inserción exitosa con is_completed:', insertData);
          if (insertData && insertData.length > 0) {
            console.log('📋 Columnas disponibles:', Object.keys(insertData[0]));
          }
        }
      }
    }
    
    // Verificar si existe la tabla
    console.log('\n🔍 Verificando existencia de la tabla...');
    const { count, error: countError } = await supabase
      .from('user_course_progress')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error al contar registros:', countError);
    } else {
      console.log('✅ Total registros en user_course_progress:', count);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkUserProgressStructure();