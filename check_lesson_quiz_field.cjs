const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkLessonQuizField() {
  try {
    console.log('🔍 Verificando campo tiene_cuestionario en lecciones del Máster...');
    
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('id, titulo, tiene_cuestionario')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden');
    
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log('\n📋 Lecciones del Máster en Adicciones:');
    lessons?.forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.titulo}`);
      console.log(`   - ID: ${lesson.id}`);
      console.log(`   - tiene_cuestionario: ${lesson.tiene_cuestionario}`);
      console.log('');
    });
    
    const lessonsWithQuiz = lessons?.filter(l => l.tiene_cuestionario) || [];
    console.log(`\n📊 Resumen:`);
    console.log(`- Total lecciones: ${lessons?.length || 0}`);
    console.log(`- Con cuestionario: ${lessonsWithQuiz.length}`);
    
    if (lessonsWithQuiz.length === 0) {
      console.log('\n⚠️  PROBLEMA ENCONTRADO: Ninguna lección tiene tiene_cuestionario = true');
      console.log('   Esto explica por qué no aparecen los cuestionarios en el frontend.');
    }
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

checkLessonQuizField();