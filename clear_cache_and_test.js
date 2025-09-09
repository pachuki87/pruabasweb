// Script para limpiar caché y probar la lección 2
console.log('🧹 Limpiando caché del navegador...');

// Limpiar localStorage
localStorage.clear();
console.log('✅ localStorage limpiado');

// Limpiar sessionStorage
sessionStorage.clear();
console.log('✅ sessionStorage limpiado');

// Forzar recarga sin caché
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name);
    }
    console.log('✅ Cache API limpiado');
  });
}

// Recargar la página sin caché
console.log('🔄 Recargando página sin caché...');
window.location.reload(true);