require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixMaterialPaths() {
  try {
    console.log('🔧 Corrigiendo rutas de materiales...');
    
    // Obtener todos los materiales
    const { data: materiales, error } = await supabase
      .from('materiales')
      .select('*');
    
    if (error) {
      console.error('❌ Error al obtener materiales:', error);
      return;
    }
    
    console.log(`📊 Total de materiales encontrados: ${materiales.length}`);
    
    // Mapeo de archivos que deben estar en master-adicciones
    const masterFiles = [
      'BLOQUE 1 TECNICO EN ADICIONES.pdf',
      'BLOQUE 2 TÉCNICO EN ADICCIONES.pdf', 
      'BLOQUE III - FAMILIA Y TRABAJO EN EQUIPO.pdf',
      'BLOQUE-1-TECNICO-EN-ADICCIONES.pdf',
      'bloque-2-tecnico-adicciones.pdf',
      'Cuaderno-de-ejercicios-de-inteligencia-emocional.pdf',
      'intervencion-Familiar-en-Adicciones-y.-Recovery-Mentoring-1.pdf',
      'Manual-MATRIX-para-Terapeutas.pdf',
      'PPT INTELIGENCIA EMOCIONAL.pdf',
      'Recovery Coach reinservida.pdf',
      'TERAPIAS TERCERA GENERACIÓN MASTER DEFINITIVO.pdf'
    ];
    
    let updatedCount = 0;
    
    for (const material of materiales) {
      let newUrl = material.url_archivo;
      let shouldUpdate = false;
      
      // Verificar si el archivo debería estar en master-adicciones
      for (const fileName of masterFiles) {
        if (material.url_archivo.includes(fileName)) {
          // Si no está ya en la ruta correcta, corregirla
          if (!material.url_archivo.includes('/pdfs/master-adicciones/')) {
            newUrl = `/pdfs/master-adicciones/${fileName}`;
            shouldUpdate = true;
            break;
          }
        }
      }
      
      if (shouldUpdate) {
        console.log(`🔄 Actualizando: ${material.titulo}`);
        console.log(`   Desde: ${material.url_archivo}`);
        console.log(`   Hacia: ${newUrl}`);
        
        const { error: updateError } = await supabase
          .from('materiales')
          .update({ url_archivo: newUrl })
          .eq('id', material.id);
        
        if (updateError) {
          console.error(`❌ Error actualizando ${material.titulo}:`, updateError);
        } else {
          updatedCount++;
          console.log(`✅ Actualizado correctamente`);
        }
      }
    }
    
    console.log(`\n📈 Resumen:`);
    console.log(`   Materiales actualizados: ${updatedCount}`);
    console.log(`   Total de materiales: ${materiales.length}`);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

fixMaterialPaths();