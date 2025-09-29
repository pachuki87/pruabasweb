import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function moveEmotionalLessons() {
  console.log('=== MOVIENDO LECCIONES DE INTELIGENCIA EMOCIONAL ===\n');
  
  const wrongCourseId = 'd7c3e503-ed61-4d7a-9e5f-aedc407d4836'; // Experto en Conductas Adictivas
  const correctCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05'; // MÁSTER EN ADICCIONES
  
  // IDs de las lecciones de inteligencia emocional que están mal ubicadas
  const emotionalLessonIds = [
    '9b17bcf3-02cc-4081-aeae-fb4cdf6c8f84', // Introducción a la Inteligencia Emocional
    '8986de95-947c-4b12-bd7b-eb18293159dc', // Autoconciencia Emocional
    '86a3d9fd-f035-436e-a157-2c26ac8ec085', // Autorregulación Emocional
    'e03de65a-b71d-41be-9809-58f4f4b2cbfb', // Empatía y Habilidades Sociales
    'de660930-c9e9-4d5f-9214-0c8d8d4dc18a', // Inteligencia Emocional en Adicciones
    '9aa4b83c-657e-4226-8e0e-ab9ce7048713', // Plan Personal de Inteligencia Emocional
    '569b2aab-28c8-4517-a423-bba4399068b8'  // Evaluación y Seguimiento Emocional
  ];
  
  console.log('PASO 1: Moviendo lecciones de inteligencia emocional al curso correcto...');
  
  // Obtener las lecciones actuales del curso correcto para saber el próximo número
  const { data: currentCorrectLessons, error: currentError } = await supabase
    .from('lecciones')
    .select('orden')
    .eq('curso_id', correctCourseId)
    .order('orden', { ascending: false })
    .limit(1);
  
  if (currentError) {
    console.error('Error obteniendo lecciones actuales:', currentError);
    return;
  }
  
  const nextOrder = currentCorrectLessons.length > 0 ? currentCorrectLessons[0].orden + 1 : 1;
  console.log(`Próximo número de orden en curso correcto: ${nextOrder}`);
  
  // Mover cada lección de inteligencia emocional
  for (let i = 0; i < emotionalLessonIds.length; i++) {
    const lessonId = emotionalLessonIds[i];
    const newOrder = nextOrder + i;
    
    console.log(`\nMoviendo lección ${lessonId} al curso ${correctCourseId} con orden ${newOrder}...`);
    
    const { data, error } = await supabase
      .from('lecciones')
      .update({
        curso_id: correctCourseId,
        orden: newOrder
      })
      .eq('id', lessonId)
      .select('titulo');
    
    if (error) {
      console.error(`Error moviendo lección ${lessonId}:`, error);
    } else {
      console.log(`✅ Movida: ${data[0].titulo} -> Orden ${newOrder}`);
    }
  }
  
  console.log('\nPASO 2: Reorganizando numeración del curso original...');
  
  // Obtener las lecciones que se quedan en el curso original
  const { data: remainingLessons, error: remainingError } = await supabase
    .from('lecciones')
    .select('id, titulo, orden')
    .eq('curso_id', wrongCourseId)
    .order('orden', { ascending: true });
  
  if (remainingError) {
    console.error('Error obteniendo lecciones restantes:', remainingError);
    return;
  }
  
  console.log(`Reorganizando ${remainingLessons.length} lecciones restantes...`);
  
  // Renumerar las lecciones restantes consecutivamente
  for (let i = 0; i < remainingLessons.length; i++) {
    const lesson = remainingLessons[i];
    const newOrder = i + 1;
    
    if (lesson.orden !== newOrder) {
      console.log(`Cambiando orden de "${lesson.titulo}" de ${lesson.orden} a ${newOrder}`);
      
      const { error: updateError } = await supabase
        .from('lecciones')
        .update({ orden: newOrder })
        .eq('id', lesson.id);
      
      if (updateError) {
        console.error(`Error actualizando orden de lección ${lesson.id}:`, updateError);
      } else {
        console.log(`✅ Actualizada`);
      }
    }
  }
  
  console.log('\nPASO 3: Verificando resultado final...');
  
  // Verificar curso original
  const { data: finalWrongLessons, error: finalWrongError } = await supabase
    .from('lecciones')
    .select('titulo, orden')
    .eq('curso_id', wrongCourseId)
    .order('orden', { ascending: true });
  
  if (finalWrongError) {
    console.error('Error verificando curso original:', finalWrongError);
  } else {
    console.log(`\n--- CURSO ${wrongCourseId} (Experto en Conductas Adictivas) ---`);
    console.log(`Total lecciones: ${finalWrongLessons.length}`);
    finalWrongLessons.forEach(lesson => {
      console.log(`${lesson.orden}) ${lesson.titulo}`);
    });
  }
  
  // Verificar curso correcto
  const { data: finalCorrectLessons, error: finalCorrectError } = await supabase
    .from('lecciones')
    .select('titulo, orden')
    .eq('curso_id', correctCourseId)
    .order('orden', { ascending: true });
  
  if (finalCorrectError) {
    console.error('Error verificando curso correcto:', finalCorrectError);
  } else {
    console.log(`\n--- CURSO ${correctCourseId} (MÁSTER EN ADICCIONES) ---`);
    console.log(`Total lecciones: ${finalCorrectLessons.length}`);
    finalCorrectLessons.forEach(lesson => {
      console.log(`${lesson.orden}) ${lesson.titulo}`);
    });
  }
  
  console.log('\n=== OPERACIÓN COMPLETADA ===');
  console.log('✅ Lecciones de inteligencia emocional movidas al curso correcto');
  console.log('✅ Numeración reorganizada en ambos cursos');
  console.log('✅ No hay mezclas entre cursos');
}

moveEmotionalLessons().catch(console.error);