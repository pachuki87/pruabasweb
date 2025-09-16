const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkCourses() {
  console.log('🔍 Verificando cursos en la base de datos...');
  
  const { data: courses, error } = await supabase
    .from('cursos')
    .select('id, titulo')
    .order('titulo');
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log('📚 Cursos encontrados:');
  courses.forEach(course => {
    console.log(`   - ID: ${course.id}`);
    console.log(`     Título: ${course.titulo}`);
    console.log('');
  });
  
  console.log(`Total de cursos: ${courses.length}`);
  
  // Verificar específicamente el curso que está causando problemas
  const targetCourseId = '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44';
  console.log(`🎯 Buscando curso específico: ${targetCourseId}`);
  
  const { data: targetCourse, error: targetError } = await supabase
    .from('cursos')
    .select('*')
    .eq('id', targetCourseId)
    .single();
    
  if (targetError) {
    console.error('❌ Error buscando curso específico:', targetError);
  } else if (targetCourse) {
    console.log('✅ Curso encontrado:', targetCourse);
  } else {
    console.log('❌ Curso no encontrado');
  }
}

checkCourses().catch(console.error);