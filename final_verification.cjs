require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalVerification() {
  try {
    console.log('🔍 Verificación final del material MATRIX...');
    
    // Obtener información del curso Master en Adicciones
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .single();
    
    if (cursoError) {
      console.error('❌ Error obteniendo curso:', cursoError);
      return;
    }
    
    console.log(`\n📚 Curso: ${curso.titulo}`);
    
    // Obtener todas las lecciones del curso
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', curso.id)
      .order('orden');
    
    if (leccionesError) {
      console.error('❌ Error obteniendo lecciones:', leccionesError);
      return;
    }
    
    console.log(`\n📖 Lecciones encontradas: ${lecciones.length}`);
    
    // Verificar materiales MATRIX en cada lección
    for (const leccion of lecciones) {
      const { data: materiales, error: materialesError } = await supabase
        .from('materiales')
        .select('id, titulo, url_archivo')
        .eq('leccion_id', leccion.id)
        .or('titulo.ilike.%matrix%,url_archivo.ilike.%matrix%');
      
      if (!materialesError) {
        if (materiales.length > 0) {
          console.log(`\n📋 Lección ${leccion.orden}: "${leccion.titulo}"`);
          console.log(`   ✅ Materiales MATRIX encontrados: ${materiales.length}`);
          materiales.forEach((material, index) => {
            console.log(`      ${index + 1}. ${material.titulo}`);
            console.log(`         ID: ${material.id}`);
            console.log(`         URL: ${material.url_archivo}`);
          });
        }
      }
    }
    
    // Verificar específicamente la lección 1 y lección 3
    const leccion1 = lecciones.find(l => l.orden === 1);
    const leccion3 = lecciones.find(l => l.orden === 3);
    
    if (leccion1) {
      const { data: materialesL1, error: errorL1 } = await supabase
        .from('materiales')
        .select('id, titulo')
        .eq('leccion_id', leccion1.id);
      
      console.log(`\n🎯 Lección 1 (${leccion1.titulo}):`);
      if (!errorL1 && materialesL1.length > 0) {
        console.log(`   Total materiales: ${materialesL1.length}`);
        materialesL1.forEach((material, index) => {
          console.log(`   ${index + 1}. ${material.titulo}`);
        });
      } else {
        console.log('   Sin materiales');
      }
    }
    
    if (leccion3) {
      const { data: materialesL3, error: errorL3 } = await supabase
        .from('materiales')
        .select('id, titulo')
        .eq('leccion_id', leccion3.id);
      
      console.log(`\n🎯 Lección 3 (${leccion3.titulo}):`);
      if (!errorL3 && materialesL3.length > 0) {
        console.log(`   Total materiales: ${materialesL3.length}`);
        materialesL3.forEach((material, index) => {
          console.log(`   ${index + 1}. ${material.titulo}`);
        });
      } else {
        console.log('   ✅ Sin materiales (correcto)');
      }
    }
    
    console.log('\n✅ Verificación completada.');
    console.log('📝 Resumen:');
    console.log('   - El material MATRIX debe estar SOLO en la lección 1');
    console.log('   - La lección 3 NO debe tener materiales MATRIX');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

finalVerification();