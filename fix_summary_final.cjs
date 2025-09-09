require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUserCourseSummary() {
  try {
    console.log('🔧 Solucionando user_course_summary definitivamente\n');
    
    // 1. Obtener inscripciones con curso_id como UUID
    console.log('📋 Obteniendo inscripciones...');
    const { data: inscripciones, error: inscripcionesError } = await supabase
      .from('inscripciones')
      .select('user_id, curso_id');
    
    if (inscripcionesError) {
      console.log('❌ Error:', inscripcionesError.message);
      return;
    }
    
    console.log(`✅ Encontradas ${inscripciones.length} inscripciones`);
    inscripciones.forEach((ins, i) => {
      console.log(`   ${i+1}. Usuario: ${ins.user_id}, Curso: ${ins.curso_id}`);
    });
    
    // 2. Obtener cursos
    console.log('\n📚 Obteniendo cursos...');
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id, titulo');
    
    if (cursosError) {
      console.log('❌ Error:', cursosError.message);
      return;
    }
    
    console.log(`✅ Encontrados ${cursos.length} cursos`);
    cursos.forEach(curso => {
      console.log(`   - ${curso.titulo} (ID: ${curso.id})`);
    });
    
    // 3. Contar lecciones por curso
    console.log('\n📖 Contando lecciones...');
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('curso_id');
    
    if (leccionesError) {
      console.log('❌ Error:', leccionesError.message);
      return;
    }
    
    const leccionesPorCurso = {};
    lecciones.forEach(leccion => {
      leccionesPorCurso[leccion.curso_id] = (leccionesPorCurso[leccion.curso_id] || 0) + 1;
    });
    
    console.log('📊 Lecciones por curso:');
    Object.entries(leccionesPorCurso).forEach(([cursoId, count]) => {
      const curso = cursos.find(c => c.id === cursoId);
      console.log(`   - ${curso?.titulo || cursoId}: ${count} lecciones`);
    });
    
    // 4. Probar diferentes estructuras basándome en los errores anteriores
    console.log('\n🧪 Probando estructura correcta...');
    
    // Basándome en los errores, parece que usa nombres en inglés pero course_id debe ser UUID
    const estructuraCorrecta = {
      user_id: inscripciones[0].user_id,
      course_id: inscripciones[0].curso_id, // UUID del curso
      total_lessons: leccionesPorCurso[inscripciones[0].curso_id] || 0,
      completed_lessons: 0,
      progress_percentage: 0.0
    };
    
    console.log('📝 Probando estructura:', Object.keys(estructuraCorrecta).join(', '));
    
    const { error: testError } = await supabase
      .from('user_course_summary')
      .insert(estructuraCorrecta);
    
    if (testError) {
      console.log('❌ Error con estructura inglés:', testError.message);
      
      // Probar con nombres mixtos
      console.log('\n🧪 Probando estructura mixta...');
      const estructuraMixta = {
        user_id: inscripciones[0].user_id,
        course_id: inscripciones[0].curso_id,
        total_lecciones: leccionesPorCurso[inscripciones[0].curso_id] || 0,
        lecciones_completadas: 0,
        progreso_porcentaje: 0.0
      };
      
      console.log('📝 Probando estructura mixta:', Object.keys(estructuraMixta).join(', '));
      
      const { error: testError2 } = await supabase
        .from('user_course_summary')
        .insert(estructuraMixta);
      
      if (testError2) {
        console.log('❌ Error con estructura mixta:', testError2.message);
        
        // Si nada funciona, mostrar el SQL para crear la tabla correctamente
        console.log('\n🚨 NINGUNA ESTRUCTURA FUNCIONA');
        console.log('\n📋 SQL para crear la tabla correctamente:');
        console.log(`
CREATE TABLE IF NOT EXISTS public.user_course_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE,
  total_lessons INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Habilitar RLS
ALTER TABLE public.user_course_summary ENABLE ROW LEVEL SECURITY;

-- Política para que usuarios vean solo sus datos
CREATE POLICY "Users can view their own course summary" 
ON public.user_course_summary FOR SELECT 
USING (auth.uid() = user_id);

-- Política para insertar
CREATE POLICY "Users can insert their own course summary" 
ON public.user_course_summary FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Política para actualizar
CREATE POLICY "Users can update their own course summary" 
ON public.user_course_summary FOR UPDATE 
USING (auth.uid() = user_id);`);
        
        console.log('\n💡 Ejecuta este SQL en el Dashboard de Supabase y luego vuelve a ejecutar este script.');
        return;
      } else {
        console.log('✅ ¡Estructura mixta funciona!');
        // Limpiar registro de prueba
        await supabase
          .from('user_course_summary')
          .delete()
          .eq('user_id', inscripciones[0].user_id)
          .eq('course_id', inscripciones[0].curso_id);
      }
    } else {
      console.log('✅ ¡Estructura inglés funciona!');
      // Limpiar registro de prueba
      await supabase
        .from('user_course_summary')
        .delete()
        .eq('user_id', inscripciones[0].user_id)
        .eq('course_id', inscripciones[0].curso_id);
    }
    
    // 5. Insertar todos los registros
    console.log('\n🔄 Insertando todos los registros...');
    
    let exitosos = 0;
    let errores = 0;
    
    for (const inscripcion of inscripciones) {
      const totalLecciones = leccionesPorCurso[inscripcion.curso_id] || 0;
      const curso = cursos.find(c => c.id === inscripcion.curso_id);
      
      const registro = testError ? {
        user_id: inscripcion.user_id,
        course_id: inscripcion.curso_id,
        total_lecciones: totalLecciones,
        lecciones_completadas: 0,
        progreso_porcentaje: 0.0
      } : {
        user_id: inscripcion.user_id,
        course_id: inscripcion.curso_id,
        total_lessons: totalLecciones,
        completed_lessons: 0,
        progress_percentage: 0.0
      };
      
      console.log(`\n📝 Insertando: ${curso?.titulo || 'Curso desconocido'}`);
      
      const { error: insertError } = await supabase
        .from('user_course_summary')
        .upsert(registro, { 
          onConflict: 'user_id,course_id',
          ignoreDuplicates: false 
        });
      
      if (insertError) {
        console.log(`❌ Error:`, insertError.message);
        errores++;
      } else {
        console.log(`✅ Éxito`);
        exitosos++;
      }
    }
    
    console.log(`\n📊 RESULTADO FINAL:`);
    console.log(`✅ Exitosos: ${exitosos}`);
    console.log(`❌ Errores: ${errores}`);
    
    if (exitosos > 0) {
      console.log('\n🎉 ¡PROBLEMA RESUELTO!');
      console.log('   La tabla user_course_summary ahora tiene datos.');
      console.log('   Los errores PGRST205 deberían desaparecer.');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

fixUserCourseSummary();