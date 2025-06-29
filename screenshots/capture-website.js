import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  // Crear directorio para las capturas si no existe
  const screenshotsDir = path.join(__dirname, 'captures');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const baseUrl = 'https://aesthetic-bubblegum-2dbfa8.netlify.app';
  
  // Páginas a capturar
  const pages = [
    { name: '01-homepage', url: '/' },
    { name: '02-cursos', url: '/cursos' },
    { name: '03-formacion', url: '/formacion' },
    { name: '04-viajes-talleres', url: '/viajes-y-talleres' }
    { name: '05-testimonios', url: '/testimonios' },
    { name: '06-contacto', url: '/contacto' },
    { name: '07-login', url: '/auth/login' },
    { name: '08-register', url: '/auth/register' },
    { name: '09-master-adicciones', url: '/master-adicciones' },
    { name: '10-about', url: '/about' }
  ];

  console.log('🚀 Iniciando capturas de pantalla...');
  
  for (const pageInfo of pages) {
    try {
      console.log(`📸 Capturando: ${pageInfo.name}`);
      
      // Navegar a la página
      await page.goto(`${baseUrl}${pageInfo.url}`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Esperar un poco para que se cargue completamente
      await page.waitForTimeout(2000);
      
      // Hacer scroll para cargar contenido lazy
      await page.evaluate(() => {
        return new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            
            if(totalHeight >= scrollHeight){
              clearInterval(timer);
              window.scrollTo(0, 0); // Volver arriba
              setTimeout(resolve, 1000);
            }
          }, 100);
        });
      });
      
      // Captura de pantalla completa
      await page.screenshot({
        path: path.join(screenshotsDir, `${pageInfo.name}-fullpage.png`),
        fullPage: true
      });
      
      // Captura del viewport
      await page.screenshot({
        path: path.join(screenshotsDir, `${pageInfo.name}-viewport.png`),
        fullPage: false
      });
      
      console.log(`✅ Completado: ${pageInfo.name}`);
      
    } catch (error) {
      console.log(`❌ Error en ${pageInfo.name}: ${error.message}`);
    }
  }
  
  console.log('🎉 ¡Todas las capturas completadas!');
  console.log(`📁 Capturas guardadas en: ${screenshotsDir}`);
  
  await browser.close();
})();