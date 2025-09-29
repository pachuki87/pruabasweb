const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function addLesson7Materials() {
  try {
    console.log('🔍 Buscando la lección 7...');
    
    // Buscar las lecciones con orden 7
    const { data: lessons, error: lessonError } = await supabase
      .from('lecciones')
      .select('id, titulo, curso_id')
      .eq('orden', 7);
    
    if (lessonError) {
      console.error('❌ Error al buscar lecciones con orden 7:', lessonError);
      return;
    }
    
    console.log(`📋 Encontradas ${lessons.length} lecciones con orden 7:`);
    lessons.forEach((l, index) => {
      console.log(`${index + 1}. ${l.titulo} (ID: ${l.id}, Curso: ${l.curso_id})`);
    });
    
    // Usar la primera lección encontrada
    const lesson = lessons[0];
    
    if (!lesson) {
      console.error('❌ No se encontraron lecciones con orden 7');
      return;
    }
    
    console.log(`✅ Lección 7 encontrada: ${lesson.titulo} (ID: ${lesson.id})`);
    
    // Materiales a agregar
    const materialsToAdd = [
      {
        titulo: 'Terapias de Tercera Generación',
        descripcion: 'Enfoques innovadores en tratamiento',
        url: '/pdfs/master-adicciones/TERAPIAS TERCERA GENERACIÓN MASTER DEFINITIVO.pdf',
        tipo: 'pdf'
      },
      {
        titulo: 'La Ventana de Johari',
        descripcion: 'Herramienta para autoconocimiento y relaciones',
        url: '/pdfs/master-adicciones/La ventana de johari.pdf',
        tipo: 'pdf'
      },
      {
        titulo: 'Psicoterapia Contemporánea',
        descripcion: 'Presentación de enfoques modernos',
        url: '/pdfs/master-adicciones/PSICOTERAPIA PPT.pdf',
        tipo: 'pdf'
      },
      {
        titulo: 'Manejo del Estrés y Ansiedad',
        descripcion: 'Técnicas prácticas para regulación emocional',
        url: '/pdfs/master-adicciones/seminario-enero-manejo-del-estres-y-ansiedad.pdf',
        tipo: 'pdf'
      },
      {
        titulo: 'Taller de Psicología Positiva',
        descripcion: 'Presentación interactiva sobre bienestar',
        url: '/pdfs/master-adicciones/TALLER PSICOLOGIA POSITIVA.pptx',
        tipo: 'presentacion'
      },
      {
        titulo: 'El Cambio - Wayne Dyer',
        descripcion: 'Presentación sobre transformación personal',
        url: '/pdfs/master-adicciones/PRESENTACION EL CAMBIO DE WYNE DIYER.pdf',
        tipo: 'pdf'
      },
      {
        titulo: 'Video: El Cambio',
        descripcion: 'Trailer motivacional sobre transformación personal',
        url: '/pdfs/master-adicciones/EL CAMBIO (trailer en castellano) copia.mp4',
        tipo: 'video'
      }
    ];
    
    console.log(`📚 Agregando ${materialsToAdd.length} materiales a la lección 7...`);
    
    // Insertar cada material
    for (let i = 0; i < materialsToAdd.length; i++) {
      const material = materialsToAdd[i];
      
      const { data, error } = await supabase
        .from('materiales')
        .insert({
          leccion_id: lesson.id,
          titulo: material.titulo,
          descripcion: material.descripcion,
          url_archivo: material.url,
          tipo_material: material.tipo
        })
        .select();
      
      if (error) {
        console.error(`❌ Error al insertar material "${material.titulo}":`, error);
      } else {
        console.log(`✅ Material agregado: ${material.titulo}`);
      }
    }
    
    // Verificar todos los materiales de la lección 7
    console.log('\n🔍 Verificando todos los materiales de la lección 7...');
    const { data: allMaterials, error: materialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lesson.id)
      .order('creado_en', { ascending: true });
    
    if (materialsError) {
      console.error('❌ Error al verificar materiales:', materialsError);
    } else {
      console.log(`\n📋 Total de materiales en la lección 7: ${allMaterials.length}`);
      allMaterials.forEach((material, index) => {
        console.log(`${index + 1}. ${material.titulo} (${material.tipo_material})`);
        console.log(`   URL: ${material.url_archivo}`);
        console.log(`   Descripción: ${material.descripcion}`);
        console.log('');
      });
    }
    
    console.log('\n🎉 ¡Proceso completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

addLesson7Materials();