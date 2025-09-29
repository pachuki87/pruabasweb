const fs = require('fs');
const path = require('path');

// Directorio raíz de los componentes React
const srcDir = path.join(__dirname, 'src');

// Función para buscar recursivamente archivos
function findFiles(dir, extension) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursivamente buscar en subdirectorios
      results = results.concat(findFiles(filePath, extension));
    } else if (path.extname(file) === extension) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Función para buscar inconsistencias en un archivo
function checkFileForInconsistencies(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const relativePath = path.relative(__dirname, filePath);
  
  // Buscar referencias a 'title' y 'titulo'
  const titleMatches = content.match(/[^a-zA-Z0-9]title[^a-zA-Z0-9]/g) || [];
  const tituloMatches = content.match(/[^a-zA-Z0-9]titulo[^a-zA-Z0-9]/g) || [];
  
  // Buscar definiciones de tipos o interfaces que incluyan 'title' o 'titulo'
  const typeDefWithTitle = content.includes('title:') || content.includes('title?:');
  const typeDefWithTitulo = content.includes('titulo:') || content.includes('titulo?:');
  
  // Buscar props o destructuring con 'title' o 'titulo'
  const propsWithTitle = content.match(/\{[^\}]*\btitle\b[^\}]*\}/g) || [];
  const propsWithTitulo = content.match(/\{[^\}]*\btitulo\b[^\}]*\}/g) || [];
  
  if ((titleMatches.length > 0 || typeDefWithTitle || propsWithTitle.length > 0) && 
      (tituloMatches.length > 0 || typeDefWithTitulo || propsWithTitulo.length > 0)) {
    console.log(`\nPosible inconsistencia en ${relativePath}:`);
    console.log(`- Referencias a 'title': ${titleMatches.length}`);
    console.log(`- Referencias a 'titulo': ${tituloMatches.length}`);
    console.log(`- Definición de tipo con 'title': ${typeDefWithTitle}`);
    console.log(`- Definición de tipo con 'titulo': ${typeDefWithTitulo}`);
    console.log(`- Props/destructuring con 'title': ${propsWithTitle.length}`);
    console.log(`- Props/destructuring con 'titulo': ${propsWithTitulo.length}`);
    
    // Mostrar algunas líneas de contexto para cada ocurrencia
    const lines = content.split('\n');
    
    console.log('\nContexto de algunas ocurrencias:');
    lines.forEach((line, index) => {
      if (line.includes('title') || line.includes('titulo')) {
        console.log(`Línea ${index + 1}: ${line.trim()}`);
      }
    });
    
    return true;
  }
  
  return false;
}

// Función principal
function main() {
  console.log('Buscando inconsistencias entre "title" y "titulo" en archivos frontend...');
  
  // Buscar archivos TypeScript/TSX
  const tsxFiles = findFiles(srcDir, '.tsx');
  const tsFiles = findFiles(srcDir, '.ts');
  const allFiles = [...tsxFiles, ...tsFiles];
  
  console.log(`Encontrados ${allFiles.length} archivos .ts/.tsx para analizar.\n`);
  
  let inconsistenciesFound = 0;
  
  // Verificar cada archivo
  allFiles.forEach(file => {
    if (checkFileForInconsistencies(file)) {
      inconsistenciesFound++;
    }
  });
  
  console.log(`\nAnálisis completado. Se encontraron ${inconsistenciesFound} archivos con posibles inconsistencias.`);
}

// Ejecutar el script
main();