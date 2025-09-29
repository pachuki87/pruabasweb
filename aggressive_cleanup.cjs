require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function aggressiveCleanup() {
  try {
    console.log('🧹 LIMPIEZA AGRESIVA DE BASE DE DATOS');
    console.log('=' .repeat(50));
    
    // Obtener archivos físicos existentes
    const pdfsPath = path.join(process.cwd(), 'public', 'pdfs');
    const physicalFiles = [];
    
    function getFilesRecursively(dir, baseDir = '') {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const relativePath = path.join(baseDir, file).replace(/\\/g, '/');
        
        if (fs.statSync(fullPath).isDirectory()) {
          getFilesRecursively(fullPath, relativePath);
        } else if (file.endsWith('.pdf')) {
          physicalFiles.push({
            fileName: file,
            fullPath: `/pdfs/${relativePath}`,
            normalizedName: file.toLowerCase().replace(/[^a-z0-9.]/g, '')
          });
        }
      });
    }
    
    if (fs.existsSync(pdfsPath)) {
      getFilesRecursively(pdfsPath);
    }
    
    console.log(`📁 Archivos físicos encontrados: ${physicalFiles.length}`);
    physicalFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file.fullPath}`);
    });
    console.log('');
    
    // Obtener todos los materiales
    const { data: allMaterials, error: materialsError } = await supabase
      .from('materiales')
      .select('*')
      .eq('tipo_material', 'pdf')
      .order('titulo');
    
    if (materialsError) {
      console.error('❌ Error al obtener materiales:', materialsError);
      return;
    }
    
    console.log(`📊 Total materiales en BD: ${allMaterials.length}`);
    console.log('');
    
    // Crear mapa de materiales válidos (uno por archivo físico)
    const validMaterialsMap = new Map();
    const materialsToDelete = [];
    
    allMaterials.forEach(material => {
      const materialFileName = path.basename(material.url_archivo);
      const normalizedMaterialName = materialFileName.toLowerCase().replace(/[^a-z0-9.]/g, '');
      
      // Buscar archivo físico correspondiente
      const matchingFile = physicalFiles.find(file => 
        file.normalizedName === normalizedMaterialName
      );
      
      if (matchingFile) {
        // Si ya tenemos un material para este archivo, marcar el duplicado para eliminación
        if (validMaterialsMap.has(matchingFile.fileName)) {
          materialsToDelete.push(material);
          console.log(`🔄 Duplicado encontrado: ${material.titulo} (${material.id})`);
        } else {
          // Verificar si la ruta es correcta
          if (material.url_archivo === matchingFile.fullPath) {
            validMaterialsMap.set(matchingFile.fileName, material);
            console.log(`✅ Material válido: ${material.titulo}`);
          } else {
            // Ruta incorrecta, pero archivo existe - actualizar después
            validMaterialsMap.set(matchingFile.fileName, {
              ...material,
              needsPathUpdate: true,
              correctPath: matchingFile.fullPath
            });
            console.log(`🔧 Necesita actualización de ruta: ${material.titulo}`);
          }
        }
      } else {
        // No hay archivo físico correspondiente
        materialsToDelete.push(material);
        console.log(`❌ Sin archivo físico: ${material.titulo} (${material.url_archivo})`);
      }
    });
    
    console.log('');
    console.log('📊 RESUMEN DEL ANÁLISIS:');
    console.log(`   ✅ Materiales válidos únicos: ${validMaterialsMap.size}`);
    console.log(`   🗑️ Materiales a eliminar: ${materialsToDelete.length}`);
    console.log('');
    
    if (materialsToDelete.length > 0) {
      console.log('🗑️ ELIMINANDO MATERIALES DUPLICADOS Y HUÉRFANOS...');
      
      const idsToDelete = materialsToDelete.map(m => m.id);
      
      const { error: deleteError } = await supabase
        .from('materiales')
        .delete()
        .in('id', idsToDelete);
      
      if (deleteError) {
        console.error('❌ Error al eliminar materiales:', deleteError);
        return;
      }
      
      console.log(`✅ ${materialsToDelete.length} materiales eliminados exitosamente`);
    }
    
    // Actualizar rutas incorrectas
    const materialsToUpdate = Array.from(validMaterialsMap.values())
      .filter(material => material.needsPathUpdate);
    
    if (materialsToUpdate.length > 0) {
      console.log('');
      console.log('🔧 ACTUALIZANDO RUTAS INCORRECTAS...');
      
      for (const material of materialsToUpdate) {
        const { error: updateError } = await supabase
          .from('materiales')
          .update({ url_archivo: material.correctPath })
          .eq('id', material.id);
        
        if (updateError) {
          console.error(`❌ Error al actualizar ${material.titulo}:`, updateError);
        } else {
          console.log(`✅ Actualizado: ${material.titulo} -> ${material.correctPath}`);
        }
      }
    }
    
    // Verificación final
    const { data: finalMaterials, error: finalError } = await supabase
      .from('materiales')
      .select('id')
      .eq('tipo_material', 'pdf');
    
    if (finalError) {
      console.error('❌ Error en verificación final:', finalError);
      return;
    }
    
    console.log('');
    console.log('🎉 LIMPIEZA COMPLETADA');
    console.log('=' .repeat(30));
    console.log(`📁 Archivos físicos: ${physicalFiles.length}`);
    console.log(`📋 Materiales en BD: ${finalMaterials.length}`);
    console.log(`🗑️ Materiales eliminados: ${materialsToDelete.length}`);
    console.log(`🔧 Rutas actualizadas: ${materialsToUpdate.length}`);
    
  } catch (error) {
    console.error('❌ Error en limpieza agresiva:', error);
  }
}

aggressiveCleanup();