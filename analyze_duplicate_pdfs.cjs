require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeDuplicatePDFs() {
  try {
    console.log('🔍 Analizando PDFs duplicados en la base de datos...');
    
    // Obtener todos los materiales
    const { data: materiales, error } = await supabase
      .from('materiales')
      .select('*')
      .order('titulo');
    
    if (error) {
      console.error('❌ Error al obtener materiales:', error);
      return;
    }
    
    console.log(`\n📊 Total de materiales: ${materiales.length}`);
    
    // Separar por tipo de ruta
    const rutasAntiguas = materiales.filter(m => m.url_archivo && m.url_archivo.startsWith('/pdfs/'));
    const rutasNuevas = materiales.filter(m => m.url_archivo && (
      m.url_archivo.startsWith('/pdfs/experto-conductas-adictivas/') ||
      m.url_archivo.startsWith('/pdfs/master-adicciones/')
    ));
    const otrasRutas = materiales.filter(m => m.url_archivo && 
      !m.url_archivo.startsWith('/pdfs/experto-conductas-adictivas/') &&
      !m.url_archivo.startsWith('/pdfs/master-adicciones/') &&
      !m.url_archivo.startsWith('/pdfs/')
    );
    
    console.log(`\n📁 RUTAS ANTIGUAS (pdfs/): ${rutasAntiguas.length}`);
    rutasAntiguas.forEach(m => {
      console.log(`  - ${m.titulo} (ID: ${m.id})`);
      console.log(`    Ruta: ${m.url_archivo}`);
      console.log(`    Curso: ${m.curso_id}`);
    });
    
    console.log(`\n📂 RUTAS NUEVAS ORGANIZADAS: ${rutasNuevas.length}`);
    rutasNuevas.forEach(m => {
      console.log(`  - ${m.titulo} (ID: ${m.id})`);
      console.log(`    Ruta: ${m.url_archivo}`);
      console.log(`    Curso: ${m.curso_id}`);
    });
    
    if (otrasRutas.length > 0) {
      console.log(`\n❓ OTRAS RUTAS: ${otrasRutas.length}`);
      otrasRutas.forEach(m => {
        console.log(`  - ${m.titulo} (ID: ${m.id})`);
        console.log(`    Ruta: ${m.url_archivo}`);
        console.log(`    Curso: ${m.curso_id}`);
      });
    }
    
    // Buscar posibles duplicados por título
    console.log('\n🔍 Buscando duplicados por título...');
    const titulosMap = new Map();
    
    materiales.forEach(m => {
      const titulo = m.titulo.toLowerCase().trim();
      if (!titulosMap.has(titulo)) {
        titulosMap.set(titulo, []);
      }
      titulosMap.get(titulo).push(m);
    });
    
    const duplicados = Array.from(titulosMap.entries())
      .filter(([titulo, items]) => items.length > 1);
    
    if (duplicados.length > 0) {
      console.log(`\n⚠️  DUPLICADOS ENCONTRADOS: ${duplicados.length} títulos`);
      duplicados.forEach(([titulo, items]) => {
        console.log(`\n📄 "${titulo}" (${items.length} copias):`);
        items.forEach(item => {
          console.log(`  - ID: ${item.id} | Curso: ${item.curso_id} | Ruta: ${item.url_archivo}`);
        });
      });
    }
    
    console.log('\n✅ Análisis completado');
    
  } catch (error) {
    console.error('❌ Error durante el análisis:', error);
  }
}

analyzeDuplicatePDFs();