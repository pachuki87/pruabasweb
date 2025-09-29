import fs from 'fs';
import path from 'path';

const lessons = [
  {
    titulo: 'FUNDAMENTOS P TERAPEUTICO',
    fileName: 'leccion-1-fundamentos-p-terapeutico.html',
  },
  {
    titulo: 'TERAPIA COGNITIVA DROGODEPENDENCIAS',
    fileName: 'leccion-2-terapia-cognitiva-drogodependencias.html',
  },
  {
    titulo: 'FAMILIA Y TRABAJO EQUIPO',
    fileName: 'leccion-3-familia-y-trabajo-equipo.html',
  },
  {
    titulo: 'RECOVERY COACHING',
    fileName: 'leccion-4-recovery-coaching.html',
  },
  {
    titulo: 'INTERVENCION FAMILIAR Y RECOVERY MENTORING',
    fileName: 'leccion-6-intervencion-familiar-y-recovery-mentoring.html',
  },
  {
    titulo: 'NUEVOS MODELOS TERAPEUTICOS',
    fileName: 'leccion-7-nuevos-modelos-terapeuticos.html',
  },
  {
    titulo: 'INTELIGENCIA EMOCIONAL',
    fileName: 'leccion-9-inteligencia-emocional.html',
  }
];

const outputDir = path.join('public', 'lessons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

lessons.forEach(lesson => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${lesson.titulo}</title>
      <style>
        body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
        h1 { color: #333; }
        p { color: #555; }
      </style>
    </head>
    <body>
      <h1>${lesson.titulo}</h1>
      <p>Contenido de la lección sobre ${lesson.titulo.toLowerCase()}.</p>
      <p>Este es un contenido de marcador de posición. El contenido real se agregará más adelante.</p>
    </body>
    </html>
  `;

  const filePath = path.join(outputDir, lesson.fileName);
  fs.writeFileSync(filePath, htmlContent);
  console.log(`✅ Archivo creado: ${filePath}`);
});

console.log('\n🎉 Proceso completado. Se han generado los archivos HTML de las lecciones.');