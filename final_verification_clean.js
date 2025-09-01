import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalVerification() {
  console.log('=== VERIFICACIÓN FINAL DE AMBOS CURSOS ===\n');
  
  const expertoCourseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836'; // Experto en Conductas Adictivas
  const masterCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'; // MÁSTER EN ADICCIONES
  
  // Palabras clave para identificar lecciones de inteligencia emocional
  const emotionalKeywords = [
    'inteligencia emocional',
    'autoconciencia',
    'autorregulación',
    'empatía',
    'habilidades sociales',
    'emocional'
  ];
  
  console.log('VERIFICANDO CURSO: Experto en Conductas Adictivas');
  console.log('=' .repeat(60));
  
  // Verificar curso Experto
  const { data: expertoLessons, error: expertoError } = await supabase
    .from('lecciones')
    .select('titulo, orden')
    .eq('curso_id', expertoCourseId)
    .order('orden', { ascending: true });
  
  if (expertoError) {
    console.error('Error obteniendo lecciones del Experto:', expertoError);
  } else {
    console.log(`Total lecciones: ${expertoLessons.length}`);
    console.log('\nLecciones:');
    expertoLessons.forEach(lesson => {
      console.log(`${lesson.orden}) ${lesson.titulo}`);
    });
    
    // Verificar si hay lecciones de inteligencia emocional
    const emotionalLessonsInExperto = expertoLessons.filter(lesson => 
      emotionalKeywords.some(keyword => 
        lesson.titulo.toLowerCase().includes(keyword)
      )
    );
    
    console.log(`\n🔍 Lecciones de inteligencia emocional encontradas: ${emotionalLessonsInExperto.length}`);
    if (emotionalLessonsInExperto.length > 0) {
      console.log('❌ ERROR: Aún hay lecciones de inteligencia emocional en este curso:');
      emotionalLessonsInExperto.forEach(lesson => {
        console.log(`   - ${lesson.orden}) ${lesson.titulo}`);
      });
    } else {
      console.log('✅ CORRECTO: No hay lecciones de inteligencia emocional en este curso');
    }
    
    // Verificar numeración consecutiva
    let isConsecutiveExperto = true;
    for (let i = 0; i < expertoLessons.length; i++) {
      if (expertoLessons[i].orden !== i + 1) {
        isConsecutiveExperto = false;
        break;
      }
    }
    console.log(`${isConsecutiveExperto ? '✅' : '❌'} Numeración consecutiva: ${isConsecutiveExperto ? 'SÍ' : 'NO'}`);
  }
  
  console.log('\n\nVERIFICANDO CURSO: MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL');
  console.log('=' .repeat(60));
  
  // Verificar curso MÁSTER
  const { data: masterLessons, error: masterError } = await supabase
    .from('lecciones')
    .select('titulo, orden')
    .eq('curso_id', masterCourseId)
    .order('orden', { ascending: true });
  
  if (masterError) {
    console.error('Error obteniendo lecciones del MÁSTER:', masterError);
  } else {
    console.log(`Total lecciones: ${masterLessons.length}`);
    console.log('\nLecciones:');
    masterLessons.forEach(lesson => {
      console.log(`${lesson.orden}) ${lesson.titulo}`);
    });
    
    // Verificar si hay lecciones de inteligencia emocional
    const emotionalLessonsInMaster = masterLessons.filter(lesson => 
      emotionalKeywords.some(keyword => 
        lesson.titulo.toLowerCase().includes(keyword)
      )
    );
    
    console.log(`\n🔍 Lecciones de inteligencia emocional encontradas: ${emotionalLessonsInMaster.length}`);
    if (emotionalLessonsInMaster.length > 0) {
      console.log('✅ CORRECTO: Lecciones de inteligencia emocional en este curso:');
      emotionalLessonsInMaster.forEach(lesson => {
        console.log(`   - ${lesson.orden}) ${lesson.titulo}`);
      });
    } else {
      console.log('❌ ERROR: No hay lecciones de inteligencia emocional en este curso');
    }
    
    // Verificar numeración consecutiva
    let isConsecutiveMaster = true;
    for (let i = 0; i < masterLessons.length; i++) {
      if (masterLessons[i].orden !== i + 1) {
        isConsecutiveMaster = false;
        break;
      }
    }
    console.log(`${isConsecutiveMaster ? '✅' : '❌'} Numeración consecutiva: ${isConsecutiveMaster ? 'SÍ' : 'NO'}`);
  }
  
  console.log('\n\n=== RESUMEN FINAL ===');
  console.log('🎯 OBJETIVO: Separar completamente los contenidos de ambos cursos');
  console.log('📚 Experto en Conductas Adictivas: SIN lecciones de inteligencia emocional');
  console.log('🎓 MÁSTER EN ADICCIONES: CON lecciones de inteligencia emocional');
  
  if (expertoLessons && masterLessons) {
    const expertoHasEmotional = expertoLessons.some(lesson => 
      emotionalKeywords.some(keyword => 
        lesson.titulo.toLowerCase().includes(keyword)
      )
    );
    
    const masterHasEmotional = masterLessons.some(lesson => 
      emotionalKeywords.some(keyword => 
        lesson.titulo.toLowerCase().includes(keyword)
      )
    );
    
    console.log('\n🏆 ESTADO FINAL:');
    console.log(`${!expertoHasEmotional ? '✅' : '❌'} Experto: ${!expertoHasEmotional ? 'LIMPIO' : 'CONTIENE INTELIGENCIA EMOCIONAL'}`);
    console.log(`${masterHasEmotional ? '✅' : '❌'} MÁSTER: ${masterHasEmotional ? 'CONTIENE INTELIGENCIA EMOCIONAL' : 'SIN INTELIGENCIA EMOCIONAL'}`);
    
    if (!expertoHasEmotional && masterHasEmotional) {
      console.log('\n🎉 ¡ÉXITO! Los cursos están correctamente separados sin mezclas');
    } else {
      console.log('\n⚠️  ATENCIÓN: Aún hay problemas de separación entre cursos');
    }
  }
}

finalVerification().catch(console.error);