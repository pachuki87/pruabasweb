require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function assignMaterialsToLessons() {
  try {
    console.log('🔧 Asignando materiales a lecciones correspondientes...');
    
    // Mapeo de materiales a lecciones basado en los títulos
    const assignments = [
      {
        materialTitle: 'Bloque 3: Familia y Trabajo en Equipo',
        lessonTitle: 'FAMILIA Y TRABAJO EQUIPO',
        lessonId: 'f86d4f76-90c9-42aa-91c1-7e8fca2dfcb0'
      },
      {
        materialTitle: 'Recovery Coach',
        lessonTitle: 'RECOVERY COACHING',
        lessonId: 'a0d939f6-8774-49b7-9a72-cb126a3afaa3'
      },
      {
        materialTitle: 'Intervención Familiar en Adicciones y Recovery Mentoring',
        lessonTitle: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
        lessonId: 'a2ea5c33-f0bf-4aba-b823-d5dabc825511'
      },
      {
        materialTitle: 'Terapias de Tercera Generación',
        lessonTitle: 'NUEVOS MODELOS TERAPEUTICOS',
        lessonId: '0b2dde26-092c-44a3-8694-875af52d7805'
      },
      {
        materialTitle: 'Cuaderno de Ejercicios: Inteligencia Emocional',
        lessonTitle: 'INTELIGENCIA EMOCIONAL',
        lessonId: '5d9a7bb3-b059-406e-9940-08c3a81d475c'
      }
    ];
    
    for (const assignment of assignments) {
      console.log(`\n📝 Asignando "${assignment.materialTitle}" a lección "${assignment.lessonTitle}"...`);
      
      // Buscar el material por título
      const { data: materials, error: findError } = await supabase
        .from('materiales')
        .select('id')
        .eq('titulo', assignment.materialTitle)
        .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05');
      
      if (findError) {
        console.error(`❌ Error buscando material "${assignment.materialTitle}":`, findError);
        continue;
      }
      
      if (!materials || materials.length === 0) {
        console.error(`❌ Material "${assignment.materialTitle}" no encontrado`);
        continue;
      }
      
      // Actualizar el material para asignarlo a la lección
      const { error: updateError } = await supabase
        .from('materiales')
        .update({ leccion_id: assignment.lessonId })
        .eq('id', materials[0].id);
      
      if (updateError) {
        console.error(`❌ Error asignando material "${assignment.materialTitle}":`, updateError);
      } else {
        console.log(`✅ Material "${assignment.materialTitle}" asignado correctamente`);
      }
    }
    
    console.log('\n🎉 Proceso de asignación completado');
    
    // Verificar el resultado
    console.log('\n🔍 Verificando asignaciones...');
    for (const assignment of assignments) {
      const { data: materials, error } = await supabase
        .from('materiales')
        .select('titulo')
        .eq('leccion_id', assignment.lessonId);
      
      if (!error && materials) {
        console.log(`📖 Lección "${assignment.lessonTitle}": ${materials.length} material(es)`);
        materials.forEach(material => {
          console.log(`   - ${material.titulo}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

assignMaterialsToLessons();