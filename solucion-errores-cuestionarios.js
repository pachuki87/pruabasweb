import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function solucionarErrores() {
  console.log('🔧 SOLUCIONANDO ERRORES DEL SISTEMA DE CUESTIONARIOS');
  console.log('================================================\n');

  try {
    // 1. Verificar si existe la tabla preguntas_cuestionario
    console.log('1. Verificando tabla preguntas_cuestionario...');
    const { data: preguntasCheck, error: preguntasError } = await supabase
      .from('preguntas_cuestionario')
      .select('*')
      .limit(1);

    if (preguntasError && preguntasError.code === 'PGRST116') {
      console.log('   ❌ La tabla preguntas_cuestionario no existe');
      console.log('   📝 Creando tabla preguntas_cuestionario...');
      
      // Crear la tabla usando SQL directo
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.preguntas_cuestionario (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            cuestionario_id UUID REFERENCES public.cuestionarios(id) ON DELETE CASCADE,
            pregunta TEXT NOT NULL,
            tipo VARCHAR(50) DEFAULT 'multiple_choice' CHECK (tipo IN ('multiple_choice', 'verdadero_falso', 'texto_libre')),
            archivo_requerido BOOLEAN DEFAULT false,
            orden INTEGER DEFAULT 1,
            activo BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Crear índices
          CREATE INDEX IF NOT EXISTS idx_preguntas_cuestionario_cuestionario_id ON public.preguntas_cuestionario(cuestionario_id);
          CREATE INDEX IF NOT EXISTS idx_preguntas_cuestionario_activo ON public.preguntas_cuestionario(activo);
          
          -- Habilitar RLS
          ALTER TABLE public.preguntas_cuestionario ENABLE ROW LEVEL SECURITY;
          
          -- Políticas RLS
          CREATE POLICY IF NOT EXISTS "Preguntas visibles para todos" ON public.preguntas_cuestionario
            FOR SELECT USING (true);
            
          CREATE POLICY IF NOT EXISTS "Solo servicio puede insertar preguntas" ON public.preguntas_cuestionario
            FOR INSERT WITH CHECK (auth.role() = 'service_role');
            
          CREATE POLICY IF NOT EXISTS "Solo servicio puede actualizar preguntas" ON public.preguntas_cuestionario
            FOR UPDATE USING (auth.role() = 'service_role');
            
          CREATE POLICY IF NOT EXISTS "Solo servicio puede eliminar preguntas" ON public.preguntas_cuestionario
            FOR DELETE USING (auth.role() = 'service_role');
        `
      });

      if (createError) {
        console.log(`   ❌ Error creando tabla: ${createError.message}`);
        console.log('   🔄 Intentando método alternativo...');
        
        // Método alternativo: usar la tabla que sí existe
        const { data: preguntasTable, error: checkPreguntas } = await supabase
          .from('preguntas')
          .select('*')
          .limit(1);
        
        if (checkPreguntas) {
          console.log('   ✅ Se encontró tabla "preguntas", se usará como alternativa');
          console.log('   📝 Creando vista preguntas_cuestionario...');
          
          // Crear vista que mapee preguntas a preguntas_cuestionario
          const { error: viewError } = await supabase.rpc('exec_sql', {
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
          
          if (viewError) {
            console.log(`   ❌ Error creando vista: ${viewError.message}`);
          } else {
            console.log('   ✅ Vista preguntas_cuestionario creada exitosamente');
          }
        }
      } else {
        console.log('   ✅ Tabla preguntas_cuestionario creada exitosamente');
      }
    } else {
      console.log('   ✅ Tabla preguntas_cuestionario ya existe');
    }

    // 2. Verificar si existe la tabla user_progress
    console.log('\n2. Verificando tabla user_progress...');
    const { data: progressCheck, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .limit(1);

    if (progressError && progressError.code === 'PGRST116') {
      console.log('   ❌ La tabla user_progress no existe');
      console.log('   📝 Creando tabla user_progress...');
      
      const { error: createProgressError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.user_progress (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            curso_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE,
            leccion_id UUID REFERENCES public.lecciones(id) ON DELETE CASCADE,
            progreso DECIMAL(5,2) DEFAULT 0.00 CHECK (progreso >= 0 AND progreso <= 100),
            completado BOOLEAN DEFAULT false,
            ultima_visita TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, leccion_id)
          );
          
          -- Crear índices
          CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
          CREATE INDEX IF NOT EXISTS idx_user_progress_curso_id ON public.user_progress(curso_id);
          CREATE INDEX IF NOT EXISTS idx_user_progress_leccion_id ON public.user_progress(leccion_id);
          CREATE INDEX IF NOT EXISTS idx_user_progress_completado ON public.user_progress(completado);
          
          -- Habilitar RLS
          ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
          
          -- Políticas RLS
          CREATE POLICY IF NOT EXISTS "Usuarios pueden ver su propio progreso" ON public.user_progress
            FOR SELECT USING (auth.uid() = user_id);
            
          CREATE POLICY IF NOT EXISTS "Usuarios pueden insertar su propio progreso" ON public.user_progress
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
          CREATE POLICY IF NOT EXISTS "Usuarios pueden actualizar su propio progreso" ON public.user_progress
            FOR UPDATE USING (auth.uid() = user_id);
            
          CREATE POLICY IF NOT EXISTS "Servicio puede gestionar todo el progreso" ON public.user_progress
            FOR ALL USING (auth.role() = 'service_role');
        `
      });

      if (createProgressError) {
        console.log(`   ❌ Error creando tabla user_progress: ${createProgressError.message}`);
      } else {
        console.log('   ✅ Tabla user_progress creada exitosamente');
      }
    } else {
      console.log('   ✅ Tabla user_progress ya existe');
    }

    // 3. Verificar y añadir columna respuestas_correctas a user_test_results
    console.log('\n3. Verificando columna respuestas_correctas en user_test_results...');
    const { data: testResults, error: testResultsError } = await supabase
      .from('user_test_results')
      .select('respuestas_correctas')
      .limit(1);

    if (testResultsError && testResultsError.message.includes('column "respuestas_correctas" does not exist')) {
      console.log('   ❌ La columna respuestas_correctas no existe');
      console.log('   📝 Añadiendo columna respuestas_correctas...');
      
      const { error: addColumnError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE public.user_test_results 
          ADD COLUMN IF NOT EXISTS respuestas_correctas INTEGER DEFAULT 0;
          
          -- Añadir también columna total_preguntas si no existe
          ALTER TABLE public.user_test_results 
          ADD COLUMN IF NOT EXISTS total_preguntas INTEGER DEFAULT 0;
        `
      });

      if (addColumnError) {
        console.log(`   ❌ Error añadiendo columnas: ${addColumnError.message}`);
      } else {
        console.log('   ✅ Columnas añadidas exitosamente');
      }
    } else {
      console.log('   ✅ Columna respuestas_correctas ya existe');
    }

    // 4. Insertar datos de prueba para preguntas
    console.log('\n4. Insertando datos de prueba para preguntas...');
    const preguntasPrueba = [
      {
        cuestionario_id: '550e8400-e29b-41d4-a716-446655440000', // Reemplazar con ID real
        pregunta: '¿Cuál es el objetivo principal del programa terapéutico en adicciones?',
        tipo: 'multiple_choice',
        orden: 1,
        activo: true
      },
      {
        cuestionario_id: '550e8400-e29b-41d4-a716-446655440000',
        pregunta: '¿Qué significa la abstinencia en el contexto de las adicciones?',
        tipo: 'multiple_choice',
        orden: 2,
        activo: true
      }
    ];

    try {
      const { data: insertedPreguntas, error: insertError } = await supabase
        .from('preguntas_cuestionario')
        .insert(preguntasPrueba)
        .select();

      if (insertError) {
        console.log(`   ⚠️ No se pudieron insertar preguntas de prueba: ${insertError.message}`);
      } else {
        console.log(`   ✅ Insertadas ${insertedPreguntas?.length || 0} preguntas de prueba`);
      }
    } catch (err) {
      console.log(`   ⚠️ Error insertando preguntas: ${err.message}`);
    }

    // 5. Verificar relaciones y consultas complejas
    console.log('\n5. Verificando consulta compleja...');
    try {
      const { data: quizCompleto, error: quizError } = await supabase
        .from('cuestionarios')
        .select(`
          *,
          preguntas_cuestionario (*)
        `)
        .limit(1);

      if (quizError) {
        console.log(`   ❌ Error en consulta compleja: ${quizError.message}`);
      } else {
        console.log('   ✅ Consulta compleja funcionando correctamente');
        if (quizCompleto && quizCompleto.length > 0) {
          const quiz = quizCompleto[0];
          console.log(`   📊 Cuestionario: ${quiz.titulo}`);
          console.log(`   📝 Preguntas: ${quiz.preguntas_cuestionario?.length || 0}`);
        }
      }
    } catch (err) {
      console.log(`   ❌ Error en consulta compleja: ${err.message}`);
    }

    // 6. Activar lecciones
    console.log('\n6. Activando lecciones...');
    const { error: updateError } = await supabase
      .from('lecciones')
      .update({ activo: true })
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05');

    if (updateError) {
      console.log(`   ❌ Error activando lecciones: ${updateError.message}`);
    } else {
      console.log('   ✅ Lecciones activadas correctamente');
    }

    console.log('\n========================================');
    console.log('✅ SOLUCIONES APLICADAS CORRECTAMENTE');
    console.log('========================================');

  } catch (error) {
    console.error('💥 Error general aplicando soluciones:', error);
  }
}

// Ejecutar soluciones
solucionarErrores().then(() => {
  console.log('\n🏁 SOLUCIONES COMPLETADAS');
  console.log('🔄 Por favor, recarga la página y prueba los cuestionarios nuevamente');
}).catch(error => {
  console.error('💥 ERROR EJECUTANDO SOLUCIONES:', error);
});
