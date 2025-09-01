const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkInscripcionesStructure() {
  try {
    console.log('🔍 Verificando estructura de la tabla inscripciones...');
    
    // Intentar obtener una inscripción para ver la estructura
    const { data: sample, error: sampleError } = await supabase
      .from('inscripciones')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.error('❌ Error al obtener muestra de inscripciones:', sampleError);
    } else {
      console.log('✅ Muestra de inscripciones:', sample);
      if (sample && sample.length > 0) {
        console.log('📋 Columnas disponibles:', Object.keys(sample[0]));
      } else {
        console.log('📋 No hay registros en inscripciones');
      }
    }
    
    // Intentar insertar sin created_at
    console.log('\n🔧 Intentando insertar inscripción sin created_at...');
    const { data: nuevaInscripcion, error: insertError } = await supabase
      .from('inscripciones')
      .insert({
        user_id: '98c473d9-011e-4a6b-a646-9c41b007d3ae',
        course_id: 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836'
      })
      .select();
    
    if (insertError) {
      console.error('❌ Error al insertar:', insertError);
    } else {
      console.log('✅ Inscripción creada:', nuevaInscripcion);
    }
    
    // Verificar todas las inscripciones
    console.log('\n📋 Todas las inscripciones:');
    const { data: todasInscripciones, error: allError } = await supabase
      .from('inscripciones')
      .select('*');
    
    if (allError) {
      console.error('❌ Error al obtener inscripciones:', allError);
    } else {
      console.log('✅ Total inscripciones:', todasInscripciones?.length || 0);
      if (todasInscripciones && todasInscripciones.length > 0) {
        todasInscripciones.forEach((ins, i) => {
          console.log(`${i + 1}. User: ${ins.user_id}, Course: ${ins.course_id}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkInscripcionesStructure();