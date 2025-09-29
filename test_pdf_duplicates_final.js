// Script para verificar PDFs duplicados - versión para navegador
// Copiar y pegar en la consola del navegador

function testPDFDuplicates() {
  console.log('🧪 Iniciando prueba final de PDFs duplicados...');
  
  // Función para contar elementos PDF en el DOM
  function countPDFElements() {
    const pdfElements = document.querySelectorAll('[href*=".pdf"]');
    const pdfLinks = Array.from(pdfElements).map(el => el.getAttribute('href'));
    const uniquePDFs = [...new Set(pdfLinks)];
    
    console.log('📊 Resultados de la prueba:');
    console.log('- Total elementos PDF encontrados:', pdfElements.length);
    console.log('- PDFs únicos:', uniquePDFs.length);
    console.log('- ¿Hay duplicados?', pdfElements.length > uniquePDFs.length ? '❌ SÍ' : '✅ NO');
    
    if (pdfElements.length > uniquePDFs.length) {
      console.log('🔍 PDFs duplicados detectados:');
      const counts = {};
      pdfLinks.forEach(pdf => {
        counts[pdf] = (counts[pdf] || 0) + 1;
      });
      
      Object.entries(counts).forEach(([pdf, count]) => {
        if (count > 1) {
          console.log(`  - ${pdf}: ${count} veces`);
        }
      });
    }
    
    return {
      total: pdfElements.length,
      unique: uniquePDFs.length,
      hasDuplicates: pdfElements.length > uniquePDFs.length
    };
  }
  
  // Función para verificar secciones de materiales
  function checkMaterialSections() {
    const materialSections = document.querySelectorAll('h3');
    const materialHeaders = Array.from(materialSections)
      .filter(h3 => h3.textContent.includes('Materiales de la Lección'));
    
    console.log('🔍 Verificando secciones de materiales:');
    console.log('- Secciones "Materiales de la Lección":', materialHeaders.length);
    
    return materialHeaders.length;
  }
  
  // Ejecutar pruebas
  console.log('\n=== PRUEBA FINAL DE PDFs DUPLICADOS ===');
  const results = countPDFElements();
  const materialSections = checkMaterialSections();
  
  if (!results.hasDuplicates && materialSections === 1) {
    console.log('\n🎉 ¡ÉXITO! No se detectaron PDFs duplicados.');
    console.log('✅ La solución funcionó correctamente.');
  } else {
    console.log('\n⚠️ Problemas detectados:');
    if (results.hasDuplicates) {
      console.log('- PDFs duplicados encontrados');
    }
    if (materialSections > 1) {
      console.log('- Múltiples secciones de materiales:', materialSections);
    }
  }
  
  console.log('\n=== FIN DE LA PRUEBA ===');
  return results;
}

// Instrucciones
console.log('📋 INSTRUCCIONES:');
console.log('1. Abrir la lección 2 en el navegador');
console.log('2. Abrir las herramientas de desarrollador (F12)');
console.log('3. Ejecutar: testPDFDuplicates()');
console.log('\n🔗 URL de prueba: http://localhost:5173/courses/b5ef8c64-fe26-4f20-8221-80a1bf475b05/lessons/e4546103-526d-42ff-a98b-0db4828caa44');

// Hacer la función disponible globalmente si se ejecuta en el navegador
if (typeof window !== 'undefined') {
  window.testPDFDuplicates = testPDFDuplicates;
}