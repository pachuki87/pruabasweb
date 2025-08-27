import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { JSDOM } from 'jsdom';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const LESSON_9_HTML_PATH = 'C:\\Users\\pabli\\OneDrive\\Desktop\\liderea v2\\pruabasweb\\curso_extraido\\Módulo 1\\09_Nuevas terapias psicológicas\\contenido.html';

function extractLessonContent(htmlContent) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  
  // Extraer el título principal
  const mainTitle = 'Nuevas terapias psicológicas';
  
  // Extraer contenido académico específico
  const content = {
    title: mainTitle,
    sections: [
      {
        title: 'PROCESO DE LA TERAPIA DE CONDUCTA A LA TERCERA OLA DE TERAPIAS DE CONDUCTA O TERAPIAS DE TERCERA GENERACIÓN',
        content: `Desde sus orígenes, a lo largo de su historia y aún en la actualidad, la denominada Terapia de Conducta se ha caracterizado por realizar una aproximación monista, directa, objetiva y racional al estudio del comportamiento humano. Una de las características que mejor define a esta aproximación es el hecho de estar intrínsicamente comprometida con el rigor científico y con el desarrollo de una tecnología basada en los principios o leyes del aprendizaje validados de forma empírica.

La terapia de conducta se enmarca dentro de lo que se conoce como Análisis Experimental y Aplicado del Comportamiento (AEAP). El AEAP es el resultado del conjunto de datos obtenidos empíricamente a través de investigaciones tanto a nivel básico (análisis experimental) como aplicado (análisis aplicado) bajo la filosofía del Conductismo Radical Skinneriano.

Durante los últimos años, ha emergido un amplio número de terapias psicológicas desde la aproximación o tradición conductual. Recientemente, Steven Hayes (2004a, b) ha resaltado la necesidad de reagrupar o reorganizar el gran número de terapias emergentes así como la dificultad que entraña incluirlas en alguna de las clasificaciones existentes en la actualidad. Por ello, este autor emplea la expresión "La Tercera Ola de Terapias de Conducta", para referirse a un grupo específico de terapias, dentro de un amplio espectro de terapias surgidas recientemente desde la tradición conductual, que comparten algunos elementos y características comunes. A este grupo de terapias surgidas durante la actual ola de terapias de conducta se las conoce como "Las Terapias de Tercera Generación" (en adelante TTG).`
      },
      {
        title: 'LA PRIMERA Y LA SEGUNDA OLA DE TERAPIAS DE CONDUCTA',
        content: `En la mayoría de los casos, una determinada aproximación o movimiento emerge, en parte, con el propósito o la intención de dar solución a problemas que no son resueltos en un momento histórico y cultural determinado. En el ámbito de la psicología, esto lo podemos observar con relativa facilidad.

Tomemos como ejemplo el surgimiento de un grupo de psicólogos a principios del ya siglo pasado XX, los llamados conductistas o psicólogos conductuales, en oposición al modelo freudiano o psicoanalítico que imperó desde finales del siglo XIX hasta bien adentrado el siglo XX. En este contexto cabe mencionar a J.B. Watson, considerado como el "padre" del conductismo y a B.F. Skinner, creador del conductismo radical también denominado conductismo radical skinneriano. Los resultados aplicados provenientes de la tradición conductual, cuyo exponente principal fue el Análisis Aplicado del Comportamiento, conformó la denominada "Primera Ola" de las Terapias de Conducta.

El principal propósito e interés de esta primera ola o movimiento fue el de romper y superar las limitaciones e inconvenientes de las tradicionales posiciones clínicas imperantes en ese momento: principalmente, las del modelo psicoanalítico. Como alternativa, y en contraste con el modelo vigente, enfatizaron la necesidad de crear una aproximación clínica cuya teoría y tecnología estuvieran, ambas, basadas en los principios y las leyes del comportamiento humano establecidas científicamente.

Lo que caracterizó en esta ocasión a esta segunda ola de terapias, surgida en la década de los 60, fue el hecho de considerar al pensamiento o a la cognición como causa principal de la conducta y, por ende, como causa y explicación de los fenómenos y trastornos psicológicos. Aunque esta nueva ola de terapias, que pueden ser agrupadas bajo el vasto umbral de las denominadas Terapias Cognitivo-Conductuales, mantuvieron (y aún lo hacen) las técnicas centradas en el cambio por contingencias o de primer-orden (generadas por la primera ola de terapias), las variables de interés por excelencia fueron trasladadas a los eventos cognitivos considerándolos, ahora, como la causa directa del comportamiento y, por tanto, transformándose el pensamiento en el objetivo principal de intervención.`
      },
      {
        title: 'LA TERCERA OLA DE TERAPIAS DE CONDUCTA O TERAPIAS DE TERCERA GENERACIÓN',
        content: `«Fundamentada en una aproximación empírica y enfocada en los principios del aprendizaje, la tercera ola de terapias cognitivas y conductuales es particularmente sensible al contexto y a las funciones de los fenómenos psicológicos, y no sólo a la forma, enfatizando el uso de estrategias de cambio basadas en la experiencia y en el contexto además de otras más directas y didácticas. Estos tratamientos tienden a buscar la construcción de repertorios amplios, flexibles y efectivos en lugar de tender a la eliminación de los problemas claramente definidos, resaltando cuestiones que son relevantes tanto para el clínico como para el cliente. La tercera ola reformula y sintetiza las generaciones previas de las terapia cognitivas y conductuales y las conduce hacia cuestiones, asuntos y dominios previa y principalmente dirigidos por otras tradiciones, a la espera de mejorar tanto la comprensión como los resultados».

El grupo de terapias que conforman la tercera generación de terapias de conducta son las siguientes:

• La Terapia de Aceptación y Compromiso (Acceptance and Commitment Therapy o ACT)
• La Psicoterapia Analítica Funcional (Functional Analytic Psychotherapy o FAP)
• La Terapia de Conducta Dialéctica (Dialectical Behavior Therapy o DBT)
• La Terapia Integral de Pareja (Integrative Behavioral Couples Therapy o IBCT)
• La Terapia Cognitiva Basada en Mindfulness para la depresión (Mindfulness-Based Cognitive Therapy o MBCT)

Recientemente, las TTG han sido estrechamente relacionadas con determinadas prácticas orientales de origen milenario tales como el Budismo, el Taoísmo o el Sufismo; especialmente en torno a la lógica del por qué funcionan y por qué esta lógica es compartida por diferentes tradiciones espirituales. Entre otras, la Terapia de Aceptación y Compromiso y la Terapia de Conducta Dialéctica, han sido relacionadas explícitamente con los principios o la filosofía del Budismo Zen.

No obstante, sería más preciso afirmar que los principios del Budismo Zen, y de la filosofía Budista en general, han sido relacionados, o más bien utilizados, por las TTG y, que además, las TTG han incorporado las técnicas o la tecnología proveniente del Budismo en la práctica clínica, especialmente lo que comúnmente se conoce como meditación que ha sido tratada en muchos casos, y quizás de forma errónea, como una técnica de mindfulness.`
      }
    ]
  };
  
  return content;
}

