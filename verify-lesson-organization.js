import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Números esperados según las carpetas existentes
const expectedLessonNumbers = [1, 2, 3, 4, 6, 7, 9];

async function verifyLessonOrganization() {
  try {
    console.log('🔍 Verificando organización de lecciones...');
    
    // Obtener el curso
    const { data: curso, error: cursoError } = await supabase
      .from('cursos')
      .select('id, titulo')
      .eq('titulo', 'MÁSTER EN ADICCIONES E INTERVENCIÓN PSICOSOCIAL')
      .single();
    
    if (cursoError || !curso) {
      throw new Error('No se encontró el curso');
    }
    
    console.log(`✅ Curso: ${curso.titulo}`);
    console.log(`📋 ID del curso: ${curso.id}`);
    
    // Obtener todas las lecciones del curso
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', curso.id)
      .order('orden');
    
    if (leccionesError) {
      throw new Error(`Error obteniendo lecciones: ${leccionesError.message}`);
    }
    
    console.log(`\n📚 Total de lecciones encontradas: ${lecciones.length}`);
    console.log('\n📋 Lecciones actuales en la base de datos:');
    
    const actualNumbers = [];
    lecciones.forEach((leccion, index) => {
      actualNumbers.push(leccion.orden);
      const contentLength = leccion.contenido_html ? leccion.contenido_html.length : 0;
      const hasContent = contentLength > 100; // Más de 100 caracteres indica contenido real
      
      console.log(`  ${leccion.orden}) ${leccion.titulo}`);
      console.log(`     📄 Contenido: ${hasContent ? '✅ Sí' : '❌ Pendiente'} (${contentLength} caracteres)`);
      console.log(`     🕒 Duración: ${leccion.duracion_estimada || 'No definida'} min`);
      console.log(`     🖼️  Imagen: ${leccion.imagen_url ? '✅ Sí' : '❌ No'}`);
      console.log('');
    });
    
    // Verificar que los números coincidan exactamente
    console.log('🔍 Verificación de numeración:');
    console.log(`   Números esperados: [${expectedLessonNumbers.join(', ')}]`);
    console.log(`   Números actuales:  [${actualNumbers.sort((a,b) => a-b).join(', ')}]`);
    
    const numbersMatch = JSON.stringify(expectedLessonNumbers.sort()) === JSON.stringify(actualNumbers.sort());
    
    if (numbersMatch) {
      console.log('   ✅ Los números coinciden perfectamente!');
    } else {
      console.log('   ❌ Los números NO coinciden!');
      
      const missing = expectedLessonNumbers.filter(num => !actualNumbers.includes(num));
      const extra = actualNumbers.filter(num => !expectedLessonNumbers.includes(num));
      
      if (missing.length > 0) {
        console.log(`   📋 Números faltantes: [${missing.join(', ')}]`);
      }
      if (extra.length > 0) {
        console.log(`   📋 Números extra: [${extra.join(', ')}]`);
      }
    }
    
    // Verificar carpetas existentes
    console.log('\n📁 Verificando carpetas en inteligencia_emocional_drive:');
    const driveDir = './inteligencia_emocional_drive';
    
    if (fs.existsSync(driveDir)) {
      const folders = fs.readdirSync(driveDir)
        .filter(item => {
          const fullPath = path.join(driveDir, item);
          return fs.statSync(fullPath).isDirectory() && /^\d+$/.test(item);
        })
        .map(folder => parseInt(folder))
        .sort((a, b) => a - b);
      
      console.log(`   Carpetas encontradas: [${folders.join(', ')}]`);
      
      const foldersMatch = JSON.stringify(folders) === JSON.stringify(expectedLessonNumbers.sort());
      if (foldersMatch) {
        console.log('   ✅ Las carpetas coinciden con las lecciones!');
      } else {
        console.log('   ❌ Las carpetas NO coinciden con las lecciones!');
      }
    } else {
      console.log('   ❌ No se encontró el directorio inteligencia_emocional_drive');
    }
    
    // Resumen final
    console.log('\n🎯 RESUMEN FINAL:');
    console.log(`   📚 Lecciones en BD: ${lecciones.length}`);
    console.log(`   📁 Carpetas esperadas: ${expectedLessonNumbers.length}`);
    console.log(`   🔢 Numeración correcta: ${numbersMatch ? '✅ Sí' : '❌ No'}`);
    
    const lessonsWithContent = lecciones.filter(l => l.contenido_html && l.contenido_html.length > 100).length;
    console.log(`   📄 Lecciones con contenido: ${lessonsWithContent}/${lecciones.length}`);
    
    if (numbersMatch && lecciones.length === expectedLessonNumbers.length) {
      console.log('\n🎉 ¡VERIFICACIÓN EXITOSA! Las lecciones están organizadas correctamente.');
      console.log('   Los números coinciden exactamente con las carpetas existentes.');
    } else {
      console.log('\n⚠️  VERIFICACIÓN FALLIDA. Revisar los problemas identificados arriba.');
    }
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
    process.exit(1);
  }
}

verifyLessonOrganization();