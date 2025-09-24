import { copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📋 Copiando archivos estáticos al directorio dist...');

try {
  // Copiar contacto.html
  const contactoSource = join(__dirname, 'contacto.html');
  const contactoDest = join(__dirname, 'dist', 'contacto.html');

  if (existsSync(contactoSource)) {
    copyFileSync(contactoSource, contactoDest);
    console.log('✅ contacto.html copiado al directorio dist');
  } else {
    console.warn('⚠️ contacto.html no encontrado en la raíz del proyecto');
  }

  // Copiar _redirects
  const redirectsSource = join(__dirname, '_redirects');
  const redirectsDest = join(__dirname, 'dist', '_redirects');

  if (existsSync(redirectsSource)) {
    copyFileSync(redirectsSource, redirectsDest);
    console.log('✅ _redirects copiado al directorio dist');
  } else {
    console.warn('⚠️ _redirects no encontrado en la raíz del proyecto');
  }

  console.log('🎉 Archivos estáticos copiados exitosamente');
} catch (error) {
  console.error('❌ Error copiando archivos estáticos:', error.message);
  process.exit(1);
}