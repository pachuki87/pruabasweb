import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function verifyMigration() {
  console.log('🔍 Verificando migración de contenido...');
  
  // Obtener algunas lecciones para verificar
  const { data: lecciones, error } = await supabase
    .from('lecciones')
    .select('id, titulo, orden, archivo_url, contenido_html')
    .limit(10);
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log('\n📊 Estado de la migración:');
  
  let migradas = 0;
  let conContenido = 0;
  
  lecciones.forEach(leccion => {
    const tieneUrl = leccion.archivo_url ? '✅' : '❌';
    const tieneContenido = leccion.contenido_html ? '⚠️' : '✅';
    
    console.log(`${tieneUrl} Lección ${leccion.orden}: ${leccion.titulo}`);
    console.log(`   URL: ${leccion.archivo_url || 'NO ASIGNADA'}`);
    console.log(`   Contenido HTML: ${leccion.contenido_html ? 'PRESENTE (debería estar limpio)' : 'LIMPIADO ✅'}`);
    console.log('');
    
    if (leccion.archivo_url) migradas++;
    if (leccion.contenido_html) conContenido++;
  });
  
  console.log('📈 Resumen:');
  console.log(`   - Lecciones con URL asignada: ${migradas}/${lecciones.length}`);
  console.log(`   - Lecciones con contenido HTML limpiado: ${lecciones.length - conContenido}/${lecciones.length}`);
  
  if (migradas === lecciones.length && conContenido === 0) {
    console.log('\n✅ Migración completada exitosamente!');
  } else {
    console.log('\n⚠️  La migración necesita revisión.');
  }
}

verifyMigration().catch(console.error);