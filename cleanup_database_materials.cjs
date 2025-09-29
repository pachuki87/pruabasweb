require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDatabaseMaterials() {
  try {
    console.log('🧹 LIMPIEZA DE MATERIALES EN BASE DE DATOS');
    console.log('=' .repeat(50));
    
    // Obtener todos los materiales de la base de datos
    const { data: allMaterials, error: materialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('tipo_material', 'pdf')
      .order('titulo');
    
    if (materialsError) {
      console.error('❌ Error al obtener materiales:', materialsError);
      return;
    }
    
    console.log(`📊 Total de materiales en BD: ${allMaterials.length}`);
    console.log('');
    
    // Obtener lista de archivos físicos existentes
    const pdfsPath = path.join(process.cwd(), 'public', 'pdfs');
    const physicalFiles = [];
    
    // Función recursiva para obtener todos los archivos PDF
    function getFilesRecursively(dir, baseDir = '') {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const relativePath = path.join(baseDir, file).replace(/\\/g, '/');
        
        if (fs.statSync(fullPath).isDirectory()) {
          getFilesRecursively(fullPath, relativePath);
        } else if (file.endsWith('.pdf')) {
          physicalFiles.push(`/pdfs/${relativePath}`);
        }
      });
    }
    
    if (fs.existsSync(pdfsPath)) {
      getFilesRecursively(pdfsPath);
    }
    
    console.log(`📁 Archivos físicos encontrados: ${physicalFiles.length}`);
    physicalFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });
    console.log('');
    
    // Identificar materiales huérfanos (sin archivo físico)
    const orphanedMaterials = [];
    const validMaterials = [];
    
    allMaterials.forEach(material => {
      const materialPath = material.url_archivo;
      const fileExists = physicalFiles.some(physicalFile => {
        // Normalizar rutas para comparación
        const normalizedPhysical = physicalFile.toLowerCase().replace(/\\/g, '/');
        const normalizedMaterial = materialPath.toLowerCase().replace(/\\/g, '/');
        
        // Comparar nombre de archivo
        const physicalFileName = path.basename(normalizedPhysical);
        const materialFileName = path.basename(normalizedMaterial);
        
        return physicalFileName === materialFileName;
      });
      
      if (fileExists) {
        validMaterials.push(material);
      } else {
        orphanedMaterials.push(material);
      }
    });
    
    console.log('🔍 ANÁLISIS DE MATERIALES:');
    console.log(`   ✅ Materiales válidos (con archivo físico): ${validMaterials.length}`);
    console.log(`   ❌ Materiales huérfanos (sin archivo físico): ${orphanedMaterials.length}`);
    console.log('');
    
    if (orphanedMaterials.length > 0) {
      console.log('🗑️ MATERIALES A ELIMINAR:');
      orphanedMaterials.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.titulo}`);
        console.log(`      📂 Ruta: ${material.url_archivo}`);
        console.log(`      🆔 ID: ${material.id}`);
        console.log('');
      });
      
      // Confirmar eliminación
      console.log('⚠️  ¿Proceder con la eliminación? (Ejecutar manualmente)');
      console.log('   Para eliminar, descomenta las siguientes líneas:');
      console.log('');
      
      // Código comentado para eliminación manual
      console.log('/*');
      console.log('const idsToDelete = orphanedMaterials.map(m => m.id);');
      console.log('const { error: deleteError } = await supabase');
      console.log('  .from(\'materiales\')');
      console.log('  .delete()');
      console.log('  .in(\'id\', idsToDelete);');
      console.log('');
      console.log('if (deleteError) {');
      console.log('  console.error(\'❌ Error al eliminar:\', deleteError);');
      console.log('} else {');
      console.log('  console.log(\'✅ Materiales eliminados exitosamente\');');
      console.log('}');
      console.log('*/');
    } else {
      console.log('✅ No hay materiales huérfanos para eliminar.');
    }
    
    console.log('');
    console.log('📋 RESUMEN:');
    console.log(`   📊 Total materiales en BD: ${allMaterials.length}`);
    console.log(`   📁 Archivos físicos: ${physicalFiles.length}`);
    console.log(`   ✅ Materiales válidos: ${validMaterials.length}`);
    console.log(`   ❌ Materiales huérfanos: ${orphanedMaterials.length}`);
    
  } catch (error) {
    console.error('❌ Error en la limpieza:', error);
  }
}

cleanupDatabaseMaterials();