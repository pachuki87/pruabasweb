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

  // Copiar quiz-results-form.html
  const quizFormSource = join(__dirname, 'quiz-results-form.html');
  const quizFormDest = join(__dirname, 'dist', 'quiz-results-form.html');

  if (existsSync(quizFormSource)) {
    copyFileSync(quizFormSource, quizFormDest);
    console.log('✅ quiz-results-form.html copiado al directorio dist');
  } else {
    console.warn('⚠️ quiz-results-form.html no encontrado en la raíz del proyecto');
  }

  // Copiar formulario-mcp-integrado.html
  const formMcpSource = join(__dirname, 'formulario-mcp-integrado.html');
  const formMcpDest = join(__dirname, 'dist', 'formulario-mcp-integrado.html');

  if (existsSync(formMcpSource)) {
    copyFileSync(formMcpSource, formMcpDest);
    console.log('✅ formulario-mcp-integrado.html copiado al directorio dist');
  } else {
    console.warn('⚠️ formulario-mcp-integrado.html no encontrado en la raíz del proyecto');
  }

  // Copiar resumen-cuestionario.html
  const resumenSource = join(__dirname, 'resumen-cuestionario.html');
  const resumenDest = join(__dirname, 'dist', 'resumen-cuestionario.html');

  if (existsSync(resumenSource)) {
    copyFileSync(resumenSource, resumenDest);
    console.log('✅ resumen-cuestionario.html copiado al directorio dist');
  } else {
    console.warn('⚠️ resumen-cuestionario.html no encontrado en la raíz del proyecto');
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