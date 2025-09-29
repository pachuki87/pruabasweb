const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function addLesson9Materials() {
  try {
    console.log('🔍 Buscando la lección 9...');
    
    // Buscar la lección 9 "Nuevos Modelos Terapéuticos"
    const { data: lessons, error: lessonError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('orden', 9);
    
    if (lessonError) {
      console.error('❌ Error buscando lecciones con orden 9:', lessonError);
      return;
    }
    
    console.log('📋 Lecciones encontradas con orden 9:', lessons.length);
    lessons.forEach((l, i) => {
      console.log(`${i + 1}. ${l.titulo} (ID: ${l.id})`);
    });
    
    // Buscar específicamente "Nuevas terapias psicológicas"
    const lesson = lessons.find(l => 
      l.titulo.toLowerCase().includes('nuevas terapias') || 
      l.titulo.toLowerCase().includes('terapeuticos') ||
      l.titulo.toLowerCase().includes('psicológicas')
    );
    

    
    if (!lesson) {
      console.log('❌ No se encontró la lección 9');
      return;
    }
    
    console.log('✅ Lección 9 encontrada:', lesson.titulo);
    console.log('📋 ID de la lección:', lesson.id);
    
    // Verificar estructura de la tabla materiales
    console.log('\n🔍 Verificando estructura de la tabla materiales...');
    const { data: existingMaterials, error: materialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lesson.id)
      .limit(1);
    
    if (materialsError) {
      console.error('❌ Error verificando materiales:', materialsError);
      return;
    }
    
    console.log('📄 Materiales existentes para la lección 9:', existingMaterials?.length || 0);
    if (existingMaterials && existingMaterials.length > 0) {
      console.log('📋 Estructura de material existente:', Object.keys(existingMaterials[0]));
    }
    
    // Definir los nuevos materiales a agregar
    const newMaterials = [
      {
        leccion_id: lesson.id,
        titulo: 'Terapias de Tercera Generación',
        descripcion: 'Enfoques innovadores en tratamiento',
        tipo_material: 'pdf',
        url_archivo: '/pdfs/master-adicciones/TERAPIAS TERCERA GENERACIÓN MASTER DEFINITIVO.pdf'
      },
      {
        leccion_id: lesson.id,
        titulo: 'La Ventana de Johari',
        descripcion: 'Herramienta para autoconocimiento y relaciones',
        tipo_material: 'pdf',
        url_archivo: '/pdfs/master-adicciones/La ventana de johari.pdf'
      },
      {
        leccion_id: lesson.id,
        titulo: 'Psicoterapia Contemporánea',
        descripcion: 'Presentación de enfoques modernos',
        tipo_material: 'pdf',
        url_archivo: '/pdfs/master-adicciones/PSICOTERAPIA PPT.pdf'
      },
      {
        leccion_id: lesson.id,
        titulo: 'Manejo del Estrés y Ansiedad',
        descripcion: 'Técnicas prácticas para regulación emocional',
        tipo_material: 'pdf',
        url_archivo: '/pdfs/master-adicciones/seminario-enero-manejo-del-estres-y-ansiedad.pdf'
      },
      {
        leccion_id: lesson.id,
        titulo: 'Taller de Psicología Positiva',
        descripcion: 'Presentación interactiva sobre bienestar',
        tipo_material: 'pdf',
        url_archivo: '/pdfs/master-adicciones/TALLER PSICOLOGIA POSITIVA.pptx'
      },
      {
        leccion_id: lesson.id,
        titulo: 'El Cambio - Wayne Dyer',
        descripcion: 'Presentación sobre transformación personal',
        tipo_material: 'pdf',
        url_archivo: '/pdfs/master-adicciones/PRESENTACION EL CAMBIO DE WYNE DIYER.pdf'
      },
      {
        leccion_id: lesson.id,
        titulo: 'Video: El Cambio',
        descripcion: 'Trailer motivacional sobre transformación personal',
        tipo_material: 'video',
        url_archivo: '/pdfs/master-adicciones/EL CAMBIO (trailer en castellano) copia.mp4'
      }
    ];
    
    console.log('\n📝 Agregando', newMaterials.length, 'nuevos materiales...');
    
    // Insertar los nuevos materiales
    const { data: insertedMaterials, error: insertError } = await supabase
      .from('materiales')
      .insert(newMaterials)
      .select();
    
    if (insertError) {
      console.error('❌ Error insertando materiales:', insertError);
      return;
    }
    
    console.log('✅ Materiales agregados exitosamente:', insertedMaterials.length);
    
    // Verificar los materiales agregados
    console.log('\n🔍 Verificando materiales agregados...');
    const { data: allMaterials, error: verifyError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lesson.id);
    
    if (verifyError) {
      console.error('❌ Error verificando materiales:', verifyError);
      return;
    }
    
    console.log('📋 Total de materiales para la lección 9:', allMaterials.length);
    allMaterials.forEach((material, index) => {
      console.log(`${index + 1}. ${material.titulo} (${material.tipo_material})`);
    });
    
    console.log('\n🎉 ¡Proceso completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

addLesson9Materials();