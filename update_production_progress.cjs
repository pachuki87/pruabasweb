require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProductionProgress() {
  console.log('🔄 Actualizando progreso del usuario en producción...');
  
  const userId = '79bcdeb7-512b-45cd-88df-f5b44169115e';
  const courseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';
  
  try {
    // 1. Obtener registros existentes de progreso
    console.log('\n1️⃣ Obteniendo registros de progreso existentes...');
    const { data: existingProgress, error: getError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('curso_id', courseId);
    
    if (getError) {
      console.error('❌ Error al obtener progreso:', getError.message);
      return;
    }
    
    console.log(`📊 Registros encontrados: ${existingProgress?.length || 0}`);
    
    if (!existingProgress || existingProgress.length === 0) {
      console.log('❌ No hay registros de progreso para actualizar');
      return;
    }
    
    // 2. Actualizar cada registro con progreso realista
    console.log('\n2️⃣ Actualizando registros con progreso realista...');
    
    const progressValues = [
      { percentage: 85, time: 45 },
      { percentage: 72, time: 38 },
      { percentage: 91, time: 52 },
      { percentage: 67, time: 33 },
      { percentage: 78, time: 41 },
      { percentage: 88, time: 47 },
      { percentage: 74, time: 36 },
      { percentage: 82, time: 44 },
      { percentage: 69, time: 35 },
      { percentage: 93, time: 55 }
    ];
    
    let updatedCount = 0;
    
    for (let i = 0; i < existingProgress.length; i++) {
      const record = existingProgress[i];
      const progressData = progressValues[i % progressValues.length];
      
      const { error: updateError } = await supabase
        .from('user_course_progress')
        .update({
          progreso_porcentaje: progressData.percentage,
          tiempo_estudiado: progressData.time,
          estado: progressData.percentage >= 80 ? 'completado' : 'en_progreso',
          ultima_actividad: new Date().toISOString(),
          actualizado_en: new Date().toISOString()
        })
        .eq('id', record.id);
      
      if (updateError) {
        console.error(`❌ Error actualizando registro ${record.id}:`, updateError.message);
      } else {
        console.log(`✅ Actualizado registro ${i + 1}: ${progressData.percentage}% - ${progressData.time} min`);
        updatedCount++;
      }
    }
    
    console.log(`\n📈 Total de registros actualizados: ${updatedCount}`);
    
    // 3. Verificar los cambios
    console.log('\n3️⃣ Verificando cambios...');
    const { data: updatedProgress, error: verifyError } = await supabase
      .from('user_course_progress')
      .select('progreso_porcentaje, tiempo_estudiado, estado')
      .eq('user_id', userId)
      .eq('curso_id', courseId);
    
    if (verifyError) {
      console.error('❌ Error verificando cambios:', verifyError.message);
    } else {
      const avgProgress = updatedProgress.reduce((sum, p) => sum + (p.progreso_porcentaje || 0), 0) / updatedProgress.length;
      const totalTime = updatedProgress.reduce((sum, p) => sum + (p.tiempo_estudiado || 0), 0);
      
      console.log(`📊 Progreso promedio actualizado: ${avgProgress.toFixed(1)}%`);
      console.log(`⏱️ Tiempo total de estudio: ${totalTime} minutos`);
      
      const completedLessons = updatedProgress.filter(p => p.estado === 'completado').length;
      console.log(`✅ Lecciones completadas: ${completedLessons}/${updatedProgress.length}`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

updateProductionProgress().then(() => {
  console.log('\n🏁 Actualización completada');
}).catch(error => {
  console.error('💥 Error fatal:', error.message);
});