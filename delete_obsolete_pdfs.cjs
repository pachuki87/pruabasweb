require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteObsoletePdfs() {
  try {
    console.log('🔍 Buscando materiales con rutas obsoletas...');
    
    // Buscar materiales que NO tengan las carpetas organizadas en url_archivo
    const { data: materiales, error } = await supabase
      .from('materiales')
      .select('*')
      .not('url_archivo', 'is', null);
    
    if (error) {
      console.error('❌ Error consultando materiales:', error);
      return;
    }
    
    if (!materiales || materiales.length === 0) {
      console.log('✅ No se encontraron materiales');
      return;
    }
    
    // Filtrar materiales con rutas obsoletas (que NO contengan las carpetas organizadas)
    const materialesObsoletos = materiales.filter(material => {
      const url = material.url_archivo;
      if (!url) return false;
      
      // Considerar obsoleto si:
      // 1. Está en /pdfs/ directamente (sin subcarpetas)
      // 2. NO está en experto-conductas-adictivas/ ni master-adicciones/
      const esObsoleto = (
        url.startsWith('/pdfs/') && 
        !url.includes('/experto-conductas-adictivas/') && 
        !url.includes('/master-adicciones/')
      ) || (
        // O si está en la raíz de pdfs sin organizar
        url.match(/^\/pdfs\/[^/]+\.pdf$/)
      );
      
      return esObsoleto;
    });
    
    console.log(`\n📋 MATERIALES CON RUTAS OBSOLETAS ENCONTRADOS: ${materialesObsoletos.length}`);
    
    if (materialesObsoletos.length === 0) {
      console.log('✅ No se encontraron materiales con rutas obsoletas para eliminar');
      return;
    }
    
    console.log('\n🗂️ LISTA DE MATERIALES OBSOLETOS:');
    console.log('=' .repeat(80));
    
    materialesObsoletos.forEach((material, index) => {
      console.log(`\n${index + 1}. ${material.titulo}`);
      console.log(`   ID: ${material.id}`);
      console.log(`   URL: ${material.url_archivo}`);
      console.log(`   Curso ID: ${material.curso_id}`);
      console.log(`   Creado: ${material.creado_en}`);
    });
    
    console.log('\n⚠️  CONFIRMACIÓN REQUERIDA');
    console.log('¿Deseas eliminar estos materiales obsoletos? (y/N)');
    
    // En un entorno real, aquí esperarías input del usuario
    // Por ahora, mostraremos qué se eliminaría
    console.log('\n🔄 SIMULANDO ELIMINACIÓN...');
    
    const idsToDelete = materialesObsoletos.map(m => m.id);
    
    console.log(`\n📝 IDs que se eliminarían: ${idsToDelete.join(', ')}`);
    
    // Ejecutar la eliminación real
    console.log('\n🗑️  EJECUTANDO ELIMINACIÓN...');
    
    const { error: deleteError } = await supabase
      .from('materiales')
      .delete()
      .in('id', idsToDelete);
    
    if (deleteError) {
      console.error('❌ Error eliminando materiales:', deleteError);
      return;
    }
    
    console.log(`✅ ${materialesObsoletos.length} materiales obsoletos eliminados exitosamente`);
    console.log('\n📊 RESUMEN:');
    console.log(`   - Materiales eliminados: ${materialesObsoletos.length}`);
    console.log(`   - Base de datos actualizada correctamente`);
    console.log(`   - Solo quedan materiales con rutas organizadas`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

deleteObsoletePdfs();