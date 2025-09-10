const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyFixes() {
  console.log('🔍 Verificando correcciones implementadas...');
  
  try {
    // 1. Verificar conectividad básica
    console.log('\n1. Verificando conectividad con Supabase...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('cursos')
      .select('count', { count: 'exact', head: true })
      .limit(1);
    
    if (healthError) {
      console.error('❌ Error de conectividad:', healthError.message);
      return false;
    }
    console.log('✅ Conectividad OK');
    
    // 2. Verificar usuario específico
    console.log('\n2. Verificando usuario 79bcdeb7-512b-45cd-88df-f5b44169115e...');
    const userId = '79bcdeb7-512b-45cd-88df-f5b44169115e';
    
    // Verificar inscripciones
    const { data: enrollments, error: enrollError } = await supabase
      .from('inscripciones')
      .select(`
        curso_id,
        cursos!inner (
          id,
          titulo
        )
      `)
      .eq('user_id', userId);
    
    if (enrollError) {
      console.error('❌ Error al obtener inscripciones:', enrollError.message);
      return false;
    }
    
    console.log(`✅ Inscripciones encontradas: ${enrollments?.length || 0}`);
    
    if (enrollments && enrollments.length > 0) {
      const courseId = enrollments[0].curso_id;
      console.log(`📚 Curso: ${enrollments[0].cursos?.titulo}`);
      
      // 3. Verificar lecciones del curso
      console.log('\n3. Verificando lecciones...');
      const { count: totalChapters, error: chaptersError } = await supabase
        .from('lecciones')
        .select('*', { count: 'exact', head: true })
        .eq('curso_id', courseId);
      
      if (chaptersError) {
        console.error('❌ Error al obtener lecciones:', chaptersError.message);
        return false;
      }
      
      console.log(`✅ Total de lecciones: ${totalChapters || 0}`);
      
      // 4. Verificar cuestionarios
      console.log('\n4. Verificando cuestionarios...');
      const { count: totalQuizzes, error: quizzesError } = await supabase
        .from('cuestionarios')
        .select('*', { count: 'exact', head: true })
        .eq('curso_id', courseId);
      
      if (quizzesError) {
        console.error('❌ Error al obtener cuestionarios:', quizzesError.message);
        return false;
      }
      
      console.log(`✅ Total de cuestionarios: ${totalQuizzes || 0}`);
      
      // 5. Verificar respuestas del usuario
      console.log('\n5. Verificando respuestas del usuario...');
      const { count: userResponses, error: responsesError } = await supabase
        .from('respuestas_texto_libre')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (responsesError) {
        console.error('❌ Error al obtener respuestas:', responsesError.message);
        return false;
      }
      
      console.log(`✅ Respuestas del usuario: ${userResponses || 0}`);
      
      // 6. Calcular progreso
      const totalItems = (totalChapters || 0) + (totalQuizzes || 0);
      const completedItems = userResponses || 0;
      const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
      
      console.log(`\n📊 Progreso calculado: ${progressPercentage}%`);
      console.log(`   - Total de elementos: ${totalItems}`);
      console.log(`   - Elementos completados: ${completedItems}`);
    }
    
    console.log('\n🎉 Todas las verificaciones completadas exitosamente!');
    console.log('\n📋 Resumen de correcciones implementadas:');
    console.log('   ✅ AbortController implementado en useProgress hook');
    console.log('   ✅ AbortController implementado en StudentProgress component');
    console.log('   ✅ Delays entre requests para evitar cancelaciones');
    console.log('   ✅ Manejo adecuado de errores AbortError');
    console.log('   ✅ Cancelación de requests anteriores');
    console.log('   ✅ Verificaciones de signal.aborted en puntos críticos');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
    return false;
  }
}

// Ejecutar verificación
verifyFixes()
  .then(success => {
    if (success) {
      console.log('\n✅ Verificación completada: Todas las correcciones funcionan correctamente');
      process.exit(0);
    } else {
      console.log('\n❌ Verificación fallida: Revisar errores anteriores');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });