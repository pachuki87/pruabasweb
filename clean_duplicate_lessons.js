import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const targetCourseId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

// Las 7 lecciones correctas de inteligencia emocional según la imagen
const correctLessons = [
  {
    orden: 1,
    titulo: 'INTELIGENCIA EMOCIONAL',
    archivo_url: 'lessons/leccion-1-introduccion-inteligencia-emocional.html'
  },
  {
    orden: 2,
    titulo: 'AUTOCONCIENCIA EMOCIONAL',
    archivo_url: 'lessons/leccion-2-autoconciencia-emocional.html'
  },
  {
    orden: 3,
    titulo: 'AUTORREGULACIÓN EMOCIONAL',
    archivo_url: 'lessons/leccion-3-autorregulacion-emocional.html'
  },
  {
    orden: 4,
    titulo: 'MOTIVACIÓN Y METAS',
    archivo_url: 'lessons/leccion-4-motivacion-metas.html'
  },
  {
    orden: 5,
    titulo: 'EMPATÍA Y COMPRENSIÓN',
    archivo_url: 'lessons/leccion-5-empatia-comprension.html'
  },
  {
    orden: 6,
    titulo: 'HABILIDADES SOCIALES',
    archivo_url: 'lessons/leccion-6-habilidades-sociales.html'
  },
  {
    orden: 7,
    titulo: 'APLICACIÓN PRÁCTICA DE LA INTELIGENCIA EMOCIONAL',
    archivo_url: 'lessons/leccion-7-aplicacion-practica-inteligencia-emocional.html'
  }
];

async function cleanDuplicateLessons() {
  console.log('🧹 Limpiando lecciones duplicadas del curso de Inteligencia Emocional...');
  console.log(`📋 ID del curso: ${targetCourseId}`);
  console.log('\n' + '='.repeat(80));

  try {
    // 1. Consultar todas las lecciones actuales del curso
    console.log('\n1️⃣ Consultando lecciones actuales...');
    const { data: currentLessons, error: fetchError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', targetCourseId)
      .order('orden', { ascending: true });

    if (fetchError) {
      console.error('❌ Error al consultar lecciones:', fetchError);
      return;
    }

    console.log(`📊 Total de lecciones encontradas: ${currentLessons.length}`);
    
    if (currentLessons.length === 0) {
      console.log('⚠️ No se encontraron lecciones para este curso.');
      return;
    }

    // Mostrar lecciones actuales
    console.log('\n📋 Lecciones actuales:');
    currentLessons.forEach((lesson, index) => {
      console.log(`   ${index + 1}. [Orden: ${lesson.orden || 'N/A'}] ${lesson.titulo}`);
      console.log(`      ID: ${lesson.id}`);
      console.log(`      Archivo: ${lesson.archivo_url || 'N/A'}`);
      console.log('');
    });

    // 2. Identificar lecciones a mantener y eliminar
    console.log('\n2️⃣ Identificando lecciones a mantener y eliminar...');
    
    const lessonsToKeep = [];
    const lessonsToDelete = [];
    
    // Para cada lección correcta, buscar la mejor coincidencia
    correctLessons.forEach(correctLesson => {
      const matches = currentLessons.filter(lesson => 
        lesson.titulo.toUpperCase().includes(correctLesson.titulo.toUpperCase()) ||
        correctLesson.titulo.toUpperCase().includes(lesson.titulo.toUpperCase())
      );
      
      if (matches.length > 0) {
        // Mantener la primera coincidencia y marcar el resto para eliminar
        lessonsToKeep.push(matches[0]);
        if (matches.length > 1) {
          lessonsToDelete.push(...matches.slice(1));
        }
      }
    });
    
    // Marcar para eliminar todas las lecciones que no coinciden con ninguna correcta
    currentLessons.forEach(lesson => {
      const isCorrectLesson = correctLessons.some(correctLesson => 
        lesson.titulo.toUpperCase().includes(correctLesson.titulo.toUpperCase()) ||
        correctLesson.titulo.toUpperCase().includes(lesson.titulo.toUpperCase())
      );
      
      if (!isCorrectLesson && !lessonsToDelete.find(l => l.id === lesson.id)) {
        lessonsToDelete.push(lesson);
      }
    });

    console.log(`\n✅ Lecciones a mantener: ${lessonsToKeep.length}`);
    lessonsToKeep.forEach((lesson, index) => {
      console.log(`   ${index + 1}. ${lesson.titulo} (ID: ${lesson.id})`);
    });

    console.log(`\n❌ Lecciones a eliminar: ${lessonsToDelete.length}`);
    lessonsToDelete.forEach((lesson, index) => {
      console.log(`   ${index + 1}. ${lesson.titulo} (ID: ${lesson.id})`);
    });

    // 3. Eliminar lecciones duplicadas
    if (lessonsToDelete.length > 0) {
      console.log('\n3️⃣ Eliminando lecciones duplicadas...');
      
      for (const lesson of lessonsToDelete) {
        console.log(`🗑️ Eliminando: ${lesson.titulo}`);
        
        const { error: deleteError } = await supabase
          .from('lecciones')
          .delete()
          .eq('id', lesson.id);
        
        if (deleteError) {
          console.error(`❌ Error al eliminar lección ${lesson.titulo}:`, deleteError);
        } else {
          console.log(`✅ Eliminada: ${lesson.titulo}`);
        }
      }
    } else {
      console.log('\n3️⃣ No hay lecciones duplicadas para eliminar.');
    }

    // 4. Actualizar lecciones restantes con datos correctos
    console.log('\n4️⃣ Actualizando lecciones con datos correctos...');
    
    for (let i = 0; i < lessonsToKeep.length; i++) {
      const lesson = lessonsToKeep[i];
      const correctData = correctLessons.find(cl => 
        lesson.titulo.toUpperCase().includes(cl.titulo.toUpperCase()) ||
        cl.titulo.toUpperCase().includes(lesson.titulo.toUpperCase())
      );
      
      if (correctData) {
        console.log(`🔄 Actualizando: ${lesson.titulo} -> ${correctData.titulo}`);
        
        const { error: updateError } = await supabase
          .from('lecciones')
          .update({
            titulo: correctData.titulo,
            orden: correctData.orden,
            archivo_url: correctData.archivo_url
          })
          .eq('id', lesson.id);
        
        if (updateError) {
          console.error(`❌ Error al actualizar lección ${lesson.titulo}:`, updateError);
        } else {
          console.log(`✅ Actualizada: ${correctData.titulo}`);
        }
      }
    }

    // 5. Verificar resultado final
    console.log('\n5️⃣ Verificando resultado final...');
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
    } else {
      console.log(`\n⚠️ Atención: El curso tiene ${finalLessons.length} lecciones, se esperaban 7.`);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

cleanDuplicateLessons();