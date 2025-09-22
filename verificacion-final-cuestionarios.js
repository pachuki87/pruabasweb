import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verificacionFinal() {
  console.log('🔍 VERIFICACIÓN FINAL DEL SISTEMA DE CUESTIONARIOS');
  console.log('================================================\n');

  const resultados = {
    problemas_identificados: [],
    soluciones_aplicadas: [],
    estado_actual: {},
    recomendaciones: []
  };

  try {
    // 1. Verificar conexión y autenticación
    console.log('1. Verificando conexión y autenticación...');
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        resultados.problemas_identificados.push('Error de autenticación: ' + authError.message);
        console.log('   ❌ Error de autenticación:', authError.message);
      } else {
        console.log('   ✅ Conexión establecida correctamente');
      }
    } catch (err) {
      resultados.problemas_identificados.push('Error de conexión: ' + err.message);
      console.log('   ❌ Error de conexión:', err.message);
    }

    // 2. Verificar todas las tablas necesarias
    console.log('\n2. Verificando tablas necesarias...');
    const tablas = [
      { nombre: 'cuestionarios', critico: true },
      { nombre: 'preguntas_cuestionario', critico: true },
      { nombre: 'preguntas', critico: false, alternativa: true },
      { nombre: 'opciones_respuesta', critico: true },
      { nombre: 'lecciones', critico: true },
      { nombre: 'cursos', critico: true },
      { nombre: 'user_test_results', critico: true },
      { nombre: 'user_progress', critico: false }
    ];

    for (const tabla of tablas) {
      try {
        const { data, error } = await supabase
          .from(tabla.nombre)
          .select('*')
          .limit(1);

        if (error) {
          if (tabla.critico) {
            resultados.problemas_identificados.push(`Tabla crítica faltante: ${tabla.nombre}`);
            console.log(`   ❌ ${tabla.nombre} (CRÍTICO): ${error.message}`);
          } else {
            console.log(`   ⚠️ ${tabla.nombre} (no crítico): ${error.message}`);
          }
        } else {
          resultados.estado_actual[tabla.nombre] = '✅ Accessible';
          console.log(`   ✅ ${tabla.nombre}: Accessible`);
        }
      } catch (err) {
        console.log(`   💥 ${tabla.nombre}: Error crítico - ${err.message}`);
        resultados.problemas_identificados.push(`Error crítico en tabla ${tabla.nombre}: ${err.message}`);
      }
    }

    // 3. Verificar estructura de user_test_results
    console.log('\n3. Verificando estructura de user_test_results...');
    try {
      const { data: testResults, error: testResultsError } = await supabase
        .from('user_test_results')
        .select('respuestas_correctas, total_preguntas')
        .limit(1);

      if (testResultsError) {
        if (testResultsError.message.includes('column "respuestas_correctas" does not exist')) {
          resultados.problemas_identificados.push('Falta columna respuestas_correctas en user_test_results');
          console.log('   ❌ Falta columna respuestas_correctas');
        }
        if (testResultsError.message.includes('column "total_preguntas" does not exist')) {
          resultados.problemas_identificados.push('Falta columna total_preguntas en user_test_results');
          console.log('   ❌ Falta columna total_preguntas');
        }
      } else {
        resultados.soluciones_aplicadas.push('Columnas de user_test_results verificadas');
        console.log('   ✅ Columnas respuestas_correctas y total_preguntas presentes');
      }
    } catch (err) {
      console.log(`   💥 Error verificando user_test_results: ${err.message}`);
    }

    // 4. Probar consulta compleja (simulando el componente)
    console.log('\n4. Probando consulta compleja (simulando QuizComponent)...');
    try {
      const leccionIdTest = '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44';
      
      // Paso 1: Buscar cuestionario específico
      const { data: quizData, error: quizError } = await supabase
        .from('cuestionarios')
        .select('*')
        .eq('leccion_id', leccionIdTest)
        .single();

      if (quizError && quizError.code !== 'PGRST116') {
        console.log(`   ❌ Error buscando cuestionario: ${quizError.message}`);
        resultados.problemas_identificados.push('Error en consulta de cuestionarios: ' + quizError.message);
      } else if (quizData) {
        console.log(`   ✅ Cuestionario encontrado: ${quizData.titulo}`);
        
        // Paso 2: Intentar cargar preguntas (con fallback)
        let preguntas = [];
        let preguntasCargadas = false;
        
        // Intentar con preguntas_cuestionario primero
        try {
          const { data: preguntasData, error: preguntasError } = await supabase
            .from('preguntas_cuestionario')
            .select('*')
            .eq('cuestionario_id', quizData.id);
          
          if (!preguntasError) {
            preguntas = preguntasData || [];
            preguntasCargadas = true;
            console.log(`   ✅ Preguntas cargadas desde preguntas_cuestionario: ${preguntas.length}`);
          }
        } catch (err) {
          console.log(`   ⚠️ Error con preguntas_cuestionario: ${err.message}`);
        }
        
        // Si no funcionó, intentar con tabla alternativa
        if (!preguntasCargadas) {
          try {
            const { data: preguntasFallback, error: fallbackError } = await supabase
              .from('preguntas')
              .select('*')
              .eq('cuestionario_id', quizData.id);
            
            if (!fallbackError) {
              preguntas = preguntasFallback || [];
              preguntasCargadas = true;
              console.log(`   ✅ Preguntas cargadas desde tabla alternativa "preguntas": ${preguntas.length}`);
              resultados.soluciones_aplicadas.push('Fallback a tabla "preguntas" funcionando');
            }
          } catch (err) {
            console.log(`   ❌ Error con tabla alternativa: ${err.message}`);
          }
        }
        
        if (preguntasCargadas && preguntas.length > 0) {
          // Paso 3: Cargar opciones para preguntas de opción múltiple
          const preguntasConOpciones = await Promise.all(
            preguntas.map(async (pregunta) => {
              if (pregunta.tipo === 'multiple_choice') {
                try {
                  const { data: opciones } = await supabase
                    .from('opciones_respuesta')
                    .select('*')
                    .eq('pregunta_id', pregunta.id);
                  
                  return {
                    ...pregunta,
                    opciones_respuesta: opciones || []
                  };
                } catch (err) {
                  return {
                    ...pregunta,
                    opciones_respuesta: []
                  };
                }
              }
              return pregunta;
            })
          );
          
          console.log(`   ✅ Consulta compleja exitosa - ${preguntasConOpciones.length} preguntas con opciones`);
          resultados.soluciones_aplicadas.push('Consulta compleja de cuestionarios funcionando');
          resultados.estado_actual.consultaCompleja = '✅ Funcional';
        } else {
          console.log(`   ⚠️ No se pudieron cargar preguntas para el cuestionario`);
          resultados.problemas_identificados.push('No se pudieron cargar preguntas para el cuestionario');
        }
      } else {
        console.log(`   ℹ️ No hay cuestionario específico para esta lección`);
      }
    } catch (err) {
      console.log(`   💥 Error en consulta compleja: ${err.message}`);
      resultados.problemas_identificados.push('Error crítico en consulta compleja: ' + err.message);
    }

    // 5. Verificar estado de lecciones
    console.log('\n5. Verificando estado de lecciones...');
    try {
      const { data: lecciones, error: leccionesError } = await supabase
        .from('lecciones')
        .select('id, titulo, activo')
        .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05');

      if (leccionesError) {
        console.log(`   ❌ Error consultando lecciones: ${leccionesError.message}`);
      } else {
        const leccionesInactivas = lecciones.filter(l => !l.activo).length;
        const leccionesTotales = lecciones.length;
        
        console.log(`   📊 Lecciones: ${leccionesTotales} totales, ${leccionesInactivas} inactivas`);
        
        if (leccionesInactivas > 0) {
          resultados.problemas_identificados.push(`${leccionesInactivas} lecciones inactivas`);
          console.log(`   ⚠️ Hay ${leccionesInactivas} lecciones inactivas`);
        } else {
          resultados.soluciones_aplicadas.push('Todas las lecciones activas');
        }
      }
    } catch (err) {
      console.log(`   💥 Error verificando lecciones: ${err.message}`);
    }

    // 6. Generar resumen y recomendaciones
    console.log('\n6. Generando resumen final...');
    
    if (resultados.problemas_identificados.length === 0) {
      resultados.recomendaciones.push('✅ Todos los sistemas funcionando correctamente');
      console.log('   🎉 No se detectaron problemas críticos');
    } else {
      console.log(`   ⚠️ Se detectaron ${resultados.problemas_identificados.length} problemas`);
      
      if (resultados.problemas_identificados.some(p => p.includes('preguntas_cuestionario'))) {
        resultados.recomendaciones.push('Verificar la existencia de la tabla preguntas_cuestionario o asegurar que el fallback a "preguntas" funcione');
      }
      
      if (resultados.problemas_identificados.some(p => p.includes('autenticación'))) {
        resultados.recomendaciones.push('Implementar autenticación previa a cargar cuestionarios');
      }
      
      if (resultados.problemas_identificados.some(p => p.includes('columna'))) {
        resultados.recomendaciones.push('Ejecutar migraciones para añadir columnas faltantes');
      }
      
      if (resultados.problemas_identificados.some(p => p.includes('inactivas'))) {
        resultados.recomendaciones.push('Activar lecciones necesarias en la base de datos');
      }
    }

    // Siempre añadir recomendaciones generales
    resultados.recomendaciones.push(
      'Monitorear la consola del navegador para errores específicos',
      'Verificar que las variables de entorno de Supabase estén configuradas correctamente',
      'Probar los cuestionarios en diferentes navegadores para descartar problemas de compatibilidad'
    );

  } catch (error) {
    console.error('💥 Error en verificación final:', error);
    resultados.problemas_identificados.push('Error crítico en verificación: ' + error.message);
  }

  // Mostrar resumen final
  console.log('\n' + '='.repeat(60));
  console.log('📋 RESUMEN FINAL DE DIAGNÓSTICO');
  console.log('='.repeat(60));
  
  console.log('\n🔍 PROBLEMAS IDENTIFICADOS:');
  if (resultados.problemas_identificados.length === 0) {
    console.log('   ✅ No se detectaron problemas críticos');
  } else {
    resultados.problemas_identificados.forEach((problema, index) => {
      console.log(`   ${index + 1}. ${problema}`);
    });
  }
  
  console.log('\n🔧 SOLUCIONES APLICADAS:');
  if (resultados.soluciones_aplicadas.length === 0) {
    console.log('   ℹ️ No se requirieron soluciones o ya estaban aplicadas');
  } else {
    resultados.soluciones_aplicadas.forEach((solucion, index) => {
      console.log(`   ${index + 1}. ${solucion}`);
    });
  }
  
  console.log('\n💡 RECOMENDACIONES:');
  resultados.recomendaciones.forEach((recomendacion, index) => {
    console.log(`   ${index + 1}. ${recomendacion}`);
  });
  
  console.log('\n📊 ESTADO ACTUAL DEL SISTEMA:');
  Object.entries(resultados.estado_actual).forEach(([tabla, estado]) => {
    console.log(`   ${tabla}: ${estado}`);
  });
  
  console.log('\n🏁 CONCLUSIÓN:');
  const problemasCriticos = resultados.problemas_identificados.filter(p => 
    p.includes('CRÍTICO') || p.includes('Error crítico')
  ).length;
  
  if (problemasCriticos === 0) {
    console.log('   ✅ El sistema de cuestionarios está listo para funcionar');
    console.log('   🔄 Reinicia la aplicación y prueba los cuestionarios nuevamente');
  } else {
    console.log(`   ⚠️ Quedan ${problemasCriticos} problemas críticos por resolver`);
    console.log('   🛠️ Revisa las recomendaciones y aplica las soluciones necesarias');
  }
  
  console.log('\n' + '='.repeat(60));
  
  return resultados;
}

// Ejecutar verificación final
verificacionFinal().then((resultados) => {
  console.log('\n🏁 VERIFICACIÓN FINAL COMPLETADA');
}).catch(error => {
  console.error('💥 ERROR EN VERIFICACIÓN FINAL:', error);
});
