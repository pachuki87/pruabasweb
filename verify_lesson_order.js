import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';
const supabase = createClient(supabaseUrl, supabaseKey);

const cursoId = 'b5ef8c64-fe26-4f20-8221-80a1bf475b05';

async function verifyLessonOrder() {
  console.log('🔍 Verificando el orden de las lecciones...');

  const { data: lecciones, error } = await supabase
    .from('lecciones')
    .select('titulo, orden')
    .eq('curso_id', cursoId)
    .order('orden', { ascending: true });

  if (error) {
    console.error('❌ Error al verificar el orden de las lecciones:', error);
    return;
  }

  if (!lecciones || lecciones.length === 0) {
    console.log('No se encontraron lecciones para este curso.');
    return;
  }

  console.log('\n=== ORDEN ACTUAL DE LECCIONES ===');
  lecciones.forEach(leccion => {
    console.log(`${leccion.orden}) ${leccion.titulo}`);
  });

  console.log('\n✅ Verificación de orden completada.');
}

verifyLessonOrder();