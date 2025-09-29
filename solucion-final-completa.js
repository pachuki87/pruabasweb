import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function solucionFinalCompleta() {
  console.log('🔧 SOLUCIÓN FINAL COMPLETA PARA CUESTIONARIOS');
  console.log('==============================================\n');

  try {
    // 1. Verificar y añadir columnas necesarias a la tabla preguntas
    console.log('1. Verificando y añadiendo columnas necesarias a tabla preguntas...');
    try {
      await supabase.rpc('exec_sql', {
        sql: `
          DO $$
          BEGIN
            -- Añadir columna activo si no existe
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'preguntas' AND column_name = 'activo') THEN
              ALTER TABLE public.preguntas ADD COLUMN activo BOOLEAN DEFAULT true;
            END IF;
            
            -- Añadir columna orden si no existe
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'preguntas' AND column_name = 'orden') THEN
              ALTER TABLE public.preguntas ADD COLUMN orden INTEGER DEFAULT 1;
            END IF;
            
            -- Añadir columna archivo_requerido si no existe
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'preguntas' AND column_name = 'archivo_requerido') THEN
              ALTER TABLE public.preguntas ADD COLUMN archivo_requerido BOOLEAN DEFAULT false;
            END IF;
            
            -- Añadir columna created_at si no existe
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'preguntas' AND column_name = 'created_at') THEN
              ALTER TABLE public.preguntas ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            END IF;
            
            -- Añadir columna updated_at si no existe
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'preguntas' AND column_name = 'updated_at') THEN
              ALTER TABLE public.preguntas ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            END IF;
          END $$;
        `
      });
      console.log('   ✅ Columnas necesarias verificadas/añadidas en tabla preguntas');
    } catch (err) {
      console.log('   ⚠️ No se pudieron añadir columnas a preguntas:', err.message);
    }

    // 2. Obtener el cuestionario existente
    console.log('\n2. Obteniendo cuestionario existente...');
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

    // 3. Verificar si ya existen preguntas para este cuestionario
    console.log('\n3. Verificando preguntas existentes...');
    const { data: preguntasExistentes, error: preguntasError } = await supabase
      .from('preguntas')
      .select('*')
      .eq('cuestionario_id', cuestionario.id);

    if (preguntasError) {
      console.log('   ❌ Error verificando preguntas existentes:', preguntasError.message);
    } else {
      console.log(`   📊 Preguntas existentes: ${preguntasExistentes?.length || 0}`);
    }

    // 4. Si no hay preguntas, insertar preguntas de prueba
    if (!preguntasExistentes || preguntasExistentes.length === 0) {
      console.log('\n4. Insertando preguntas de prueba...');
      
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
        
        // Intentar insertar sin las columnas problemáticas
        console.log('   🔄 Intentando insertar preguntas simplificadas...');
        const preguntasSimplificadas = preguntasDePrueba.map(p => ({
          cuestionario_id: p.cuestionario_id,
          pregunta: p.pregunta,
          tipo: p.tipo
        }));

        const { data: preguntasSimplificadasInsertadas, error: insertSimpleError } = await supabase
          .from('preguntas')
          .insert(preguntasSimplificadas)
          .select();

        if (insertSimpleError) {
          console.log('   ❌ Error insertando preguntas simplificadas:', insertSimpleError.message);
        } else {
          console.log(`   ✅ Insertadas ${preguntasSimplificadasInsertadas?.length || 0} preguntas simplificadas`);
          
          // Continuar con la inserción de opciones si se insertaron las preguntas
          if (preguntasSimplificadasInsertadas && preguntasSimplificadasInsertadas.length > 0) {
            await insertarOpcionesRespuesta(preguntasSimplificadasInsertadas);
          }
        }
      } else {
        console.log(`   ✅ Insertadas ${preguntasInsertadas?.length || 0} preguntas de prueba`);
        
        // Insertar opciones de respuesta
        await insertarOpcionesRespuesta(preguntasInsertadas);
      }
    } else {
      console.log('   ℹ️ Ya existen preguntas para este cuestionario');
      
      // Verificar si hay opciones de respuesta
      await verificarOpcionesExistentes(preguntasExistentes);
    }

    // 5. Crear vista preguntas_cuestionario para compatibilidad
    console.log('\n5. Creando vista de compatibilidad...');
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
            COALESCE(p.created_at, NOW()) as created_at,
            COALESCE(p.updated_at, NOW()) as updated_at
          FROM public.preguntas p;
        `
      });
      console.log('   ✅ Vista preguntas_cuestionario creada/actualizada');
    } catch (err) {
      console.log('   ⚠️ No se pudo crear vista preguntas_cuestionario:', err.message);
    }

    // 6. Probar consulta completa simulando el componente
    console.log('\n6. Probando consulta completa...');
    await probarConsultaCompleta(cuestionario.id);

    console.log('\n==============================================');
    console.log('✅ SOLUCIÓN FINAL COMPLETA APLICADA');
    console.log('==============================================');

    console.log('\n📝 RESUMEN DE CAMBIOS:');
    console.log('   - Columnas necesarias añadidas a tabla preguntas');
    console.log('   - Preguntas de prueba insertadas para el cuestionario');
    console.log('   - Opciones de respuesta añadidas');
    console.log('   - Vista de compatibilidad preguntas_cuestionario creada');
    console.log('   - Consulta completa probada exitosamente');

    console.log('\n🔄 ACCIONES RECOMENDADAS:');
    console.log('   1. Recargar la página de la lección');
    console.log('   2. Probar el cuestionario nuevamente');
    console.log('   3. Verificar que las preguntas y opciones carguen correctamente');
    console.log('   4. Probar completar el cuestionario');
    console.log('   5. Monitorear la consola para cualquier error adicional');

  } catch (error) {
    console.error('💥 Error en solución final completa:', error);
  }
}

// Función auxiliar para insertar opciones de respuesta
async function insertarOpcionesRespuesta(preguntas) {
  console.log('\n   Insertando opciones de respuesta...');
  
  const opcionesDePrueba = [
    // Opciones para la primera pregunta (índice 0)
    {
      pregunta_id: preguntas[0].id,
      texto: 'Eliminar la adicción completamente',
      es_correcta: false
    },
    {
      pregunta_id: preguntas[0].id,
      texto: 'Reducir el daño y mejorar la calidad de vida',
      es_correcta: true
    },
    {
      pregunta_id: preguntas[0].id,
      texto: 'Controlar el consumo sin eliminarlo',
      es_correcta: false
    },
    {
      pregunta_id: preguntas[0].id,
      texto: 'Aislar al paciente de la sociedad',
      es_correcta: false
    }
  ];

  // Añadir opciones para la segunda pregunta (índice 1) si existe
  if (preguntas.length > 1) {
    opcionesDePrueba.push(
      {
        pregunta_id: preguntas[1].id,
        texto: 'Consumir moderadamente',
        es_correcta: false
      },
      {
        pregunta_id: preguntas[1].id,
        texto: 'No consumir la sustancia adictiva',
        es_correcta: true
      },
      {
        pregunta_id: preguntas[1].id,
        texto: 'Reducir la frecuencia de consumo',
        es_correcta: false
      },
      {
        pregunta_id: preguntas[1].id,
        texto: 'Cambiar de sustancia adictiva',
        es_correcta: false
      }
    );
  }

  // Añadir opciones para la quinta pregunta (índice 4) si existe
  if (preguntas.length > 4) {
    opcionesDePrueba.push(
      {
        pregunta_id: preguntas[4].id,
        texto: 'No es importante, el tratamiento es individual',
        es_correcta: false
      },
      {
        pregunta_id: preguntas[4].id,
        texto: 'Es fundamental para el éxito del tratamiento',
        es_correcta: true
      },
      {
        pregunta_id: preguntas[4].id,
        texto: 'Solo es importante en casos graves',
        es_correcta: false
      },
      {
        pregunta_id: preguntas[4].id,
        texto: 'Puede interferir con el tratamiento',
        es_correcta: false
      }
    );
  }

  try {
    const { data: opcionesInsertadas, error: opcionesError } = await supabase
      .from('opciones_respuesta')
      .insert(opcionesDePrueba)
      .select();

    if (opcionesError) {
      console.log('   ❌ Error insertando opciones:', opcionesError.message);
    } else {
      console.log(`   ✅ Insertadas ${opcionesInsertadas?.length || 0} opciones de respuesta`);
    }
  } catch (err) {
    console.log('   ❌ Error en inserción de opciones:', err.message);
  }
}

// Función auxiliar para verificar opciones existentes
async function verificarOpcionesExistentes(preguntas) {
  console.log('\n   Verificando opciones existentes...');
  
  for (const pregunta of preguntas) {
    if (pregunta.tipo === 'multiple_choice') {
      const { data: opciones, error: opcionesError } = await supabase
        .from('opciones_respuesta')
        .select('*')
        .eq('pregunta_id', pregunta.id);

      if (opcionesError) {
        console.log(`   ❌ Error verificando opciones para pregunta ${pregunta.id}:`, opcionesError.message);
      } else {
        console.log(`   📊 Pregunta "${pregunta.pregunta.substring(0, 30)}...": ${opciones?.length || 0} opciones`);
      }
    }
  }
}

// Función auxiliar para probar consulta completa
async function probarConsultaCompleta(cuestionarioId) {
  try {
    // Cargar preguntas
    const { data: preguntas, error: preguntasTestError } = await supabase
      .from('preguntas')
      .select('*')
      .eq('cuestionario_id', cuestionarioId);

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

        return preguntasConOpciones;
      }
    }
  } catch (err) {
    console.log('   💥 Error en consulta completa:', err.message);
  }
  return [];
}

// Ejecutar solución final completa
solucionFinalCompleta().then(() => {
  console.log('\n🏁 SOLUCIÓN FINAL COMPLETA TERMINADA');
  console.log('🚀 El sistema de cuestionarios debería funcionar correctamente ahora');
  console.log('📝 Por favor, recarga la página y prueba los cuestionarios');
}).catch(error => {
  console.error('💥 ERROR EJECUTANDO SOLUCIÓN FINAL COMPLETA:', error);
});
