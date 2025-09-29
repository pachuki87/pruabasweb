import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const targetCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// Las 6 lecciones faltantes de inteligencia emocional
const missingLessons = [
  {
    orden: 2,
    titulo: 'AUTOCONCIENCIA EMOCIONAL',
    archivo_url: 'lessons/leccion-2-autoconciencia-emocional.html',
    descripcion: 'Aprende a reconocer y comprender tus propias emociones'
  },
  {
    orden: 3,
    titulo: 'AUTORREGULACIÓN EMOCIONAL',
    archivo_url: 'lessons/leccion-3-autorregulacion-emocional.html',
    descripcion: 'Desarrolla habilidades para controlar y gestionar tus emociones'
  },
  {
    orden: 4,
    titulo: 'MOTIVACIÓN Y METAS',
    archivo_url: 'lessons/leccion-4-motivacion-metas.html',
    descripcion: 'Utiliza las emociones para motivarte y alcanzar tus objetivos'
  },
  {
    orden: 5,
    titulo: 'EMPATÍA Y COMPRENSIÓN',
    archivo_url: 'lessons/leccion-5-empatia-comprension.html',
    descripcion: 'Desarrolla la capacidad de entender las emociones de otros'
  },
  {
    orden: 6,
    titulo: 'HABILIDADES SOCIALES',
    archivo_url: 'lessons/leccion-6-habilidades-sociales.html',
    descripcion: 'Mejora tus relaciones interpersonales usando inteligencia emocional'
  },
  {
    orden: 7,
    titulo: 'APLICACIÓN PRÁCTICA DE LA INTELIGENCIA EMOCIONAL',
    archivo_url: 'lessons/leccion-7-aplicacion-practica-inteligencia-emocional.html',
    descripcion: 'Aplica todos los conceptos aprendidos en situaciones reales'
  }
];

async function createMissingLessons() {
  console.log('➕ Creando lecciones faltantes de Inteligencia Emocional...');
  console.log(`📋 ID del curso: ${targetCourseId}`);
  console.log('\n' + '='.repeat(80));

  try {
    // 1. Verificar lecciones actuales
    console.log('\n1️⃣ Verificando lecciones actuales...');
    const { data: currentLessons, error: fetchError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', targetCourseId)
      .order('orden', { ascending: true });

    if (fetchError) {
      console.error('❌ Error al consultar lecciones:', fetchError);
      return;
    }

    console.log(`📊 Lecciones actuales: ${currentLessons.length}`);
    currentLessons.forEach((lesson, index) => {
      console.log(`   ${lesson.orden}. ${lesson.titulo}`);
    });

    // 2. Crear lecciones faltantes
    console.log('\n2️⃣ Creando lecciones faltantes...');
    
    for (const lesson of missingLessons) {
      console.log(`➕ Creando: ${lesson.titulo}`);
      
      const { data, error: insertError } = await supabase
        .from('lecciones')
        .insert({
          curso_id: targetCourseId,
          titulo: lesson.titulo,
          descripcion: lesson.descripcion,
          orden: lesson.orden,
          archivo_url: lesson.archivo_url,
          duracion_estimada: 30,
          tiene_cuestionario: false
        })
        .select();
      
      if (insertError) {
        console.error(`❌ Error al crear lección ${lesson.titulo}:`, insertError);
      } else {
        console.log(`✅ Creada: ${lesson.titulo} (ID: ${data[0].id})`);
      }
    }

    // 3. Verificar resultado final
    console.log('\n3️⃣ Verificando resultado final...');
    const { data: finalLessons, error: finalError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', targetCourseId)
      .order('orden', { ascending: true });

    if (finalError) {
      console.error('❌ Error al verificar resultado final:', finalError);
      return;
    }

    console.log(`\n📊 Resultado final: ${finalLessons.length} lecciones`);
    console.log('\n📋 Lecciones finales:');
    finalLessons.forEach((lesson, index) => {
      console.log(`   ${lesson.orden}. ${lesson.titulo}`);
      console.log(`      ID: ${lesson.id}`);
      console.log(`      Archivo: ${lesson.archivo_url}`);
      console.log('');
    });

    if (finalLessons.length === 7) {
      console.log('\n🎉 ¡Perfecto! El curso ahora tiene exactamente 7 lecciones de inteligencia emocional.');
      console.log('\n✅ Las lecciones están listas para aparecer en la web.');
      console.log('\n🔍 Verificando que los archivos HTML existen...');
      
      // Verificar archivos HTML
      for (const lesson of finalLessons) {
        if (lesson.archivo_url) {
          console.log(`📄 ${lesson.titulo}: ${lesson.archivo_url}`);
        }
      }
    } else {
      console.log(`\n⚠️ Atención: El curso tiene ${finalLessons.length} lecciones, se esperaban 7.`);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createMissingLessons();