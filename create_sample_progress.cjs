require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSampleProgress() {
  try {
    console.log('🚀 Creando datos de progreso de ejemplo...');
    
    // 1. Obtener usuarios y cursos existentes
    console.log('📊 Obteniendo usuarios...');
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, nombre')
      .limit(3);
    
    if (usersError) {
      console.error('Error obteniendo usuarios:', usersError);
      return;
    }
    
    console.log('📚 Obteniendo cursos...');
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, titulo')
      .limit(2);
    
    if (coursesError) {
      console.error('Error obteniendo cursos:', coursesError);
      return;
    }
    
    console.log('📖 Obteniendo lecciones...');
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, titulo, curso_id')
      .limit(10);
    
    if (lessonsError) {
      console.error('Error obteniendo lecciones:', lessonsError);
      return;
    }
    
    console.log(`👥 Usuarios encontrados: ${users?.length || 0}`);
    console.log(`📚 Cursos encontrados: ${courses?.length || 0}`);
    console.log(`📖 Lecciones encontradas: ${lessons?.length || 0}`);
    
    if (!users?.length || !courses?.length || !lessons?.length) {
      console.log('⚠️ No hay suficientes datos para crear progreso de ejemplo');
      return;
    }
    
    // 2. Crear registros de progreso de ejemplo
    const progressRecords = [];
    
    for (const user of users) {
      for (const course of courses) {
        // Obtener lecciones de este curso
        const courseLessons = lessons.filter(l => l.curso_id === course.id);
        
        for (let i = 0; i < Math.min(courseLessons.length, 3); i++) {
          const lesson = courseLessons[i];
          const isCompleted = Math.random() > 0.5; // 50% probabilidad de completado
          const progress = isCompleted ? 100 : Math.floor(Math.random() * 80) + 10;
          
          progressRecords.push({
            user_id: user.id,
            curso_id: course.id,
            leccion_id: lesson.id,
            progreso_porcentaje: progress,
            tiempo_estudiado: Math.floor(Math.random() * 60) + 5, // 5-65 minutos
            estado: isCompleted ? 'completado' : 'en_progreso',
            fecha_inicio: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            ultima_actividad: new Date().toISOString(),
            fecha_completado: isCompleted ? new Date().toISOString() : null
          });
        }
      }
    }
    
    console.log(`📝 Creando ${progressRecords.length} registros de progreso...`);
    
    // 3. Insertar registros (usando upsert para evitar duplicados)
    for (const record of progressRecords) {
      const { error: insertError } = await supabase
        .from('user_course_progress')
        .upsert(record, {
          onConflict: 'user_id,curso_id,leccion_id'
        });
      
      if (insertError) {
        console.log(`⚠️ Error insertando progreso para usuario ${record.user_id}:`, insertError.message);
      } else {
        console.log(`✅ Progreso creado: Usuario ${record.user_id.substring(0, 8)}... - Lección ${record.leccion_id.substring(0, 8)}... - ${record.progreso_porcentaje}%`);
      }
    }
    
    // 4. Verificar los datos creados
    console.log('\n🔍 Verificando datos creados...');
    const { data: createdProgress, error: verifyError } = await supabase
      .from('user_course_progress')
      .select('*')
      .limit(10);
    
    if (verifyError) {
      console.error('Error verificando datos:', verifyError);
    } else {
      console.log(`📊 Total de registros de progreso: ${createdProgress?.length || 0}`);
      
      // Mostrar estadísticas por usuario
      const userStats = {};
      createdProgress?.forEach(p => {
        if (!userStats[p.user_id]) {
          userStats[p.user_id] = { total: 0, completed: 0 };
        }
        userStats[p.user_id].total++;
        if (p.estado === 'completado') {
          userStats[p.user_id].completed++;
        }
      });
      
      console.log('\n📈 Estadísticas por usuario:');
      Object.entries(userStats).forEach(([userId, stats]) => {
        const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
        console.log(`  👤 ${userId.substring(0, 8)}...: ${stats.completed}/${stats.total} completadas (${percentage}%)`);
      });
    }
    
    console.log('\n✅ Datos de progreso de ejemplo creados exitosamente!');
    console.log('\n🔄 Ahora recarga la página del dashboard para ver el progreso.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createSampleProgress();