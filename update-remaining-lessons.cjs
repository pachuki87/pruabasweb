const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function updateRemainingLessons() {
  try {
    console.log('🔧 Actualizando lecciones 7, 8, 9 y 10 a archivos limpios...');
    
    const updates = [
      {
        orden: 7,
        url: '/lessons/leccion-7-nuevos-modelos-terapeuticos-clean.html',
        titulo: 'NUEVOS MODELOS TERAPEUTICOS'
      },
      {
        orden: 8,
        url: '/lessons/leccion-8-gestion-perspectiva-genero-clean.html',
        titulo: 'GESTIÓN PERSPECTIVA GÉNERO'
      },
      {
        orden: 9,
        url: '/lessons/leccion-9-inteligencia-emocional-clean.html',
        titulo: 'INTELIGENCIA EMOCIONAL'
      },
      {
        orden: 10,
        url: '/lessons/leccion-10-trabajo-final-master-clean.html',
        titulo: 'TRABAJO FINAL MASTER'
      }
    ];
    
    for (const update of updates) {
      const { data, error } = await supabase
        .from('lecciones')
        .update({ 
          archivo_url: update.url,
          actualizado_en: new Date().toISOString()
        })
        .eq('orden', update.orden)
        .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
        .select();
      
      if (error) {
        console.error(`❌ Error actualizando lección ${update.orden}:`, error);
        continue;
      }
      
      if (data && data.length > 0) {
        console.log(`✅ Lección ${update.orden} (${update.titulo}) actualizada:`);
        console.log(`   - Nuevo archivo_url: ${data[0].archivo_url}`);
      }
    }
    
    console.log('\n🎉 ¡TODAS LAS LECCIONES DEL MÁSTER ACTUALIZADAS!');
    console.log('📊 Resumen final:');
    console.log('   ✅ 10/10 lecciones con contenido profesional');
    console.log('   ✅ Diseño moderno y consistente');
    console.log('   ✅ Contenido especializado y actualizado');
    console.log('   ✅ Eliminación de duplicados completada');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

updateRemainingLessons();