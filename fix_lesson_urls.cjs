const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixLessonUrls() {
  try {
    console.log('🔧 Fixing lesson URLs for Master course...');
    
    // Mapeo correcto de las lecciones del máster
    const lessonUpdates = [
      {
        titulo: 'FUNDAMENTOS P TERAPEUTICO',
        archivo_url: '/lessons/leccion-1-fundamentos-p-terapeutico.html'
      },
      {
        titulo: 'TERAPIA COGNITIVA DROGODEPENDENCIAS',
        archivo_url: '/lessons/leccion-2-terapia-cognitiva-drogodependencias.html'
      },
      {
        titulo: 'FAMILIA Y TRABAJO EQUIPO',
        archivo_url: '/lessons/leccion-3-familia-y-trabajo-equipo.html'
      },
      {
        titulo: 'RECOVERY COACHING',
        archivo_url: '/lessons/leccion-4-recovery-coaching.html'
      },
      {
        titulo: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
        archivo_url: '/lessons/leccion-6-intervencion-familiar-y-recovery-mentoring.html'
      },
      {
        titulo: 'NUEVOS MODELOS TERAPEUTICOS',
        archivo_url: '/lessons/leccion-7-nuevos-modelos-terapeuticos.html'
      },
      {
        titulo: 'INTELIGENCIA EMOCIONAL',
        archivo_url: '/lessons/leccion-9-inteligencia-emocional.html'
      }
    ];
    
    // Obtener todas las lecciones del máster
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden', { ascending: true });
    
    if (leccionesError) {
      console.error('❌ Error getting lessons:', leccionesError);
      return;
    }
    
    console.log(`✅ Found ${lecciones.length} lessons to update`);
    
    // Actualizar cada lección
    for (let i = 0; i < lecciones.length && i < lessonUpdates.length; i++) {
      const leccion = lecciones[i];
      const update = lessonUpdates[i];
      
      console.log(`\n🔄 Updating lesson ${i + 1}:`);
      console.log(`- Current: ${leccion.titulo}`);
      console.log(`- New URL: ${update.archivo_url}`);
      
      const { error: updateError } = await supabase
        .from('lecciones')
        .update({ archivo_url: update.archivo_url })
        .eq('id', leccion.id);
      
      if (updateError) {
        console.error(`❌ Error updating lesson ${i + 1}:`, updateError);
      } else {
        console.log(`✅ Updated lesson ${i + 1}`);
      }
    }
    
    console.log('\n🎉 All lesson URLs updated!');
    
    // Verificar que los archivos existen
    console.log('\n🔍 Verifying files exist...');
    for (const update of lessonUpdates) {
      try {
        const fullUrl = `http://localhost:5173${update.archivo_url}`;
        const response = await fetch(fullUrl);
        console.log(`📄 ${update.archivo_url}: ${response.status === 200 ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      } catch (error) {
        console.log(`📄 ${update.archivo_url}: ❌ ERROR - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixLessonUrls();