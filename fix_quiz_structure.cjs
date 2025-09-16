const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function analyzeAndFixQuizStructure() {
  console.log('🔧 ANÁLISIS Y PROPUESTA DE SOLUCIÓN PARA CUESTIONARIOS\n');
  
  try {
    // 1. Analizar estructura actual de preguntas
    console.log('1️⃣ Analizando estructura actual de preguntas:');
    const { data: preguntas, error: preguntasError } = await supabase
      .from('preguntas')
      .select('*')
      .limit(10);
    
    if (preguntasError) {
      console.error('❌ Error:', preguntasError);
      return;
    }
    
    console.log(`✅ Encontradas ${preguntas.length} preguntas`);
    
    // Analizar tipos y estructura
    const tiposPreguntas = {};
    const problemasDetectados = [];
    
    preguntas.forEach((pregunta, index) => {
      const tipo = pregunta.tipo || 'sin_tipo';
      if (!tiposPreguntas[tipo]) tiposPreguntas[tipo] = 0;
      tiposPreguntas[tipo]++;
      
      console.log(`\n   Pregunta ${index + 1}:`);
      console.log(`   - Tipo: ${tipo}`);
      console.log(`   - Texto: ${pregunta.pregunta?.substring(0, 80)}...`);
      console.log(`   - Opciones: A=${!!pregunta.opcion_a}, B=${!!pregunta.opcion_b}, C=${!!pregunta.opcion_c}, D=${!!pregunta.opcion_d}`);
      console.log(`   - Respuesta correcta: ${pregunta.respuesta_correcta || 'No definida'}`);
      
      // Detectar problemas
      if (tipo === 'multiple_choice' || tipo === 'opcion_multiple') {
        const tieneOpciones = pregunta.opcion_a || pregunta.opcion_b || pregunta.opcion_c || pregunta.opcion_d;
        if (!tieneOpciones) {
          problemasDetectados.push(`Pregunta ${pregunta.id}: Tipo múltiple sin opciones`);
        }
      }
      
      if (tipo === 'texto_libre') {
        problemasDetectados.push(`Pregunta ${pregunta.id}: Tipo texto libre no soportado por QuizComponent`);
      }
    });
    
    console.log('\n📊 Resumen de tipos de preguntas:');
    Object.entries(tiposPreguntas).forEach(([tipo, cantidad]) => {
      console.log(`   - ${tipo}: ${cantidad} preguntas`);
    });
    
    console.log('\n⚠️  Problemas detectados:');
    if (problemasDetectados.length === 0) {
      console.log('   ✅ No se detectaron problemas');
    } else {
      problemasDetectados.forEach(problema => {
        console.log(`   - ${problema}`);
      });
    }
    
    // 2. Proponer soluciones
    console.log('\n💡 SOLUCIONES PROPUESTAS:\n');
    
    console.log('OPCIÓN 1: Modificar QuizComponent para soportar texto libre');
    console.log('   ✅ Pros: Mantiene la flexibilidad de preguntas abiertas');
    console.log('   ❌ Contras: Requiere modificar el componente y la lógica de evaluación');
    console.log('   📝 Implementación: Agregar campo textarea para respuestas de texto libre\n');
    
    console.log('OPCIÓN 2: Convertir preguntas de texto libre a opción múltiple');
    console.log('   ✅ Pros: Funciona inmediatamente con el QuizComponent actual');
    console.log('   ❌ Contras: Pierde la flexibilidad de respuestas abiertas');
    console.log('   📝 Implementación: Agregar opciones A, B, C, D a las preguntas existentes\n');
    
    console.log('OPCIÓN 3: Completar las opciones faltantes en preguntas múltiples');
    console.log('   ✅ Pros: Solución rápida para preguntas de opción múltiple');
    console.log('   ❌ Contras: No resuelve el problema de texto libre');
    console.log('   📝 Implementación: Agregar opciones A, B, C, D donde falten\n');
    
    // 3. Mostrar ejemplo de implementación
    console.log('🛠️  EJEMPLO DE IMPLEMENTACIÓN (OPCIÓN 2):\n');
    
    const preguntasTextoLibre = preguntas.filter(p => p.tipo === 'texto_libre');
    if (preguntasTextoLibre.length > 0) {
      console.log('Script SQL para convertir preguntas de texto libre:');
      console.log('```sql');
      preguntasTextoLibre.forEach(pregunta => {
        console.log(`-- Pregunta: ${pregunta.pregunta?.substring(0, 50)}...`);
        console.log(`UPDATE preguntas SET`);
        console.log(`  tipo = 'multiple_choice',`);
        console.log(`  opcion_a = 'Opción A (a definir)',`);
        console.log(`  opcion_b = 'Opción B (a definir)',`);
        console.log(`  opcion_c = 'Opción C (a definir)',`);
        console.log(`  opcion_d = 'Opción D (a definir)',`);
        console.log(`  respuesta_correcta = 'A'`);
        console.log(`WHERE id = '${pregunta.id}';\n`);
      });
      console.log('```\n');
    }
    
    // 4. Verificar cuestionarios sin preguntas
    console.log('4️⃣ Verificando cuestionarios sin preguntas válidas:');
    const { data: cuestionarios } = await supabase
      .from('cuestionarios')
      .select(`
        id,
        titulo,
        preguntas (
          id,
          tipo,
          opcion_a,
          opcion_b,
          opcion_c,
          opcion_d
        )
      `);
    
    cuestionarios?.forEach(cuestionario => {
      const preguntasValidas = cuestionario.preguntas?.filter(p => {
        if (p.tipo === 'multiple_choice' || p.tipo === 'opcion_multiple') {
          return p.opcion_a || p.opcion_b || p.opcion_c || p.opcion_d;
        }
        return false; // texto_libre no es válido actualmente
      }) || [];
      
      console.log(`   ${cuestionario.titulo}: ${preguntasValidas.length}/${cuestionario.preguntas?.length || 0} preguntas válidas`);
    });
    
    console.log('\n🎯 RECOMENDACIÓN FINAL:');
    console.log('1. Implementar OPCIÓN 1 para máxima flexibilidad');
    console.log('2. O usar OPCIÓN 2 como solución rápida');
    console.log('3. Completar opciones faltantes en preguntas múltiples');
    console.log('4. Asegurar que todas las preguntas tengan respuesta_correcta definida');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

analyzeAndFixQuizStructure();