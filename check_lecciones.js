import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CURSO_INTELIGENCIA_ID = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

async function verificarLecciones() {
  console.log('Verificando lecciones del curso de Inteligencia Emocional...');
  
  try {
    // Obtener lecciones del curso
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', CURSO_INTELIGENCIA_ID)
      .order('orden');
    
    if (leccionesError) {
      console.error('Error al obtener lecciones:', leccionesError);
      return;
    }
    
    console.log(`\n=== LECCIONES DEL CURSO (${lecciones.length} total) ===`);
    
    for (const leccion of lecciones) {
      console.log(`${leccion.orden}. ${leccion.titulo}`);
      console.log(`   ID: ${leccion.id}`);
      console.log(`   Descripción: ${leccion.descripcion?.substring(0, 80)}...`);
      
      // Obtener materiales de esta lección
      const { data: materiales, error: materialesError } = await supabase
        .from('materiales')
        .select('*')
        .eq('leccion_id', leccion.id);
      
      if (materialesError) {
        console.error(`   Error al obtener materiales: ${materialesError.message}`);
      } else {
        console.log(`   Materiales: ${materiales.length}`);
        materiales.forEach(material => {
          console.log(`     - ${material.titulo} (${material.tipo_material})`);
        });
      }
      console.log('');
    }
    
    // Resumen final
    const totalMateriales = await supabase
      .from('materiales')
      .select('id', { count: 'exact' })
      .in('leccion_id', lecciones.map(l => l.id));
    
    console.log('=== RESUMEN ===');
    console.log(`Total de lecciones: ${lecciones.length}`);
    console.log(`Total de materiales: ${totalMateriales.count}`);
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

verificarLecciones();