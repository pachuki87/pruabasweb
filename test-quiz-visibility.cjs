// Test automatizado para verificar la visibilidad de los cuestionarios
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🚀 Iniciando test de cuestionarios...');
    
    // Navegar a la página principal
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('✅ Página principal cargada');
    
    // Tomar captura de la página principal
    await page.screenshot({ path: 'homepage.png', fullPage: true });
    console.log('📸 Captura de homepage guardada');
    
    // Mostrar el HTML de la página principal
    const homeHTML = await page.content();
    console.log('🏠 Título de la página:', await page.title());
    console.log('🏠 URL actual:', page.url());
    
    // Buscar todos los enlaces en la página
    const allLinks = page.locator('a');
    const linkCount = await allLinks.count();
    console.log(`🔗 Total de enlaces encontrados: ${linkCount}`);
    
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const href = await allLinks.nth(i).getAttribute('href');
      const text = await allLinks.nth(i).textContent();
      console.log(`  - Enlace ${i + 1}: "${text}" -> ${href}`);
    }
    
    // Navegar directamente a la URL del curso específico
     console.log('🎯 Navegando directamente al curso específico...');
     const courseUrl = 'http://localhost:5173/student/courses/d7c3e503-ed61-4d7a-9e5f-aedc407d4836';
     await page.goto(courseUrl);
     await page.waitForLoadState('networkidle');
     await page.waitForTimeout(3000);
     console.log('✅ Navegado al curso específico');
      
      // Tomar captura de la página del curso
      await page.screenshot({ path: 'course-page.png', fullPage: true });
      console.log('📸 Captura de página del curso guardada');
      
      console.log('📚 Título de página del curso:', await page.title());
      console.log('📚 URL actual:', page.url());
      
      // Capturar y mostrar el HTML de la página del curso
     const coursePageHTML = await page.content();
     console.log('\n🔍 HTML de la página del curso (caracteres del medio):');
     const middleStart = Math.floor(coursePageHTML.length * 0.3);
     const middleEnd = Math.floor(coursePageHTML.length * 0.7);
     console.log(coursePageHTML.substring(middleStart, middleStart + 3000));
     
     // Buscar específicamente elementos que contengan "lección" o "lesson"
      const lessonElements = await page.$$eval('*', elements => {
        return elements.filter(el => {
          const text = el.textContent?.toLowerCase() || '';
          const className = (el.className?.toString() || '').toLowerCase();
          const id = (el.id || '').toLowerCase();
          return text.includes('lección') || text.includes('lesson') || 
                 className.includes('lesson') || id.includes('lesson') ||
                 text.includes('módulo') || text.includes('module');
        }).map(el => ({
          tagName: el.tagName,
          className: el.className?.toString() || '',
          id: el.id || '',
          textContent: el.textContent?.substring(0, 100)
        }));
      });
     
     console.log('\n📚 Elementos que contienen "lección" o términos relacionados:');
     lessonElements.forEach((el, i) => {
       console.log(`  ${i + 1}. ${el.tagName} - class: "${el.className}" - id: "${el.id}" - text: "${el.textContent}"`);
     });
      
      // Buscar todos los enlaces en la página del curso
      const allCoursePageLinks = page.locator('a');
      const coursePageLinkCount = await allCoursePageLinks.count();
      console.log(`🔗 Total de enlaces en página del curso: ${coursePageLinkCount}`);
      
      for (let i = 0; i < Math.min(coursePageLinkCount, 10); i++) {
        const href = await allCoursePageLinks.nth(i).getAttribute('href');
        const text = await allCoursePageLinks.nth(i).textContent();
        if (href && (href.includes('leccion') || href.includes('lesson') || href.includes('modulo'))) {
          console.log(`  - Enlace lección ${i + 1}: "${text?.substring(0, 30)}..." -> ${href}`);
        }
      }
      
      // Buscar lecciones con selectores más amplios
     const lessonElementsLocator = page.locator('div, li, a').filter({ hasText: /Lección|Módulo|Tema|Clase/ });
      const lessonCount = await lessonElementsLocator.count();
      console.log(`📖 Encontrados ${lessonCount} elementos que podrían ser lecciones`);
      
      // Buscar enlaces de lecciones
      const lessonLinks = page.locator('a[href*="leccion"], a[href*="lesson"], a[href*="modulo"]');
      const lessonLinkCount = await lessonLinks.count();
      console.log(`🔗 Encontrados ${lessonLinkCount} enlaces de lecciones`);
      
      if (lessonLinkCount > 0) {
        // Hacer clic en la primera lección
        const firstLessonLink = lessonLinks.first();
        const lessonHref = await firstLessonLink.getAttribute('href');
        console.log(`🎯 Haciendo clic en lección: ${lessonHref}`);
        
        await firstLessonLink.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        console.log('✅ Navegado a la primera lección');
        
        // Tomar captura de la página de la lección
        await page.screenshot({ path: 'lesson-page.png', fullPage: true });
        console.log('📸 Captura de página de lección guardada');
        
        console.log('📖 Título de página de lección:', await page.title());
        console.log('📖 URL actual:', page.url());
        
        // Buscar botón de cuestionario con selectores más amplios
        const quizButton = page.locator('button, a').filter({ hasText: /Cuestionario|Quiz|Evaluación|Examen/ });
        const quizButtonCount = await quizButton.count();
        console.log(`🎯 Encontrados ${quizButtonCount} botones de cuestionario`);
        
        if (quizButtonCount > 0) {
          console.log('🎉 ¡Botón de cuestionario encontrado!');
          
          // Hacer clic en el botón de cuestionario
          await quizButton.first().click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(3000);
          
          // Tomar captura después de hacer clic en el cuestionario
          await page.screenshot({ path: 'quiz-result.png', fullPage: true });
          console.log('📸 Captura de resultado del cuestionario guardada');
          
          // Verificar si aparece error o se carga el cuestionario
          const errorMessage = page.locator('text=Error al cargar el cuestionario');
          const errorCount = await errorMessage.count();
          
          const quizContent = page.locator('div').filter({ hasText: /pregunta|respuesta|opción/i });
          const quizContentCount = await quizContent.count();
          
          if (errorCount > 0) {
            console.log('❌ Error encontrado: "Error al cargar el cuestionario"');
          } else if (quizContentCount > 0) {
            console.log('✅ Cuestionario cargado correctamente - se encontró contenido de quiz');
          } else {
            console.log('⚠️ No se encontró mensaje de error, pero tampoco contenido de cuestionario claro');
          }
        } else {
          console.log('❌ No se encontró botón de cuestionario en esta lección');
        }
      } else {
        console.log('❌ No se encontraron enlaces de lecciones');
      }
    
  } catch (error) {
    console.error('❌ Error durante el test:', error.message);
  } finally {
    await browser.close();
    console.log('🏁 Test completado');
  }
})();