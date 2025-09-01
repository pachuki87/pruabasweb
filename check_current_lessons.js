import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const targetCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

async function checkCurrentLessons() {
  try {
    console.log('🔍 Consultando estado actual de las lecciones...');
    
    // Obtener todas las lecciones del curso ordenadas por número
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', targetCourseId)
      .order('orden');
    
    if (error) {
      console.error('❌ Error al consultar lecciones:', error);
      return;
    }
    
    console.log(`\n📚 ESTADO ACTUAL - Total de lecciones: ${lessons.length}`);
    console.log('=' .repeat(60));
    
    lessons.forEach((lesson, index) => {
      console.log(`${lesson.orden}) ${lesson.titulo}`);
      console.log(`   ID: ${lesson.id}`);
      console.log(`   Archivo: ${lesson.archivo_url || 'No definido'}`);
      console.log('');
    });
    
    console.log('=' .repeat(60));
    
    // Verificar si coincide con la imagen esperada
    const expectedLessons = [
      'INTELIGENCIA EMOCIONAL',
      'AUTOCONCIENCIA EMOCIONAL', 
      'AUTORREGULACIÓN EMOCIONAL',
      'MOTIVACIÓN Y METAS',
      'EMPATÍA Y COMPRENSIÓN',
      'HABILIDADES SOCIALES',
      'APLICACIÓN PRÁCTICA DE LA INTELIGENCIA EMOCIONAL'
    ];
    
    console.log('\n🎯 COMPARACIÓN CON LA IMAGEN ESPERADA:');
    console.log('Según la imagen, deberían ser:');
    expectedLessons.forEach((title, index) => {
      console.log(`${index + 1}) ${title}`);
    });
    
    console.log('\n📊 ANÁLISIS:');
    if (lessons.length === 7) {
      console.log('✅ Cantidad correcta: 7 lecciones');
    } else {
      console.log(`❌ Cantidad incorrecta: ${lessons.length} lecciones (debería ser 7)`);
    }
    
    // Verificar orden y títulos
    let allCorrect = true;
    for (let i = 0; i < Math.min(lessons.length, expectedLessons.length); i++) {
      const currentLesson = lessons[i];
      const expectedTitle = expectedLessons[i];
      const expectedOrder = i + 1;
      
      if (currentLesson.orden !== expectedOrder) {
        console.log(`❌ Orden incorrecto en posición ${i + 1}: tiene ${currentLesson.orden}, debería ser ${expectedOrder}`);
        allCorrect = false;
      }
      
      if (currentLesson.titulo !== expectedTitle) {
        console.log(`❌ Título incorrecto en posición ${i + 1}:`);
        console.log(`   Actual: "${currentLesson.titulo}"`);
        console.log(`   Esperado: "${expectedTitle}"`);
        allCorrect = false;
      }
    }
    
    if (allCorrect && lessons.length === 7) {
      console.log('\n🎉 ¡PERFECTO! Las lecciones coinciden exactamente con la imagen');
    } else {
      console.log('\n⚠️  Las lecciones NO coinciden con la imagen del usuario');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la verificación
checkCurrentLessons();