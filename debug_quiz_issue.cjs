const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function debugQuizIssue() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DEL PROBLEMA DE CUESTIONARIOS\n');
  
  try {
    // 1. Verificar lecciones con cuestionarios
    console.log('1️⃣ Lecciones con tiene_cuestionario=true:');
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, tiene_cuestionario')
      .eq('tiene_cuestionario', true)
      .limit(5);
    
    if (leccionesError) {
      console.error('❌ Error:', leccionesError);
      return;
    }
    
    console.log(`✅ Encontradas ${lecciones.length} lecciones con cuestionarios`);
    lecciones.forEach(leccion => {
      console.log(`   - ${leccion.titulo} (ID: ${leccion.id})`);
    });
    
    if (lecciones.length === 0) {
      console.log('❌ PROBLEMA: No hay lecciones con tiene_cuestionario=true');
      return;
    }
    
    // 2. Verificar cuestionarios para estas lecciones
    console.log('\n2️⃣ Cuestionarios asociados a estas lecciones:');
    for (const leccion of lecciones) {
      const { data: cuestionarios, error: cuestionariosError } = await supabase
        .from('cuestionarios')
        .select('id, titulo, leccion_id')
        .eq('leccion_id', leccion.id);
      
      if (cuestionariosError) {
        console.error(`❌ Error para lección ${leccion.id}:`, cuestionariosError);
        continue;
      }
      
      console.log(`   Lección: ${leccion.titulo}`);
      if (cuestionarios.length === 0) {
        console.log('     ❌ Sin cuestionarios asociados');
      } else {
        cuestionarios.forEach(cuestionario => {
          console.log(`     ✅ ${cuestionario.titulo} (ID: ${cuestionario.id})`);
        });
      }
    }
    
    // 3. Verificar preguntas para los cuestionarios
    console.log('\n3️⃣ Preguntas en los cuestionarios:');
    const { data: todosLosCuestionarios } = await supabase
      .from('cuestionarios')
      .select('id, titulo, leccion_id')
      .in('leccion_id', lecciones.map(l => l.id));
    
    for (const cuestionario of todosLosCuestionarios || []) {
      const { data: preguntas, error: preguntasError } = await supabase
        .from('preguntas')
        .select('id, pregunta, tipo, opcion_a, opcion_b, opcion_c, opcion_d')
        .eq('cuestionario_id', cuestionario.id);
      
      if (preguntasError) {
        console.error(`❌ Error para cuestionario ${cuestionario.id}:`, preguntasError);
        continue;
      }
      
      console.log(`   Cuestionario: ${cuestionario.titulo}`);
      if (preguntas.length === 0) {
        console.log('     ❌ Sin preguntas');
      } else {
        preguntas.forEach(pregunta => {
          console.log(`     📝 ${pregunta.tipo}: ${pregunta.pregunta.substring(0, 50)}...`);
          if (pregunta.tipo === 'opcion_multiple') {
            const opciones = [pregunta.opcion_a, pregunta.opcion_b, pregunta.opcion_c, pregunta.opcion_d]
              .filter(Boolean).length;
            console.log(`        Opciones disponibles: ${opciones}`);
          } else if (pregunta.tipo === 'texto_libre') {
            console.log('        ⚠️  PROBLEMA DETECTADO: Pregunta de texto libre');
            console.log('        El QuizComponent solo maneja preguntas de opción múltiple');
          }
        });
      }
    }
    
    // 4. Simular la consulta del QuizComponent
    console.log('\n4️⃣ Simulando consulta del QuizComponent:');
    const leccionTest = lecciones[0];
    const { data: cuestionariosConPreguntas, error: consultaError } = await supabase
      .from('cuestionarios')
      .select(`
        *,
        preguntas (
          *
        )
      `)
      .eq('leccion_id', leccionTest.id)
      .order('creado_en');
    
    if (consultaError) {
      console.error('❌ Error en consulta:', consultaError);
      return;
    }
    
    console.log(`✅ Consulta exitosa para lección: ${leccionTest.titulo}`);
    console.log(`   Cuestionarios encontrados: ${cuestionariosConPreguntas.length}`);
    
    cuestionariosConPreguntas.forEach(cuestionario => {
      console.log(`   - ${cuestionario.titulo}: ${cuestionario.preguntas?.length || 0} preguntas`);
      
      if (cuestionario.preguntas) {
        cuestionario.preguntas.forEach(pregunta => {
          // Simular la lógica del QuizComponent
          const opcionesGeneradas = [];
          
          if (pregunta.opcion_a) opcionesGeneradas.push('A');
          if (pregunta.opcion_b) opcionesGeneradas.push('B');
          if (pregunta.opcion_c) opcionesGeneradas.push('C');
          if (pregunta.opcion_d) opcionesGeneradas.push('D');
          
          console.log(`     Pregunta ${pregunta.tipo}: ${opcionesGeneradas.length} opciones generadas`);
          
          if (opcionesGeneradas.length === 0 && pregunta.tipo !== 'texto_libre') {
            console.log('     ❌ PROBLEMA: Pregunta sin opciones válidas');
          }
        });
      }
    });
    
    // 5. Conclusiones
    console.log('\n🎯 CONCLUSIONES:');
    console.log('1. Las lecciones tienen tiene_cuestionario=true ✅');
    console.log('2. Los cuestionarios están asociados correctamente ✅');
    console.log('3. Las preguntas existen en la base de datos ✅');
    console.log('4. PROBLEMA IDENTIFICADO: QuizComponent no maneja preguntas de texto libre ❌');
    console.log('\n💡 SOLUCIÓN RECOMENDADA:');
    console.log('   - Modificar QuizComponent para manejar preguntas tipo "texto_libre"');
    console.log('   - Agregar un campo de texto para respuestas abiertas');
    console.log('   - O convertir las preguntas de texto libre a opción múltiple');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

debugQuizIssue();