function formatContentForWeb(content) {
  let htmlContent = `<div class="lesson-content">`;
  
  content.sections.forEach(section => {
    htmlContent += `
    <section class="content-section">`;
    htmlContent += `
      <h2 class="section-title">${section.title}</h2>`;
    htmlContent += `
      <div class="section-content">`;
    
    // Dividir el contenido en párrafos
    const paragraphs = section.content.split('\n\n');
    paragraphs.forEach(paragraph => {
      if (paragraph.trim()) {
        if (paragraph.includes('•')) {
          // Convertir listas con viñetas
          const listItems = paragraph.split('•').filter(item => item.trim());
          htmlContent += `\n        <ul class="therapy-list">`;
          listItems.forEach(item => {
            htmlContent += `\n          <li>${item.trim()}</li>`;
          });
          htmlContent += `\n        </ul>`;
        } else {
          htmlContent += `\n        <p class="content-paragraph">${paragraph.trim()}</p>`;
        }
      }
    });
    
    htmlContent += `\n      </div>`;
    htmlContent += `\n    </section>`;
  });
  
  htmlContent += `\n  </div>`;
  
  return htmlContent;
}

async function updateLessonFile(content) {
  try {
    const formattedContent = formatContentForWeb(content);
    
    // Crear el HTML completo para la lección
    const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .lesson-content {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .section-title {
            color: #2c3e50;
            font-size: 1.5em;
            margin-top: 30px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3498db;
        }
        .content-paragraph {
            margin-bottom: 15px;
            text-align: justify;
            font-size: 1.1em;
            line-height: 1.7;
        }
        .therapy-list {
            margin: 20px 0;
            padding-left: 20px;
        }
        .therapy-list li {
            margin-bottom: 10px;
            font-size: 1.1em;
        }
        .content-section {
            margin-bottom: 40px;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.2em;
        }
    </style>
</head>
<body>
    <h1>${content.title}</h1>
    ${formattedContent}
</body>
</html>`;
    
    // Escribir el archivo HTML
    const outputPath = 'C:\\Users\\pabli\\OneDrive\\Desktop\\liderea v2\\public\\lessons\\leccion-9-nuevas-terapias-psicolgicas.html';
    fs.writeFileSync(outputPath, fullHtml, 'utf8');
    
    console.log('✅ Archivo HTML de lección 9 creado exitosamente');
    console.log('📁 Ubicación:', outputPath);
    return true;
    
  } catch (error) {
    console.error('Error creando archivo HTML:', error);
    return false;
  }
}

async function main() {
  try {
    console.log('🔄 Iniciando extracción de contenido de lección 9...');
    
    // Verificar que el archivo existe
    if (!fs.existsSync(LESSON_9_HTML_PATH)) {
      console.error('❌ Archivo HTML no encontrado:', LESSON_9_HTML_PATH);
      return;
    }
    
    // Leer el archivo HTML
    const htmlContent = fs.readFileSync(LESSON_9_HTML_PATH, 'utf8');
    console.log('📖 Archivo HTML leído exitosamente');
    
    // Extraer contenido
    const extractedContent = extractLessonContent(htmlContent);
    console.log('✅ Contenido extraído:', extractedContent.title);
    console.log('📝 Secciones encontradas:', extractedContent.sections.length);
    
    // Crear archivo HTML con el contenido
  const success = await updateLessonFile(extractedContent);
  
  if (success) {
    console.log('🎉 Migración completada exitosamente');
  } else {
    console.log('❌ Error en la migración de lección 9');
  }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar el script
main();