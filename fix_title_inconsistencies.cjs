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

// Función para corregir inconsistencias en un archivo
function fixInconsistenciesInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const relativePath = path.relative(__dirname, filePath);
  
  // Verificar si el archivo tiene inconsistencias
  const hasTitleProps = content.match(/\bprops\.title\b/) || content.match(/\{ ?title ?\}/) || content.match(/title:/) || content.match(/title\?:/); 
  const hasTituloProps = content.match(/\bprops\.titulo\b/) || content.match(/\{ ?titulo ?\}/) || content.match(/titulo:/) || content.match(/titulo\?:/);
  
  // Si hay inconsistencias, corregir
  if (hasTitleProps && !hasTituloProps) {
    // Caso 1: Solo usa 'title', cambiar a 'titulo'
    let modified = false;
    
    // Reemplazar en definiciones de tipos e interfaces
    const updatedContent = content
      // Reemplazar en definiciones de tipos/interfaces
      .replace(/([^a-zA-Z0-9])title([?]?):/g, (match, prefix, optional) => {
        modified = true;
        return `${prefix}titulo${optional}:`;
      })
      // Reemplazar en destructuring de props
      .replace(/\{([^}]*?)\btitle\b([^}]*?)\}/g, (match, before, after) => {
        modified = true;
        return `{${before}titulo${after}}`;
      })
      // Reemplazar props.title
      .replace(/props\.title/g, () => {
        modified = true;
        return 'props.titulo';
      })
      // Reemplazar otras referencias a title como variable
      .replace(/([^a-zA-Z0-9])title([^a-zA-Z0-9])/g, (match, prefix, suffix) => {
        // Evitar reemplazar en atributos JSX como title={...}
        if (prefix === '=' || suffix === '=') return match;
        modified = true;
        return `${prefix}titulo${suffix}`;
      });
    
    if (modified) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Corregido: ${relativePath} (title -> titulo)`);
      return true;
    }
  } 
  else if (!hasTitleProps && hasTituloProps) {
    // Caso 2: Solo usa 'titulo', no es necesario cambiar nada
    return false;
  }
  else if (hasTitleProps && hasTituloProps) {
    // Caso 3: Usa ambos, esto requiere revisión manual
    console.log(`Requiere revisión manual: ${relativePath} (usa tanto 'title' como 'titulo')`);
    
    // Mostrar algunas líneas de contexto
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('title') || line.includes('titulo')) {
        console.log(`  Línea ${index + 1}: ${line.trim()}`);
      }
    });
    
    return false;
  }
  
  return false;
}

// Función principal
function main() {
  console.log('Corrigiendo inconsistencias entre "title" y "titulo" en archivos frontend...');
  
  // Buscar archivos TypeScript/TSX
  const tsxFiles = findFiles(srcDir, '.tsx');
  const tsFiles = findFiles(srcDir, '.ts');
  const allFiles = [...tsxFiles, ...tsFiles];
  
  console.log(`Encontrados ${allFiles.length} archivos .ts/.tsx para analizar.\n`);
  
  let filesFixed = 0;
  
  // Verificar y corregir cada archivo
  allFiles.forEach(file => {
    if (fixInconsistenciesInFile(file)) {
      filesFixed++;
    }
  });
  
  console.log(`\nProceso completado. Se corrigieron ${filesFixed} archivos.`);
  console.log('Nota: Los archivos que requieren revisión manual no fueron modificados.');
}

// Ejecutar el script
main();