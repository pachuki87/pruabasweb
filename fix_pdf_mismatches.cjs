require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mapeo de archivos que existen físicamente
const physicalFiles = [
  '/pdfs/experto-conductas-adictivas/2-Guia-IF-Especializados-2014.pdf',
  '/pdfs/experto-conductas-adictivas/informe-educacion-emocional-conductas-adictivas.pdf',
  '/pdfs/experto-conductas-adictivas/Informe-Educación-emocional-para-las-conductas-adictivas.pdf',
  '/pdfs/experto-conductas-adictivas/La ventana de johari.pdf',
  '/pdfs/experto-conductas-adictivas/NIÑO INTERIOR .pdf',
  '/pdfs/experto-conductas-adictivas/PSICOTERAPIA PPT.pdf',
  '/pdfs/experto-conductas-adictivas/seminario-enero-manejo-del-estres-y-ansiedad.pdf',
  '/pdfs/experto-conductas-adictivas/TECNICAS COMUNICATIVAS DEF.pdf',
  '/pdfs/master-adicciones/BLOQUE 1 TECNICO EN ADICIONES.pdf',
  'http://localhost:5173/pdfs/master-adicciones/BLOQUE-2-TECNICO-EN-ADICCIONES.pdf',
  '/pdfs/master-adicciones/BLOQUE III - FAMILIA Y TRABAJO EN EQUIPO.pdf',
  '/pdfs/master-adicciones/BLOQUE-1-TECNICO-EN-ADICCIONES.pdf',
  '/pdfs/master-adicciones/bloque-2-tecnico-adicciones.pdf',
  '/pdfs/master-adicciones/Cuaderno-de-ejercicios-de-inteligencia-emocional.pdf',
  '/pdfs/master-adicciones/intervencion-Familiar-en-Adicciones-y.-Recovery-Mentoring-1.pdf',
  '/pdfs/master-adicciones/PPT INTELIGENCIA EMOCIONAL.pdf',
  '/pdfs/master-adicciones/Recovery Coach reinservida.pdf',
  '/pdfs/master-adicciones/TERAPIAS TERCERA GENERACIÓN MASTER DEFINITIVO.pdf'
];

// Correcciones específicas para archivos que no coinciden
const corrections = {
  '/pdfs/master-adicciones/Manual-MATRIX-para-Terapeutas.pdf': '/pdfs/master-adicciones/PPT INTELIGENCIA EMOCIONAL.pdf',
  '/pdfs/master-adicciones/Bloque-1-Tecnico-en-Adicciones.pdf': '/pdfs/master-adicciones/BLOQUE 1 TECNICO EN ADICIONES.pdf',
  '/pdfs/master-adicciones/BLOQUE-1-TECNICO-EN-ADICCIONES.pdf': '/pdfs/master-adicciones/BLOQUE 1 TECNICO EN ADICIONES.pdf', // Este existe
  '/pdfs/master-adicciones/bloque-2-tecnico-adicciones.pdf': '/pdfs/master-adicciones/bloque-2-tecnico-adicciones.pdf' // Este existe
};

async function fixPdfMismatches() {
  try {
    // Obtener todos los materiales de la BD
    const { data: materials, error } = await supabase
      .from('materiales')
      .select('id, titulo, url_archivo')
      .order('id');

    if (error) {
      console.error('Error obteniendo materiales:', error);
      return;
    }

    console.log('=== VERIFICANDO Y CORRIGIENDO RUTAS DE PDFs ===\n');

    for (const material of materials) {
      const currentUrl = material.url_archivo;
      
      // Verificar si el archivo existe físicamente
      const physicalPath = path.join('public', currentUrl.replace('/pdfs/', 'pdfs/'));
      const fileExists = fs.existsSync(physicalPath);
      
      console.log(`ID: ${material.id}`);
      console.log(`Título: ${material.titulo}`);
      console.log(`URL actual: ${currentUrl}`);
      console.log(`Archivo existe: ${fileExists ? 'SÍ' : 'NO'}`);
      
      if (!fileExists) {
        // Buscar corrección en el mapeo
        if (corrections[currentUrl]) {
          const newUrl = corrections[currentUrl];
          console.log(`🔧 Corrigiendo a: ${newUrl}`);
          
          const { error: updateError } = await supabase
            .from('materiales')
            .update({ url_archivo: newUrl })
            .eq('id', material.id);
            
          if (updateError) {
            console.error('❌ Error actualizando:', updateError);
          } else {
            console.log('✅ Actualizado correctamente');
          }
        } else {
          console.log('⚠️  No se encontró corrección automática');
        }
      } else {
        console.log('✅ Archivo correcto');
      }
      
      console.log('---\n');
    }
    
    console.log('=== VERIFICACIÓN COMPLETADA ===');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixPdfMismatches();