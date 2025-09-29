import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://lyojcqiiixkqqtpoejdo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2pjcWlpaXhrcXF0cG9lamRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ5ODAzMCwiZXhwIjoyMDYzMDc0MDMwfQ.hM0gJ9SiugPCMB6MyvcqjEvvDT648hf3HLPoDRomhuM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFilePaths() {
  try {
    console.log('🔍 Verificando rutas de archivos HTML...');
    
    // Consultar lecciones del curso
    const { data: lessons, error } = await supabase
      .from('lecciones')
      .select('id, titulo, orden, archivo_url')
      .eq('curso_id', 'b5ef8c64-fe26-4f20-8221-80a1bf475b05')
      .order('orden', { ascending: true });

    if (error) {
      console.error('❌ Error al consultar lecciones:', error);
      return;
    }

    console.log(`📊 Verificando ${lessons.length} lecciones...\n`);
    
    const publicDir = 'C:\\Users\\pabli\\OneDrive\\Desktop\\institutoooo\\pruabasweb\\public';
    let foundFiles = 0;
    let missingFiles = 0;
    
    for (const lesson of lessons) {
      console.log(`--- Lección ${lesson.orden}: ${lesson.titulo} ---`);
      console.log(`Archivo URL en BD: ${lesson.archivo_url || 'NO ASIGNADO'}`);
      
      if (!lesson.archivo_url) {
        console.log('❌ Sin archivo asignado\n');
        missingFiles++;
        continue;
      }
      
      // Construir la ruta completa del archivo
      const fullPath = path.join(publicDir, lesson.archivo_url);
      console.log(`Ruta completa: ${fullPath}`);
      
      // Verificar si el archivo existe
      if (fs.existsSync(fullPath)) {
        console.log('✅ Archivo encontrado');
        foundFiles++;
      } else {
        console.log('❌ Archivo NO encontrado');
        missingFiles++;
        
        // Buscar archivos similares
        const lessonsDir = path.join(publicDir, 'lessons');
        if (fs.existsSync(lessonsDir)) {
          const files = fs.readdirSync(lessonsDir);
          const htmlFiles = files.filter(f => f.endsWith('.html'));
          console.log('📁 Archivos HTML disponibles:');
          htmlFiles.forEach(f => console.log(`   - ${f}`));
        }
      }
      console.log('');
    }
    
    console.log('📈 Resumen de verificación:');
    console.log(`- Total de lecciones: ${lessons.length}`);
    console.log(`- Archivos encontrados: ${foundFiles}`);
    console.log(`- Archivos faltantes: ${missingFiles}`);
    
    if (foundFiles === lessons.length) {
      console.log('\n🎉 ¡Todos los archivos HTML están disponibles!');
    } else {
      console.log('\n⚠️ Hay archivos faltantes que necesitan ser corregidos.');
    }
    
    // Listar todos los archivos HTML disponibles
    console.log('\n📂 Archivos HTML disponibles en /public/lessons:');
    const lessonsDir = path.join(publicDir, 'lessons');
    if (fs.existsSync(lessonsDir)) {
      const files = fs.readdirSync(lessonsDir);
      const htmlFiles = files.filter(f => f.endsWith('.html')).sort();
      htmlFiles.forEach((f, index) => {
        console.log(`${index + 1}. ${f}`);
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkFilePaths();