const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

// IDs de los materiales a eliminar (basado en el análisis anterior)
const materialsToRemove = [
  '1d6dca97-3829-4fbd-99ef-179b461a3299', // La Entrevista en Psicología de las Adicciones
  '5838036e-0b8e-4c1b-b96e-989ca3ee85b7', // IV Encuentro Género y Drogas - Patricia Martínez Redondo
  'dc8295a9-90f8-4b72-8846-2bbd96949f03', // Wilson - Terapia de Aceptación y Compromiso
  'f8ee0c5b-49b6-4b59-8ed8-e7830703c816', // Guía Práctica del Trabajo Final de Máster (duplicado)
  'af6eb09c-fdfc-4b02-859f-7b0e1ab3d0eb', // Bloque 1: Técnico en Adicciones
  '96b2350c-518e-4d3f-84aa-1849121e8a7b'  // Protocolo de Inclusión de Género en Prevención de Adicciones
];

// ID del material a mantener
const materialToKeep = '5a55fcfd-cceb-4e4b-8f5f-cab214372305'; // GUIA PRACTICA TFM

async function cleanFinalLessonMaterials() {
  try {
    console.log('🧹 Iniciando limpieza de materiales del módulo final...');
    
    // Primero, verificar que el material a mantener existe
    console.log('\n✅ Verificando material a mantener...');
    const { data: keepMaterial, error: keepError } = await supabase
      .from('materiales')
      .select('*')
      .eq('id', materialToKeep)
      .single();
    
    if (keepError) {
      console.error('❌ Error al verificar material a mantener:', keepError);
      return;
    }
    
    console.log(`✅ Material a mantener confirmado: "${keepMaterial.titulo}" (ID: ${keepMaterial.id})`);
    
    // Verificar materiales a eliminar
    console.log('\n🔍 Verificando materiales a eliminar...');
    const { data: removeMaterials, error: removeError } = await supabase
      .from('materiales')
      .select('*')
      .in('id', materialsToRemove);
    
    if (removeError) {
      console.error('❌ Error al verificar materiales a eliminar:', removeError);
      return;
    }
    
    console.log(`📋 Materiales encontrados para eliminar: ${removeMaterials.length}`);
    removeMaterials.forEach(material => {
      console.log(`- "${material.titulo}" (ID: ${material.id})`);
    });
    
    // Confirmar antes de eliminar
    console.log('\n⚠️ ATENCIÓN: Se van a eliminar los materiales listados arriba.');
    console.log('⚠️ Esta acción NO se puede deshacer.');
    console.log('⚠️ Solo se mantendrá: "' + keepMaterial.titulo + '"');
    
    // Proceder con la eliminación
    console.log('\n🗑️ Eliminando materiales incorrectos...');
    
    let deletedCount = 0;
    for (const materialId of materialsToRemove) {
      const { error: deleteError } = await supabase
        .from('materiales')
        .delete()
        .eq('id', materialId);
      
      if (deleteError) {
        console.error(`❌ Error al eliminar material ${materialId}:`, deleteError);
      } else {
        deletedCount++;
        console.log(`✅ Material eliminado: ${materialId}`);
      }
    }
    
    console.log(`\n📊 Resumen de eliminación:`);
    console.log(`- Materiales eliminados: ${deletedCount}`);
    console.log(`- Materiales que fallaron: ${materialsToRemove.length - deletedCount}`);
    
    // Verificar el estado final
    console.log('\n🔍 Verificando estado final...');
    const lessonId = 'b8c5e2f1-4a3d-4e5f-8b9c-1d2e3f4a5b6c'; // ID de la lección TRABAJO FINAL DE MÁSTER
    
    const { data: finalMaterials, error: finalError } = await supabase
      .from('materiales')
      .select('*')
      .eq('leccion_id', lessonId);
    
    if (finalError) {
      console.error('❌ Error al verificar estado final:', finalError);
      return;
    }
    
    console.log(`\n✅ Estado final - Materiales restantes: ${finalMaterials.length}`);
    finalMaterials.forEach(material => {
      console.log(`- "${material.titulo}" (ID: ${material.id})`);
    });
    
    if (finalMaterials.length === 1 && finalMaterials[0].id === materialToKeep) {
      console.log('\n🎉 ¡ÉXITO! Solo queda el material correcto: "' + finalMaterials[0].titulo + '"');
    } else {
      console.log('\n⚠️ ADVERTENCIA: El resultado no es el esperado. Revisar manualmente.');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la función
cleanFinalLessonMaterials().then(() => {
  console.log('\n🏁 Limpieza completada');
}).catch(error => {
  console.error('❌ Error en la ejecución:', error);
});