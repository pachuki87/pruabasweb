const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('🎯 Iniciando test completo del cuestionario con Playwright...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navegar directamente a la lección con cuestionario en Netlify
    console.log('📍 Navegando a la lección con cuestionario en producción...');
    await page.goto('https://aesthetic-bubblegum-2dbfa8.netlify.app/student/courses/b5ef8c64-fe26-4f20-8221-80a1bf475b05/lessons/e4546103-526d-42ff-a98b-0db4828caa44', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    // Esperar a que React se cargue
    await page.waitForTimeout(3000);
    await page.waitForTimeout(3000);
    
    // Verificar que estamos en la lección correcta
    const lessonTitle = await page.textContent('h1, h2, .lesson-title').catch(() => 'Título no encontrado');
    console.log('📖 Título de la lección:', lessonTitle);
    
    // Buscar el botón de cuestionario con múltiples selectores
    const quizButtonSelectors = [
      'button:has-text("Cuestionario")',
      '.quiz-button',
      '[data-testid="quiz-button"]',
      'button:has-text("Quiz")',
      'button[class*="quiz"]'
    ];
    
    let quizButton = null;
    for (const selector of quizButtonSelectors) {
      quizButton = page.locator(selector).first();
      if (await quizButton.count() > 0) {
        console.log(`✅ Botón de cuestionario encontrado con selector: ${selector}`);
        break;
      }
    }
    
    if (quizButton && await quizButton.count() > 0) {
      // Hacer clic en el botón de cuestionario
      await quizButton.click();
      console.log('🖱️ Clic en botón de cuestionario realizado');
      
      // Esperar a que aparezca el contenido del quiz
      await page.waitForTimeout(2000);
      
      // Tomar screenshot para diagnóstico
      await page.screenshot({ path: 'quiz-opened.png' });
      console.log('📸 Screenshot tomado después del clic');
      
      // Buscar el componente QuizComponent
      const quizComponent = page.locator('.quiz-start, .quiz-container');
      
      if (await quizComponent.count() > 0) {
        console.log('✅ Componente QuizComponent detectado');
        
        // Verificar si hay cuestionarios disponibles
        const quizOptions = page.locator('.quiz-option');
        const quizOptionsCount = await quizOptions.count();
        console.log(`📋 Cuestionarios disponibles: ${quizOptionsCount}`);
        
        if (quizOptionsCount > 0) {
          // Seleccionar el primer cuestionario si no está seleccionado
          const firstQuizOption = quizOptions.first();
          await firstQuizOption.click();
          console.log('✅ Cuestionario seleccionado');
          
          await page.waitForTimeout(1000);
        }
        
        // Buscar el botón "Comenzar Cuestionario"
        const startButton = page.locator('.btn-start');
        
        if (await startButton.count() > 0) {
          const startButtonText = await startButton.textContent();
          console.log(`🚀 Botón de inicio encontrado: "${startButtonText}"`);
          
          const isStartButtonEnabled = await startButton.isEnabled();
          console.log(`🔓 Botón habilitado: ${isStartButtonEnabled}`);
          
          if (isStartButtonEnabled) {
            // Hacer clic en "Comenzar Cuestionario"
            await startButton.click();
            console.log('🎯 Cuestionario iniciado');
            
            // Esperar a que aparezca la primera pregunta
            await page.waitForTimeout(3000);
            
            // Verificar que aparezca el contenedor de preguntas
            const questionContainer = page.locator('.question-container');
            
            if (await questionContainer.count() > 0) {
              console.log('✅ Primera pregunta cargada correctamente');
              
              // Obtener el texto de la pregunta
              const questionText = await page.textContent('.question-text');
              console.log('❓ Pregunta:', questionText?.substring(0, 100) + '...');
              
              // Verificar opciones de respuesta
              const options = page.locator('.option-button');
              const optionCount = await options.count();
              console.log(`📝 Opciones de respuesta: ${optionCount}`);
              
              if (optionCount > 0) {
                // Mostrar las opciones disponibles
                for (let i = 0; i < optionCount; i++) {
                  const optionText = await options.nth(i).textContent();
                  console.log(`   ${i + 1}. ${optionText}`);
                }
                
                // Seleccionar la primera opción
                await options.first().click();
                console.log('✅ Primera opción seleccionada');
                
                await page.waitForTimeout(1000);
                
                // Verificar el botón "Siguiente"
                const nextButton = page.locator('.btn-next');
                const isNextEnabled = await nextButton.isEnabled();
                const nextButtonText = await nextButton.textContent();
                console.log(`➡️ Botón siguiente: "${nextButtonText}" - Habilitado: ${isNextEnabled}`);
                
                // Tomar screenshot final
                await page.screenshot({ path: 'quiz-question-answered.png' });
                
                console.log('🎉 ¡Test del cuestionario completado exitosamente!');
                console.log('📊 Resumen:');
                console.log(`   - Cuestionario encontrado y abierto: ✅`);
                console.log(`   - Botón de inicio funcional: ✅`);
                console.log(`   - Primera pregunta cargada: ✅`);
                console.log(`   - Opciones de respuesta: ${optionCount} ✅`);
                console.log(`   - Selección de respuesta: ✅`);
                console.log(`   - Botón siguiente habilitado: ${isNextEnabled ? '✅' : '❌'}`);
                
              } else {
                console.log('❌ No se encontraron opciones de respuesta');
                await page.screenshot({ path: 'quiz-no-options.png' });
              }
            } else {
              console.log('❌ No se cargó la primera pregunta');
              await page.screenshot({ path: 'quiz-no-question.png' });
            }
          } else {
            console.log('❌ El botón de inicio está deshabilitado');
          }
        } else {
          console.log('❌ No se encontró el botón "Comenzar Cuestionario"');
          
          // Verificar si ya estamos en una pregunta
          const questionContainer = page.locator('.question-container');
          if (await questionContainer.count() > 0) {
            console.log('ℹ️ El cuestionario parece estar ya iniciado');
          }
        }
      } else {
        console.log('❌ No se detectó el componente QuizComponent');
        
        // Mostrar qué elementos están presentes
        const bodyContent = await page.textContent('body');
        console.log('🔍 Contenido de la página:', bodyContent?.substring(0, 200) + '...');
      }
    } else {
      console.log('❌ No se encontró el botón de cuestionario');
      
      // Mostrar todos los botones disponibles para diagnóstico
      const allButtons = page.locator('button');
      const buttonCount = await allButtons.count();
      console.log(`🔍 Botones encontrados en la página: ${buttonCount}`);
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const buttonText = await allButtons.nth(i).textContent();
        console.log(`   ${i + 1}. "${buttonText}"`);
      }
    }
    
  } catch (error) {
    console.error('💥 Error durante el test:', error.message);
    await page.screenshot({ path: 'quiz-error.png' });
  } finally {
    await browser.close();
    console.log('🏁 Test completado');
  }
})();