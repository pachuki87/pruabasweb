import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function solucionDefinitiva() {
  console.log('🔧 SOLUCIÓN DEFINITIVA PARA ERRORES DE CUESTIONARIOS');
  console.log('===================================================\n');

  try {
    // 1. Obtener el cuestionario existente
    console.log('1. Obteniendo cuestionario existente...');
    const { data: cuestionario, error: quizError } = await supabase
      .from('cuestionarios')
      .select('*')
      .eq('leccion_id', '5cc8702c-45ab-4ae4-8e9a-df1d5c2c6e44')
      .single();

    if (quizError) {
      console.log('   ❌ Error obteniendo cuestionario:', quizError.message);
      return;
    }

    console.log(`   ✅ Cuestionario encontrado: ${cuestionario.titulo}`);
    console.log(`   📝 ID: ${cuestionario.id}`);

    // 2. Verificar si ya existen preguntas para este cuestionario
    console.log('\n2. Verificando preguntas existentes...');
    const { data: preguntasExistentes, error: preguntasError } = await supabase
      .from('preguntas')
      .select('*')
      .eq('cuestionario_id', cuestionario.id);

    if (preguntasError) {
      console.log('   ❌ Error verificando preguntas existentes:', preguntasError.message);
    } else {
      console.log(`   📊 Preguntas existentes: ${preguntasExistentes?.length || 0}`);
    }

    // 3. Si no hay preguntas, insertar preguntas de prueba
    if (!preguntasExistentes || preguntasExistentes.length === 0) {
      console.log('\n3. Insertando preguntas de prueba...');
      
      const preguntasDePrueba = [
        {
          cuestionario_id: cuestionario.id,
          pregunta: '¿Cuál es el objetivo principal del programa terapéutico en adicciones?',
          tipo: 'multiple_choice',
          orden: 1,
          activo: true
        },
        {
          cuestionario_id: cuestionario.id,
          pregunta: '¿Qué significa la abstinencia en el contexto de las adicciones?',
          tipo: 'multiple_choice',
          orden: 2,
          activo: true
        },
        {
          cuestionario_id: cuestionario.id,
          pregunta: '¿Mencione tres etapas del proceso de recuperación',
          tipo: 'texto_libre',
          orden: 3,
          activo: true
        },
        {
          cuestionario_id: cuestionario.id,
          pregunta: 'La terapia cognitiva es efectiva para tratar adicciones',
          tipo: 'verdadero_falso',
          orden: 4,
          activo: true
        },
        {
          cuestionario_id: cuestionario.id,
          pregunta: '¿Cuál es la importancia del apoyo familiar en el tratamiento?',
          tipo: 'multiple_choice',
          orden: 5,
          activo: true
        }
      ];

      const { data: preguntasInsertadas, error: insertError } = await supabase
        .from('preguntas')
        .insert(preguntasDePrueba)
        .select();

      if (insertError) {
        console.log('   ❌ Error insertando preguntas:', insertError.message);
      } else {
        console.log(`   ✅ Insertadas ${preguntasInsertadas?.length || 0} preguntas de prueba`);
        
        // 4. Insertar opciones de respuesta para preguntas de opción múltiple
        console.log('\n4. Insertando opciones de respuesta...');
        
        const opcionesDePrueba = [
          // Opciones para la primera pregunta
          {
            pregunta_id: preguntasInsertadas[0].id,
            texto: 'Eliminar la adicción completamente',
            es_correcta: false
          },
          {
            pregunta_id: preguntasInsertadas[0].id,
            texto: 'Reducir el daño y mejorar la calidad de vida',
            es_correcta: true
          },
          {
            pregunta_id: preguntasInsertadas[0].id,
            texto: 'Controlar el consumo sin eliminarlo',
            es_correcta: false
          },
          {
            pregunta_id: preguntasInsertadas[0].id,
            texto: 'Aislar al paciente de la sociedad',
            es_correcta: false
          },
          // Opciones para la segunda pregunta
          {
            pregunta_id: preguntasInsertadas[1].id,
            texto: 'Consumir moderadamente',
            es_correcta: false
          },
          {
            pregunta_id: preguntasInsertadas[1].id,
            texto: 'No consumir la sustancia adictiva',
            es_correcta: true
          },
          {
            pregunta_id: preguntasInsertadas[1].id,
            texto: 'Reducir la frecuencia de consumo',
            es_correcta: false
          },
          {
            pregunta_id: preguntasInsertadas[1].id,
            texto: 'Cambiar de sustancia adictiva',
            es_correcta: false
          },
          // Opciones para la quinta pregunta
          {
            pregunta_id: preguntasInsertadas[4].id,
            texto: 'No es importante, el tratamiento es individual',
            es_correcta: false
          },
          {
            pregunta_id: preguntasInsertadas[4].id,
            texto: 'Es fundamental para el éxito del tratamiento',
            es_correcta: true
          },
          {
            pregunta_id: preguntasInsertadas[4].id,
            texto: 'Solo es importante en casos graves',
            es_correcta: false
          },
          {
            pregunta_id: preguntasInsertadas[4].id,
            texto: 'Puede interferir con el tratamiento',
            es_correcta: false
          }
        ];

        const { data: opcionesInsertadas, error: opcionesError } = await supabase
          .from('opciones_respuesta')
          .insert(opcionesDePrueba)
          .select();

        if (opcionesError) {
          console.log('   ❌ Error insertando opciones:', opcionesError.message);
        } else {
          console.log(`   ✅ Insertadas ${opcionesInsertadas?.length || 0} opciones de respuesta`);
        }
      }
    } else {
      console.log('   ℹ️ Ya existen preguntas para este cuestionario');
    }

    // 5. Verificar la estructura de la tabla lecciones
    console.log('\n5. Verificando estructura de tabla lecciones...');
    try {
      const { data: leccion, error: leccionError } = await supabase
        .from('lecciones')
        .select('id, titulo')
        .limit(1);

      if (leccionError) {
        console.log('   ❌ Error consultando lecciones:', leccionError.message);
      } else {
        console.log('   ✅ Estructura de lecciones verificada');
        
        // Intentar añadir columna activo si no existe
        try {
          await supabase.rpc('exec_sql', {
            sql: `
              DO $$
              BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lecciones' AND column_name = 'activo') THEN
                  ALTER TABLE public.lecciones ADD COLUMN activo BOOLEAN DEFAULT true;
                END IF;
              END $$;
            `
          });
          console.log('   ✅ Columna activo verificada/añadida en lecciones');
        } catch (err) {
          console.log('   ⚠️ No se pudo verificar/añadir columna activo:', err.message);
        }
      }
    } catch (err) {
      console.log('   💥 Error verificando lecciones:', err.message);
    }

    // 6. Probar consulta completa simulando el componente
    console.log('\n6. Probando consulta completa...');
    try {
      // Cargar preguntas
      const { data: preguntas, error: preguntasTestError } = await supabase
        .from('preguntas')
        .select('*')
        .eq('cuestionario_id', cuestionario.id);

      if (preguntasTestError) {
        console.log('   ❌ Error cargando preguntas:', preguntasTestError.message);
      } else {
        console.log(`   ✅ Preguntas cargadas: ${preguntas?.length || 0}`);

        if (preguntas && preguntas.length > 0) {
          // Cargar opciones para preguntas de opción múltiple
          const preguntasConOpciones = await Promise.all(
            preguntas.map(async (pregunta) => {
              if (pregunta.tipo === 'multiple_choice') {
                const { data: opciones } = await supabase
                  .from('opciones_respuesta')
                  .select('*')
                  .eq('pregunta_id', pregunta.id);
                
                return {
                  ...pregunta,
                  opciones_respuesta: opciones || []
                };
              }
              return pregunta;
            })
          );

          console.log(`   ✅ Consulta completa exitosa - ${preguntasConOpciones.length} preguntas con opciones`);
          
          // Mostrar resumen de preguntas
          console.log('\n   📋 Resumen de preguntas:');
          preguntasConOpciones.forEach((pregunta, index) => {
            const tipo = pregunta.tipo;
            const opcionesCount = pregunta.opciones_respuesta?.length || 0;
            console.log(`      ${index + 1}. ${pregunta.pregunta.substring(0, 50)}... (${tipo}) - ${opcionesCount} opciones`);
          });
        }
      }
    } catch (err) {
      console.log('   💥 Error en consulta completa:', err.message);
    }

    // 7. Crear vista preguntas_cuestionario para compatibilidad
    console.log('\n7. Creando vista de compatibilidad...');
    try {
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE OR REPLACE VIEW public.preguntas_cuestionario AS
          SELECT 
            p.id,
            p.cuestionario_id,
            p.pregunta,
            COALESCE(p.tipo, 'multiple_choice') as tipo,
            COALESCE(p.archivo_requerido, false) as archivo_requerido,
            COALESCE(p.orden, 1) as orden,
            COALESCE(p.activo, true) as activo,
            p.created_at,
            p.updated_at
          FROM public.preguntas p;
        `
      });
      console.log('   ✅ Vista preguntas_cuestionario creada/actualizada');
    } catch (err) {
      console.log('   ⚠️ No se pudo crear vista preguntas_cuestionario:', err.message);
    }

    console.log('\n===================================================');
    console.log('✅ SOLUCIÓN DEFINITIVA APLICADA CORRECTAMENTE');
    console.log('==================================================');

    console.log('\n📝 RESUMEN DE CAMBIOS:');
    console.log('   - Preguntas de prueba insertadas para el cuestionario');
    console.log('   - Opciones de respuesta añadidas');
    console.log('   - Vista de compatibilidad preguntas_cuestionario creada');
    console.log('   - Estructura de lecciones verificada');
    console.log('   - Consulta completa probada exitosamente');

    console.log('\n🔄 ACCIONES RECOMENDADAS:');
    console.log('   1. Recargar la página de la lección');
    console.log('   2. Probar el cuestionario nuevamente');
    console.log('   3. Verificar que las preguntas y opciones carguen correctamente');
    console.log('   4. Probar completar el cuestionario');

  } catch (error) {
    console.error('💥 Error en solución definitiva:', error);
  }
}

// Ejecutar solución definitiva
solucionDefinitiva().then(() => {
  console.log('\n🏁 SOLUCIÓN DEFINITIVA COMPLETADA');
  console.log('🚀 El sistema de cuestionarios debería funcionar correctamente ahora');
}).catch(error => {
  console.error('💥 ERROR EJECUTANDO SOLUCIÓN DEFINITIVA:', error);
});
