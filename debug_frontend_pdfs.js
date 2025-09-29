// Script para debuggear PDFs en el frontend
// Ejecutar en la consola del navegador en la lección 2

console.log('🔍 DEBUGGING PDFs EN FRONTEND');
console.log('================================');

// 1. Verificar cuántas veces se renderiza el componente
let renderCount = 0;
const originalLog = console.log;
console.log = function(...args) {
  if (args[0] && args[0].includes('📄 Lesson') && args[0].includes('PDFs from database')) {
    renderCount++;
    originalLog(`🚨 RENDER #${renderCount}:`, ...args);
  } else {
    originalLog(...args);
  }
};

// 2. Verificar elementos DOM
setTimeout(() => {
  const pdfElements = document.querySelectorAll('[class*="bg-red-50"]');
  console.log(`🎯 PDFs encontrados en DOM: ${pdfElements.length}`);
  
  pdfElements.forEach((element, index) => {
    const titleElement = element.querySelector('.text-gray-900');
    const title = titleElement ? titleElement.textContent : 'Sin título';
    console.log(`  ${index + 1}. ${title}`);
  });
  
  // 3. Verificar si hay múltiples componentes LessonViewer
  const lessonViewers = document.querySelectorAll('[class*="space-y-4"]');
  console.log(`📱 Posibles LessonViewer components: ${lessonViewers.length}`);
  
  // 4. Verificar React DevTools si están disponibles
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('⚛️ React DevTools detectado - revisar componentes duplicados');
  }
  
}, 2000);

console.log('✅ Script de debug activado. Recarga la página para ver los resultados.');