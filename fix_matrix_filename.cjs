require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Archivos que necesitan ser actualizados
const filesToUpdate = [
  'public/lessons/leccion-1-fundamentos-p-terapeutico.html',
  'public/lessons/leccion-2-terapia-cognitiva-drogodependencias.html',
  'public/lessons/leccion-3-familia-y-trabajo-equipo.html',
  'public/lessons/leccion-4-recovery-coaching.html',
  'public/lessons/leccion-7-nuevos-modelos-terapeuticos.html',
  'src/pages/courses/NewLessonPage.tsx',
  'src/pages/courses/LessonPage.tsx'
];

const oldFilename = 'Manual-MATRIX-para-Terapeutas.pdf';
const newFilename = 'MATRIX-manual_terapeuta.pdf';

console.log('🔄 Actualizando referencias del archivo MATRIX...');

filesToUpdate.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Reemplazar todas las ocurrencias
      content = content.replace(new RegExp(oldFilename, 'g'), newFilename);
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Actualizado: ${filePath}`);
      } else {
        console.log(`ℹ️  Sin cambios: ${filePath}`);
      }
    } else {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
});

console.log('\n✅ Proceso completado. Todas las referencias han sido actualizadas.');
console.log(`📝 Cambio realizado: ${oldFilename} → ${newFilename}`);