require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ Faltante');
  console.log('VITE_SUPABASE_SERVICE_KEY:', supabaseKey ? '✅ Configurada' : '❌ Faltante');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductionProgress() {
  console.log('🔍 Verificando progreso del usuario en producción...');
  console.log('📍 URL de Supabase:', supabaseUrl);
  
  const userId = '79bcdeb7-512b-45cd-88df-f5b44169115e';
  const courseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836';
  
  try {
    // 1. Verificar inscripción del usuario
    console.log('\n1️⃣ Verificando inscripción del usuario...');
    const { data: inscripcion, error: inscripcionError } = await supabase
      .from('inscripciones')
      .select('*')
      .eq('user_id', userId)
      .eq('curso_id', courseId)
      .single();
    
    if (inscripcionError) {
      console.error('❌ Error al verificar inscripción:', inscripcionError.message);
      return;
    }
    
    if (!inscripcion) {
      console.log('❌ Usuario no inscrito en el curso');
      return;
    }
    
    console.log('✅ Usuario inscrito:', {
      fecha_inscripcion: inscripcion.fecha_inscripcion,
      estado: inscripcion.estado || 'activo'
    });
    
    // 2. Verificar progreso del usuario
    console.log('\n2️⃣ Verificando progreso del usuario...');
    const { data: progreso, error: progresoError } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('curso_id', courseId);
    
    if (progresoError) {
      console.error('❌ Error al verificar progreso:', progresoError.message);
      return;
    }
    
    console.log(`📊 Registros de progreso encontrados: ${progreso?.length || 0}`);
    
    if (progreso && progreso.length > 0) {
      const progresoTotal = progreso.reduce((sum, p) => sum + (p.progreso_porcentaje || 0), 0) / progreso.length;
      console.log(`📈 Progreso promedio: ${progresoTotal.toFixed(1)}%`);
      
      progreso.forEach((p, index) => {
        console.log(`   Lección ${index + 1}: ${p.progreso_porcentaje || 0}% - ${p.tiempo_estudiado || 0} min`);
      });
    } else {
      console.log('📊 No se encontraron registros de progreso');
    }
    
    // 3. Verificar lecciones del curso
    console.log('\n3️⃣ Verificando lecciones del curso...');
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', courseId)
      .order('orden');
    
    if (leccionesError) {
      console.error('❌ Error al verificar lecciones:', leccionesError.message);
      return;
    }
    
    console.log(`📚 Lecciones del curso: ${lecciones?.length || 0}`);
    
    // 4. Verificar vista user_course_summary
    console.log('\n4️⃣ Verificando vista user_course_summary...');
    const { data: summary, error: summaryError } = await supabase
      .from('user_course_summary')
      .select('*')
      .eq('user_id', userId)
      .eq('curso_id', courseId)
      .single();
    
    if (summaryError) {
      console.error('❌ Error al verificar vista summary:', summaryError.message);
    } else if (summary) {
      console.log('📋 Vista user_course_summary:', {
        course_title: summary.course_title,
        progress_percentage: summary.progress_percentage,
        lessons_completed: summary.lessons_completed,
        total_lessons: summary.total_lessons
      });
    } else {
      console.log('❌ No se encontró registro en user_course_summary');
    }
    
    // 5. Verificar conectividad general
    console.log('\n5️⃣ Verificando conectividad general...');
    const { data: testQuery, error: testError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('id', courseId)
      .single();
    
    if (testError) {
      console.error('❌ Error de conectividad:', testError.message);
    } else {
      console.log('✅ Conectividad OK - Curso encontrado:', testQuery.titulo);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

checkProductionProgress().then(() => {
  console.log('\n🏁 Verificación completada');
}).catch(error => {
  console.error('💥 Error fatal:', error.message);
});