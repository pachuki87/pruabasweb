// Script para probar la visualización de cuestionarios del Máster de Adicciones
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testQuizDisplay() {
  try {
    console.log('🔍 Probando visualización de cuestionarios del Máster de Adicciones...');
    
    // ID del curso Máster de Adicciones
    const cursoId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';
    
    // 1. Obtener cuestionarios del curso
    console.log('\n📋 Paso 1: Obteniendo cuestionarios...');
    const { data: cuestionarios, error: cuestionariosError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('curso_id', cursoId);
    
    if (cuestionariosError) {
      console.error('❌ Error obteniendo cuestionarios:', cuestionariosError);
      return;
    }
    
    console.log(`✅ Cuestionarios encontrados: ${cuestionarios.length}`);
    cuestionarios.forEach(c => {
      console.log(`  - ${c.titulo} (ID: ${c.id})`);
    });
    
    // 2. Para cada cuestionario, probar la consulta exacta del frontend
    for (const cuestionario of cuestionarios) {
      console.log(`\n🔍 Paso 2: Probando cuestionario "${cuestionario.titulo}"...`);
      
      // Consulta exacta del QuizAttemptPage.tsx
      const { data: questionsData, error: questionsError } = await supabase
        .from('preguntas')
        .select(`
          *,
          opciones_respuesta (id, opcion, es_correcta, orden, pregunta_id)
        `)
        .eq('cuestionario_id', cuestionario.id)
        .order('orden');
      
      if (questionsError) {
        console.error(`❌ Error obteniendo preguntas para ${cuestionario.titulo}:`, questionsError);
        continue;
      }
      
      console.log(`  📝 Preguntas encontradas: ${questionsData.length}`);
      
      // 3. Simular el procesamiento del frontend
      const processedQuestions = (questionsData || []).map(q => {
        // Ordenar opciones por el campo 'orden' y extraer solo el texto
        const sortedOptions = (q.opciones_respuesta || [])
          .sort((a, b) => a.orden - b.orden)
          .map(opt => opt.opcion);
        
        // Encontrar el índice de la respuesta correcta
        const correctAnswerIndex = (q.opciones_respuesta || [])
          .sort((a, b) => a.orden - b.orden)
          .findIndex(opt => opt.es_correcta);
        
        return {
          id: q.id,
          question: q.pregunta,
          options: sortedOptions,
          correct_answer: correctAnswerIndex,
          explanation: q.explicacion
        };
      });
      
      console.log(`  ✅ Preguntas procesadas correctamente: ${processedQuestions.length}`);
      
      // 4. Verificar que cada pregunta tiene opciones
      processedQuestions.forEach((q, index) => {
        console.log(`    Pregunta ${index + 1}: ${q.question.substring(0, 50)}...`);
        console.log(`      - Opciones: ${q.options.length}`);
        console.log(`      - Respuesta correcta: ${q.correct_answer}`);
        
        if (q.options.length === 0) {
          console.log(`      ⚠️  PROBLEMA: No hay opciones para esta pregunta`);
        }
        
        if (q.correct_answer === -1) {
          console.log(`      ⚠️  PROBLEMA: No se encontró respuesta correcta`);
        }
        
        q.options.forEach((opt, optIndex) => {
          const isCorrect = optIndex === q.correct_answer ? ' ✅' : '';
          console.log(`        ${optIndex + 1}. ${opt}${isCorrect}`);
        });
      });
    }
    
    console.log('\n🎉 Prueba completada');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testQuizDisplay();