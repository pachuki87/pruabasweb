require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLesson3Materials() {
  try {
    console.log('🔍 Verificando materiales de la lección 3...');
    
    // Primero obtener todas las lecciones del Master en Adicciones
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id, titulo, orden')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden');
    
    if (leccionesError) {
      console.error('❌ Error obteniendo lecciones:', leccionesError);
      return;
    }
    
    console.log('\n📚 Lecciones del Master en Adicciones:');
    lecciones.forEach(leccion => {
      console.log(`   ${leccion.orden}. ${leccion.titulo} (ID: ${leccion.id})`);
    });
    
    // Encontrar la lección 3
    const leccion3 = lecciones.find(l => l.orden === 3);
    if (!leccion3) {
      console.log('\n❌ No se encontró la lección 3');
      return;
    }
    
    console.log(`\n🎯 Analizando lección 3: ${leccion3.titulo}`);
    
    // Obtener todos los materiales de la lección 3
    const { data: materiales, error: materialesError } = await supabase
      .from('materiales')
      .select('id, titulo, url_archivo, tipo_material')
      .eq('leccion_id', leccion3.id);
    
    if (materialesError) {
      console.error('❌ Error obteniendo materiales:', materialesError);
      return;
    }
    
    console.log(`\n📋 Materiales de la lección 3: ${materiales.length}`);
    materiales.forEach((material, index) => {
      console.log(`\n${index + 1}. Material:`);
      console.log(`   ID: ${material.id}`);
      console.log(`   Título: ${material.titulo}`);
      console.log(`   URL: ${material.url_archivo}`);
      console.log(`   Tipo: ${material.tipo_material || 'No especificado'}`);
    });
    
    // Buscar si hay algún material MATRIX en la lección 3
    const matrixInLesson3 = materiales.filter(m => 
      m.titulo.toLowerCase().includes('matrix') || 
      m.url_archivo.toLowerCase().includes('matrix')
    );
    
    if (matrixInLesson3.length > 0) {
      console.log('\n🚨 MATERIALES MATRIX ENCONTRADOS EN LECCIÓN 3:');
      matrixInLesson3.forEach(material => {
        console.log(`   - ID: ${material.id}`);
        console.log(`     Título: ${material.titulo}`);
        console.log(`     URL: ${material.url_archivo}`);
      });
      
      console.log('\n🗑️ Estos materiales deben ser eliminados de la lección 3.');
    } else {
      console.log('\n✅ No se encontraron materiales MATRIX en la lección 3.');
    }
    
    // También verificar la lección 1 para asegurar que el material MATRIX esté allí
    const leccion1 = lecciones.find(l => l.orden === 1);
    if (leccion1) {
      const { data: materialesL1, error: errorL1 } = await supabase
        .from('materiales')
        .select('id, titulo, url_archivo')
        .eq('leccion_id', leccion1.id);
      
      if (!errorL1) {
        const matrixInLesson1 = materialesL1.filter(m => 
          m.titulo.toLowerCase().includes('matrix') || 
          m.url_archivo.toLowerCase().includes('matrix')
        );
        
        console.log(`\n📖 Lección 1: ${leccion1.titulo}`);
        console.log(`   Materiales MATRIX: ${matrixInLesson1.length}`);
        
        if (matrixInLesson1.length === 0) {
          console.log('\n⚠️ El material MATRIX no está asignado a la lección 1.');
          console.log('   Debería asignarse el material ID: 8f6424b2-61c5-4a58-900b-ce082601609d');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkLesson3Materials();