// Test simple para verificar si useProgress.ts se puede importar
try {
  console.log('🧪 Probando importación de useProgress...');
  
  // Intentar importar el hook
  import('./src/hooks/useProgress.ts')
    .then(() => {
      console.log('✅ useProgress.ts se importa correctamente');
    })
    .catch((error) => {
      console.error('❌ Error importando useProgress.ts:', error.message);
      console.error('Stack:', error.stack);
    });
    
} catch (error) {
  console.error('❌ Error general:', error.message);
}

console.log('🔍 Verificación de importación iniciada...');